import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { promptCredentials } from './utils/cli/prompt-credentials/prompt-credentials';
// import { CLI_COMMANDS } from './constants/cli-commands.constant';
import { UsersService } from './modules/users/users.service';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  const userService = app.get(UsersService);
  const user = await userService.findSoleUser();

  if (user) {
    console.log(console.log('email:', user.email));

    console.log(console.log('passowrdHash:', user.passwordHash));

    app.listen(process.env.PORT ?? 3000);

    return;
  }

  const { email, password } = await promptCredentials();

  await userService.createInitialUser({
    email: email.toString(),
    passwordHash: password.toString(),
  });

  app.listen(process.env.PORT ?? 3000);
};

const main = async () => {
  // const command = process.argv[2];

  bootstrap();
};

main();
