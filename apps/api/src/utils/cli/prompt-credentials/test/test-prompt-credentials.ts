// @ts-ignore: `.ts` extension is here intentionally. Test fails without it
import { promptCredentials } from '../prompt-credentials.util.js';

async function main() {
  const { password } = await promptCredentials();
  const expectedPassword = process.env.EXPECTED_PASSWORD;

  if (password !== expectedPassword) {
    process.exitCode = 1;
  }
}

main();
