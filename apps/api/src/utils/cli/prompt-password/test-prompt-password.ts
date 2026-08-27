// TODO(auth): Figure out why extension here is required to test work
// @ts-ignore: `.ts` extension is here intentionally. Test fails without it
import { promptPassword } from './prompt-password.util.ts';

await promptPassword();
