
import React from 'react';
import { DocumentTextIcon } from './icons';

interface SynthesisReportProps {
  report: string;
}

// Simple Markdown to HTML converter for bold, headings, and lists
const renderMarkdown = (text: string) => {
  const html = text
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-text-primary mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-text-primary mt-4 mb-2">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-text-primary mt-4 mb-2">$1</h1>')
    .replace(/\*\*(.*)\*\*/g, '<strong class="text-accent-primary">$1</strong>')
    .replace(/^\* (.*$)/gim, '<li class="flex items-start gap-3"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-secondary flex-shrink-0"></span><span>$1</span></li>')
    .replace(/\n/g, '<br />')
    .replace(/<br \/>(<li)/g, '$1'); // Remove line breaks before list items

  return { __html: `<ul class="space-y-2">${html}</ul>` };
};

export default function SynthesisReport({ report }: SynthesisReportProps) {
  return (
    <div className="my-8 bg-surface border border-border rounded-2xl p-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-primary to-accent-primary-dark rounded-full flex items-center justify-center flex-shrink-0 text-white">
                <DocumentTextIcon />
            </div>
            <h2 className="text-2xl font-bold text-text-primary">AI Skill Synthesis Report</h2>
        </div>
        <div
            className="text-text-secondary space-y-4 leading-relaxed"
            dangerouslySetInnerHTML={renderMarkdown(report)}
        />
    </div>
  );
}
