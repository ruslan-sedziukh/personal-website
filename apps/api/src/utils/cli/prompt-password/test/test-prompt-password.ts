// @ts-ignore: `.ts` extension is here intentionally. Test fails without it
import { promptPassword } from '../prompt-password.util.ts';

async function main() {
  const password = await promptPassword();
  const expectedPassword = process.env.EXPECTED_PASSWORD;

  if (password !== expectedPassword) {
    process.exitCode = 1;
  }
}

main();
