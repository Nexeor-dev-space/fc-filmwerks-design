import { Button, Container, Section } from '@/components/ui';
import { createMetadata } from '@/lib/seo';

export const metadata = createMetadata({
  title: 'Page not found',
  description: 'The page you were looking for does not exist.',
  noIndex: true,
});

export default function NotFound() {
  return (
    <Section spacing="xl">
      <Container size="sm">
        <p className="font-mono text-sm text-muted">404</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
          Page not found
        </h1>
        <p className="mt-4 text-muted">
          That page has been moved or never existed.
        </p>
        <Button href="/" className="mt-8">
          Back home
        </Button>
      </Container>
    </Section>
  );
}
