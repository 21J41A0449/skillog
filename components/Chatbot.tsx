
import React, { useState, useEffect, useRef } from 'react';
import { ChatHistoryMessage } from '../types';
import { api } from '../lib/api';
import { SparkleIcon, CloseIcon, SendIcon, UserIcon } from './icons';

interface ChatbotProps {
    onClose: () => void;
}

export default function Chatbot({ onClose }: ChatbotProps) {
    const [history, setHistory] = useState<ChatHistoryMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatHistoryMessage = { role: 'user', parts: [{ text: input }] };
        const currentHistory = [...history, userMessage];
        setHistory(currentHistory);
        setInput('');
        setIsLoading(true);

        try {
            const responseText = await api.getChatbotResponse(currentHistory, input);
            const modelResponse: ChatHistoryMessage = { role: 'model', parts: [{ text: responseText }] };
            setHistory(prev => [...prev, modelResponse]);

        } catch (error) {
            console.error("Chatbot error:", error);
            setHistory(prev => [...prev, { role: 'model', parts: [{ text: "Sorry, I encountered an error. Please try again." }] }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-28 right-8 w-full max-w-md h-[70vh] bg-surface border border-border rounded-2xl shadow-2xl flex flex-col z-40 animate-fade-in">
            <header className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-accent-primary to-accent-primary-dark rounded-full flex items-center justify-center text-white">
                        <SparkleIcon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-text-primary">AI Learning Assistant</h3>
                </div>
                <button onClick={onClose} className="p-1 text-text-secondary hover:text-text-primary">
                    <CloseIcon />
                </button>
            </header>
            <div className="flex-grow p-4 overflow-y-auto">
                <div className="space-y-6">
                    {history.map((msg, index) => (
                        <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                            {msg.role === 'model' && (
                                <div className="w-8 h-8 bg-surface-light rounded-full flex items-center justify-center text-text-primary border border-border flex-shrink-0">
                                    <SparkleIcon className="w-5 h-5 text-accent-primary" />
                                </div>
                            )}
                            <div className={`max-w-xs md:max-w-sm p-3 rounded-lg ${msg.role === 'user' ? 'bg-accent-primary/80 text-white' : 'bg-surface-light'}`}>
                                <p className="whitespace-pre-wrap">{msg.parts[0].text}</p>
                            </div>
                             {msg.role === 'user' && (
                                <div className="w-8 h-8 bg-surface-light rounded-full flex items-center justify-center text-text-primary border border-border flex-shrink-0">
                                    <UserIcon className="w-5 h-5" />
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex gap-3">
                            <div className="w-8 h-8 bg-surface-light rounded-full flex items-center justify-center text-text-primary border border-border flex-shrink-0">
                                <SparkleIcon className="w-5 h-5 text-accent-primary" />
                            </div>
                            <div className="max-w-xs md:max-w-sm p-3 rounded-lg bg-surface-light flex items-center gap-2">
                                <span className="w-2 h-2 bg-text-secondary rounded-full animate-pulse"></span>
                                <span className="w-2 h-2 bg-text-secondary rounded-full animate-pulse delay-150"></span>
                                <span className="w-2 h-2 bg-text-secondary rounded-full animate-pulse delay-300"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <div className="p-4 border-t border-border">
                <form onSubmit={handleSendMessage} className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask anything..."
                        className="w-full p-3 pr-12 bg-surface-light rounded-lg border border-border focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/50 transition-colors placeholder-text-secondary text-text-primary"
                    />
                    <button type="submit" disabled={isLoading || !input.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-text-secondary hover:text-accent-primary disabled:opacity-50">
                        <SendIcon />
                    </button>
                </form>
            </div>
        </div>
    );
}
