import { Footer, Header } from '@/components/layout';

/**
 * Chrome shared by every public marketing page. Routes that need different
 * chrome (a client portal, a bare campaign landing page) get their own route
 * group beside this one rather than conditionals in here.
 */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // The column lives here rather than on <body>, so that pages using a
    // pinned ScrollTrigger section are not nested inside a flex container.
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only rounded-md bg-foreground px-4 py-2 text-background focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100"
      >
        Skip to content
      </a>
      {/* <Header /> */}
      <main id="main" className="flex-1">
        {children}
      </main>
      {/* <Footer /> */}
    </div>
  );
}
