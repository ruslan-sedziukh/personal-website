# Memica Web

The Memica web application is a Next.js project managed by the repository's Yarn and Nx workspace.

## Development

From the repository root, install dependencies and start the web application:

```bash
yarn install
yarn web:dev
```

Open [http://localhost:3001](http://localhost:3001) in a browser.

## Workspace commands

Run these commands from the repository root:

```bash
yarn build
yarn lint
yarn test
yarn typecheck
```

They run the corresponding Nx target across all workspace projects. To run a target for this application only, use Nx directly:

```bash
yarn nx run web:build
yarn nx run web:lint
yarn nx run web:typecheck
```

## Source code

The application source lives in `apps/web/src`. It uses the Next.js App Router.
