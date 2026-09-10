# Coding Style — Batik Arunika

## 1. Language and Types

- Use TypeScript strict mode.
- Avoid `any` unless there is no practical typed alternative.
- Prefer explicit return types for service and utility functions.
- Define shared domain types only when needed by implemented code.
- Do not create speculative future type systems.

## 2. Components

- Prefer React Server Components.
- Use Client Components only for interactivity, browser APIs, forms, dialogs, and client state.
- Keep components small and focused.
- Avoid giant pages or deeply nested conditional logic.
- Use semantic HTML, labels, keyboard-accessible controls, and alt text.
- Use shadcn/ui where it already solves the UI need.

## 3. Organization

- Feature-based folders under `features/`.
- Presentation components under `components/`.
- Shared constants under `constants/`.
- Shared types under `types/`.
- Reusable utilities under `lib/` or `utils/`.
- External integrations under `services/`.

Avoid unnecessary abstractions or premature frameworks.

## 4. Validation and Errors

- Validate user input with Zod.
- Validate critical operations on the server.
- Never trust client-supplied prices, stock, discounts, totals, shipping costs, or payment status.
- Provide loading, empty, error, and success states.
- Do not expose raw server errors or secrets to users.

## 5. Security

- No secrets in client bundles.
- Server-only keys must not use `NEXT_PUBLIC_`.
- Future admin checks must exist in server or database authorization, not only UI visibility.

## 6. Naming and Commits

- Use clear English identifiers.
- Use `kebab-case` for file names where practical.
- Use `PascalCase` for components and types.
- Use meaningful conventional commits:

```text
feat: create product catalog
fix: validate checkout stock
refactor: simplify order service
docs: update database documentation
chore: configure project environment
```
