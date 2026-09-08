'use client'

import React, { useState, useEffect } from "react";
import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ContentManagerShell, type ShellSection } from "@/components/admin/ContentManagerShell";
import { Field, Section } from "@/components/admin/ContentFields";
import { toast } from "sonner";
import { authenticatedFetch } from "@/lib/utils";
import { mergePreservingUnknown } from "@/lib/mergeContent";
import {
    CONTACT_CONTENT_KEY,
    DEFAULT_CONTACT_CONTENT,
    type ContactContent,
} from "@/lib/contactContent";

const SECTIONS: ShellSection[] = [
    { id: "hero", label: "Hero" },
    { id: "info", label: "Contact Info" },
    { id: "form", label: "Enquiry Form" },
    { id: "team", label: "Team Card" },
];

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.truscomp.com/api/v1";

const ContactContentManager = () => {
    const [content, setContent] = useState<ContactContent>(DEFAULT_CONTACT_CONTENT);
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
            const res = await fetch(`${API_BASE}/settings/${CONTACT_CONTENT_KEY}`);
            const data = await res.json().catch(() => null);
            const stored = data?.value;
            setStoredRecord(stored ?? null);

            // Nothing saved yet → start from the copy the page currently ships.
            // Merge per-section so a record saved before a section existed still
            // fills that section in.
            const next: ContactContent =
                stored && typeof stored === "object" && !Array.isArray(stored)
                    ? {
                        hero: { ...DEFAULT_CONTACT_CONTENT.hero, ...stored.hero },
                        info: { ...DEFAULT_CONTACT_CONTENT.info, ...stored.info },
                        form: { ...DEFAULT_CONTACT_CONTENT.form, ...stored.form },
                        team: { ...DEFAULT_CONTACT_CONTENT.team, ...stored.team },
                    }
                    : DEFAULT_CONTACT_CONTENT;

            setContent(next);
            setSavedSnapshot(JSON.stringify(next));
        } catch (err) {
            console.error("Failed to load contact page content:", err);
            setContent(DEFAULT_CONTACT_CONTENT);
            setSavedSnapshot(JSON.stringify(DEFAULT_CONTACT_CONTENT));
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        const whatsapp = content.team.whatsapp_number.replace(/[^0-9]/g, "");

        // wa.me needs bare digits including the country code, so anything the
        // admin types with spaces, +, or dashes is normalised here.
        if (whatsapp && whatsapp.length < 10) {
            toast.error("The WhatsApp number needs the country code, e.g. 919743883000.");
            return;
        }
        const zohoUrl = content.form.zoho_url.trim();
        if (!/^https?:\/\//i.test(zohoUrl)) {
            toast.error("The form URL must start with http:// or https://");
            return;
        }

        const cleaned: ContactContent = {
            ...content,
            form: { ...content.form, zoho_url: zohoUrl },
            team: { ...content.team, whatsapp_number: whatsapp },
        };

        // What actually goes to the API: the edited record layered over
        // whatever was stored, so unknown fields are carried through.
        const payload = mergePreservingUnknown(storedRecord, cleaned);

        setIsSaving(true);
        try {
            const res = await authenticatedFetch(`${API_BASE}/settings/upsert`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key: CONTACT_CONTENT_KEY, value: payload }),
            });

            if (res.ok) {
                setContent(cleaned);
                setSavedSnapshot(JSON.stringify(cleaned));
                setStoredRecord(payload);
                toast.success("Contact page content saved.");
            } else {
                const data = await res.json().catch(() => ({}));
                toast.error(data.message || "Failed to save contact page content.");
            }
        } catch (err) {
            toast.error("Unable to save. Is the server reachable?");
        } finally {
            setIsSaving(false);
        }
    };

    const isDirty = JSON.stringify(content) !== savedSnapshot;

    const patch = <K extends keyof ContactContent>(section: K, value: Partial<ContactContent[K]>) =>
        setContent((prev) => ({ ...prev, [section]: { ...prev[section], ...value } }));

    const { hero, info, form, team } = content;

    return (
        <ContentManagerShell
            icon={Mail}
            title="Contact Page Content"
            subtitle="Copy on the public contact page."
            note={"The office address, phone and email in the info card come from System Settings. The enquiry form is a Zoho Forms embed — change its fields in Zoho."}
            sections={SECTIONS}
            isLoading={isLoading}
            isSaving={isSaving}
            isDirty={isDirty}
            onRefresh={fetchContent}
            onSave={handleSave}
        >
                    {/* ---------------------------- Hero ---------------------------- */}
                    <Section id="hero" title="Hero" subtitle="The heading block at the top of the page.">
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
                            <Field label="Headline — Highlight" hint="Shown in the brand gradient.">
                                <Input
                                    value={hero.headline_highlight}
                                    onChange={(e) => patch("hero", { headline_highlight: e.target.value })}
                                />
                            </Field>
                        </div>

                        <Field label="Description">
                            <Textarea
                                rows={2}
                                value={hero.description}
                                onChange={(e) => patch("hero", { description: e.target.value })}
                            />
                        </Field>
                    </Section>

                    {/* ------------------------ Contact info ------------------------ */}
                    <Section id="info" title="Contact Information Card" subtitle="The white card on the left.">
                        <Field label="Heading">
                            <Input value={info.heading} onChange={(e) => patch("info", { heading: e.target.value })} />
                        </Field>
                        <Field label="Description" hint="The address, phone and email below it come from System Settings.">
                            <Textarea
                                rows={2}
                                value={info.description}
                                onChange={(e) => patch("info", { description: e.target.value })}
                            />
                        </Field>
                    </Section>

                    {/* ---------------------------- Form ---------------------------- */}
                    <Section
                        id="form"
                        title="Enquiry Form"
                        subtitle="The form is a Zoho Forms embed — its fields are edited in Zoho, not here."
                    >
                        <Field label="Zoho Form URL" hint="The formperma link from Zoho Forms.">
                            <Input
                                value={form.zoho_url}
                                placeholder="https://forms.zohopublic.in/..."
                                onChange={(e) => patch("form", { zoho_url: e.target.value })}
                            />
                        </Field>
                        <Field label="Embed Height" hint="Tall enough that the form does not scroll inside its frame, e.g. 1150px.">
                            <Input
                                value={form.height}
                                placeholder="1150px"
                                onChange={(e) => patch("form", { height: e.target.value })}
                            />
                        </Field>
                    </Section>

                    {/* ---------------------------- Team ---------------------------- */}
                    <Section id="team" title="Connect with Our Team" subtitle="The dark card with the contact person and WhatsApp button.">
                        <Field label="Eyebrow">
                            <Input value={team.eyebrow} onChange={(e) => patch("team", { eyebrow: e.target.value })} />
                        </Field>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <Field label="Name">
                                <Input value={team.name} onChange={(e) => patch("team", { name: e.target.value })} />
                            </Field>
                            <Field label="Role">
                                <Input value={team.role} onChange={(e) => patch("team", { role: e.target.value })} />
                            </Field>
                        </div>

                        <Field label="Email">
                            <Input value={team.email} onChange={(e) => patch("team", { email: e.target.value })} />
                        </Field>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <Field label="Phone — Shown" hint="e.g. +91 97438 83000">
                                <Input
                                    value={team.phone_display}
                                    onChange={(e) => patch("team", { phone_display: e.target.value })}
                                />
                            </Field>
                            <Field label="Phone — Dialled" hint="What tapping it calls, e.g. +919743883000">
                                <Input
                                    value={team.phone_link}
                                    onChange={(e) => patch("team", { phone_link: e.target.value })}
                                />
                            </Field>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <Field label="QR Caption">
                                <Input value={team.qr_title} onChange={(e) => patch("team", { qr_title: e.target.value })} />
                            </Field>
                            <Field label="QR Sub-caption">
                                <Input
                                    value={team.qr_subtitle}
                                    onChange={(e) => patch("team", { qr_subtitle: e.target.value })}
                                />
                            </Field>
                        </div>

                        <Field label="WhatsApp Heading">
                            <Input
                                value={team.whatsapp_heading}
                                onChange={(e) => patch("team", { whatsapp_heading: e.target.value })}
                            />
                        </Field>

                        <Field label="WhatsApp Description">
                            <Textarea
                                rows={2}
                                value={team.whatsapp_description}
                                onChange={(e) => patch("team", { whatsapp_description: e.target.value })}
                            />
                        </Field>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <Field label="WhatsApp Button Label">
                                <Input
                                    value={team.whatsapp_button_label}
                                    onChange={(e) => patch("team", { whatsapp_button_label: e.target.value })}
                                />
                            </Field>
                            <Field label="WhatsApp Number" hint="Digits with country code, e.g. 919743883000.">
                                <Input
                                    value={team.whatsapp_number}
                                    onChange={(e) => patch("team", { whatsapp_number: e.target.value })}
                                />
                            </Field>
                        </div>
                    </Section>

        </ContentManagerShell>
    );
};

export default ContactContentManager;
