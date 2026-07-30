# Basic spec

You should disagree if there are cons of my decisions.

If an import path contains more than two `../` segments, replace it with a configured alias (e.g., `@/`).
- Treat any path like `../../../...` or deeper as a candidate for replacement.
- Map the path to the appropriate alias based on project configuration.
- Preserve the original target file/module — only change the import path format.
- Do not modify imports with two or fewer `../` segments.

All generated and updated markdown files should have empty line after each heading. 

