import prompt from 'prompt';

export async function promptCredentials() {
  prompt.start();
  prompt.message = '';
  prompt.delimiter = ':';

  const { email } = await prompt.get({
    properties: {
      password: {
        message: 'email',
      },
    },
  });

  const { password } = await prompt.get({
    properties: {
      password: {
        message: 'password',
        hidden: true,
      },
    },
  });

  return { email, password };
}
