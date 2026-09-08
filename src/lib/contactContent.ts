// Copy for the contact page. These defaults are exactly what the page ships
// with today: they render while the admin values load, and whenever the API is
// unreachable or the key has never been saved. The public component and the
// admin screen both import from here so the two cannot drift apart.
//
// The address, phone and email shown in the info card come from System
// Settings, and the service dropdown comes from Admin > Services, so neither
// appears here.

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
    heading: string;
    message_label: string;
    message_placeholder: string;
    submit_label: string;
}

export interface ContactTeamContent {
    eyebrow: string;
    name: string;
    role: string;
    phone_display: string;
    phone_link: string;
    whatsapp_heading: string;
    whatsapp_description: string;
    whatsapp_button_label: string;
    whatsapp_number: string;
}

export interface ContactSuccessContent {
    title: string;
    description: string;
    button_label: string;
}

export interface ContactContent {
    hero: ContactHeroContent;
    info: ContactInfoContent;
    form: ContactFormContent;
    team: ContactTeamContent;
    success: ContactSuccessContent;
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
        heading: "Compliance Enquiry Form",
        message_label: "Tell us about your compliance needs",
        message_placeholder: "Describe your current compliance challenges...",
        submit_label: "Submit Request",
    },

    team: {
        eyebrow: "Connect with Our Team",
        name: "Ms. Swetha",
        role: "Business Development",
        phone_display: "90809 66206",
        phone_link: "+919080966206",
        whatsapp_heading: "Quick WhatsApp Access",
        whatsapp_description:
            "Have urgent compliance questions? Chat with our experts directly for instant support.",
        whatsapp_button_label: "Message on WhatsApp",
        whatsapp_number: "919080966206",
    },

    success: {
        title: "Submission Successful",
        description:
            "Your compliance request has been submitted successfully. Our team will review your details and reach out to you shortly.",
        button_label: "Great, Thank You",
    },
};
