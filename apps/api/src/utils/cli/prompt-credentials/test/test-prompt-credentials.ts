// @ts-ignore: `.ts` extension is here intentionally. Test fails without it
import { promptCredentials } from '../prompt-credentials.ts';

async function main() {
  const { password } = await promptCredentials();
  const expectedPassword = process.env.EXPECTED_PASSWORD;

  if (expectedPassword && password !== expectedPassword) {
    process.exitCode = 1;
  }
}

main();
