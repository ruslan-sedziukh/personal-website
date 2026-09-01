import { resolve } from 'path';
import * as pty from 'node-pty';

const promptScript = resolve(__dirname, './test-prompt-password.ts');

const defaultTimeoutMs = 1_000;

function startPrompt(expectedPassword?: string) {
  const promptProcess = pty.spawn('ts-node', [promptScript], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      EXPECTED_PASSWORD: expectedPassword ?? '',
    },
  });

  let output = '';
  let exited = false;

  promptProcess.onData((data) => {
    output += data;
  });

  const exit = new Promise<{ exitCode: number }>((resolve) => {
    promptProcess.onExit(({ exitCode }) => {
      exited = true;
      resolve({ exitCode });
    });
  });

  return {
    process: promptProcess,
    exit,
    getOutput: () => output,
    isExited: () => exited,
  };
}

async function waitForOutput(
  getOutput: () => string,
  text: string,
  timeout = defaultTimeoutMs,
) {
  const deadline = Date.now() + timeout;

  while (!getOutput().includes(text)) {
    if (Date.now() >= deadline) {
      throw new Error(
        `Timed out waiting for terminal output: "${text}"\n\n` +
          `Received output:\n${getOutput()}`,
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 10));
  }
}

async function waitForExit(
  exit: Promise<{ exitCode: number }>,
  timeout = defaultTimeoutMs,
) {
  return Promise.race([
    exit,
    new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Timed out waiting for process to exit'));
      }, timeout);
    }),
  ]);
}

describe('promptPassword', () => {
  it('asks for a password', async () => {
    const prompt = startPrompt();

    try {
      await waitForOutput(prompt.getOutput, 'password');

      expect(prompt.getOutput()).toContain('password');
    } finally {
      if (!prompt.isExited()) {
        prompt.process.kill();
      }
    }
  });

  it('returns the entered password without echoing it', async () => {
    const password = 'asdasd';
    const prompt = startPrompt(password);

    try {
      await waitForOutput(prompt.getOutput, 'password');

      prompt.process.write(`${password}\r`);

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
