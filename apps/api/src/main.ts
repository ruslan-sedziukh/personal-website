import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { promptPassword } from './utils/cli/prompt-password/prompt-password.util';
import { CLI_COMMANDS } from './constants/cli-commands.constant';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}

const authBootstrap = async () => {
  promptPassword();
};

const main = async () => {
  const command = process.argv[2];

  if (command === CLI_COMMANDS.AUTH_BOOTSTRAP) {
    await authBootstrap();
  } else {
    bootstrap();
  }
};

main();
