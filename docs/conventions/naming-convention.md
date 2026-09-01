# Naming convention

## Main principle

Use the same conventions across the monorepo unless a framework has a stronger convention.

## General

- Files/directories: `kebab-case`
- Variables/functions: `camelCase`
- Classes/components/types/interfaces: `PascalCase`
- Application-level constants: `UPPER_SNAKE_CASE`

## Files

Use `kebab-case` for both NestJS and React files.

```text
user-profile.service.ts
user-profile.controller.ts
user-profile-card.tsx
use-user-profile.ts
```

Keep framework-specific suffixes where appropriate:

```text
.service.ts
.controller.ts
.module.ts
.guard.ts
.dto.ts
.spec.ts
```

## Utilities

Use `.util.ts` as a category suffix, regardless of whether the file contains one or multiple utilities.

```text
date.util.ts
auth.util.ts
password-prompt.util.ts
```

If a file contains one clearly named function, the suffix can be omitted:

```text
format-date.ts
parse-token.ts
prompt-password.ts
```

## Constants

For files containing related constants, use `.constants.ts`:

```text
auth.constants.ts
validation.constants.ts
```

Example:

```ts
export const ACCESS_TOKEN_COOKIE_NAME = 'access_token';
export const REFRESH_TOKEN_COOKIE_NAME = 'refresh_token';
```

`.util.ts` and `.constants.ts` do not need to be grammatically symmetrical; they are conventional category suffixes.

## Summary

| Element                             | Convention         |
| ----------------------------------- | ------------------ |
| Files/directories                   | `kebab-case`       |
| Variables/functions                 | `camelCase`        |
| Classes/components/types/interfaces | `PascalCase`       |
| Constants                           | `UPPER_SNAKE_CASE` |
| Utility files                       | `*.util.ts`        |
| Constant files                      | `*.constants.ts`   |
| Component files                     | `*.component.ts`   |
