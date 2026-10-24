// @ts-ignore: `.ts` extension is here intentionally. Test fails without it
import { promptCredentials } from '../prompt-credentials.ts';

async function main() {
  const { password, email } = await promptCredentials();
  const expectedPassword = process.env.EXPECTED_PASSWORD;
  const expectedEmail = process.env.EXPECTED_EMAIL;

  const failedPasswordCheck = Boolean(
    expectedPassword && password !== expectedPassword,
  );
  const failedEmailCheck = Boolean(expectedEmail && email !== expectedEmail);

  if (failedEmailCheck || failedPasswordCheck) {
    process.exitCode = 1;
  }
}

main();
