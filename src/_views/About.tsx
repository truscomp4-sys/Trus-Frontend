'use client'

import Layout from "@/components/layout/Layout";
import AboutHero from "@/components/about/AboutHero";
import CoreValues from "@/components/about/CoreValues";
import VisionMission from "@/components/about/VisionMission";
import ImpactScale from "@/components/about/ImpactScale";
import FoundersLeadership from "@/components/about/FoundersLeadership";
import DeliveryFramework from "@/components/about/DeliveryFramework";
import ContinuousSupport from "@/components/about/ContinuousSupport";
import AboutCTA from "@/components/about/AboutCTA";

import { useSEO } from "@/hooks/useSEO";
import { useSettingValue } from "@/hooks/useSettingValue";
import { ABOUT_CONTENT_KEY, DEFAULT_ABOUT_CONTENT } from "@/lib/aboutContent";

const About = () => {
  useSEO("about");

  // One request for the whole page; each section gets its own slice so the
  // components stay presentational.
  const content = useSettingValue(ABOUT_CONTENT_KEY, DEFAULT_ABOUT_CONTENT);

  return (
    <Layout>
      <AboutHero content={content.hero} />
      <CoreValues content={content.core_values} />
      <FoundersLeadership content={content.leadership} />
      <ImpactScale content={content.impact} />
      <VisionMission content={content.vision_mission} />
      <DeliveryFramework content={content.framework} />
      <ContinuousSupport content={content.support} />
      <AboutCTA content={content.cta} />
    </Layout>
  );
};

export default About;
