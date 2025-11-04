
import React, { useState } from 'react';
import { LogEntry, User } from '../types';
import { SparkleIcon, DocumentTextIcon } from '../components/icons';
import { api } from '../lib/api';
import SynthesisReport from '../components/SynthesisReport';

interface ReportPageProps {
    logs: LogEntry[];
    user: User;
}

export default function ReportPage({ logs, user }: ReportPageProps) {
    const [isSynthesizing, setIsSynthesizing] = useState(false);
    const [synthesisReport, setSynthesisReport] = useState<string | null>(null);

    const handleGenerateSynthesis = async () => {
        setIsSynthesizing(true);
        setSynthesisReport(null);

        try {
            const report = await api.generateSynthesisReport(logs);
            setSynthesisReport(report);
        } catch (error) {
            console.error("Error generating synthesis report:", error);
            alert("Sorry, we couldn't generate the report at this time.");
        } finally {
            setIsSynthesizing(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="bg-surface border border-border rounded-2xl p-8 text-center">
                 <div className="w-16 h-16 bg-gradient-to-br from-accent-primary to-accent-primary-dark rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-accent-primary/20">
                    <DocumentTextIcon className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-text-primary">AI Skill Synthesis Report</h1>
                <p className="mt-2 text-text-secondary max-w-2xl mx-auto">Turn your daily effort into a career-defining asset. Generate a shareable, AI-powered summary of your skills for recruiters and hiring managers.</p>
                 <div className="mt-8">
                    <button onClick={handleGenerateSynthesis} disabled={isSynthesizing} className="w-full max-w-sm py-3 text-base font-bold bg-gradient-to-r from-accent-primary to-accent-primary-dark text-white rounded-lg shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-3 mx-auto">
                        {isSynthesizing ? (
                            <>
                                <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-white"></div>
                                <span>Synthesizing Your Skills...</span>
                            </>
                        ) : (
                            <>
                                <SparkleIcon className="w-6 h-6" />
                                <span>Generate Your Report</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {synthesisReport && <SynthesisReport report={synthesisReport} />}
        </div>
    );
}
