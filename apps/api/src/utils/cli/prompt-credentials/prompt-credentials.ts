import prompt from 'prompt';

export async function promptCredentials() {
  prompt.start();
  prompt.message = '';
  prompt.delimiter = ':';

  const { email, password } = await prompt.get({
    properties: {
      email: {
        message: 'email',
      },
      password: {
        message: 'password',
        hidden: true,
      },
    },
  });

  return { email, password };
}
