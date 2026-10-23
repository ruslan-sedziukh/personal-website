import { startPrompt, waitForExit, waitForOutput } from './utils';

describe('promptPassword', () => {
  it('correctly ask and return data', async () => {
    const prompt = startPrompt();
    const password = 'asdasd';
    const email = 'john.doe@test.com';

    try {
      // getOutput is called in the while loop while output do not match 'email' or timeout passes
      await waitForOutput(prompt.getOutput, 'email');

      expect(prompt.getOutput()).toContain('email');

      prompt.process.write(`${email}\r`);

      await waitForOutput(prompt.getOutput, email);

      expect(prompt.getOutput()).toContain(email);

      await waitForOutput(prompt.getOutput, 'password');

      prompt.process.write(`${password}\r`);

      // Why this exit code is `1`?
      await expect(waitForExit(prompt.exit)).resolves.toEqual({
        exitCode: 0,
      });

      expect(prompt.getOutput()).not.toContain(password);
    } finally {
      if (!prompt.isExited()) {
        prompt.process.kill();
      }
    }
  });
});
