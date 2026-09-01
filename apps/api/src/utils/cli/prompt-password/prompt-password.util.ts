import prompt from 'prompt';

export async function promptPassword() {
  prompt.start();
  prompt.message = '';
  prompt.delimiter = ':';

  const { password } = await prompt.get({
    properties: {
      password: {
        message: 'password',
        // hidden: true,
      },
    },
  });

  return password;
}
