'use client'

import React, { useState, useEffect } from "react";
import { Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ContentManagerShell, type ShellSection } from "@/components/admin/ContentManagerShell";
import { Field, Section, StringList, Repeater, ImageField } from "@/components/admin/ContentFields";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { authenticatedFetch } from "@/lib/utils";
import { mergePreservingUnknown } from "@/lib/mergeContent";
import {
    ABOUT_CONTENT_KEY,
    DEFAULT_ABOUT_CONTENT,
    VALUE_ICON_NAMES,
    type AboutContent,
    type ValueIconName,
} from "@/lib/aboutContent";

const SECTIONS: ShellSection[] = [
    { id: "hero", label: "Hero" },
    { id: "core-values", label: "Core Values" },
    { id: "leadership", label: "Leadership" },
    { id: "impact", label: "Impact & Scale" },
    { id: "vision-mission", label: "Vision & Mission" },
    { id: "framework", label: "Delivery Framework" },
    { id: "support", label: "Continuous Support" },
    { id: "cta", label: "Closing CTA" },
];

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.truscomp.com/api/v1";

/* -------------------------------- manager -------------------------------- */

const AboutContentManager = () => {
    const [content, setContent] = useState<AboutContent>(DEFAULT_ABOUT_CONTENT);
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
            const res = await fetch(`${API_BASE}/settings/${ABOUT_CONTENT_KEY}`);
            const data = await res.json().catch(() => null);
            const stored = data?.value;
            setStoredRecord(stored ?? null);

            // Nothing saved yet → start from the copy the page currently ships.
            // Merge per-section so a record saved before a section existed still
            // fills that section in.
            const next: AboutContent =
                stored && typeof stored === "object" && !Array.isArray(stored)
                    ? {
                    hero: { ...DEFAULT_ABOUT_CONTENT.hero, ...stored.hero },
                    core_values: { ...DEFAULT_ABOUT_CONTENT.core_values, ...stored.core_values },
                    leadership: { ...DEFAULT_ABOUT_CONTENT.leadership, ...stored.leadership },
                    impact: { ...DEFAULT_ABOUT_CONTENT.impact, ...stored.impact },
                    vision_mission: {
                        vision: { ...DEFAULT_ABOUT_CONTENT.vision_mission.vision, ...stored.vision_mission?.vision },
                        mission: { ...DEFAULT_ABOUT_CONTENT.vision_mission.mission, ...stored.vision_mission?.mission },
                    },
                    framework: { ...DEFAULT_ABOUT_CONTENT.framework, ...stored.framework },
                    support: { ...DEFAULT_ABOUT_CONTENT.support, ...stored.support },
                        cta: { ...DEFAULT_ABOUT_CONTENT.cta, ...stored.cta },
                    }
                    : DEFAULT_ABOUT_CONTENT;

            setContent(next);
            setSavedSnapshot(JSON.stringify(next));
        } catch (err) {
            console.error("Failed to load About page content:", err);
            setContent(DEFAULT_ABOUT_CONTENT);
            setSavedSnapshot(JSON.stringify(DEFAULT_ABOUT_CONTENT));
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        // Drop blank list rows so the page never renders an empty chip or card.
        const cleaned: AboutContent = {
            ...content,
            core_values: {
                ...content.core_values,
                values: content.core_values.values.filter((v) => v.label.trim()),
            },
            leadership: {
                ...content.leadership,
                founders: content.leadership.founders
                    .filter((f) => f.name.trim())
                    .map((f) => ({ ...f, expertise: f.expertise.map((e) => e.trim()).filter(Boolean) })),
                leadership: content.leadership.leadership.filter((l) => l.name.trim()),
            },
            impact: {
                ...content.impact,
                metrics: content.impact.metrics.filter((m) => m.label.trim()),
            },
            framework: {
                ...content.framework,
                phases: content.framework.phases.filter((p) => p.title.trim()),
            },
            cta: {
                ...content.cta,
                trust_indicators: content.cta.trust_indicators.map((t) => t.trim()).filter(Boolean),
            },
        };

        if (cleaned.framework.phases.length === 0) {
            toast.error("Keep at least one delivery phase.");
            return;
        }

        // What actually goes to the API: the edited record layered over
        // whatever was stored, so unknown fields are carried through.
        const payload = mergePreservingUnknown(storedRecord, cleaned);

        setIsSaving(true);
        try {
            const res = await authenticatedFetch(`${API_BASE}/settings/upsert`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key: ABOUT_CONTENT_KEY, value: payload }),
            });

            if (res.ok) {
                setContent(cleaned);
                setSavedSnapshot(JSON.stringify(cleaned));
                setStoredRecord(payload);
                toast.success("About page content saved.");
            } else {
                const data = await res.json().catch(() => ({}));
                toast.error(data.message || "Failed to save About page content.");
            }
        } catch (err) {
            toast.error("Unable to save. Is the server reachable?");
        } finally {
            setIsSaving(false);
        }
    };

    const isDirty = JSON.stringify(content) !== savedSnapshot;

    const patch = <K extends keyof AboutContent>(section: K, value: Partial<AboutContent[K]>) =>
        setContent((prev) => ({ ...prev, [section]: { ...prev[section], ...value } }));

    const { hero, core_values, leadership, impact, vision_mission, framework, support, cta } = content;

    return (
        <ContentManagerShell
            icon={Users}
            title="About Page Content"
            subtitle="Every section of the public About page."
            sections={SECTIONS}
            isLoading={isLoading}
            isSaving={isSaving}
            isDirty={isDirty}
            onRefresh={fetchContent}
            onSave={handleSave}
        >
                    {/* ---------------------------- Hero ---------------------------- */}
                    <Section id="hero" title="Hero" subtitle="The opening block at the top of the About page.">
                        <Field label="Badge">
                            <Input value={hero.badge} onChange={(e) => patch("hero", { badge: e.target.value })} />
                        </Field>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Field label="Headline — Start">
                                <Input
                                    value={hero.headline_prefix}
                                    onChange={(e) => patch("hero", { headline_prefix: e.target.value })}
                                />
                            </Field>
                            <Field label="Headline — Highlight" hint="Shown in the animated gradient.">
                                <Input
                                    value={hero.headline_highlight}
                                    onChange={(e) => patch("hero", { headline_highlight: e.target.value })}
                                />
                            </Field>
                        </div>
                        <Field label="Description">
                            <Textarea
                                rows={3}
                                value={hero.description}
                                onChange={(e) => patch("hero", { description: e.target.value })}
                            />
                        </Field>
                    </Section>

                    {/* ------------------------- Core Values ------------------------- */}
                    <Section id="core-values" title="Core Values" subtitle="The dark 'Values in Motion' band.">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Field label="Eyebrow">
                                <Input
                                    value={core_values.eyebrow}
                                    onChange={(e) => patch("core_values", { eyebrow: e.target.value })}
                                />
                            </Field>
                            <Field label="Heading">
                                <Input
                                    value={core_values.heading}
                                    onChange={(e) => patch("core_values", { heading: e.target.value })}
                                />
                            </Field>
                        </div>

                        <Repeater
                            label="Values"
                            hint="Pills laid out in a wrapping row — any number works."
                            items={core_values.values}
                            itemLabel={(item) => item.label}
                            blank={() => ({ icon: "Heart" as ValueIconName, label: "", description: "" })}
                            onChange={(values) => patch("core_values", { values })}
                            renderItem={(item, update) => (
                                <div className="space-y-4">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <Field label="Icon">
                                            <Select value={item.icon} onValueChange={(icon) => update({ icon: icon as ValueIconName })}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {VALUE_ICON_NAMES.map((name) => (
                                                        <SelectItem key={name} value={name}>
                                                            {name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </Field>
                                        <Field label="Label">
                                            <Input value={item.label} onChange={(e) => update({ label: e.target.value })} />
                                        </Field>
                                    </div>
                                    <Field label="Description" hint="Revealed on hover.">
                                        <Input
                                            value={item.description}
                                            onChange={(e) => update({ description: e.target.value })}
                                        />
                                    </Field>
                                </div>
                            )}
                        />
                    </Section>

                    {/* -------------------------- Leadership -------------------------- */}
                    <Section id="leadership" title="Leadership" subtitle="Founders and the operational leadership grid.">
                        <Field label="Heading">
                            <Input
                                value={leadership.heading}
                                onChange={(e) => patch("leadership", { heading: e.target.value })}
                            />
                        </Field>

                        <Repeater
                            label="Founders"
                            hint="Each one alternates left/right down the page."
                            items={leadership.founders}
                            itemLabel={(item) => item.name}
                            blank={() => ({ name: "", role: "", image: "", description: "", expertise: [] })}
                            onChange={(founders) => patch("leadership", { founders })}
                            renderItem={(item, update) => (
                                <div className="space-y-4">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <Field label="Name">
                                            <Input value={item.name} onChange={(e) => update({ name: e.target.value })} />
                                        </Field>
                                        <Field label="Role">
                                            <Input value={item.role} onChange={(e) => update({ role: e.target.value })} />
                                        </Field>
                                    </div>
                                    <ImageField
                                        value={item.image}
                                        placeholder="/images/leadership/name.png"
                                        hint="Upload a square image, or paste a URL."
                                        onChange={(image) => update({ image })}
                                    />
                                    <Field label="Description">
                                        <Textarea
                                            rows={2}
                                            value={item.description}
                                            onChange={(e) => update({ description: e.target.value })}
                                        />
                                    </Field>
                                    <StringList
                                        label="Expertise Tags"
                                        values={item.expertise}
                                        onChange={(expertise) => update({ expertise })}
                                    />
                                </div>
                            )}
                        />

                        <Field label="Operational Leadership Heading">
                            <Input
                                value={leadership.leadership_heading}
                                onChange={(e) => patch("leadership", { leadership_heading: e.target.value })}
                            />
                        </Field>

                        <Repeater
                            label="Operational Leadership"
                            hint="Laid out three per row on desktop."
                            items={leadership.leadership}
                            itemLabel={(item) => item.name}
                            blank={() => ({ name: "", role: "" })}
                            onChange={(list) => patch("leadership", { leadership: list })}
                            renderItem={(item, update) => (
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <Field label="Name">
                                        <Input value={item.name} onChange={(e) => update({ name: e.target.value })} />
                                    </Field>
                                    <Field label="Role">
                                        <Input value={item.role} onChange={(e) => update({ role: e.target.value })} />
                                    </Field>
                                </div>
                            )}
                        />
                    </Section>

                    {/* ---------------------------- Impact ---------------------------- */}
                    <Section id="impact" title="Impact & Scale" subtitle="The dark metrics band.">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Field label="Eyebrow">
                                <Input value={impact.eyebrow} onChange={(e) => patch("impact", { eyebrow: e.target.value })} />
                            </Field>
                            <Field label="Heading">
                                <Input value={impact.heading} onChange={(e) => patch("impact", { heading: e.target.value })} />
                            </Field>
                        </div>

                        <Repeater
                            label="Metrics"
                            hint="Three per row on desktop — keep to three for an even row."
                            items={impact.metrics}
                            itemLabel={(item) => item.label}
                            blank={() => ({ number: "", label: "", description: "" })}
                            onChange={(metrics) => patch("impact", { metrics })}
                            renderItem={(item, update) => (
                                <div className="space-y-4">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <Field label="Number" hint="The large ghosted figure behind the text.">
                                            <Input value={item.number} onChange={(e) => update({ number: e.target.value })} />
                                        </Field>
                                        <Field label="Label">
                                            <Input value={item.label} onChange={(e) => update({ label: e.target.value })} />
                                        </Field>
                                    </div>
                                    <Field label="Description">
                                        <Input
                                            value={item.description}
                                            onChange={(e) => update({ description: e.target.value })}
                                        />
                                    </Field>
                                </div>
                            )}
                        />
                    </Section>

                    {/* ------------------------ Vision & Mission ------------------------ */}
                    <Section id="vision-mission" title="Vision & Mission" subtitle="The two large scroll-animated statements.">
                        {(["vision", "mission"] as const).map((which) => {
                            const block = vision_mission[which];
                            const update = (value: Partial<typeof block>) =>
                                setContent((prev) => ({
                                    ...prev,
                                    vision_mission: { ...prev.vision_mission, [which]: { ...prev.vision_mission[which], ...value } },
                                }));

                            return (
                                <div key={which} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-4">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        {which}
                                    </span>
                                    <Field label="Eyebrow">
                                        <Input value={block.eyebrow} onChange={(e) => update({ eyebrow: e.target.value })} />
                                    </Field>
                                    <div className="grid sm:grid-cols-3 gap-4">
                                        <Field label="Heading — Start">
                                            <Input
                                                value={block.heading_prefix}
                                                onChange={(e) => update({ heading_prefix: e.target.value })}
                                            />
                                        </Field>
                                        <Field label="Heading — Highlight">
                                            <Input
                                                value={block.heading_highlight}
                                                onChange={(e) => update({ heading_highlight: e.target.value })}
                                            />
                                        </Field>
                                        <Field label="Heading — End">
                                            <Input
                                                value={block.heading_suffix}
                                                onChange={(e) => update({ heading_suffix: e.target.value })}
                                            />
                                        </Field>
                                    </div>
                                    <Field label="Body">
                                        <Textarea rows={4} value={block.body} onChange={(e) => update({ body: e.target.value })} />
                                    </Field>
                                </div>
                            );
                        })}
                    </Section>

                    {/* -------------------------- Framework -------------------------- */}
                    <Section id="framework" title="Delivery Framework" subtitle="The phased timeline.">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Field label="Eyebrow">
                                <Input value={framework.eyebrow} onChange={(e) => patch("framework", { eyebrow: e.target.value })} />
                            </Field>
                            <Field label="Heading">
                                <Input value={framework.heading} onChange={(e) => patch("framework", { heading: e.target.value })} />
                            </Field>
                        </div>
                        <Field label="Description">
                            <Textarea
                                rows={2}
                                value={framework.description}
                                onChange={(e) => patch("framework", { description: e.target.value })}
                            />
                        </Field>

                        <Repeater
                            label="Phases"
                            hint="The desktop timeline sizes itself to the number of phases. Past about eight the columns get cramped."
                            items={framework.phases}
                            itemLabel={(item) => item.title}
                            blank={() => ({ step: "", title: "", range: "" })}
                            onChange={(phases) => patch("framework", { phases })}
                            renderItem={(item, update) => (
                                <div className="grid sm:grid-cols-3 gap-4">
                                    <Field label="Step" hint="e.g. 01">
                                        <Input value={item.step} onChange={(e) => update({ step: e.target.value })} />
                                    </Field>
                                    <Field label="Title">
                                        <Input value={item.title} onChange={(e) => update({ title: e.target.value })} />
                                    </Field>
                                    <Field label="Range" hint="e.g. Phase 1-2">
                                        <Input value={item.range} onChange={(e) => update({ range: e.target.value })} />
                                    </Field>
                                </div>
                            )}
                        />
                    </Section>

                    {/* ------------------------ Continuous Support ------------------------ */}
                    <Section id="support" title="Continuous Support" subtitle="The 'Beyond Go-Live' band with the looping visual.">
                        <Field label="Badge">
                            <Input value={support.badge} onChange={(e) => patch("support", { badge: e.target.value })} />
                        </Field>
                        <Field label="Heading — Line 1">
                            <Input
                                value={support.heading_line1}
                                onChange={(e) => patch("support", { heading_line1: e.target.value })}
                            />
                        </Field>
                        <Field label="Heading — Line 2" hint="Shown in the muted colour.">
                            <Input
                                value={support.heading_line2}
                                onChange={(e) => patch("support", { heading_line2: e.target.value })}
                            />
                        </Field>
                    </Section>

                    {/* ----------------------------- CTA ----------------------------- */}
                    <Section id="cta" title="Closing CTA" subtitle="The dark call-to-action at the bottom of the page.">
                        <Field label="Badge">
                            <Input value={cta.badge} onChange={(e) => patch("cta", { badge: e.target.value })} />
                        </Field>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Field label="Heading — Start">
                                <Input
                                    value={cta.heading_prefix}
                                    onChange={(e) => patch("cta", { heading_prefix: e.target.value })}
                                />
                            </Field>
                            <Field label="Heading — Highlight">
                                <Input
                                    value={cta.heading_highlight}
                                    onChange={(e) => patch("cta", { heading_highlight: e.target.value })}
                                />
                            </Field>
                        </div>
                        <Field label="Description">
                            <Textarea
                                rows={3}
                                value={cta.description}
                                onChange={(e) => patch("cta", { description: e.target.value })}
                            />
                        </Field>
                        <Field label="Button Label" hint="Links to the contact page.">
                            <Input value={cta.button_label} onChange={(e) => patch("cta", { button_label: e.target.value })} />
                        </Field>
                        <StringList
                            label="Trust Indicators"
                            values={cta.trust_indicators}
                            onChange={(trust_indicators) => patch("cta", { trust_indicators })}
                        />
                    </Section>
        </ContentManagerShell>
    );
};

export default AboutContentManager;
