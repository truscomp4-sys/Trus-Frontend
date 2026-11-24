'use client'

import { useCallback, useEffect, useMemo, useState, type CSSProperties, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import {
    ArrowLeft,
    ArrowRight,
    ArrowUpRight,
    BadgeCheck,
    FolderOpen,
    ReceiptText,
    Scale,
    UsersRound,
    WalletCards,
    type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DEFAULT_HOME_CONTENT, type HomeServicesContent, type HomeServiceItem } from "@/lib/homeContent";

const SERVICE_PRESENTATION = [
    {
        key: "labour-law",
        match: /labour law/i,
        fallbackTitle: "Labour Law Compliance",
        fallbackDescription: "Expert-led solutions tailored for businesses leveraging automation.",
        href: "/services/end-to-end-labor-law-compliance-management",
        image: "/images/services/labour-law.webp",
        icon: Scale,
    },
    {
        key: "payroll",
        match: /payroll/i,
        fallbackTitle: "Payroll Compliance",
        fallbackDescription: "Advanced automation for error-free payroll processing.",
        href: "/services/payroll-compliance",
        image: "/images/services/payroll.webp",
        icon: WalletCards,
    },
    {
        key: "records-registers",
        match: /records|registers/i,
        fallbackTitle: "Records & Registers",
        fallbackDescription: "Automated solutions for managing mandatory records.",
        href: "/services/records-registers-compliance-automated-solutions-by-truscomp",
        image: "/images/services/records-registers.webp",
        icon: FolderOpen,
    },
    {
        key: "licenses-registrations",
        match: /licenses|registrations/i,
        fallbackTitle: "Licenses & Registrations",
        fallbackDescription: "Simplifies licensing, renewals, and amendments seamlessly.",
        href: "/services/licenses-registrations-renewals-amendments",
        image: "/images/services/licenses-registrations.webp",
        icon: BadgeCheck,
    },
    {
        key: "vendor-compliance",
        match: /vendor/i,
        fallbackTitle: "Vendor Audit",
        fallbackDescription: "Streamlines vendor audits for supply chain visibility.",
        href: "/services/vendor-audit",
        image: "/images/services/vendor-compliance.webp",
        icon: UsersRound,
    },
    {
        key: "remittances-returns",
        match: /remittances|returns/i,
        fallbackTitle: "Remittances & Returns",
        fallbackDescription: "Automated processes for timely remittances and returns.",
        href: "/services/remittances-returns-automated-compliance-by-truscomp",
        image: "/images/services/remittances-returns.webp",
        icon: ReceiptText,
    },
] as const;

type CarouselService = HomeServiceItem & {
    key: string;
    image: string;
    icon: LucideIcon;
};

const usePrefersReducedMotion = () => {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const query = window.matchMedia("(prefers-reduced-motion: reduce)");
        const update = () => setPrefersReducedMotion(query.matches);
        update();
        query.addEventListener("change", update);
        return () => query.removeEventListener("change", update);
    }, []);

    return prefersReducedMotion;
};

const ServiceCard = ({
    service,
    index,
    total,
    position,
    isHighlighted,
    onHighlight,
    onClearHighlight,
}: {
    service: CarouselService;
    index: number;
    total: number;
    position: number;
    isHighlighted: boolean;
    onHighlight: () => void;
    onClearHighlight: () => void;
}) => {
    const ServiceIcon = service.icon;
    const distance = Math.min(Math.abs(position), 3);
    const isCentre = position === 0;
    const angle = position * 2.7;
    const translateY = distance * 15;
    const scale = isCentre ? 1.075 : distance === 1 ? 0.98 : 0.93;

    return (
        <div
            className="min-w-0 flex-[0_0_86%] px-1.5 sm:flex-[0_0_56%] md:flex-[0_0_40%] lg:flex-[0_0_33.333%]"
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${total}: ${service.title}`}
            style={{ zIndex: 20 - distance }}
        >
            <Link
                href={service.href}
                className="group mx-auto block h-full w-full transition-transform duration-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FE8E01] focus-visible:ring-offset-4 focus-visible:ring-offset-[#393C49] motion-reduce:transition-none lg:w-[76%] lg:translate-x-[var(--fan-x)]"
                aria-label={`View ${service.title}`}
                style={{ "--fan-x": `${position * -36}%` } as CSSProperties}
                onMouseEnter={onHighlight}
                onMouseLeave={onClearHighlight}
                onFocus={onHighlight}
                onBlur={onClearHighlight}
            >
                <div
                    className="relative h-full origin-bottom transition-[transform,opacity] duration-700 ease-out motion-reduce:transition-none"
                    style={{
                        transform: `translateY(${translateY}px) rotate(${angle}deg) scale(${scale})`,
                        opacity: distance >= 3 ? 0.55 : distance === 2 ? 0.72 : 1,
                    }}
                >
                    <article
                        className={cn(
                            "flex h-[430px] flex-col overflow-hidden rounded-[1.6rem] border border-white/35 bg-white shadow-[0_22px_55px_-26px_rgba(0,0,0,0.75)] transition-transform duration-500 group-hover:scale-[1.025] group-focus-visible:scale-[1.025] motion-reduce:transition-none sm:h-[450px]",
                            isHighlighted && "shadow-[0_30px_65px_-25px_rgba(254,142,1,0.45)]"
                        )}
                        style={{ clipPath: "polygon(6% 0, 100% 3%, 94% 100%, 0 97%)" }}
                    >
                        <div className="relative h-[47%] shrink-0 overflow-hidden">
                            <Image
                                src={service.image}
                                alt={`${service.title} compliance service`}
                                fill
                                sizes="(max-width: 640px) 86vw, (max-width: 1024px) 40vw, 20vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transition-none"
                            />
                        </div>

                        <div
                            className={cn(
                                "flex flex-1 flex-col px-7 pb-7 pt-5 transition-colors duration-300 motion-reduce:transition-none",
                                isHighlighted
                                    ? "bg-[#FE8E01] text-white"
                                    : "bg-[#FFF9F2] text-[#393C49]"
                            )}
                        >
                            <div className="mb-3 flex items-start justify-between gap-4">
                                <ServiceIcon
                                    className={cn(
                                        "h-9 w-9 transition-colors",
                                        isHighlighted ? "text-white" : "text-[#FE8E01]"
                                    )}
                                    strokeWidth={1.8}
                                    aria-hidden="true"
                                />
                                <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full border", isHighlighted ? "border-white/40 text-white" : "border-[#393C49]/25")} aria-hidden="true">
                                    <ArrowUpRight className="h-4 w-4" />
                                </span>
                            </div>

                            <h3 className={cn("text-xl leading-tight sm:text-2xl", isHighlighted ? "font-black" : "font-extrabold")}>
                                {service.title}
                            </h3>
                            <span className={cn("mt-3 h-0.5 w-12", isHighlighted ? "bg-white" : "bg-[#393C49]")} aria-hidden="true" />
                            <p className={cn("mt-3 text-sm leading-5", isHighlighted ? "font-semibold text-white" : "font-medium text-[#393C49]/85")}>
                                {service.descriptor}
                            </p>

                            <span className={cn("mt-auto pt-4 text-sm", isHighlighted ? "font-extrabold text-white" : "font-bold")}>
                                View service <span aria-hidden="true">→</span>
                            </span>
                        </div>
                    </article>
                </div>
            </Link>
        </div>
    );
};

const getRelativePosition = (index: number, selectedIndex: number, total: number) => {
    let position = index - selectedIndex;
    if (position > total / 2) position -= total;
    if (position < -total / 2) position += total;
    return position;
};

const LivingComplianceSystem = ({ content = DEFAULT_HOME_CONTENT.services }: { content?: HomeServicesContent }) => {
    const services = useMemo<CarouselService[]>(
        () => SERVICE_PRESENTATION.map((presentation) => {
            const source = content.items.find((item) => presentation.match.test(item.title));
            return {
                title: source?.title || presentation.fallbackTitle,
                descriptor: source?.descriptor || presentation.fallbackDescription,
                outcomes: source?.outcomes || [],
                href: presentation.href,
                key: presentation.key,
                image: presentation.image,
                icon: presentation.icon,
            };
        }),
        [content.items]
    );

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center", skipSnaps: false });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
    const [isInteractionPaused, setIsInteractionPaused] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const prefersReducedMotion = usePrefersReducedMotion();

    const updateSelected = useCallback(() => {
        if (emblaApi) setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;

        updateSelected();
        emblaApi.on("select", updateSelected);
        emblaApi.on("reInit", updateSelected);
        emblaApi.on("pointerDown", () => setIsDragging(true));
        emblaApi.on("settle", () => setIsDragging(false));

        return () => {
            emblaApi.off("select", updateSelected);
            emblaApi.off("reInit", updateSelected);
        };
    }, [emblaApi, updateSelected]);

    useEffect(() => {
        if (!emblaApi || prefersReducedMotion || isInteractionPaused || isDragging) return;
        const interval = window.setInterval(() => emblaApi.scrollNext(), 4000);
        return () => window.clearInterval(interval);
    }, [emblaApi, isDragging, isInteractionPaused, prefersReducedMotion]);

    const handleKeyboard = (event: KeyboardEvent<HTMLDivElement>) => {
        if (!emblaApi) return;
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            emblaApi.scrollPrev();
        }
        if (event.key === "ArrowRight") {
            event.preventDefault();
            emblaApi.scrollNext();
        }
    };

    return (
        <section className="relative overflow-hidden bg-slate-900 py-14 text-white sm:py-16" aria-labelledby="services-heading">
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
                <div className="absolute inset-0 opacity-[0.13] [background-image:linear-gradient(to_right,rgba(255,255,255,0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.25)_1px,transparent_1px)] [background-size:5rem_5rem]" />
                <div className="absolute -left-48 -top-56 h-[620px] w-[620px] rounded-full bg-[#FE8E01]/16 blur-[110px]" />
                <div className="absolute -right-52 top-0 h-[700px] w-[700px] rounded-full bg-[#FE8E01]/10 blur-[130px]" />
                <div className="absolute -bottom-36 left-1/2 h-72 w-[80%] -translate-x-1/2 rounded-[50%] bg-[#FE8E01]/10 blur-3xl" />
                <div className="absolute bottom-20 left-1/2 h-px w-[88%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#FE8E01]/65 to-transparent" />
            </div>

            <div className="section-container relative z-10 text-center">
                <div className="mb-5 inline-flex items-center gap-3">
                    <span className="h-0.5 w-10 bg-[#FE8E01]" aria-hidden="true" />
                    <span className="text-sm font-bold uppercase tracking-[0.25em] text-[#FE8E01]">Our Services</span>
                    <span className="h-0.5 w-10 bg-[#FE8E01]" aria-hidden="true" />
                </div>

                <h2 id="services-heading" className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
                    Comprehensive <span className="text-[#FE8E01]">Compliance Solutions</span>
                </h2>
                <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-white/80 sm:text-lg">
                    End-to-end labour law and statutory compliance management with expert support and technology.
                </p>
            </div>

            <div
                className="relative z-10 mx-auto mt-6 max-w-[1600px] sm:mt-8"
                role="region"
                aria-roledescription="carousel"
                aria-label="TrusComp compliance services"
                onMouseEnter={() => setIsInteractionPaused(true)}
                onMouseLeave={() => {
                    setHighlightedIndex(null);
                    setIsInteractionPaused(false);
                }}
                onFocusCapture={() => setIsInteractionPaused(true)}
                onBlurCapture={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                        setHighlightedIndex(null);
                        setIsInteractionPaused(false);
                    }
                }}
                onKeyDown={handleKeyboard}
            >
                <div ref={emblaRef} className="overflow-hidden px-4 py-9 sm:px-8 sm:py-10">
                    <div className="flex touch-pan-y items-stretch">
                        {services.map((service, index) => (
                            <ServiceCard
                                key={service.key}
                                service={service}
                                index={index}
                                total={services.length}
                                position={getRelativePosition(index, selectedIndex, services.length)}
                                isHighlighted={(highlightedIndex ?? selectedIndex) === index}
                                onHighlight={() => setHighlightedIndex(index)}
                                onClearHighlight={() => setHighlightedIndex(null)}
                            />
                        ))}
                    </div>
                </div>

                <p className="sr-only" aria-live="polite">
                    Showing {services[selectedIndex]?.title}
                </p>

                <button
                    type="button"
                    onClick={() => emblaApi?.scrollPrev()}
                    className="absolute left-2 top-[37%] z-40 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-slate-950/70 text-white shadow-lg backdrop-blur-sm transition-colors hover:border-[#FE8E01] hover:bg-[#FE8E01] hover:text-[#393C49] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FE8E01] motion-reduce:transition-none sm:left-4 sm:top-1/2 sm:h-10 sm:w-10 lg:left-7"
                    aria-label="Previous service"
                >
                    <ArrowLeft className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    onClick={() => emblaApi?.scrollNext()}
                    className="absolute right-2 top-[37%] z-40 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-slate-950/70 text-white shadow-lg backdrop-blur-sm transition-colors hover:border-[#FE8E01] hover:bg-[#FE8E01] hover:text-[#393C49] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FE8E01] motion-reduce:transition-none sm:right-4 sm:top-1/2 sm:h-10 sm:w-10 lg:right-7"
                    aria-label="Next service"
                >
                    <ArrowRight className="h-4 w-4" />
                </button>
            </div>

            <div className="section-container relative z-10 mt-2 text-center sm:mt-3">
                <Link
                    href="/services"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#FE8E01] px-8 py-3.5 text-base font-extrabold text-[#393C49] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#393C49] motion-reduce:transition-none"
                >
                    Explore All Services
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Link>
            </div>
        </section>
    );
};

export default LivingComplianceSystem;
