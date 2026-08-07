'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { EASE } from '@/constants';
import { Button } from '@/components/ui';
import { siteConfig } from '@/config/site';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE.out, delay },
  }),
};

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setTimeout(() => setStatus('sent'), 1200);
  };

  return (
    <section className="relative z-10 bg-[#0f1012] pt-32 pb-20 md:pt-40 md:pb-24 lg:pt-48 lg:pb-28 min-h-screen">
      <div className="w-full px-4 md:px-[3vw]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Left Column: Typography & Info */}
          <div>
            <motion.h1
              className="text-[2.5rem] leading-[0.95] font-semibold tracking-[-0.02em] text-white uppercase md:text-[3.25rem] lg:text-[4rem] xl:text-[4.5rem]"
              variants={fadeUp}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
            >
              Let&rsquo;s talk
              <br />
              about your
              <br />
              next project.
            </motion.h1>

            <motion.p
              className="mt-8 max-w-[460px] text-[1rem] leading-[1.8] text-white/[0.72] md:text-[1.0625rem] lg:text-[1.125rem]"
              variants={fadeUp}
              custom={0.1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
            >
              Whether you&rsquo;re launching a brand, telling a story, or creating a campaign, we&rsquo;re ready to bring your vision to life.
            </motion.p>

            <motion.div
              className="mt-12 space-y-8"
              variants={fadeUp}
              custom={0.2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
            >
              <div>
                <p className="mb-2 text-[0.6875rem] font-semibold tracking-[0.28em] text-[#BFA76F] uppercase">
                  Email
                </p>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-[1.125rem] text-white transition-colors duration-300 hover:text-[#BFA76F]"
                >
                  {siteConfig.contact.email}
                </a>
              </div>
              
              {siteConfig.contact.phone && (
                <div>
                  <p className="mb-2 text-[0.6875rem] font-semibold tracking-[0.28em] text-[#BFA76F] uppercase">
                    Phone
                  </p>
                  <a
                    href={`tel:${siteConfig.contact.phone}`}
                    className="text-[1.125rem] text-white transition-colors duration-300 hover:text-[#BFA76F]"
                  >
                    {siteConfig.contact.phone}
                  </a>
                </div>
              )}

              <div>
                <p className="mb-2 text-[0.6875rem] font-semibold tracking-[0.28em] text-[#BFA76F] uppercase">
                  Locations
                </p>
                <p className="text-[1.125rem] text-white/[0.8]">
                  Dubai &middot; Kerala &middot; Worldwide
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Form */}
          <motion.div
            className="w-full max-w-[600px] lg:ml-auto"
            variants={fadeUp}
            custom={0.3}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="relative group">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name *"
                    required
                    className="w-full bg-transparent border-b border-white/[0.15] px-0 py-3 text-[1.125rem] text-white placeholder:text-white/40 focus:border-[#BFA76F] focus:outline-none focus:ring-0 transition-colors duration-300"
                  />
                </div>
                <div className="relative group">
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name *"
                    required
                    className="w-full bg-transparent border-b border-white/[0.15] px-0 py-3 text-[1.125rem] text-white placeholder:text-white/40 focus:border-[#BFA76F] focus:outline-none focus:ring-0 transition-colors duration-300"
                  />
                </div>
              </div>
              
              <div className="relative group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address *"
                  required
                  className="w-full bg-transparent border-b border-white/[0.15] px-0 py-3 text-[1.125rem] text-white placeholder:text-white/40 focus:border-[#BFA76F] focus:outline-none focus:ring-0 transition-colors duration-300"
                />
              </div>

              <div className="relative group">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  className="w-full bg-transparent border-b border-white/[0.15] px-0 py-3 text-[1.125rem] text-white placeholder:text-white/40 focus:border-[#BFA76F] focus:outline-none focus:ring-0 transition-colors duration-300"
                />
              </div>

              <div className="relative group">
                <textarea
                  name="message"
                  placeholder="Tell us about your project *"
                  rows={4}
                  required
                  className="w-full bg-transparent border-b border-white/[0.15] px-0 py-3 text-[1.125rem] text-white placeholder:text-white/40 focus:border-[#BFA76F] focus:outline-none focus:ring-0 transition-colors duration-300 resize-none"
                />
              </div>

              <div className="mt-4">
                <Button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="group rounded-full bg-[#F8F7F4] text-[#0F1C2E] transition-[background-color,transform,box-shadow] duration-500 ease-out hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_8px_30px_rgba(248,247,244,0.15)] disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                  size="lg"
                >
                  {status === 'submitting' ? 'Sending...' : status === 'sent' ? 'Message Sent' : 'Send Message'}
                  {status === 'idle' && (
                    <span
                      aria-hidden="true"
                      className="inline-block transition-transform duration-500 ease-out group-hover:translate-x-1"
                    >
                      →
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
