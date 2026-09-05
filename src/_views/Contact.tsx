'use client'

import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/hooks/useSettings";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useSEO } from "@/hooks/useSEO";
import qrCode from "@/assets/qr.png";

// Zoho Forms embed (TrusComp-Website form, mapped into Zoho CRM Leads
// with the same Business Entity / Assignment Rule / notification workflow
// pattern used by the other CEO Group sites).
const ZOHO_FORM_URL =
  "https://forms.zohopublic.in/ceohrconsultancy1/form/TrusCompWebsite/formperma/E1M0WZ5gxr0YMQvvk1gxCdgVbyaMgypA2aTxf9p6m7U";

const Contact = () => {
  useSEO("contact");

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const { data: settings } = useSettings();

  return (
    <Layout>
      {/* Contact Section with Integrated Header */}
      <section className="pt-6 lg:pt-12 pb-6 lg:pb-24 bg-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Gradient Blobs */}
          <motion.div
            className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/5 blur-[100px]"
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-orange-100/40 blur-[100px]"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 12, repeat: Infinity }}
          />

          {/* Animated Dots/Particles */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-primary/20"
              style={{
                width: Math.random() * 8 + 4 + "px",
                height: Math.random() * 8 + 4 + "px",
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
              }}
              animate={{
                y: [0, -80, 0],
                x: [0, Math.random() * 40 - 20, 0],
                opacity: [0, 0.4, 0],
              }}
              transition={{
                duration: 6 + Math.random() * 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        <div className="section-container relative z-10">
          {/* Page Header */}
          <div className="text-center mb-12 lg:mb-16">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1.5 rounded-full bg-orange-50 text-primary text-sm font-medium border border-orange-100 mb-6"
            >
              Contact Us
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl lg:text-7xl font-display font-bold text-slate-900 mb-6 tracking-tight"
            >
              Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">Touch</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
            >
              Ready to simplify your compliance? We're here to help you navigate complex labor laws with ease.
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-500" />

                <h2 className="text-2xl font-display font-bold text-slate-900 mb-6 relative z-10">
                  Contact Information
                </h2>
                <p className="text-slate-600 mb-8 relative z-10">
                  Reach out to us for a free compliance consultation.
                  Our experts are ready to help.
                </p>

                <div className="space-y-6 relative z-10">
                  {/* Address */}
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0 text-primary shadow-sm border border-orange-100">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Address</h4>
                      <p className="text-sm text-slate-600">
                        {settings?.office_address ? (
                          [
                            settings.office_address.line1,
                            settings.office_address.street,
                            settings.office_address.district,
                            settings.office_address.state,
                            settings.office_address.country
                          ].filter(Boolean).join(', ') + (settings.office_address.pincode ? ` - ${settings.office_address.pincode}` : '')
                        ) : (
                          "TrusComp Private Limited, No.9, 3rd Floor, Pe Ve plaza, Lakshmi Nagar, Tamil Nadu, India - 600116"
                        )}
                      </p>
                    </div>
                  </motion.div>

                  {/* Phone */}
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0 text-primary shadow-sm border border-orange-100">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Phone</h4>
                      <a href={`tel:${settings?.contact_phone || '+918754048634'}`} className="text-sm text-slate-600 hover:text-primary transition-colors block">
                        {settings?.contact_phone || '+91 87540 48634'}
                      </a>
                    </div>
                  </motion.div>

                  {/* Email */}
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0 text-primary shadow-sm border border-orange-100">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Email</h4>
                      <a href={`mailto:${settings?.contact_email || 'info@truscomp.com'}`} className="text-sm text-slate-600 hover:text-primary transition-colors block">
                        {settings?.contact_email || 'info@truscomp.com'}
                      </a>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Contact Form (Zoho Forms embed -> Zoho CRM Leads) */}
            <div className="lg:col-span-3">
              <div className="dashboard-card p-8">
                <h3 className="text-xl font-display font-semibold text-foreground mb-6">
                  Compliance Enquiry Form
                </h3>
                <iframe
                  title="TrusComp Compliance Enquiry Form"
                  aria-label="TrusComp-Website"
                  src={ZOHO_FORM_URL}
                  style={{ height: "1000px", width: "100%", border: "none" }}
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Connect with Our Team - Full Width Horizontal Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 lg:mt-24 mb-6 lg:mb-12 bg-slate-900 text-white rounded-3xl p-8 lg:p-12 shadow-2xl shadow-slate-900/20 relative overflow-hidden group"
          >
            {/* Background Decals */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-tr-full -ml-8 -mb-8 group-hover:scale-110 transition-transform duration-700 pointer-events-none" />

            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 relative z-10">
              {/* Contact Person Details */}
              <div className="flex-grow space-y-6 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <h4 className="font-display font-semibold text-white tracking-widest uppercase text-[10px]">
                    Connect with Our Team
                  </h4>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-3xl font-display font-bold text-white tracking-tight">Mr. MV Prakash</h3>
                    <p className="text-primary text-sm font-semibold mt-1">Senior Vice President</p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-2">
                    <div className="flex items-center gap-3 group/item">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-white transition-all duration-300">
                        <Phone className="w-5 h-5" />
                      </div>
                      <a href="tel:+919743883000" className="text-sm text-slate-300 hover:text-white transition-colors font-medium">
                        +91 97438 83000
                      </a>
                    </div>
                    <div className="flex items-center gap-3 group/item">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-white transition-all duration-300">
                        <Mail className="w-5 h-5" />
                      </div>
                      <a href="mailto:prakash@truscomp.com" className="text-base text-slate-300 hover:text-white transition-colors font-medium">
                        prakash@truscomp.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vertical Divider (Desktop Only) */}
              <div className="hidden lg:block w-px h-32 bg-slate-800" />

              {/* QR Code Section */}
              <div className="flex flex-col items-center gap-4 text-center shrink-0">
                <div className="bg-white p-3.5 rounded-2xl shadow-2xl transition-all hover:scale-105 duration-500">
                  <img
                    src={(qrCode as any).src || qrCode}
                    alt="Connect QR Code"
                    className="w-28 h-28 lg:w-32 lg:h-32 object-contain"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-white mb-0.5">Scan to Connect</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">Instant Contact Access</p>
                </div>
              </div>

              {/* Vertical Divider (Desktop Only) */}
              <div className="hidden lg:block w-px h-32 bg-slate-800" />

              {/* WhatsApp Call to Action */}
              <div className="flex-shrink-0 flex flex-col items-center lg:items-start gap-4">
                <div className="text-center lg:text-left">
                  <p className="text-lg font-display font-bold text-white mb-1">Quick WhatsApp Access</p>
                  <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed">Have urgent compliance questions? Chat with our experts directly for instant support.</p>
                </div>
                <Button
                  onClick={() => window.open('https://wa.me/919743883000', '_blank')}
                  className="bg-[#25D366] hover:bg-[#20ba59] text-white border-0 h-12 px-8 rounded-xl font-bold transition-all shadow-xl shadow-emerald-500/10 group/wa w-full sm:w-auto"
                >
                  <MessageCircle className="w-5 h-5 mr-2 group-hover/wa:rotate-12 transition-transform" />
                  Message on WhatsApp
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
