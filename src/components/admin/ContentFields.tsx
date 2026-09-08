'use client'

import React, { useRef, useState } from "react";
import { Plus, Trash2, RefreshCw, Upload, ArrowUp, ArrowDown, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { authenticatedFetch, cn } from "@/lib/utils";

// Shared form primitives for the page-content managers (About, Home). They all
// edit a single settings key made of nested records and lists, so the same few
// building blocks cover every screen.

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.truscomp.com/api/v1";

export const Field = ({
    label,
    hint,
    children,
}: {
    label: string;
    hint?: string;
    children: React.ReactNode;
}) => (
    <div className="flex flex-col gap-1.5 h-full">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</label>
        {children}
        {/* `mt-auto` pins the hint to the bottom of the cell, so in a multi-column
            row the hints share a baseline instead of one column running long. */}
        {hint && <p className="text-[11px] text-slate-400 mt-auto pt-0.5">{hint}</p>}
    </div>
);

export const Section = ({
    id,
    title,
    subtitle,
    children,
}: {
    id?: string;
    title: string;
    subtitle: string;
    children: React.ReactNode;
}) => (
    // `scroll-mt` keeps the heading clear of the sticky header when jumped to.
    <div id={id} className="scroll-mt-36 rounded-2xl border border-slate-200 bg-white p-6 space-y-5">
        <div>
            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
            <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
        {children}
    </div>
);

/** A list of plain strings — chips, badges, bullet lines. */
export const StringList = ({
    label,
    hint,
    values,
    onChange,
}: {
    label: string;
    hint?: string;
    values: string[];
    onChange: (next: string[]) => void;
}) => (
    <div className="space-y-1.5">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</label>
        <div className="space-y-2">
            {values.map((value, i) => (
                <div key={i} className="flex items-center gap-2">
                    <Input
                        value={value}
                        placeholder="Enter item text..."
                        onChange={(e) => {
                            const next = [...values];
                            next[i] = e.target.value;
                            onChange(next);
                        }}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 hover:text-rose-600 shrink-0"
                        onClick={() => onChange(values.filter((_, idx) => idx !== i))}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ))}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => onChange([...values, ""])}>
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Add
        </Button>
        {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
    </div>
);

/**
 * Repeating group of records with add / remove / reorder controls.
 *
 * Rows are collapsed to a single summary line and open one at a time: a list of
 * six services with four fields each would otherwise be several screens of
 * scrolling to reach the last one.
 */
export function Repeater<T>({
    label,
    hint,
    items,
    blank,
    onChange,
    renderItem,
    itemLabel,
}: {
    label: string;
    hint?: string;
    items: T[];
    blank: () => T;
    onChange: (next: T[]) => void;
    renderItem: (item: T, update: (patch: Partial<T>) => void) => React.ReactNode;
    /** Summary shown on the collapsed row. Falls back to the row number. */
    itemLabel?: (item: T, index: number) => string;
}) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const move = (index: number, dir: -1 | 1) => {
        const target = index + dir;
        if (target < 0 || target >= items.length) return;
        const next = [...items];
        [next[index], next[target]] = [next[target], next[index]];
        onChange(next);
        // Follow the row that moved, so the open one stays open.
        setOpenIndex((current) => (current === index ? target : current === target ? index : current));
    };

    const remove = (index: number) => {
        onChange(items.filter((_, i) => i !== index));
        setOpenIndex((current) => {
            if (current === null || current === index) return null;
            return current > index ? current - 1 : current;
        });
    };

    const add = () => {
        onChange([...items, blank()]);
        // A blank row is only useful open.
        setOpenIndex(items.length);
    };

    return (
        <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</label>
            {hint && <p className="text-[11px] text-slate-400 -mt-2">{hint}</p>}

            <div className="space-y-2">
                {items.map((item, index) => {
                    const isOpen = openIndex === index;
                    const summary = itemLabel?.(item, index)?.trim();

                    return (
                        <div key={index} className="rounded-xl border border-slate-200 bg-slate-50/60 overflow-hidden">
                            <div className="flex items-center gap-2 pr-2">
                                <button
                                    type="button"
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    aria-expanded={isOpen}
                                    className="flex flex-1 items-center gap-2 min-w-0 px-4 py-3 text-left hover:bg-slate-100/70 transition-colors"
                                >
                                    <ChevronDown
                                        className={cn(
                                            "w-4 h-4 shrink-0 text-slate-400 transition-transform",
                                            isOpen && "rotate-180"
                                        )}
                                    />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0">
                                        #{index + 1}
                                    </span>
                                    <span
                                        className={cn(
                                            "text-sm truncate",
                                            summary ? "text-slate-700 font-medium" : "text-slate-400 italic"
                                        )}
                                    >
                                        {summary || "Untitled"}
                                    </span>
                                </button>

                                <div className="flex items-center gap-1 shrink-0">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-slate-400"
                                        onClick={() => move(index, -1)}
                                        disabled={index === 0}
                                    >
                                        <ArrowUp className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-slate-400"
                                        onClick={() => move(index, 1)}
                                        disabled={index === items.length - 1}
                                    >
                                        <ArrowDown className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-slate-400 hover:text-rose-600"
                                        onClick={() => remove(index)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            {isOpen && (
                                <div className="px-4 pb-4 pt-1 space-y-4 border-t border-slate-200">
                                    {renderItem(item, (patch) => {
                                        const next = [...items];
                                        next[index] = { ...items[index], ...patch };
                                        onChange(next);
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <Button type="button" variant="outline" size="sm" onClick={add}>
                <Plus className="w-3.5 h-3.5 mr-1.5" /> Add
            </Button>
        </div>
    );
}

/** Image field: shows a preview and uploads through the shared /upload endpoint. */
export const ImageField = ({
    label = "Photo",
    hint = "Upload an image, or paste a URL.",
    placeholder,
    rounded = true,
    value,
    onChange,
}: {
    label?: string;
    hint?: string;
    placeholder?: string;
    rounded?: boolean;
    value: string;
    onChange: (url: string) => void;
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const upload = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        setIsUploading(true);
        try {
            const res = await authenticatedFetch(`${API_BASE}/upload`, { method: "POST", body: formData });
            if (res.ok) {
                const data = await res.json();
                onChange(data.url);
                toast.success("Image uploaded.");
            } else {
                toast.error("Image upload failed.");
            }
        } catch (err) {
            toast.error("Image upload failed.");
        } finally {
            setIsUploading(false);
        }
    };

    const shape = rounded ? "rounded-full" : "rounded-lg";

    return (
        <Field label={label} hint={hint}>
            <div className="flex items-center gap-3">
                {value ? (
                    <img src={value} alt="" className={`w-14 h-14 ${shape} object-contain border border-slate-200 bg-white shrink-0`} />
                ) : (
                    <div className={`w-14 h-14 ${shape} bg-slate-100 border border-slate-200 shrink-0`} />
                )}
                <Input value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) upload(file);
                        e.target.value = "";
                    }}
                />
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    disabled={isUploading}
                    onClick={() => inputRef.current?.click()}
                >
                    {isUploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                </Button>
            </div>
        </Field>
    );
};
