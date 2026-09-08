'use client'

import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import LivingComplianceSystem from "@/components/home/LivingComplianceSystem";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import ClientLogos from "@/components/home/ClientLogos";
import FAQSection from "@/components/home/FAQSection";
import CTASection from "@/components/home/CTASection";
import NotificationTicker from "@/components/home/NotificationTicker";

import { useSEO } from "@/hooks/useSEO";
import { useSettingValue } from "@/hooks/useSettingValue";
import { HOME_CONTENT_KEY, DEFAULT_HOME_CONTENT } from "@/lib/homeContent";

const Index = () => {
  useSEO("home");

  // One request for the whole page; each section gets its own slice so the
  // components stay presentational. The ticker and the FAQ block fetch their
  // own data and are left alone.
  const content = useSettingValue(HOME_CONTENT_KEY, DEFAULT_HOME_CONTENT);

  return (
    <Layout>
      <HeroSection content={content.hero} />
      <NotificationTicker />
      <LivingComplianceSystem content={content.services} />
      <WhyChooseUs content={content.why_choose} />
      <ClientLogos content={content.clients} />
      <FAQSection />
      <CTASection content={content.cta} />
    </Layout>
  );
};

export default Index;
