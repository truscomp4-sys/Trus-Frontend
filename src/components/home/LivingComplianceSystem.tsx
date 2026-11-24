'use client'

import { useCallback, useEffect, useMemo, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
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
    },
    {
        key: "payroll",
        match: /payroll/i,
        fallbackTitle: "Payroll Compliance",
        fallbackDescription: "Advanced automation for error-free payroll processing.",
        href: "/services/payroll-compliance",
        image: "/images/services/payroll.webp",
    },
    {
        key: "records-registers",
        match: /records|registers/i,
        fallbackTitle: "Records & Registers",
        fallbackDescription: "Automated solutions for managing mandatory records.",
        href: "/services/records-registers-compliance-automated-solutions-by-truscomp",
        image: "/images/services/records-registers.webp",
    },
    {
        key: "licenses-registrations",
        match: /licenses|registrations/i,
        fallbackTitle: "Licenses & Registrations",
        fallbackDescription: "Simplifies licensing, renewals, and amendments seamlessly.",
        href: "/services/licenses-registrations-renewals-amendments",
        image: "/images/services/licenses-registrations.webp",
    },
    {
        key: "vendor-compliance",
        match: /vendor/i,
        fallbackTitle: "Vendor Audit",
        fallbackDescription: "Streamlines vendor audits for supply chain visibility.",
        href: "/services/vendor-audit",
        image: "/images/services/vendor-compliance.webp",
    },
    {
        key: "remittances-returns",
        match: /remittances|returns/i,
        fallbackTitle: "Remittances & Returns",
        fallbackDescription: "Automated processes for timely remittances and returns.",
        href: "/services/remittances-returns-automated-compliance-by-truscomp",
        image: "/images/services/remittances-returns.webp",
    },
] as const;

type CarouselService = HomeServiceItem & {
    key: string;
    image: string;
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
    isActive,
}: {
    service: CarouselService;
    index: number;
    total: number;
    isActive: boolean;
}) => (
    <div
        className="min-w-0 flex-[0_0_86%] px-2 sm:flex-[0_0_56%] md:flex-[0_0_40%] lg:flex-[0_0_24%] xl:flex-[0_0_20%]"
        role="group"
        aria-roledescription="slide"
        aria-label={`${index + 1} of ${total}: ${service.title}`}
    >
        <Link
            href={service.href}
            className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FE8E01] focus-visible:ring-offset-4 focus-visible:ring-offset-[#393C49]"
            aria-label={`View ${service.title}`}
        >
            <article
                className={cn(
                    "flex h-[410px] flex-col overflow-hidden rounded-2xl border border-white/20 bg-white transition-[transform,opacity] duration-500 motion-reduce:transition-none sm:h-[430px]",
                    isActive
                        ? "-translate-y-2 scale-[1.04] opacity-100"
                        : "scale-[0.94] opacity-80 group-hover:-translate-y-2 group-hover:scale-[1.04] group-hover:opacity-100 group-focus-visible:-translate-y-2 group-focus-visible:scale-[1.04] group-focus-visible:opacity-100"
                )}
            >
                <div className="relative h-44 shrink-0 overflow-hidden sm:h-48">
                    <Image
                        src={service.image}
                        alt={`${service.title} compliance service`}
                        fill
                        sizes="(max-width: 640px) 86vw, (max-width: 1024px) 40vw, 20vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transition-none"
                    />
                </div>

                <div
                    className={cn(
                        "flex flex-1 flex-col p-5 text-[#393C49] transition-colors duration-300 motion-reduce:transition-none sm:p-6",
                        isActive
                            ? "bg-[#FE8E01]"
                            : "bg-white group-hover:bg-[#FE8E01] group-focus-visible:bg-[#FE8E01]"
                    )}
                >
                    <div className="mb-4 flex items-start justify-between gap-4">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-70">
                            Service {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#393C49]/25" aria-hidden="true">
                            <ArrowUpRight className="h-4 w-4" />
                        </span>
                    </div>

                    <h3 className="text-xl font-extrabold leading-tight sm:text-2xl">
                        {service.title}
                    </h3>
                    <span className="mt-4 h-0.5 w-12 bg-[#393C49]" aria-hidden="true" />
                    <p className="mt-4 text-sm font-medium leading-6 text-[#393C49]/85">
                        {service.descriptor}
                    </p>

                    <span className="mt-auto pt-5 text-sm font-bold">
                        View service <span aria-hidden="true">→</span>
                    </span>
                </div>
            </article>
        </Link>
    </div>
);

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
            };
        }),
        [content.items]
    );

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center", skipSnaps: false });
    const [selectedIndex, setSelectedIndex] = useState(0);
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
        <section className="overflow-hidden bg-[#393C49] py-20 text-white sm:py-24" aria-labelledby="services-heading">
            <div className="section-container text-center">
                <div className="mb-5 inline-flex items-center gap-3">
                    <span className="h-0.5 w-10 bg-[#FE8E01]" aria-hidden="true" />
                    <span className="text-sm font-bold uppercase tracking-[0.25em] text-[#FE8E01]">Our Services</span>
                    <span className="h-0.5 w-10 bg-[#FE8E01]" aria-hidden="true" />
                </div>

                <h2 id="services-heading" className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
                    Comprehensive <span className="text-[#FE8E01]">Compliance Solutions</span>
                </h2>
                <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-white/80 sm:text-lg">
                    End-to-end labour law and statutory compliance management with expert support and technology.
                </p>
            </div>

            <div
                className="relative mx-auto mt-10 max-w-[1600px] sm:mt-14"
                role="region"
                aria-roledescription="carousel"
                aria-label="TrusComp compliance services"
                onMouseEnter={() => setIsInteractionPaused(true)}
                onMouseLeave={() => setIsInteractionPaused(false)}
                onFocusCapture={() => setIsInteractionPaused(true)}
                onBlurCapture={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                        setIsInteractionPaused(false);
                    }
                }}
                onKeyDown={handleKeyboard}
            >
                <div ref={emblaRef} className="overflow-hidden px-4 py-10 sm:px-8">
                    <div className="flex touch-pan-y items-stretch">
                        {services.map((service, index) => (
                            <ServiceCard
                                key={service.key}
                                service={service}
                                index={index}
                                total={services.length}
                                isActive={index === selectedIndex}
                            />
                        ))}
                    </div>
                </div>

                <p className="sr-only" aria-live="polite">
                    Showing {services[selectedIndex]?.title}
                </p>

                <div className="section-container mt-2 flex items-center justify-center gap-4">
                    <button
                        type="button"
                        onClick={() => emblaApi?.scrollPrev()}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/35 text-white transition-colors hover:border-[#FE8E01] hover:bg-[#FE8E01] hover:text-[#393C49] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FE8E01] motion-reduce:transition-none"
                        aria-label="Previous service"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>

                    <span className="min-w-20 text-center text-sm font-bold tracking-[0.15em] text-white/75" aria-hidden="true">
                        {String(selectedIndex + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
                    </span>

                    <button
                        type="button"
                        onClick={() => emblaApi?.scrollNext()}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/35 text-white transition-colors hover:border-[#FE8E01] hover:bg-[#FE8E01] hover:text-[#393C49] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FE8E01] motion-reduce:transition-none"
                        aria-label="Next service"
                    >
                        <ArrowRight className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div className="section-container mt-10 text-center">
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
