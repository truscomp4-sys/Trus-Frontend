// Copy for the contact page. These defaults are exactly what the page ships
// with today: they render while the admin values load, and whenever the API is
// unreachable or the key has never been saved. The public component and the
// admin screen both import from here so the two cannot drift apart.
//
// The address, phone and email shown in the info card come from System
// Settings, so they do not appear here. The enquiry form itself is a Zoho Forms
// embed — only its URL is configurable; the fields inside it are edited in Zoho.

export const CONTACT_CONTENT_KEY = "contact_page";

export interface ContactHeroContent {
    badge: string;
    headline_prefix: string;
    headline_highlight: string;
    description: string;
}

export interface ContactInfoContent {
    heading: string;
    description: string;
}

export interface ContactFormContent {
    zoho_url: string;
    height: string;
}

export interface ContactTeamContent {
    eyebrow: string;
    name: string;
    role: string;
    phone_display: string;
    phone_link: string;
    email: string;
    qr_title: string;
    qr_subtitle: string;
    whatsapp_heading: string;
    whatsapp_description: string;
    whatsapp_button_label: string;
    whatsapp_number: string;
}

export interface ContactContent {
    hero: ContactHeroContent;
    info: ContactInfoContent;
    form: ContactFormContent;
    team: ContactTeamContent;
}

export const DEFAULT_CONTACT_CONTENT: ContactContent = {
    hero: {
        badge: "Contact Us",
        headline_prefix: "Get in",
        headline_highlight: "Touch",
        description:
            "Ready to simplify your compliance? We're here to help you navigate complex labor laws with ease.",
    },

    info: {
        heading: "Contact Information",
        description: "Reach out to us for a free compliance consultation. Our experts are ready to help.",
    },

    form: {
        // Zoho Forms embed (TrusComp-Website form, mapped into Zoho CRM Leads
        // with the same Business Entity / Assignment Rule / notification workflow
        // pattern used by the other CEO Group sites).
        zoho_url:
            "https://forms.zohopublic.in/ceohrconsultancy1/form/TrusCompWebsite/formperma/E1M0WZ5gxr0YMQvvk1gxCdgVbyaMgypA2aTxf9p6m7U",
        height: "1150px",
    },

    team: {
        eyebrow: "Connect with Our Team",
        name: "Mr. MV Prakash",
        role: "Senior Vice President",
        phone_display: "+91 97438 83000",
        phone_link: "+919743883000",
        email: "prakash@truscomp.com",
        qr_title: "Scan to Connect",
        qr_subtitle: "Instant Contact Access",
        whatsapp_heading: "Quick WhatsApp Access",
        whatsapp_description:
            "Have urgent compliance questions? Chat with our experts directly for instant support.",
        whatsapp_button_label: "Message on WhatsApp",
        whatsapp_number: "919743883000",
    },
};
