import type { Metadata } from 'next'
import Script from 'next/script'
import { Providers } from './providers'
import '../index.css'

export const metadata: Metadata = {
  title: 'TrusComp - Labor Law Compliance Solutions',
  description: 'Technology-driven labor law compliance solutions. PF, ESIC, Payroll, Audits & Consulting services for businesses across India.',
  keywords: 'labor law compliance, PF compliance, ESIC compliance, payroll services, HR compliance, statutory compliance India',
  robots: 'index, follow',
  openGraph: {
    title: 'TrusComp - Compliance Engineered for Confidence',
    description: 'Technology-driven labor law compliance solutions for businesses across India.',
    url: 'https://truscomp.com',
    siteName: 'TrusComp',
    images: [{ url: 'https://truscomp.com/og-image.jpg' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TrusComp - Labor Law Compliance Solutions',
    description: 'Technology-driven labor law compliance solutions for businesses across India.',
    images: ['https://truscomp.com/og-image.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="gtm-head"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WRPRJV6X');`,
          }}
        />
      </head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WRPRJV6X"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
