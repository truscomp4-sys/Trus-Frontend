// Copy for every section of the About page. These defaults are exactly what the
// page ships with today: they render while the admin values load, and whenever
// the API is unreachable or a key has never been saved. The public components
// and the admin screen both import from here so the two cannot drift apart.

export const ABOUT_CONTENT_KEY = "about_page";

// Icons are stored as names rather than components so the value survives a JSON
// round-trip. Only names in this list are offered in the admin dropdown and
// resolved on the page — anything else falls back to the first entry.
export const VALUE_ICON_NAMES = [
    "Heart",
    "Eye",
    "Scale",
    "Lightbulb",
    "Users",
    "Handshake",
    "GraduationCap",
    "Shield",
    "Award",
    "Target",
    "Zap",
    "BookOpen",
] as const;

export type ValueIconName = (typeof VALUE_ICON_NAMES)[number];

export interface AboutHeroContent {
    badge: string;
    headline_prefix: string;
    headline_highlight: string;
    description: string;
}

export interface CoreValueItem {
    icon: ValueIconName;
    label: string;
    description: string;
}

export interface CoreValuesContent {
    eyebrow: string;
    heading: string;
    values: CoreValueItem[];
}

export interface FounderItem {
    name: string;
    role: string;
    image: string;
    description: string;
    expertise: string[];
}

export interface LeaderItem {
    name: string;
    role: string;
}

export interface LeadershipContent {
    heading: string;
    founders: FounderItem[];
    leadership_heading: string;
    leadership: LeaderItem[];
}

export interface MetricItem {
    number: string;
    label: string;
    description: string;
}

export interface ImpactContent {
    eyebrow: string;
    heading: string;
    metrics: MetricItem[];
}

export interface StatementContent {
    eyebrow: string;
    heading_prefix: string;
    heading_highlight: string;
    heading_suffix: string;
    body: string;
}

export interface VisionMissionContent {
    vision: StatementContent;
    mission: StatementContent;
}

export interface PhaseItem {
    step: string;
    title: string;
    range: string;
}

export interface FrameworkContent {
    eyebrow: string;
    heading: string;
    description: string;
    phases: PhaseItem[];
}

export interface SupportContent {
    badge: string;
    heading_line1: string;
    heading_line2: string;
}

export interface AboutCtaContent {
    badge: string;
    heading_prefix: string;
    heading_highlight: string;
    description: string;
    button_label: string;
    trust_indicators: string[];
}

export interface AboutContent {
    hero: AboutHeroContent;
    core_values: CoreValuesContent;
    leadership: LeadershipContent;
    impact: ImpactContent;
    vision_mission: VisionMissionContent;
    framework: FrameworkContent;
    support: SupportContent;
    cta: AboutCtaContent;
}

export const DEFAULT_ABOUT_CONTENT: AboutContent = {
    hero: {
        badge: "Our Identity",
        headline_prefix: "Compliance,",
        headline_highlight: "Powered by TrusComp",
        description:
            "TrusComp Private Limited is a trusted leader in compliance solutions, combining labor law expertise, consulting, and technology to transform regulatory adherence into a competitive advantage.",
    },

    core_values: {
        eyebrow: "Our DNA",
        heading: "Values in Motion",
        values: [
            { icon: "Heart", label: "Trust", description: "Building long-lasting relationships." },
            { icon: "Eye", label: "Transparency", description: "Open and honest communication." },
            { icon: "Scale", label: "Ethical Practices", description: "Upholding highest standards." },
            { icon: "Lightbulb", label: "Innovation", description: "Future-ready solutions." },
            { icon: "Users", label: "Client-Centric", description: "Exceeding expectations." },
            { icon: "Handshake", label: "Collaboration", description: "Teamwork for problem-solving." },
            { icon: "GraduationCap", label: "Learning", description: "Continuous improvement." },
        ],
    },

    leadership: {
        heading: "Leadership That Built the System",
        founders: [
            {
                name: "Mr. S. Deenadayalan",
                role: "Founder",
                image: "/images/leadership/deenadayalan.png",
                expertise: ["50+ Years Experience", "Centre for Excellence CEO", "Pioneered Self-Managed Teams"],
                description: "A visionary leader who has shaped the landscape of organizational excellence in India.",
            },
            {
                name: "Mr. PPK Mahindhra",
                role: "Co-Founder",
                image: "/images/leadership/ppk-mahindhra1.png",
                expertise: ["26+ Years Experience", "Automation Pioneer", "RPA-Powered Tools"],
                description: "Driving the digital transformation of compliance through high-performance systems.",
            },
            {
                name: "Mr. Anand Gopalan",
                role: "Knowledge Partner",
                image: "/images/leadership/anand-gopalan.png",
                expertise: ["Barrister", "Industrial Relations", "Policy Reform Contributor"],
                description: "Providing the legal backbone and deep insights into labor law complexities.",
            },
        ],
        leadership_heading: "Operational Leadership",
        leadership: [
            { name: "Mr. Ramesh", role: "Head of Operations" },
            { name: "Mr. C. Sreetharan", role: "Chief Operating Officer" },
            { name: "Mr. M.V. Prakash", role: "Senior Vice President" },
        ],
    },

    impact: {
        eyebrow: "Impact & Resonance",
        heading: "Proof Through Presence",
        metrics: [
            { number: "7+", label: "7+ Years of Excellence", description: "Delivering customized compliance solutions." },
            { number: "60+", label: "60+ Compliance Specialists", description: "Dedicated experts ensuring your peace of mind." },
            { number: "100+", label: "100+ Trusted Clients", description: "Including industry leaders across sectors." },
        ],
    },

    vision_mission: {
        vision: {
            eyebrow: "Our Vision",
            heading_prefix: "To be the",
            heading_highlight: "leading force",
            heading_suffix: "transforming compliance.",
            body: "To be the leading force in transforming compliance management in India, enabling organizations to achieve regulatory excellence effortlessly. We aim to set new benchmarks for ethical business practices across industries, fostering trust, transparency, and innovation.",
        },
        mission: {
            eyebrow: "Our Mission",
            heading_prefix: "Empowering businesses with",
            heading_highlight: "innovative",
            heading_suffix: "solutions.",
            body: "To empower businesses with innovative compliance solutions that simplify regulatory adherence and enhance operational efficiency. We strive to enable organizations to focus on growth with complete trust in their compliance.",
        },
    },

    framework: {
        eyebrow: "Our Methodology",
        heading: "Compliance, Engineered in Phases",
        description:
            "A meticulously structured framework designed for seamless operational transition and long-term stability.",
        phases: [
            { step: "01", title: "Needs Analysis", range: "Phase 1-2" },
            { step: "02", title: "Project Planning", range: "Phase 3" },
            { step: "03", title: "Technical Setup", range: "Phase 4" },
            { step: "04", title: "User Onboarding", range: "Phase 4-5" },
            { step: "05", title: "Pilot Testing", range: "Phase 6-7" },
            { step: "06", title: "Full-Scale Deployment", range: "Phase 8-9" },
            { step: "07", title: "Ongoing Support", range: "Ongoing" },
        ],
    },

    support: {
        badge: "Beyond Go-Live",
        heading_line1: "Compliance doesn't end at implementation.",
        heading_line2: "We stay with you.",
    },

    cta: {
        badge: "Your Trusted Compliance Partner",
        heading_prefix: "Ready to build",
        heading_highlight: "trust?",
        description:
            "Join 100+ trusted clients who have transformed their compliance journey with TrusComp. Let's write your success story together.",
        button_label: "Take the First Step",
        trust_indicators: ["Free Consultation", "Expert Team", "24/7 Support"],
    },
};
