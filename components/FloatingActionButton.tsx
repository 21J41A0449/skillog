
import React from 'react';
import { SparkleIcon } from './icons';

interface FloatingActionButtonProps {
    onClick: () => void;
}

export default function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-accent-primary to-accent-primary-dark rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform z-40 animate-glow shadow-accent-glow"
            aria-label="Open AI Learning Assistant"
        >
            <SparkleIcon className="w-8 h-8" />
        </button>
    );
}
