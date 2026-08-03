`UsersService` is the database-access layer for the sole account. Controllers and future auth commands call it instead of writing SQL themselves.

Nest creates it through dependency injection:

```ts
@InjectRepository(User)
private readonly usersRepository: Repository<User>
```

`UsersModule` registers the `User` repository with TypeORM, then Nest gives that repository to `UsersService`.

The new parts work like this:

- `CreateInitialUserInput` defines what bootstrap needs: only `email` and an already-hashed password. The service never receives or stores a raw password.

Question: Should't we have a DTO for this? 

- `normalizeEmail()` trims spaces and lowercases an email. Both creation and lookup use it, so `You@Example.com` and `you@example.com` refer to the same account.

- `UserAlreadyExistsError` is a specific error for attempting bootstrap after an account already exists.

- `createInitialUser()` safely creates the one account:
  1. Starts a database transaction.
  2. Takes a PostgreSQL advisory lock.
  3. Checks whether any user exists.
  4. Throws `UserAlreadyExistsError` if one does.
  5. Saves the normalized email and password hash.
  6. Fetches the saved user again without `passwordHash`.

  The advisory lock matters if two bootstrap commands run at the same time: one waits, then sees that the other already created the account.

- `findByEmail()` finds a user for ordinary use. Because `passwordHash` has `select: false`, it is not loaded.

Question: Why do we need this?

- `findByEmailWithPasswordHash()` explicitly loads `passwordHash`. The future login flow needs this one method to verify the entered password with Argon2.

- `findSoleUser()` and `findSoleUserWithPasswordHash()` return the one account, with or without its hash. The reset command will use the hash version.

Question: Why do we need this?

- `updatePasswordHash()` replaces the stored hash after a password reset. It never accepts a plaintext password.

Question: Why do we need this?

The older `create()` and `findAll()` methods are still present only because the existing `/users` controller still calls them. Step 4 removes that controller and these obsolete scaffold methods.