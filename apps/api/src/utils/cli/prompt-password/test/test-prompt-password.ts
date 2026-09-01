// TODO(auth): Figure out why extension here is required to test work
// @ts-ignore: `.ts` extension is here intentionally. Test fails without it
import { promptPassword } from './prompt-password.ts';

async function main() {
  const password = await promptPassword();
  const expectedPassword = process.env.EXPECTED_PASSWORD;

  if (password !== expectedPassword) {
    process.exitCode = 1;
  }
}

main();
