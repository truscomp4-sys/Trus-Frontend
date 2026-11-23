'use client'

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ClipboardCheck,
  Factory,
  MapPin,
  Play,
  ShieldCheck,
  Users,
  WalletCards,
} from "lucide-react";
import type { HomeHeroContent } from "@/lib/homeContent";

const HERO_VIDEO_EMBED_URL = "https://www.youtube.com/embed/u0pxL6U2ud0";
const HERO_VIDEO_TITLE = "TrusComp compliance support video";

const CAPABILITIES = [
  { label: "Statutory Filings & Returns", icon: ClipboardCheck },
  { label: "Payroll Compliance", icon: WalletCards },
  { label: "Vendor & Contractor Compliance", icon: Users },
  { label: "Factory Compliance", icon: Factory },
  { label: "Compliance Tracking & Audit Support", icon: ShieldCheck },
];

const TRUST_ICONS = [Users, MapPin];

const HeroSection = ({ content }: { content: HomeHeroContent }) => {
  const [videoActivated, setVideoActivated] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoFrameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!videoActivated) return;

    videoContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    videoFrameRef.current?.focus({ preventScroll: true });
  }, [videoActivated]);

  const handleVideoActivation = () => {
    setVideoActivated(true);
  };

  const videoSrc = videoActivated
    ? `${HERO_VIDEO_EMBED_URL}?autoplay=1&rel=0&playsinline=1`
    : HERO_VIDEO_EMBED_URL;

  return (
    <section className="overflow-hidden bg-white">
      <div className="section-container py-12 sm:py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-20">
          <div>
            <div className="mb-6 flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-[#393C49] sm:text-sm">
                {content.badge}
              </span>
              <span className="h-0.5 w-16 rounded-full bg-[#FE8E01]" aria-hidden="true" />
            </div>

            <h1 className="max-w-3xl text-[clamp(2.6rem,4.8vw,4.75rem)] font-extrabold leading-[0.98] tracking-[-0.045em] text-[#393C49]">
              <span className="block">{content.headline_prefix}</span>
              <span className="mt-2 block text-[#FE8E01]">
                {content.headline_highlight}{" "}{content.headline_suffix}
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-7 text-[#393C49]/80 sm:text-lg sm:leading-8">
              {content.subheadline}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                asChild
                size="lg"
                className="h-14 rounded-xl bg-[#FE8E01] px-7 text-base font-bold text-[#393C49] shadow-none hover:bg-[#FE8E01]/90 focus-visible:ring-[#393C49]"
              >
                <Link href="/contact" className="group">
                  {content.cta_label}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={handleVideoActivation}
                aria-controls="truscomp-video"
                className="h-14 rounded-xl border-[#FE8E01] bg-white px-7 text-base font-bold text-[#393C49] shadow-none hover:bg-[#FE8E01]/10 hover:text-[#393C49] focus-visible:ring-[#FE8E01]"
              >
                <Play className="mr-1 h-5 w-5 fill-[#FE8E01] text-[#FE8E01]" />
                Watch How We Support
              </Button>
            </div>

            <div className="mt-9 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-0">
              {content.trust_badges.map((badge, index) => {
                const Icon = TRUST_ICONS[index % TRUST_ICONS.length];
                return (
                  <div
                    key={badge}
                    className={`flex items-center gap-3 sm:px-6 ${index === 0 ? "sm:pl-0" : "sm:border-l sm:border-[#393C49]/20"}`}
                  >
                    <Icon className="h-8 w-8 shrink-0 text-[#FE8E01]" strokeWidth={1.8} />
                    <span className="max-w-40 text-base font-semibold leading-tight text-[#393C49]">
                      {badge}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-full lg:pl-2">
            <div
              ref={videoContainerRef}
              className="aspect-video w-full scroll-mt-28 overflow-hidden rounded-xl bg-black focus-within:ring-4 focus-within:ring-[#393C49] focus-within:ring-offset-2 focus-within:ring-offset-white"
            >
              <iframe
                key={videoSrc}
                ref={videoFrameRef}
                id="truscomp-video"
                className="h-full w-full"
                src={videoSrc}
                title={HERO_VIDEO_TITLE}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#393C49] text-white">
        <div className="section-container grid gap-px bg-white/15 sm:grid-cols-2 lg:grid-cols-5">
          {CAPABILITIES.map(({ label, icon: Icon }) => (
            <div key={label} className="flex min-h-28 items-center gap-4 bg-[#393C49] px-5 py-6 lg:px-6">
              <Icon className="h-9 w-9 shrink-0 text-[#FE8E01]" strokeWidth={1.7} />
              <span className="text-sm font-semibold leading-5 text-white xl:text-base">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
