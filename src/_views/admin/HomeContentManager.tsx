'use client'

import React, { useState, useEffect } from "react";
import { LayoutTemplate, AlertTriangle } from "lucide-react";
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
    HOME_CONTENT_KEY,
    DEFAULT_HOME_CONTENT,
    PILLAR_ICON_NAMES,
    SERVICE_SLOT_COUNT,
    type HomeContent,
    type PillarIconName,
} from "@/lib/homeContent";

const SECTIONS: ShellSection[] = [
    { id: "hero", label: "Hero" },
    { id: "services", label: "Services Orbit" },
    { id: "why-choose", label: "Why Choose Us" },
    { id: "clients", label: "Client Logos" },
    { id: "cta", label: "Closing CTA" },
];

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.truscomp.com/api/v1";

const HomeContentManager = () => {
    const [content, setContent] = useState<HomeContent>(DEFAULT_HOME_CONTENT);
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
            const res = await fetch(`${API_BASE}/settings/${HOME_CONTENT_KEY}`);
            const data = await res.json().catch(() => null);
            const stored = data?.value;
            setStoredRecord(stored ?? null);

            // Nothing saved yet → start from the copy the page currently ships.
            // Merge per-section so a record saved before a section existed still
            // fills that section in.
            const next: HomeContent =
                stored && typeof stored === "object" && !Array.isArray(stored)
                    ? {
                        hero: { ...DEFAULT_HOME_CONTENT.hero, ...stored.hero },
                        services: { ...DEFAULT_HOME_CONTENT.services, ...stored.services },
                        why_choose: { ...DEFAULT_HOME_CONTENT.why_choose, ...stored.why_choose },
                        clients: { ...DEFAULT_HOME_CONTENT.clients, ...stored.clients },
                        cta: { ...DEFAULT_HOME_CONTENT.cta, ...stored.cta },
                    }
                    : DEFAULT_HOME_CONTENT;

            setContent(next);
            setSavedSnapshot(JSON.stringify(next));
        } catch (err) {
            console.error("Failed to load Home page content:", err);
            setContent(DEFAULT_HOME_CONTENT);
            setSavedSnapshot(JSON.stringify(DEFAULT_HOME_CONTENT));
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        // Drop blank list rows so the page never renders an empty chip or card.
        const cleaned: HomeContent = {
            ...content,
            hero: {
                ...content.hero,
                trust_badges: content.hero.trust_badges.map((b) => b.trim()).filter(Boolean),
            },
            services: {
                ...content.services,
                items: content.services.items
                    .filter((item) => item.title.trim())
                    .map((item) => ({ ...item, outcomes: item.outcomes.map((o) => o.trim()).filter(Boolean) })),
            },
            why_choose: {
                ...content.why_choose,
                pillars: content.why_choose.pillars.filter((p) => p.title.trim()),
            },
            clients: {
                ...content.clients,
                logos: content.clients.logos.filter((l) => l.logo.trim()),
                stats: content.clients.stats.filter((s) => s.value.trim() || s.label.trim()),
            },
            cta: {
                ...content.cta,
                trust_indicators: content.cta.trust_indicators.map((t) => t.trim()).filter(Boolean),
            },
        };

        if (cleaned.services.items.length === 0) {
            toast.error("Keep at least one service in the orbit.");
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
                body: JSON.stringify({ key: HOME_CONTENT_KEY, value: payload }),
            });

            if (res.ok) {
                setContent(cleaned);
                setSavedSnapshot(JSON.stringify(cleaned));
                setStoredRecord(payload);
                toast.success("Home page content saved.");
            } else {
                const data = await res.json().catch(() => ({}));
                toast.error(data.message || "Failed to save Home page content.");
            }
        } catch (err) {
            toast.error("Unable to save. Is the server reachable?");
        } finally {
            setIsSaving(false);
        }
    };

    const isDirty = JSON.stringify(content) !== savedSnapshot;

    const patch = <K extends keyof HomeContent>(section: K, value: Partial<HomeContent[K]>) =>
        setContent((prev) => ({ ...prev, [section]: { ...prev[section], ...value } }));

    const { hero, services, why_choose, clients, cta } = content;
    const overflowCount = services.items.length - SERVICE_SLOT_COUNT;

    return (
        <ContentManagerShell
            icon={LayoutTemplate}
            title="Home Page Content"
            subtitle="Hero, services orbit, pillars, clients and the closing call-to-action."
            note={"The notification ticker reads Labour Law Updates and the FAQ block is managed in FAQ Manager, so neither appears here."}
            sections={SECTIONS}
            isLoading={isLoading}
            isSaving={isSaving}
            isDirty={isDirty}
            onRefresh={fetchContent}
            onSave={handleSave}
        >
                    {/* ---------------------------- Hero ---------------------------- */}
                    <Section id="hero" title="Hero" subtitle="The first block visitors see at the top of the page.">
                        <Field label="Badge" hint="Small pill above the headline.">
                            <Input value={hero.badge} onChange={(e) => patch("hero", { badge: e.target.value })} />
                        </Field>

                        <div className="grid sm:grid-cols-3 gap-4">
                            <Field label="Headline — Start">
                                <Input
                                    value={hero.headline_prefix}
                                    onChange={(e) => patch("hero", { headline_prefix: e.target.value })}
                                />
                            </Field>
                            <Field label="Headline — Highlight" hint="Gets the gradient and the drawn underline.">
                                <Input
                                    value={hero.headline_highlight}
                                    onChange={(e) => patch("hero", { headline_highlight: e.target.value })}
                                />
                            </Field>
                            <Field label="Headline — End">
                                <Input
                                    value={hero.headline_suffix}
                                    onChange={(e) => patch("hero", { headline_suffix: e.target.value })}
                                />
                            </Field>
                        </div>

                        <Field label="Sub-headline">
                            <Textarea
                                rows={3}
                                value={hero.subheadline}
                                onChange={(e) => patch("hero", { subheadline: e.target.value })}
                            />
                        </Field>

                        <Field label="Button Label" hint="Links to the contact page.">
                            <Input value={hero.cta_label} onChange={(e) => patch("hero", { cta_label: e.target.value })} />
                        </Field>

                        <StringList
                            label="Trust Badges"
                            hint="Short proof points under the buttons."
                            values={hero.trust_badges}
                            onChange={(trust_badges) => patch("hero", { trust_badges })}
                        />
                    </Section>

                    {/* -------------------------- Services -------------------------- */}
                    <Section id="services" title="Services Orbit"
                        subtitle="The dark 'Our Compliance Solutions' band with the rotating core."
                    >
                        <div className="grid sm:grid-cols-3 gap-4">
                            <Field label="Eyebrow">
                                <Input
                                    value={services.eyebrow}
                                    onChange={(e) => patch("services", { eyebrow: e.target.value })}
                                />
                            </Field>
                            <Field label="Heading — Start">
                                <Input
                                    value={services.heading_prefix}
                                    onChange={(e) => patch("services", { heading_prefix: e.target.value })}
                                />
                            </Field>
                            <Field label="Heading — Highlight">
                                <Input
                                    value={services.heading_highlight}
                                    onChange={(e) => patch("services", { heading_highlight: e.target.value })}
                                />
                            </Field>
                        </div>

                        <Field label="Button Label" hint="Links to the services page.">
                            <Input
                                value={services.cta_label}
                                onChange={(e) => patch("services", { cta_label: e.target.value })}
                            />
                        </Field>

                        {overflowCount > 0 && (
                            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-800">
                                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                                <p className="text-xs">
                                    The orbit has {SERVICE_SLOT_COUNT} positions. The last {overflowCount} service
                                    {overflowCount > 1 ? "s" : ""} below will not appear on the page.
                                </p>
                            </div>
                        )}

                        <Repeater
                            label="Services"
                            hint={`Only the first ${SERVICE_SLOT_COUNT} are shown. Keep titles short — long ones overflow the orbit and overlap the core.`}
                            items={services.items}
                            blank={() => ({ title: "", descriptor: "", outcomes: [], href: "/services" })}
                            onChange={(items) => patch("services", { items })}
                            renderItem={(item, update) => (
                                <div className="space-y-4">
                                    <Field label="Title" hint="Two or three words works best.">
                                        <Input value={item.title} onChange={(e) => update({ title: e.target.value })} />
                                    </Field>
                                    <Field label="Descriptor" hint="One line, revealed on hover.">
                                        <Input
                                            value={item.descriptor}
                                            onChange={(e) => update({ descriptor: e.target.value })}
                                        />
                                    </Field>
                                    <Field label="Link" hint="e.g. /services/payroll-compliance">
                                        <Input value={item.href} onChange={(e) => update({ href: e.target.value })} />
                                    </Field>
                                    <StringList
                                        label="Outcome Chips"
                                        hint="Three short chips fit the hover panel."
                                        values={item.outcomes}
                                        onChange={(outcomes) => update({ outcomes })}
                                    />
                                </div>
                            )}
                        />
                    </Section>

                    {/* ------------------------- Why Choose Us ------------------------- */}
                    <Section id="why-choose" title="Why Choose Us" subtitle="The four-card pillar row.">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Field label="Heading — Start">
                                <Input
                                    value={why_choose.heading_prefix}
                                    onChange={(e) => patch("why_choose", { heading_prefix: e.target.value })}
                                />
                            </Field>
                            <Field label="Heading — Highlight">
                                <Input
                                    value={why_choose.heading_highlight}
                                    onChange={(e) => patch("why_choose", { heading_highlight: e.target.value })}
                                />
                            </Field>
                        </div>

                        <Field label="Description">
                            <Textarea
                                rows={2}
                                value={why_choose.description}
                                onChange={(e) => patch("why_choose", { description: e.target.value })}
                            />
                        </Field>

                        <Field label="Link Label" hint="Links to the about page.">
                            <Input
                                value={why_choose.link_label}
                                onChange={(e) => patch("why_choose", { link_label: e.target.value })}
                            />
                        </Field>

                        <Repeater
                            label="Pillars"
                            hint="Four per row on desktop — keep to four for an even row."
                            items={why_choose.pillars}
                            blank={() => ({ icon: "Shield" as PillarIconName, title: "", description: "" })}
                            onChange={(pillars) => patch("why_choose", { pillars })}
                            renderItem={(item, update) => (
                                <div className="space-y-4">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <Field label="Icon">
                                            <Select
                                                value={item.icon}
                                                onValueChange={(icon) => update({ icon: icon as PillarIconName })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {PILLAR_ICON_NAMES.map((name) => (
                                                        <SelectItem key={name} value={name}>
                                                            {name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </Field>
                                        <Field label="Title">
                                            <Input value={item.title} onChange={(e) => update({ title: e.target.value })} />
                                        </Field>
                                    </div>
                                    <Field label="Description">
                                        <Textarea
                                            rows={2}
                                            value={item.description}
                                            onChange={(e) => update({ description: e.target.value })}
                                        />
                                    </Field>
                                </div>
                            )}
                        />
                    </Section>

                    {/* --------------------------- Clients --------------------------- */}
                    <Section id="clients" title="Client Logos" subtitle="The dark partners band with the scrolling logo marquee.">
                        <Field label="Badge">
                            <Input value={clients.badge} onChange={(e) => patch("clients", { badge: e.target.value })} />
                        </Field>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <Field label="Heading — Start">
                                <Input
                                    value={clients.heading_prefix}
                                    onChange={(e) => patch("clients", { heading_prefix: e.target.value })}
                                />
                            </Field>
                            <Field label="Heading — Highlight">
                                <Input
                                    value={clients.heading_highlight}
                                    onChange={(e) => patch("clients", { heading_highlight: e.target.value })}
                                />
                            </Field>
                        </div>

                        <Field label="Description">
                            <Textarea
                                rows={2}
                                value={clients.description}
                                onChange={(e) => patch("clients", { description: e.target.value })}
                            />
                        </Field>

                        <Repeater
                            label="Logos"
                            hint="The marquee loops, so any number works. Transparent PNGs look best on the dark band."
                            items={clients.logos}
                            blank={() => ({ name: "", logo: "" })}
                            onChange={(logos) => patch("clients", { logos })}
                            renderItem={(item, update) => (
                                <div className="space-y-4">
                                    <Field label="Client Name" hint="Used as the image alt text.">
                                        <Input value={item.name} onChange={(e) => update({ name: e.target.value })} />
                                    </Field>
                                    <ImageField
                                        label="Logo"
                                        rounded={false}
                                        hint="Upload a transparent PNG, or paste a URL."
                                        value={item.logo}
                                        onChange={(logo) => update({ logo })}
                                    />
                                </div>
                            )}
                        />

                        <Repeater
                            label="Stats"
                            hint="The figures under the marquee."
                            items={clients.stats}
                            blank={() => ({ value: "", label: "" })}
                            onChange={(stats) => patch("clients", { stats })}
                            renderItem={(item, update) => (
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <Field label="Value" hint="e.g. 100+">
                                        <Input value={item.value} onChange={(e) => update({ value: e.target.value })} />
                                    </Field>
                                    <Field label="Label">
                                        <Input value={item.label} onChange={(e) => update({ label: e.target.value })} />
                                    </Field>
                                </div>
                            )}
                        />
                    </Section>

                    {/* ----------------------------- CTA ----------------------------- */}
                    <Section id="cta" title="Closing CTA" subtitle="The dark call-to-action block near the bottom of the page.">
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

                        <div className="grid sm:grid-cols-2 gap-4">
                            <Field label="Primary Button" hint="Links to the contact page.">
                                <Input
                                    value={cta.primary_label}
                                    onChange={(e) => patch("cta", { primary_label: e.target.value })}
                                />
                            </Field>
                            <Field label="Secondary Button" hint="Links to the services page.">
                                <Input
                                    value={cta.secondary_label}
                                    onChange={(e) => patch("cta", { secondary_label: e.target.value })}
                                />
                            </Field>
                        </div>

                        <StringList
                            label="Trust Indicators"
                            values={cta.trust_indicators}
                            onChange={(trust_indicators) => patch("cta", { trust_indicators })}
                        />
                    </Section>
        </ContentManagerShell>
    );
};

export default HomeContentManager;
