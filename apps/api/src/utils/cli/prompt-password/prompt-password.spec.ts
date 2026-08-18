import { resolve } from 'path';
import { render } from 'cli-testing-library';

describe('prompt-password', () => {
  it('Is able to make terminal input and view in-progress stdout', async () => {
    const { clear, findByText, queryByText, userEvent } = await render('node', [
      resolve(__dirname, './execute-scripts/stdio-inquirer.js'),
    ]);

    const instance = await findByText('First option');

    expect(instance).toBeInTheConsole();

    expect(await findByText('❯ One')).toBeInTheConsole();

    clear();

    userEvent('[ArrowDown]');

    expect(await findByText('❯ Two')).toBeInTheConsole();

    clear();

    userEvent.keyboard('[Enter]');

    expect(await findByText('First option: Two')).toBeInTheConsole();
    expect(await queryByText('First option: Three')).not.toBeInTheConsole();
  });
});
