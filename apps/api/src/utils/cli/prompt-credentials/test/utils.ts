import { resolve } from 'path';
import * as pty from 'node-pty';

const promptScript = resolve(__dirname, './test-prompt-credentials.ts');

const defaultTimeoutMs = 1_000;

export const startPrompt = (expectedPassword?: string) => {
  const promptProcess = pty.spawn('node', [promptScript], {
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
};

export const waitForOutput = async (
  getOutput: () => string,
  text: string,
  timeout = defaultTimeoutMs,
) => {
  const deadline = Date.now() + timeout;

  while (!getOutput().includes(text)) {
    if (Date.now() >= deadline) {
      throw new Error(
        `Timed out waiting for terminal output: "${text}"\n\n` +
          `Received output:\n${getOutput()}`,
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 50));
  }
};

export const waitForExit = async (
  exit: Promise<{ exitCode: number }>,
  timeout = defaultTimeoutMs,
) => {
  return Promise.race([
    exit,
    new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Timed out waiting for process to exit'));
      }, timeout);
    }),
  ]);
};
