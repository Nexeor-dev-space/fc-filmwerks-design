import { ContactForm } from '@/components/sections/ContactForm';
import { LensTransition } from '@/components/sections/LensTransition';
import { createMetadata } from '@/lib/seo';
import { FloatingNav } from '@/components/layout/FloatingNav';
import { CinematicFooter } from '@/components/layout/CinematicFooter';

export const metadata = createMetadata({ path: '/contact' });

export default function ContactPage() {
  return (
    <>
      <FloatingNav />
      <ContactForm />
      <LensTransition />
      <CinematicFooter />
    </>
  );
}
