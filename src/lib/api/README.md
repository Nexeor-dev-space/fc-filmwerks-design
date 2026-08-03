# API / data layer

Data fetching lives here, not in components. Each file wraps one external
source (CMS, form endpoint, newsletter provider) and exports typed functions
that return domain objects.

Keeping it isolated means components never touch `fetch` directly, and swapping
a provider is a change in one folder.

Server-only modules should start with `import 'server-only';` so a stray client
import fails at build time rather than leaking a secret into the bundle.
