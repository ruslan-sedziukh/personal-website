# Auth investigation report

## 1. Problem summary

The API has an empty AuthModule and no usable authentication. The current POST /users endpoint is scaffold code: it accepts a password but has no password-hash field to persist it, and its DTO does not provide required User fields.

The required behavior is a single-account authentication system for a personal website. There is no public registration and no admin or role model. A person with deployment or database access creates the one account through a local command, then logs in with email and password. Every authenticated request has the same full authenticated access.

At present, no bootstrap or password-reset command, login endpoint, password hashing, session handling, route guard, or authorization policy exists. The affected area is apps/api: the Auth and Users modules, the User entity, DTOs, startup configuration, package dependencies, scripts, and tests.

## 2. Investigation findings

### Confirmed findings

- apps/api/src/auth/auth.module.ts declares an empty AuthModule with no controller, providers, imports, strategy, or guard.
- apps/api/src/app.module.ts imports AuthModule and configures TypeORM with User as its only entity. It loads environment variables from apps/api/.env and .env.
- apps/api/src/users/users.controller.ts exposes POST /users and GET /users without authentication.
- apps/api/src/users/dto/user.dto.ts accepts username, email, and password. apps/api/src/users/entities/user.entity.ts requires email, username, displayName, and bio, but has no password-hash column.
- UsersService.create passes the DTO directly to TypeORM. Password is not an entity column, while displayName and bio are required entity columns but absent from the DTO.
- The API README explicitly says POST /users is scaffold-only and password handling is unimplemented.
- apps/api/package.json and yarn.lock contain no password-hashing, JWT, Passport, or cookie-parsing dependency.
- The only API test is a placeholder assertion in apps/api/test/app.e2e-spec.ts. Before this report, the API test, typecheck, and lint targets completed successfully.
- tsconfig.base.json has no API-local alias, but no existing import has more than two parent-directory segments, so the basic-spec alias rule requires no import changes.

### Most likely root cause

Authentication and the user-create endpoint were intentionally scaffolded but never implemented. The user-create route is not a viable registration flow.

### Confirmed product decisions

- The website has exactly one account.
- Email is the sole login identifier. It is stored uniquely and retained for possible future notifications or recovery, but is not email-verified in this initial design. Username is not needed and will be removed.
- There is no HTTP registration endpoint and no /users endpoint. The existing UsersController will be removed.
- The sole HTTP authentication endpoint is POST /auth/login.
- The account is created once by an interactive deployment-only api:auth:bootstrap command. Its password is chosen there, entered without terminal echo, and kept by the account holder in a password manager.
- A deployment-only api:auth:reset-password command changes a forgotten password. Neither command is exposed through HTTP.
- Every HTTP route is private by default. POST /auth/login is the only explicitly public endpoint.
- Authenticated access is uniform; no role, permission, or admin field is needed.
- Authentication uses a short-lived JWT in a Secure, HttpOnly, SameSite cookie.
- JWT configuration is JWT_EXPIRES_IN=3d, JWT_ISSUER=memica-api, and JWT_AUDIENCE=memica-web.
- JWT_SECRET is a distinct, high-entropy local or deployment environment secret. It is never committed to Git; rotating it invalidates active sessions. WEB_ORIGIN holds the exact deployed website origin, so the final domain can be changed without source-code changes.
- Email verification, email delivery, public account recovery, and public registration are out of scope.

### Open questions

- No profile endpoint is currently required. A future profile API should be added only for a concrete consumer and will be private by default.
- The target production shape is a website at https://<site-domain> and an API at https://api.<site-domain>, potentially on different providers. The actual site domain is intentionally unknown until deployment and will be supplied by WEB_ORIGIN.
- No public health-check endpoint is needed initially. Add one only if a future hosting or monitoring requirement makes it necessary.

## 3. Proposed solution

Remove the public UsersController. Keep User and UsersService as internal persistence for the sole account.

Keep User limited to its internal id, unique normalized email, non-selected passwordHash, and creation timestamp. Remove username, displayName, and bio; they are not needed for authentication or the single-account model.

Add interactive bootstrap and reset commands that connect through the normal API configuration. Bootstrap prompts for email, password, and password confirmation. It hashes the password with Argon2 before persistence and fails atomically when any account already exists. Reset finds the sole account and atomically replaces only its password hash. Neither command may print, store, or receive a plaintext password through source-controlled configuration.

Add AuthService and AuthController with POST /auth/login and a private POST /auth/logout. Login validates email and password, uses a non-enumerating failure response for bad credentials, signs a JWT containing only the account subject and required JWT claims, and sends it as a Secure, HttpOnly, SameSite=Lax cookie. In production, use the host-only __Host-auth cookie name with Secure and Path=/ and do not set a cookie Domain. The response must not expose password or passwordHash. Logout clears that cookie; it does not revoke an already copied JWT.

Register the JWT guard globally. Add a Public decorator and use it only for POST /auth/login. Configure CORS to allow exactly WEB_ORIGIN with credentials; the web client sends API requests with credentials included. Add a configurable login rate limit, initially five failed attempts per fifteen minutes for an IP/email combination, to slow password-guessing attempts without requiring an external service. This makes all future routes private unless explicitly reviewed and opted out.

Use established dependencies for Argon2 password hashing, JWT signing and verification, Passport strategy support, and cookie parsing. Argon2 is preferred because it is designed for password hashing. Its native-runtime compatibility is the main trade-off; bcrypt is an alternative if the deployment cannot support Argon2.

This design removes unnecessary public identity flows, avoids the need for an email provider, keeps the one password out of project configuration, and provides a safe future default for protected API features.

## 4. Implementation plan

- [x] 1. Update apps/api/package.json and yarn.lock with Argon2, Nest JWT, Passport, cookie, and required TypeScript type dependencies. This supplies maintained primitives for hashing, sessions, and cookie parsing. Verified: Argon2 loads at runtime, and API type checking, linting, and tests pass.

- [x] 2. Update apps/api/.env.example and Auth configuration with JWT_SECRET, JWT_EXPIRES_IN=3d, JWT_ISSUER=memica-api, JWT_AUDIENCE=memica-web, WEB_ORIGIN, secure cookie settings, and configurable login-throttle settings with a default of five failed attempts per fifteen minutes. Use no hard-coded production domain. This keeps deployment-specific values environment-specific. Verify startup fails clearly when required configuration is absent.

- [x] 3. Update the User entity and UsersService. Add a non-selected passwordHash field, make email the unique normalized login identifier, remove username, and add sole-user lookup, atomic bootstrap creation, and password-hash update operations. Verify ordinary reads cannot return passwordHash.

- [x] 4. Remove apps/api/src/users/users.controller.ts and the public user-create and user-list flows. This removes accidental account creation and the unused user-list API. Verify no public registration or generic user endpoint remains.

- [ ] 5. Add api:auth:bootstrap and api:auth:reset-password command targets. They must use hidden terminal password input, never log plaintext passwords, bootstrap only an empty database, and reset only the single existing account. Verify a second bootstrap cannot create another user, including concurrent attempts.

- [ ] 5.1 Add a reusable command runtime that creates and closes a Nest application context without starting the HTTP server. This gives deployment-only commands access to the configured database and UsersService. Verify the command exits cleanly after the application context closes.

- [ ] 5.2 Add reusable terminal prompts for email and hidden password entry with confirmation. Validate email and enforce the agreed password policy before hashing. Verify entered passwords are neither echoed nor included in error output.

- [ ] 5.3 Implement the bootstrap command. Hash the confirmed password with Argon2id, call createInitialUser, and return a safe success or already-exists result. Verify only the first bootstrap can create an account.

- [ ] 5.4 Implement the password-reset command. Require exactly one existing account, hash the confirmed replacement password with Argon2id, and update only passwordHash. Verify the command rejects a missing or invalid multi-user state.

- [ ] 5.5 Add api:auth:bootstrap and api:auth:reset-password Nx/package-script targets that execute the compiled deployment-only commands. Verify each command receives terminal input and returns a non-zero exit code for invalid input or failed operations.

- [ ] 5.6 Manually verify bootstrap and reset against local Docker PostgreSQL. Confirm a second bootstrap is rejected, the reset does not display credentials, and the database never stores a plaintext password.

- [ ] 6. Implement POST /auth/login and private POST /auth/logout in AuthController and AuthService. Verify passwords using Argon2, sign JWTs with only the account subject plus defined claims and three-day expiry, issue a Secure, HttpOnly, SameSite session cookie, and clear that cookie on logout. Verify failed login does not reveal whether the email exists.

- [ ] 7. Add a global JWT guard, Public decorator, current-user helper, cookie parsing, CORS restricted to WEB_ORIGIN with credentials, and a configurable login rate limit with the stated default. Mark only login as public. Verify an ordinary newly added route is private by default and repeated failed login attempts are throttled.

- [ ] 8. Add unit and API tests for bootstrap success, rejected second bootstrap, password non-disclosure, reset behavior, valid and invalid login, email normalization, cookie attributes, JWT claims and expiry, and global private-by-default authorization.

- [ ] 9. Run yarn nx run api:test, yarn nx run api:lint, yarn nx run api:typecheck, and yarn nx run api:build. Manually verify bootstrap, login, one protected route, rejected second bootstrap, and password reset against local Docker PostgreSQL.

## 5. Validation plan

Automated tests must confirm:

- a first bootstrap stores a password hash different from the submitted password;
- a second bootstrap, including concurrent attempts, leaves the one account unchanged;
- bootstrap and reset never expose plaintext passwords in output or persisted data;
- email is normalized consistently and remains unique;
- login succeeds only with the account email and current password, and repeated failed attempts are throttled;
- failed login has the same non-enumerating response for unknown email and incorrect password;
- login and all user responses omit password and passwordHash;
- the production login cookie is host-only __Host-auth with HttpOnly, Secure, SameSite=Lax, Path=/, and three-day expiry attributes; local development has an explicit localhost-safe configuration; and logout clears it;
- a valid cookie grants access to a normal route, while missing, malformed, expired, or invalid-signature tokens are rejected;
- a new route is protected without adding a route-level guard, and only login bypasses authentication.

Manual verification uses yarn api:db:up, the bootstrap command, yarn api:dev, the login endpoint, and a protected endpoint. Run the reset command, confirm the old password stops working and the new password works, and test a modified or expired JWT.

Regression risks include password-hash disclosure through entity serialization, accidental plaintext logging, more than one account being created, an exposed bootstrap/reset HTTP path, an accidentally public future route, incorrect production cookie settings, and reliance on TypeORM synchronize beyond local development.

## 6. Risks and open questions

- The single-account invariant must be atomic. A simple count-then-create check can race, so implementation needs a transaction, database lock, or database-enforced invariant.
- Secure cookie settings differ between local HTTP development and production HTTPS. The implementation must make the environment-specific behavior deliberate, not silently weaken production settings. Production CORS must use the exact WEB_ORIGIN, not a wildcard, and must allow credentials.
- The selected production deployment is same-site subdomains: https://<site-domain> for the web and https://api.<site-domain> for the API. They remain different origins, so exact-origin CORS and credentialed client requests are required; they do not require the more complex cross-site cookie setup.
- JWTs cannot be individually revoked. Three-day expiry limits exposure, but immediate logout or forced revocation later requires server-side session state or refresh-token tracking.
- Argon2 has native binary/build requirements. Confirm its compatibility in the deployment environment before choosing it; otherwise use bcrypt deliberately.
- Email verification, email sending, public password recovery, multi-user support, roles, and production migrations are intentionally out of scope. Login rate limiting is included because the endpoint is deliberately public; more advanced abuse protection can be added later.
