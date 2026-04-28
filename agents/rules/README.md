# Agents Rules

This directory contains modular, machine-readable engineering rules for this project.

## Structure

| File             | Topic                                    | Impact   |
| ---------------- | ---------------------------------------- | -------- |
| `api-`           | API Client & Domain Patterns             | HIGH     |
| `architecture-`  | Architecture & Layer Boundaries          | CRITICAL |
| `design-`        | Design System, Figma, Tailwind, Icons    | HIGH     |
| `i18n-`          | Internationalization                     | HIGH     |
| `quality-`       | Code Quality & React Patterns            | HIGH     |
| `search-query-`  | URL / search params (NUQS)               | HIGH     |
| `tanstack-query-`| TanStack Query (factory, keys, mutation) | HIGH     |
| `tanstack-form-` | TanStack Form (useForm, context)         | HIGH     |
| `zod-`           | Zod validation & error messages          | HIGH     |

## Files

- `_sections.md` - Defines all sections, their ordering, and impact levels
- `_template.md` - Template for creating new rules
- `{section}-{rule-name}.md` - Individual rule files

## Rule Format

Each rule file follows a consistent format with YAML frontmatter:

```markdown
---
title: Rule Title Here
impact: CRITICAL | HIGH | MEDIUM | LOW
impactDescription: Optional description (e.g., "20-50% improvement")
tags: tag1, tag2, tag3
---

## Rule Title Here

**Impact: LEVEL (optional description)**

Brief explanation of the rule and why it matters.

**Incorrect (description):**
\`\`\`typescript
// Bad code example
\`\`\`

**Correct (description):**
\`\`\`typescript
// Good code example
\`\`\`

Reference: [Link](url)
```

## Adding New Rules

1. Copy `_template.md` to a new file with the appropriate section prefix
2. Fill in the frontmatter (title, impact, tags)
3. Write a clear explanation of the rule
4. Provide incorrect and correct code examples
5. Add a reference link if applicable

## Usage

These rules are designed to be:

- **Human-readable**: Engineers can browse and learn from them
- **Machine-readable**: AI agents can parse and apply them
- **Modular**: Individual rules can be updated without affecting others
- **Versionable**: Changes are tracked in git history

## Core Principles

The rules in this directory encode the practices and standards that the project follows.
