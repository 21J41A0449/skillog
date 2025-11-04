
import React, { useState, useEffect } from 'react';
import { Circle } from '../types';
import { CirclesIcon } from '../components/icons';
import { supabase } from '../lib/supabaseClient';

const CircleCard = ({ circle }: { circle: Circle }) => (
    <a href={`#/circle/${circle.name}`} className="block bg-surface p-6 rounded-xl border border-border hover:border-accent-secondary/50 transition-colors">
        <h3 className="font-bold text-text-primary"># {circle.name}</h3>
        <p className="mt-1 text-sm text-text-secondary">{circle.description}</p>
        <div className="mt-4 text-xs text-accent-secondary">
            💬 Join the conversation
        </div>
    </a>
);

export default function CirclesDirectoryPage() {
    const [circles, setCircles] = useState<Circle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCircles = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase.from('circles').select('*');
                if (error) throw error;
                setCircles(data);
            } catch (error) {
                console.error("Error fetching circles:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCircles();
    }, []);

    return (
        <div className="animate-fade-in">
            <div className="bg-surface border border-border rounded-2xl p-8 mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-surface-light rounded-full flex items-center justify-center border border-border">
                        <CirclesIcon className="w-6 h-6 text-accent-secondary" />
                    </div>
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-text-primary">Study Circles</h1>
                        <p className="mt-1 text-text-secondary max-w-2xl">Join real-time chat rooms for any topic. Ask questions, share resources, and learn together.</p>
                    </div>
                </div>
            </div>
            {loading ? (
                <p className="text-center text-text-secondary">Loading circles...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {circles.map(circle => (
                        <CircleCard key={circle.id} circle={circle} />
                    ))}
                </div>
            )}
        </div>
    );
}
