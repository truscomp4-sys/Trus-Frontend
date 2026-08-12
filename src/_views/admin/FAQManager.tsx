'use client'

import React, { useState, useEffect } from "react";
import { HelpCircle, Plus, Save, Trash2, ArrowUp, ArrowDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { authenticatedFetch } from "@/lib/utils";

interface FAQ {
    id: number;
    question: string;
    answer: string;
}

// Shown the first time (before any custom FAQs are saved) so the admin can edit
// the copy that currently ships hardcoded on the homepage.
const DEFAULT_FAQS: FAQ[] = [
    { id: 1, question: "What compliances do you handle?", answer: "We handle a comprehensive range of compliance needs including PF, ESIC, Professional Tax, Labor Welfare Fund, and all major Central and State labor laws across India." },
    { id: 2, question: "How often are filings done?", answer: "Most statutory filings are done monthly. Our system tracks every deadline and automates the preparation process to ensure zero late fees and complete accuracy." },
    { id: 3, question: "Is this applicable PAN-India?", answer: "Absolutely. Our solutions are designed to scale across all states in India, handling varied state-specific regulations and local municipal compliances seamlessly." },
    { id: 4, question: "What happens during inspections?", answer: "We provide full support during government inspections. Our digital records are audit-ready, and our team of experts provides on-ground representation to resolve queries." },
];

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.truscomp.com/api/v1";

const FAQManager = () => {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchFaqs();
    }, []);

    const fetchFaqs = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_BASE}/settings/home_faqs`);
            const data = await res.json().catch(() => null);
            // Stored as { faqs: [...] } (top-level arrays break the jsonb cast);
            // tolerate a bare array too, just in case.
            const value = data?.value;
            const list = Array.isArray(value?.faqs) ? value.faqs : Array.isArray(value) ? value : null;
            if (list && list.length > 0) {
                setFaqs(list);
            } else {
                // No custom FAQs saved yet — start from the current homepage copy.
                setFaqs(DEFAULT_FAQS);
            }
        } catch (err) {
            console.error("Failed to load FAQs:", err);
            setFaqs(DEFAULT_FAQS);
        } finally {
            setIsLoading(false);
        }
    };

    const updateFaq = (id: number, field: "question" | "answer", val: string) => {
        setFaqs(prev => prev.map(f => (f.id === id ? { ...f, [field]: val } : f)));
    };

    const addFaq = () => {
        const nextId = faqs.length ? Math.max(...faqs.map(f => f.id)) + 1 : 1;
        setFaqs(prev => [...prev, { id: nextId, question: "", answer: "" }]);
    };

    const removeFaq = (id: number) => {
        setFaqs(prev => prev.filter(f => f.id !== id));
    };

    const move = (index: number, dir: -1 | 1) => {
        const target = index + dir;
        if (target < 0 || target >= faqs.length) return;
        setFaqs(prev => {
            const next = [...prev];
            [next[index], next[target]] = [next[target], next[index]];
            return next;
        });
    };

    const handleSave = async () => {
        // Drop empty rows and re-number ids so ordering stays clean.
        const cleaned = faqs
            .map(f => ({ ...f, question: f.question.trim(), answer: f.answer.trim() }))
            .filter(f => f.question && f.answer)
            .map((f, i) => ({ ...f, id: i + 1 }));

        if (cleaned.length === 0) {
            toast.error("Add at least one FAQ with a question and answer.");
            return;
        }

        setIsSaving(true);
        try {
            const res = await authenticatedFetch(`${API_BASE}/settings/upsert`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key: "home_faqs", value: { faqs: cleaned } }),
            });
            if (res.ok) {
                setFaqs(cleaned);
                toast.success("Homepage FAQs saved.");
            } else {
                const data = await res.json().catch(() => ({}));
                toast.error(data.message || "Failed to save FAQs.");
            }
        } catch (err) {
            toast.error("Unable to save. Is the server reachable?");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                        <HelpCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">FAQ Manager</h1>
                        <p className="text-sm text-slate-500">Questions shown on the homepage FAQ section.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={fetchFaqs} disabled={isLoading || isSaving}>
                        <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving || isLoading}>
                        {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        <span className="ml-2">Save Changes</span>
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20 text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mr-2" /> Loading FAQs…
                </div>
            ) : (
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={faq.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <span className="text-xs font-semibold text-slate-400 mt-2">FAQ #{index + 1}</span>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => move(index, -1)} disabled={index === 0}
                                        className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30" title="Move up">
                                        <ArrowUp className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => move(index, 1)} disabled={index === faqs.length - 1}
                                        className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30" title="Move down">
                                        <ArrowDown className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => removeFaq(faq.id)}
                                        className="p-2 rounded-lg text-red-500 hover:bg-red-50" title="Delete">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <Input
                                value={faq.question}
                                onChange={(e) => updateFaq(faq.id, "question", e.target.value)}
                                placeholder="Question"
                                className="mb-3 font-medium"
                            />
                            <Textarea
                                value={faq.answer}
                                onChange={(e) => updateFaq(faq.id, "answer", e.target.value)}
                                placeholder="Answer"
                                rows={3}
                            />
                        </div>
                    ))}

                    <button
                        onClick={addFaq}
                        className="w-full rounded-2xl border-2 border-dashed border-slate-300 py-4 text-slate-500 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Add FAQ
                    </button>
                </div>
            )}
        </div>
    );
};

export default FAQManager;
