
import React, { useState, useEffect, useRef } from 'react';
import { Circle, CircleMessage, LogEntry } from '../types';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { UserIcon } from '../components/icons';

interface CirclePageProps {
    circleId: string;
    currentUser: User;
    publicLogs: LogEntry[];
}

const ChatMessage = ({ msg }: { msg: CircleMessage }) => (
    <div className="flex gap-3 py-2">
        <div className="w-8 h-8 bg-surface-light rounded-full flex items-center justify-center text-text-primary border border-border flex-shrink-0">
            <UserIcon className="w-5 h-5" />
        </div>
        <div>
            <div className="flex items-baseline gap-2">
                <p className="font-semibold text-sm text-text-primary">{msg.profiles?.display_name || 'Anonymous'}</p>
                <p className="text-xs text-text-secondary">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <p className="text-text-primary">{msg.content}</p>
        </div>
    </div>
);

export default function CirclePage({ circleId, currentUser, publicLogs }: CirclePageProps) {
    console.log('CirclePage: rendered with circleId:', circleId);
    const [circle, setCircle] = useState<Circle | null>(null);
    const [messages, setMessages] = useState<CircleMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const relevantLogs = publicLogs.filter(log => log.tags.includes(circleId)).slice(0, 5);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        const fetchCircleData = async () => {
            setLoading(true);
            try {
                const { data: circleData, error: circleError } = await supabase.from('circles').select('*').eq('name', circleId).single();
                if (circleError) throw circleError;
                setCircle(circleData);

                const { data: messagesData, error: messagesError } = await supabase.from('circle_messages').select('*, profiles(id, display_name, avatar_url)').eq('circle_id', circleData.id).order('created_at');
                if(messagesError) throw messagesError;
                setMessages(messagesData as any);

            } catch(error) {
                console.error("Error fetching circle data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCircleData();
    }, [circleId]);

    // Separate useEffect for real-time subscription - only runs when circle is loaded
    useEffect(() => {
        if (!circle?.id) return; // Don't subscribe until circle data is loaded

        const channel = supabase.channel(`circle_${circleId}`);
        channel.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'circle_messages', filter: `circle_id=eq.${circle.id}` }, (payload) => {
            setMessages(prev => [...prev, payload.new as CircleMessage]);
        }).subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [circle?.id, circleId]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !circle) return;

        const tempMessageContent = newMessage;
        setNewMessage('');
        
        await supabase.from('circle_messages').insert({
            circle_id: circle.id,
            user_id: currentUser.id,
            content: tempMessageContent,
        });
    };

    if (loading) return <div className="text-center text-text-secondary">Loading Circle...</div>;
    if (!circle) return <div className="text-center text-accent-primary">Study Circle not found.</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            <div className="lg:col-span-2 bg-surface border border-border rounded-2xl flex flex-col h-[80vh]">
                <div className="p-4 border-b border-border">
                    <h2 className="text-xl font-bold text-text-primary"># {circle.name}</h2>
                    <p className="text-sm text-text-secondary">{circle.description}</p>
                </div>
                <div className="flex-grow p-4 overflow-y-auto">
                    {messages.map(msg => <ChatMessage key={msg.id} msg={msg} />)}
                    <div ref={chatEndRef} />
                </div>
                <div className="p-4 border-t border-border">
                    <form onSubmit={handleSendMessage}>
                        <input 
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder={`Message #${circle.name}`}
                            className="w-full p-3 bg-surface-light rounded-lg border border-border focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/50 transition-colors placeholder-text-secondary text-text-primary"
                        />
                    </form>
                </div>
            </div>
            <div className="space-y-6">
                <div className="bg-surface p-4 rounded-xl border border-border">
                    <h3 className="font-bold text-text-primary mb-3">Study Circle</h3>
                    <div className="space-y-2 text-sm text-text-secondary">
                        <p>Join the conversation and connect with fellow learners in real-time.</p>
                        <p className="text-xs">💡 Ask questions, share resources, and learn together!</p>
                    </div>
                </div>
                <div className="bg-surface p-4 rounded-xl border border-border">
                    <h3 className="font-bold text-text-primary mb-3">Recent Logs</h3>
                    <div className="space-y-3">
                        {relevantLogs.length > 0 ? relevantLogs.map(log => (
                            <a key={log.id} href={`#/log/${log.id}`} className="block text-sm p-2 rounded-md hover:bg-surface-light">
                                <p className="truncate text-text-primary">{log.text}</p>
                                <p className="text-xs text-text-secondary">by {log.profiles?.display_name}</p>
                            </a>
                        )) : <p className="text-sm text-text-secondary">No recent logs with this tag.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
