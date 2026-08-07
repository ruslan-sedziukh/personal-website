# Authentication design

## Decision

Memica uses **single-account, email-and-password authentication**. The account is created and maintained through deployment-only interactive commands, rather than through a public registration or password-recovery flow.

The email is the sole login identifier. There are no usernames, roles, permissions, or separate administrator accounts: the only authenticated account has access to every protected API capability.

The API authenticates requests with a three-day JWT stored in an HttpOnly cookie.

## Account lifecycle

1. Configure the API and database for a deployment environment.
2. Run `yarn api:auth:bootstrap` once. It interactively asks for an email and a password, then creates the sole account.
3. The account holder stores that password in a password manager.
4. The account holder signs in through `POST /auth/login`.
5. If the password is lost, a person with deployment or database access runs `yarn api:auth:reset-password`.

Bootstrap refuses to run when an account already exists. Password reset requires exactly one account. Neither command is an HTTP endpoint.

## Password and session handling

Passwords are entered interactively without terminal echo and are hashed with Argon2id before storage. The database stores only `passwordHash`, never the plaintext password. Normal database reads do not select that field unless authentication explicitly requests it.

After a successful login, the API issues a JWT with only the account subject and the configured issuer, audience, and three-day expiry. It stores the token in a host-only `__Host-auth` cookie in production, with `HttpOnly`, `Secure`, `SameSite=Lax`, and `Path=/` attributes. JavaScript cannot read an HttpOnly cookie, which reduces the impact of an injected script stealing a session token.

All API routes are private by default. `POST /auth/login` is explicitly public; future public routes must be deliberately opted out of the global JWT guard.

## Why this design was chosen

This is a personal website with one intended user. A public registration flow, email verification, password-reset emails, roles, and user management would add code, attack surface, operational work, and potentially paid email services without solving a current need.

Creating the account only from the deployment environment keeps account creation private and avoids a registration endpoint that anyone on the internet could call. Retaining an email still leaves room for future notifications, recovery, or a move to multiple accounts.

JWT cookie authentication is a good fit for the intended web/API layout: the website uses `https://<site-domain>` and the API uses `https://api.<site-domain>`. These are different origins, so the API allows the exact configured `WEB_ORIGIN` and the web client sends credentialed requests. They are still same-site subdomains, allowing the simpler `SameSite=Lax` cookie policy rather than a cross-site-cookie design.

## Trade-offs and future changes

- There is no self-service password recovery. Losing the password requires deployment or database access to run the reset command.
- There is no email verification, because email is not used to communicate with anyone or establish a public identity.
- A JWT remains valid until its three-day expiry if copied before logout. Immediate server-side revocation would require a future session store or token-revocation mechanism.
- If the site later needs more users, public registration, email verification, password recovery, roles, or external identity providers can be designed then. They should not be added implicitly to this single-account flow.
