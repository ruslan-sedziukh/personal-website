# Git flow convention

## Main principle

Use a single `main` branch as the integration branch.

`main` should always be kept in a releasable state. All practices below are aimed at preserving this property.

## Regular development

- Integrate changes into `main` frequently, ideally at least once per day.
- Prefer small, incremental changes over large, long-lived branches.
- Every change merged into `main` must pass the required automated checks.
- Do not knowingly merge broken functionality into `main`. If `main` is found to be broken, fixing or reverting the problem has priority.

## Incomplete features

Use feature flags when a feature cannot be completed in a single small change.

- Merge the implementation incrementally into `main`.
- Keep incomplete functionality disabled.
- Enable the feature only after it has been sufficiently tested and is ready for release.
- Prefer feature flags over keeping feature branches alive for long periods.

## Parallel old and new implementations

For migrations where the old implementation must remain available while the new one is developed, use a parallel-change / branch-by-abstraction approach.

- Keep the old implementation working while introducing the new one incrementally.
- Use an abstraction or feature flag to switch between old and new behavior where appropriate.
- While both implementations coexist, important shared fixes or behavioral changes must be applied to both paths when necessary.
- Remove the old implementation once the new one has been fully migrated and verified.

## Large changes and migrations

Some changes, such as major library, framework, or architectural migrations, may not be practical to integrate into `main` incrementally.

In such cases:

- A longer-lived migration branch is acceptable as an exception.
- Keep the branch synchronized with `main` frequently to minimize divergence and integration conflicts.
- For shared or long-lived branches, merging `main` into the branch is usually preferable to repeatedly rewriting its history with rebase.
- Normal unrelated development should continue from and merge into `main`; the migration branch should not become a temporary replacement for `main`.
- Test the migration thoroughly on its branch before merging it into `main`.
- Synchronize with the latest `main` and rerun the required checks before the final merge.
- Delete the migration branch after integration.

## Goal

The purpose of this workflow is to minimize divergence, detect integration problems early, and keep `main` as close as reasonably possible to an always-releasable state.

