# Memica API

The Memica API is a NestJS application managed by the repository's Yarn and Nx workspace. PostgreSQL runs in Docker during local development; the API runs on the host for fast reload and debugging.

## Local development

From the repository root, create your local environment file and start PostgreSQL:

```bash
cp apps/api/.env.example apps/api/.env
yarn api:db:up
```

Start the API in a separate terminal:

```bash
yarn api:dev
```

The API listens at `http://localhost:3000`.

## Database commands

Run these commands from the repository root:

```bash
yarn api:db:up     # Start PostgreSQL
yarn api:db:down   # Stop PostgreSQL while preserving its data
yarn api:db:reset  # Stop PostgreSQL and remove its local data volume
```

Never commit `apps/api/.env`; it contains local configuration and is ignored by Git.

## Current endpoints

```bash
curl http://localhost:3000/users
```

`GET /users` returns the current users. The `POST /users` endpoint is scaffold-only: its DTO and entity fields are not yet aligned, and password handling has not been implemented. Do not use it for real user creation until that follow-up work is complete.

## Workspace commands

Run API-only targets from the repository root:

```bash
yarn nx run api:build
yarn nx run api:lint
yarn nx run api:test
yarn nx run api:typecheck
```
