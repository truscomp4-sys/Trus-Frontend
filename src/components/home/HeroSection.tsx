'use client'

import Link from 'next/link';
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

const HERO_VIDEO_ID = "pXUGZjYm0lo";
const HERO_VIDEO_TITLE = "TrusComp Pvt Ltd - Simplifying Compliance for Indian Businesses | Introduction";

const CAPABILITIES = [
  { label: "Statutory Filings & Returns", icon: ClipboardCheck },
  { label: "Payroll Compliance", icon: WalletCards },
  { label: "Vendor & Contractor Compliance", icon: Users },
  { label: "Factory Compliance", icon: Factory },
  { label: "Compliance Tracking & Audit Support", icon: ShieldCheck },
];

const TRUST_ICONS = [Users, MapPin];

const HeroSection = ({ content }: { content: HomeHeroContent }) => {
  return (
    <section className="relative overflow-hidden bg-[#fbfaf8]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 top-8 h-[34rem] w-[34rem] rounded-full bg-orange-100/70 blur-3xl" />
        <div className="absolute -left-40 bottom-10 h-80 w-80 rounded-full bg-slate-100 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.025)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      </div>

      <div className="section-container relative py-12 sm:py-16 lg:py-20 xl:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-10 xl:gap-16">
          <div className="animate-fade-in-up">
            <div className="mb-7 flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-slate-700 sm:text-sm">
                {content.badge}
              </span>
              <span className="h-0.5 w-16 rounded-full bg-primary" aria-hidden="true" />
            </div>

            <h1 className="max-w-3xl text-[clamp(2.7rem,5.3vw,5.25rem)] font-extrabold leading-[0.98] tracking-[-0.045em] text-slate-800">
              <span className="block">{content.headline_prefix}</span>
              <span className="mt-2 block text-[#c2410c]">
                {content.headline_highlight}{" "}{content.headline_suffix}
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              {content.subheadline}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="h-14 rounded-xl bg-[#c2410c] px-7 text-base font-bold text-white shadow-[0_14px_30px_-12px_rgba(194,65,12,0.65)] hover:bg-[#9a3412]">
                <Link href="/contact" className="group">
                  {content.cta_label}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 rounded-xl border-primary/70 bg-white/80 px-7 text-base font-bold text-slate-800 hover:bg-orange-50 hover:text-slate-900">
                <a href="#truscomp-video">
                  <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#c2410c] text-white">
                    <Play className="h-3.5 w-3.5 fill-current" />
                  </span>
                  Watch How We Support
                </a>
              </Button>
            </div>

            <div className="mt-9 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-0">
              {content.trust_badges.map((badge, index) => {
                const Icon = TRUST_ICONS[index % TRUST_ICONS.length];
                return (
                  <div
                    key={badge}
                    className={`flex items-center gap-3 sm:px-6 ${index === 0 ? "sm:pl-0" : "sm:border-l sm:border-slate-300"}`}
                  >
                    <Icon className="h-8 w-8 shrink-0 text-[#c2410c]" strokeWidth={1.8} />
                    <span className="max-w-40 text-base font-semibold leading-tight text-slate-700">
                      {badge}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="animate-slide-in-right lg:pl-2">
            <div className="relative rounded-[2rem] border border-slate-200/80 bg-white p-2.5 shadow-[0_28px_80px_-32px_rgba(15,23,42,0.42)] sm:p-3">
              <div className="pointer-events-none absolute -bottom-3 -right-3 h-28 w-28 rounded-br-[2.2rem] border-b-[12px] border-r-[12px] border-primary/80" />
              <div className="grid overflow-hidden rounded-[1.45rem] bg-slate-900 md:grid-cols-[minmax(0,1.45fr)_minmax(210px,0.75fr)]">
                <div id="truscomp-video" role="group" tabIndex={-1} aria-label="TrusComp introduction video" className="relative aspect-video min-h-[230px] bg-black focus:outline-none focus:ring-4 focus:ring-[#c2410c] focus:ring-offset-2 focus:ring-offset-white md:aspect-auto md:min-h-[430px]">
                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src={`https://www.youtube-nocookie.com/embed/${HERO_VIDEO_ID}?rel=0`}
                    title={HERO_VIDEO_TITLE}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>

                <div className="relative flex flex-col justify-center overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-[#111827] px-7 py-9 text-white md:px-8">
                  <div className="absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-primary/90 blur-sm" />
                  <div className="absolute right-5 top-5 h-24 w-24 rounded-full border border-white/5" />
                  <div className="relative">
                    <span className="inline-flex rounded-lg bg-[#c2410c] px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.12em] text-white">
                      TrusComp Overview
                    </span>
                    <h2 className="mt-6 text-2xl font-bold leading-tight text-white xl:text-3xl">
                      Simplifying Compliance for Indian Businesses
                    </h2>
                    <div className="mt-5 h-1 w-14 rounded-full bg-primary" />
                    <p className="mt-5 text-sm leading-6 text-slate-300">
                      See how TrusComp combines compliance expertise, structured monitoring and technology-led support.
                    </p>
                    <a
                      href={`https://youtu.be/${HERO_VIDEO_ID}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-white transition-colors hover:text-orange-300"
                    >
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#c2410c]">
                        <Play className="h-4 w-4 fill-current" />
                      </span>
                      Watch on YouTube
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative bg-[#202b40] text-white">
        <div className="section-container grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-5">
          {CAPABILITIES.map(({ label, icon: Icon }) => (
            <div key={label} className="flex min-h-28 items-center gap-4 bg-[#202b40] px-5 py-6 lg:px-6">
              <Icon className="h-9 w-9 shrink-0 text-primary" strokeWidth={1.7} />
              <span className="text-sm font-semibold leading-5 text-slate-100 xl:text-base">
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
