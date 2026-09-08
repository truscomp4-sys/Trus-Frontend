'use client'

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import FloatingShapes from "@/components/ui/floating-shapes";
import ComplianceVisual from "./ComplianceVisual";
import ComplianceUpdatesButton from "./ComplianceUpdatesButton";
import type { HomeHeroContent } from "@/lib/homeContent";

// Trust badge dots cycle through the accent colours, so the row keeps its look
// however many badges are saved.
const TRUST_DOT_COLORS = ["bg-success animate-pulse", "bg-warning", "bg-primary"];

const HeroSection = ({ content }: { content: HomeHeroContent }) => {
  return (
    <section className="relative overflow-hidden min-h-[70vh] flex items-center bg-gradient-to-br from-background via-secondary/20 to-background">
      <FloatingShapes variant="hero" />

      {/* Animated gradient border at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-warning to-primary bg-[length:200%_100%] animate-shimmer" />

      <div className="section-container relative py-2 lg:py-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-warning/10 border border-primary/20 text-primary text-sm font-medium backdrop-blur-sm">
              <Sparkles className="w-4 h-4 animate-pulse" />
              {content.badge}
              <Zap className="w-4 h-4" />
            </div>

            {/* Headline */}
            <div className="animate-fade-in-up animation-delay-100">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-foreground leading-[1.1] tracking-tight">
                {content.headline_prefix}{" "}
                <span className="relative inline-block">
                  <span className="gradient-text">{content.headline_highlight}</span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                    <path d="M2 8C40 3 80 2 100 2C140 2 180 5 198 10" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" className="animate-[draw_1s_ease-out_forwards]" strokeDasharray="200" strokeDashoffset="200" style={{ animation: "draw 1.5s ease-out 0.5s forwards" }} />
                  </svg>
                </span>{" "}
                <br className="hidden sm:block" />
                {content.headline_suffix}
              </h1>
            </div>

            {/* Subheadline */}
            <p className="animate-fade-in-up animation-delay-200 text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl">
              {content.subheadline}
            </p>

            {/* CTAs */}
            <div className="animate-fade-in-up animation-delay-300 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="btn-primary text-base group">
                <Link href="/contact">
                  {content.cta_label}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <ComplianceUpdatesButton />
            </div>

            {/* Trust badges */}
            <div className="animate-fade-in-up animation-delay-400 flex items-center gap-6 pt-4">
              {content.trust_badges.map((badge, i) => (
                <div key={badge} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className={`w-2 h-2 rounded-full ${TRUST_DOT_COLORS[i % TRUST_DOT_COLORS.length]}`} />
                  {badge}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Abstract Compliance Visual */}
          <div className="animate-slide-in-right hidden lg:block">
            <ComplianceVisual />
          </div>

        </div>
      </div>

      {/* Draw animation keyframe */}
      <style>{`
        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
