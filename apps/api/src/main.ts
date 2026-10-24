import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { promptCredentials } from './utils/cli/prompt-credentials/prompt-credentials';
import { CLI_COMMANDS } from './constants/cli-commands.constant';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}

const authBootstrap = async () => {
  promptCredentials();
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
