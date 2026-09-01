# Commit and PR convention

## Commit message

A good general rule is: write both commit messages and PR titles as short imperative descriptions of the change—as if completing the sentence:

“This change will ___.”

So these work well:

- Simplify PR template
- Fix login redirect
- Add password validation
- Remove deprecated API
- Update user profile styles

Prefer imperative mood (Add, Fix, Update, Remove, Refactor) rather than past tense:

- ✅ Fix dropdown positioning
- ⚠️ Fixed dropdown positioning

## PR description

For PR descriptions, the rule is different from commit messages and PR titles.

Commit messages and PR titles should usually be short, imperative summaries:

> Simplify PR template

A PR description should explain context and intent, usually answering:

- What changed?
- Why was it changed?
- Anything reviewers should pay attention to?
- How was it tested? when relevant.

It does not need to use imperative mood. Normal descriptive prose is more natural.

For example:

```markdown
## What changed

Simplified the PR template by removing redundant sections and reducing the amount of required information.

## Why

The previous template was unnecessarily verbose and made small PRs harder to create.

## Testing

Documentation-only change. No testing required.
```
