import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { getAuthConfig } from './auth.config';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const authConfig = getAuthConfig(configService);

        return {
          secret: authConfig.jwt.secret,
          signOptions: {
            audience: authConfig.jwt.audience,
            expiresIn: authConfig.jwt.expiresInSeconds,
            issuer: authConfig.jwt.issuer,
          },
        };
      },
    }),
  ],
})
export class AuthModule {}
