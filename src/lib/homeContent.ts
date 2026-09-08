// Copy for the homepage sections that are not already admin-managed elsewhere.
// (The notification ticker reads Labour Law Updates and the FAQ block reads the
// `home_faqs` key, so neither appears here.)
//
// These defaults are exactly what the page ships with today: they render while
// the admin values load, and whenever the API is unreachable or the key has
// never been saved. The public components and the admin screen both import from
// here so the two cannot drift apart.

import eucareLogo from "@/assets/eucare-1.png";
import yuluLogo from "@/assets/yulu-2.png";
import yumaLogo from "@/assets/yuma-3.png";
import apolloLogo from "@/assets/apollo-4.png";
import kothariLogo from "@/assets/kotharai-5.png";
import sanofiLogo from "@/assets/sanofi-6.png";
import fischerLogo from "@/assets/fischer-7.png";
import sankarLogo from "@/assets/sanker-8.png";

export const HOME_CONTENT_KEY = "home_page";

// The orbit around the compliance core has six fixed positions, so anything
// past the sixth saved service simply is not rendered.
export const SERVICE_SLOT_COUNT = 6;

// Icons are stored as names rather than components so the value survives a JSON
// round-trip. Only names in this list are offered in the admin dropdown and
// resolved on the page — anything else falls back to the first entry.
export const PILLAR_ICON_NAMES = [
    "Shield",
    "Award",
    "Settings",
    "TrendingUp",
    "Zap",
    "Users",
    "Target",
    "CheckCircle2",
    "Clock",
    "Lock",
] as const;

export type PillarIconName = (typeof PILLAR_ICON_NAMES)[number];

export interface HomeHeroContent {
    badge: string;
    headline_prefix: string;
    headline_highlight: string;
    headline_suffix: string;
    subheadline: string;
    cta_label: string;
    trust_badges: string[];
}

export interface HomeServiceItem {
    title: string;
    descriptor: string;
    outcomes: string[];
    href: string;
}

export interface HomeServicesContent {
    eyebrow: string;
    heading_prefix: string;
    heading_highlight: string;
    cta_label: string;
    items: HomeServiceItem[];
}

export interface PillarItem {
    icon: PillarIconName;
    title: string;
    description: string;
}

export interface WhyChooseContent {
    heading_prefix: string;
    heading_highlight: string;
    description: string;
    link_label: string;
    pillars: PillarItem[];
}

export interface ClientLogoItem {
    name: string;
    logo: string;
}

export interface ClientStatItem {
    value: string;
    label: string;
}

export interface ClientsContent {
    badge: string;
    heading_prefix: string;
    heading_highlight: string;
    description: string;
    logos: ClientLogoItem[];
    stats: ClientStatItem[];
}

export interface HomeCtaContent {
    badge: string;
    heading_prefix: string;
    heading_highlight: string;
    description: string;
    primary_label: string;
    secondary_label: string;
    trust_indicators: string[];
}

export interface HomeContent {
    hero: HomeHeroContent;
    services: HomeServicesContent;
    why_choose: WhyChooseContent;
    clients: ClientsContent;
    cta: HomeCtaContent;
}

export const DEFAULT_HOME_CONTENT: HomeContent = {
    hero: {
        badge: "Technology-Driven Compliance",
        headline_prefix: "Compliance,",
        headline_highlight: "Engineered",
        headline_suffix: "for Confidence.",
        subheadline:
            "Reduce compliance risks, automate regulatory returns, and maintain inspection-ready records with India's trusted labor law experts.",
        cta_label: "Book Free Consultation",
        trust_badges: ["100+ Clients Trust Us", "Pan-India Coverage"],
    },

    services: {
        eyebrow: "Our Services",
        heading_prefix: "Our Compliance",
        heading_highlight: "Solutions",
        cta_label: "Explore All Services",
        items: [
            {
                title: "Labor Law Compliance",
                descriptor: "Expert-led solutions tailored for businesses leveraging automation.",
                outcomes: ["Zero Risk", "Automated Workflows", "Audit Ready"],
                href: "/services/labor-law-compliance",
            },
            {
                title: "Records & Registers",
                descriptor: "Automated solutions for managing mandatory records.",
                outcomes: ["100% Adherence", "Cloud Storage", "Audit Ready"],
                href: "/services/records-registers",
            },
            {
                title: "Licenses & Registrations",
                descriptor: "Simplifies licensing, renewals, and amendments seamlessly.",
                outcomes: ["Real-Time Tracking", "Expert Support", "No Disruptions"],
                href: "/services/licenses-registrations",
            },
            {
                title: "Vendor Audit",
                descriptor: "Streamlines vendor audits for supply chain visibility.",
                outcomes: ["Safe Supply Chain", "Risk Categorization", "Liability Check"],
                href: "/services/vendor-audit",
            },
            {
                title: "Payroll Compliance",
                descriptor: "Advanced automation for error-free payroll processing.",
                outcomes: ["Zero Errors", "Precise Deductions", "Real-Time Tracking"],
                href: "/services/payroll-compliance",
            },
            {
                title: "Remittances & Returns",
                descriptor: "Automated processes for timely remittances and returns.",
                outcomes: ["Multi-State Adherence", "Audit Trails", "Reduced Overhead"],
                href: "/services/remittances-returns",
            },
        ],
    },

    why_choose: {
        heading_prefix: "Why Choose",
        heading_highlight: "TrusComp?",
        description:
            "We combine technology innovation with compliance expertise to deliver unmatched value for your business.",
        link_label: "Learn More About Us",
        pillars: [
            {
                icon: "Shield",
                title: "Comprehensive Solutions",
                description: "End-to-end compliance management covering all aspects of labor law requirements.",
            },
            {
                icon: "Award",
                title: "Trusted Expertise",
                description: "Team of seasoned professionals with deep expertise in labor laws and regulations.",
            },
            {
                icon: "Settings",
                title: "Customizable Approach",
                description: "Tailored solutions that adapt to your specific industry and business needs.",
            },
            {
                icon: "TrendingUp",
                title: "Proven Track Record",
                description: "Consistent delivery of results with 100+ satisfied clients across industries.",
            },
        ],
    },

    clients: {
        badge: "Our Partners",
        heading_prefix: "Trusted by",
        heading_highlight: "Leading Organizations",
        description: "Join 100+ enterprises that rely on our expertise for compliance excellence",
        logos: [
            { name: "EUCARE", logo: eucareLogo.src },
            { name: "YULU", logo: yuluLogo.src },
            { name: "YUMA", logo: yumaLogo.src },
            { name: "Apollo Hospitals", logo: apolloLogo.src },
            { name: "KICL", logo: kothariLogo.src },
            { name: "Sanofi", logo: sanofiLogo.src },
            { name: "Fischer", logo: fischerLogo.src },
            { name: "Sankar", logo: sankarLogo.src },
        ],
        stats: [
            { value: "100+", label: "Enterprise Clients" },
            { value: "15+", label: "Industries Served" },
            { value: "98%", label: "Retention Rate" },
        ],
    },

    cta: {
        badge: "Start Your Journey",
        heading_prefix: "Ready to Simplify Your",
        heading_highlight: "Compliance?",
        description:
            "Schedule a free consultation with our compliance experts and discover how we can help protect your business from regulatory risks.",
        primary_label: "Book Free Consultation",
        secondary_label: "Explore Services",
        trust_indicators: ["No Hidden Fees", "Free Initial Assessment", "Expert Consultation"],
    },
};
