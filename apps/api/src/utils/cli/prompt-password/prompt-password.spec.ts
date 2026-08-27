import { resolve } from 'path';
import { render } from 'cli-testing-library';

describe('prompt-password', () => {
  it('hides password', async () => {
    const { clear, findByText, queryByText, userEvent } = await render('node', [
      resolve(__dirname, './prompt-password.util/ts'),
    ]);

    const instance = await findByText('First option');

    expect(instance).toBeInTheConsole();

    expect(await findByText('❯ One')).toBeInTheConsole();

    clear();

    userEvent.keyboard('[ArrowDown]');

    expect(await findByText('❯ Two')).toBeInTheConsole();

    clear();

    userEvent.keyboard('[Enter]');

    expect(await findByText('First option: Two')).toBeInTheConsole();
    expect(await queryByText('First option: Three')).not.toBeInTheConsole();
  });
});
