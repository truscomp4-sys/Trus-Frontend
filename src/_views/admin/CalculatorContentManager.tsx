'use client'

import React, { useState, useEffect } from "react";
import { Calculator } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ContentManagerShell, type ShellSection } from "@/components/admin/ContentManagerShell";
import { Field, Section } from "@/components/admin/ContentFields";
import { toast } from "sonner";
import { authenticatedFetch } from "@/lib/utils";
import { mergePreservingUnknown } from "@/lib/mergeContent";
import {
    CALCULATOR_CONTENT_KEY,
    DEFAULT_CALCULATOR_CONTENT,
    type CalculatorContent,
} from "@/lib/calculatorContent";

const SECTIONS: ShellSection[] = [
    { id: "hero", label: "Hero" },
];

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.truscomp.com/api/v1";

const CalculatorContentManager = () => {
    const [content, setContent] = useState<CalculatorContent>(DEFAULT_CALCULATOR_CONTENT);
    const [isLoading, setIsLoading] = useState(true);
    // The raw record as stored, so fields this screen does not edit are
    // carried through instead of being dropped on save.
    const [storedRecord, setStoredRecord] = useState<unknown>(null);
    const [isSaving, setIsSaving] = useState(false);
    // Snapshot of the last loaded/saved record, so the header can flag edits
    // and the leave-guard knows there is something to lose.
    const [savedSnapshot, setSavedSnapshot] = useState("");

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_BASE}/settings/${CALCULATOR_CONTENT_KEY}`);
            const data = await res.json().catch(() => null);
            const stored = data?.value;
            setStoredRecord(stored ?? null);

            // Nothing saved yet → start from the copy the page currently ships.
            // Merge so a record saved before a field existed still fills it in.
            const next: CalculatorContent =
                stored && typeof stored === "object" && !Array.isArray(stored)
                    ? { ...DEFAULT_CALCULATOR_CONTENT, ...stored }
                    : DEFAULT_CALCULATOR_CONTENT;

            setContent(next);
            setSavedSnapshot(JSON.stringify(next));
        } catch (err) {
            console.error("Failed to load calculator page content:", err);
            setContent(DEFAULT_CALCULATOR_CONTENT);
            setSavedSnapshot(JSON.stringify(DEFAULT_CALCULATOR_CONTENT));
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        const url = content.button_url.trim();

        // The button opens a new tab, so a relative path would land nowhere useful.
        if (!/^https?:\/\//i.test(url)) {
            toast.error("The calculator link must start with http:// or https://");
            return;
        }
        if (!content.button_label.trim()) {
            toast.error("Give the calculator button a label.");
            return;
        }

        const cleaned: CalculatorContent = { ...content, button_url: url };

        // What actually goes to the API: the edited record layered over
        // whatever was stored, so unknown fields are carried through.
        const payload = mergePreservingUnknown(storedRecord, cleaned);

        setIsSaving(true);
        try {
            const res = await authenticatedFetch(`${API_BASE}/settings/upsert`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key: CALCULATOR_CONTENT_KEY, value: payload }),
            });

            if (res.ok) {
                setContent(cleaned);
                setSavedSnapshot(JSON.stringify(cleaned));
                setStoredRecord(payload);
                toast.success("Calculator page content saved.");
            } else {
                const data = await res.json().catch(() => ({}));
                toast.error(data.message || "Failed to save calculator page content.");
            }
        } catch (err) {
            toast.error("Unable to save. Is the server reachable?");
        } finally {
            setIsSaving(false);
        }
    };

    const isDirty = JSON.stringify(content) !== savedSnapshot;

    const patch = (value: Partial<CalculatorContent>) => setContent((prev) => ({ ...prev, ...value }));

    return (
        <ContentManagerShell
            icon={Calculator}
            title="Calculator Page Content"
            subtitle="The wage calculator landing page."
            note={"The dark call-to-action at the bottom of this page is the homepage one — edit it under Home Page Content."}
            sections={SECTIONS}
            isLoading={isLoading}
            isSaving={isSaving}
            isDirty={isDirty}
            onRefresh={fetchContent}
            onSave={handleSave}
        >
                <Section id="hero" title="Hero" subtitle="Everything above the call-to-action block.">
                    <Field label="Badge" hint="Small pill above the headline.">
                        <Input value={content.badge} onChange={(e) => patch({ badge: e.target.value })} />
                    </Field>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <Field label="Headline — Start">
                            <Input
                                value={content.heading_prefix}
                                onChange={(e) => patch({ heading_prefix: e.target.value })}
                            />
                        </Field>
                        <Field label="Headline — Highlight" hint="Shown in the brand gradient.">
                            <Input
                                value={content.heading_highlight}
                                onChange={(e) => patch({ heading_highlight: e.target.value })}
                            />
                        </Field>
                    </div>

                    <Field label="Description">
                        <Textarea
                            rows={3}
                            value={content.description}
                            onChange={(e) => patch({ description: e.target.value })}
                        />
                    </Field>

                    <Field label="Button Label">
                        <Input value={content.button_label} onChange={(e) => patch({ button_label: e.target.value })} />
                    </Field>

                    <Field label="Calculator Link" hint="Opens in a new tab. Must be a full https:// address.">
                        <Input
                            value={content.button_url}
                            placeholder="https://app.truscomp.com/..."
                            onChange={(e) => patch({ button_url: e.target.value })}
                        />
                    </Field>
                </Section>
        </ContentManagerShell>
    );
};

export default CalculatorContentManager;
