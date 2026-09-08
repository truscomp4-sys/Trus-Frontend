'use client'

import Layout from "@/components/layout/Layout";
import { Calculator as CalcIcon, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import CTASection from "@/components/home/CTASection";
import { useSEO } from "@/hooks/useSEO";
import { useSettingValue } from "@/hooks/useSettingValue";
import { CALCULATOR_CONTENT_KEY, DEFAULT_CALCULATOR_CONTENT } from "@/lib/calculatorContent";
import { HOME_CONTENT_KEY, DEFAULT_HOME_CONTENT } from "@/lib/homeContent";

const WageCalculator = () => {
  useSEO("wage_calculator");

  const content = useSettingValue(CALCULATOR_CONTENT_KEY, DEFAULT_CALCULATOR_CONTENT);
  // The closing block is the homepage CTA, so it follows Home Page Content.
  const home = useSettingValue(HOME_CONTENT_KEY, DEFAULT_HOME_CONTENT);

  const handleRedirect = () => {
    window.open(content.button_url, "_blank", "noopener,noreferrer");
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-background via-secondary/30 to-background border-b border-border/50">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <CalcIcon className="w-4 h-4" />
              {content.badge}
            </div>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-display font-bold text-foreground mb-6">
              {content.heading_prefix} <span className="gradient-text">{content.heading_highlight}</span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground mb-10 leading-relaxed">
              {content.description}
            </p>

            {/* Redirect Button Section */}
            <div className="flex justify-center mt-4">
              <Button
                onClick={handleRedirect}
                size="lg"
                className="btn-primary max-w-full px-4 py-4 sm:px-8 sm:py-6 lg:px-12 lg:py-8 text-sm sm:text-base lg:text-lg font-bold rounded-xl shadow-[0_10px_30px_rgba(255,140,0,0.3)] hover:shadow-[0_15px_40px_rgba(255,140,0,0.4)] transition-all flex items-center justify-center gap-2 sm:gap-3 group"
              >
                <span className="truncate sm:whitespace-normal">{content.button_label}</span>
                <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 group-hover:scale-110 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section from Home Page */}
      <CTASection content={home.cta} />
    </Layout>
  );
};

export default WageCalculator;
