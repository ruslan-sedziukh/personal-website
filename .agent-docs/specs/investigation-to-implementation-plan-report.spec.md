# Investigation to implementation plan report spec

Before making any implementation changes, investigate the issue and create a Markdown report in the `<agent-docs-directory>/output` directory.

## Report file

Provide a report in the `<agent-docs-directory>/output` directory before implementing anything. 

It should be named `<task-name>-implementation-report.md`. You should ask about task name if did no ask already. 

## Allowed actions before approval

Before the report is approved, you may:

* inspect and search the codebase;
* read configuration, source, test, and documentation files;
* inspect Git history and diffs;
* run non-destructive diagnostic commands;
* run existing tests, linters, type checks, or build commands when useful for the investigation.

Before approval, you must not:

* modify source code;
* modify tests or configuration files;
* install, remove, or update dependencies;
* apply migrations;
* make commits;
* perform any other implementation changes.

The only file you may create or modify before approval is the report in the `<agent-docs-directory>/output` directory.

## Required report contents

The report must include the following sections.

### 1. Problem summary

Briefly explain:

* the reported problem;
* the expected behavior;
* the actual behavior;
* the affected area of the application.

### 2. Investigation findings

Describe:

* the relevant execution or data flow;
* the files, modules, components, functions, or configurations involved;
* the evidence collected during the investigation;
* the most likely root cause;
* any contributing factors.

Clearly distinguish between:

* confirmed findings;
* assumptions;
* unresolved questions.

Do not present assumptions as confirmed facts.

### 3. Proposed solution

Explain:

* what should be changed;
* where the changes should be made;
* why those changes address the root cause;
* any important design decisions or trade-offs;
* any behavior that must remain unchanged.

Reference specific files, modules, functions, or components whenever they are known.

### 4. Implementation plan

Provide a step-by-step implementation plan as a checklist. Each step must start with its checkbox, followed by its number, in this exact format:

- [ ] 1. Describe the implementation step.

Each step should:

* represent one small and logically isolated change;
* identify the affected file, module, or application area;
* explain what will be changed;
* explain why the change is necessary;
* describe how the step can be verified.

The steps should be ordered so that the implementation can be completed and reviewed incrementally.

### 5. Validation plan

Describe how the implementation should be validated, including:

* automated tests to add or update;
* existing tests to run;
* type checking, linting, and build commands;
* relevant manual verification;
* regression risks and edge cases.

### 6. Risks and open questions

List:

* possible implementation risks;
* areas where the investigation is incomplete;
* assumptions requiring user confirmation;
* alternative solutions that may need consideration.

## Approval requirement

After creating the report:

1. provide the path to the report;
2. summarize the proposed solution briefly;
3. stop and ask the user to review and approve the plan.

Do not begin implementation until the user explicitly confirms that you may proceed.

Approval of the report is not implied by silence or by the original request to investigate the issue.
