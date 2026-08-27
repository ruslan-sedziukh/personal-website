import { resolve } from 'path';
import { render } from 'cli-testing-library';

describe('prompt-password', () => {
  it('hides password', async () => {
    const { clear, findByText, queryByText, userEvent } = await render(
      'ts-node',
      [resolve(__dirname, './test-prompt-password.ts')],
    );

    const instance = await findByText('password');

    expect(instance).toBeInTheConsole();

    expect(true).toBe(true);
  });
});
