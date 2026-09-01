import { resolve } from 'path';
import { getByText, render } from 'cli-testing-library';

describe('prompt-password', () => {
  it('asks password', async () => {
    const { findByText } = await render('ts-node', [
      resolve(__dirname, './test-prompt-password.ts'),
    ]);

    const instance = await findByText('password');

    expect(instance).toBeInTheConsole();
  });

  it('hides entered password', async () => {
    const { findByText, queryByText, userEvent, debug } = await render(
      'ts-node',
      [resolve(__dirname, './test-prompt-password.ts')],
    );

    const password = 'asdasd';

    // await userEvent.setup();
    // userEvent.keyboard('[KeyA][KeyA]{Key1]');
    // await userEvent.keyboard(`${password}[Enter]`);
    await userEvent.keyboard(password);

    debug(1000);

    const passwordInstance = await findByText(password);

    expect(passwordInstance).toBeInTheConsole();
  });
});
