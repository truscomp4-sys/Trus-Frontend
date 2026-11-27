import type { Metadata } from 'next'
import { fetchSEOMeta } from '@/lib/seo'
import Index from '@/_views/Index'
import JsonLd from '@/components/JsonLd'

export async function generateMetadata(): Promise<Metadata> {
  return fetchSEOMeta('home')
}

const homepageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.truscomp.com/#organization",
      name: "TrusComp",
      legalName: "TrusComp Private Limited",
      url: "https://www.truscomp.com/",
      logo: "https://res.cloudinary.com/do9eg3jbe/raw/upload/v1772691819/truscomp_resources/truscomp_logo%201_1772691816205",
      description:
        "Manage compliance obligations, statutory records and workforce requirements with structured monitoring and expert assistance.",
      areaServed: "IN",
      address: {
        "@type": "PostalAddress",
        streetAddress: "2nd Floor, Pe Ve Plaza, 9, Arcot Rd, Sai Nagar, Lakshmi Nagar, Porur",
        addressLocality: "Chennai",
        addressRegion: "Tamil Nadu",
        postalCode: "600116",
        addressCountry: "IN",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+91-8754048634",
        email: "info@truscomp.com",
        contactType: "compliance services",
        areaServed: "IN",
      },
      sameAs: [
        "https://in.linkedin.com/company/truscomp-compliance",
        "https://www.facebook.com/p/Truscomp-61561657566740/",
        "https://www.instagram.com/trus_comp",
        "https://www.youtube.com/@TruscompOfficial",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://www.truscomp.com/#website",
      url: "https://www.truscomp.com/",
      name: "TrusComp",
      publisher: { "@id": "https://www.truscomp.com/#organization" },
    },
  ],
}

export default function HomePage() {
  return (
    <>
      <JsonLd data={homepageSchema} />
      <Index />
    </>
  )
}
