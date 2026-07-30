# Spec for PR description

## What should be done

Document all problems, findings, reasonings and things that were done in `<agent-docs-directory>/output/<task-name>-pr-description.md`. You should ask task name if did not asked it already.

If the document don't exist, create it in specified location. 

This should be a document that can be used as a PR description for this problem. 

## PR description example

```markdown
## Overview

Adds account-specific field mapping for Varus feeds and improves invalid inventory submission handling.

## Changes

- For Noname accounts, Shop List is required and Price is optional. For other accounts, Price remains required.
- Uses the same mapping rules in the Field mapping form, validation, and Summary step.
- Shows the existing required-fields error instead of throwing when a Website inventory has no domain or an In-App inventory has no app name.

## Verification

- Verify the required and optional mappings for Noname and non-Noname accounts.
- Verify custom mappings can be added, renamed, and removed.
- Verify incomplete Website and In-App inventories show a validation error without submitting a request.

## Technical Debt

- `DraggableItem` and `DroppableItem` have broken imports due to the removal of `react-beautiful-dnd`.
```
