interface JsonLdProps {
  /** A schema.org object, e.g. the output of `organizationJsonLd()`. */
  data: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Injects structured data as a JSON-LD script tag.
 *
 * `data` must come from application code, never from user input — it is
 * serialised straight into a script element. The `<` escape below is what
 * stops a stray `</script>` in the data from closing the tag early.
 */
export function JsonLd({ data }: JsonLdProps) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
