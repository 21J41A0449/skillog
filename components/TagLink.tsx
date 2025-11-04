
import React from 'react';

interface TagLinkProps {
    tag: string;
}

export default function TagLink({ tag }: TagLinkProps) {
    return (
        <a href={`#/circle/${tag}`} className="px-2.5 py-1 bg-surface-light text-sm text-text-secondary font-medium rounded-full border border-border hover:border-accent-secondary hover:text-accent-secondary transition-colors">
            #{tag}
        </a>
    );
}
