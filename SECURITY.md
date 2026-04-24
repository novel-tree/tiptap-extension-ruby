# Security policy

## Reporting a vulnerability

If you believe you've found a security issue in `tiptap-extension-ruby`, please do **not** open a public GitHub issue. Instead, email the maintainers:

**support@noveltree.xyz**

Include:

- A description of the issue and its impact.
- Steps to reproduce (proof-of-concept code is ideal).
- Affected versions, if known.

We aim to acknowledge reports within 72 hours and will coordinate a fix and disclosure timeline with you.

## Supported versions

We support the latest published minor release on the current major. Older majors are out of scope unless noted in the release notes.

## Scope

This package is client-side and parses user-provided HTML through TipTap / ProseMirror. Reports we're particularly interested in:

- Parser confusions that could let an attacker-controlled `<ruby>` string produce unintended DOM structures.
- Input-rule / paste-rule patterns that cause denial-of-service (runaway regex).
- Any XSS vector introduced via `HTMLAttributes` handling.

Reports about TipTap core, ProseMirror, or other upstream dependencies should be forwarded to their respective maintainers.
