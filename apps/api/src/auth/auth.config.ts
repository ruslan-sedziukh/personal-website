import type { ConfigService } from '@nestjs/config';

export interface AuthConfig {
  readonly cookie: {
    readonly sameSite: 'lax' | 'none' | 'strict';
    readonly secure: boolean;
  };
  readonly jwt: {
    readonly audience: string;
    readonly expiresInSeconds: number;
    readonly issuer: string;
    readonly secret: string;
  };
  readonly loginThrottle: {
    readonly limit: number;
    readonly windowSeconds: number;
  };
  readonly webOrigin: string;
}

const parseBoolean = (value: string, name: string): boolean => {
  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  throw new Error(`${name} must be either true or false`);
};

const parsePositiveInteger = (value: string, name: string): number => {
  if (!/^\d+$/.test(value) || Number(value) < 1) {
    throw new Error(`${name} must be a positive integer`);
  }

  return Number(value);
};

const parseDuration = (value: string): number => {
  const match = /^(\d+)([smhd])$/.exec(value);

  if (!match || Number(match[1]) < 1) {
    throw new Error(
      'JWT_EXPIRES_IN must be a positive duration using s, m, h, or d, for example 3d',
    );
  }

  const multipliers = {
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 60 * 60 * 24,
  } as const;

  return Number(match[1]) * multipliers[match[2] as keyof typeof multipliers];
};

const parseSameSite = (value: string): AuthConfig['cookie']['sameSite'] => {
  if (value === 'lax' || value === 'none' || value === 'strict') {
    return value;
  }

  throw new Error('AUTH_COOKIE_SAME_SITE must be lax, none, or strict');
};

const parseWebOrigin = (value: string): string => {
  try {
    const origin = new URL(value);

    if (origin.protocol !== 'http:' && origin.protocol !== 'https:') {
      throw new Error();
    }

    return origin.origin;
  } catch {
    throw new Error('WEB_ORIGIN must be an absolute HTTP or HTTPS origin');
  }
};

export const getAuthConfig = (configService: ConfigService): AuthConfig => {
  const secret = configService.getOrThrow<string>('JWT_SECRET');

  if (secret.includes('change_me') || secret.length < 32) {
    throw new Error(
      'JWT_SECRET must be a unique random secret with at least 32 characters',
    );
  }

  const secure = parseBoolean(
    configService.getOrThrow<string>('AUTH_COOKIE_SECURE'),
    'AUTH_COOKIE_SECURE',
  );
  const sameSite = parseSameSite(
    configService.getOrThrow<string>('AUTH_COOKIE_SAME_SITE'),
  );

  if (sameSite === 'none' && !secure) {
    throw new Error(
      'AUTH_COOKIE_SECURE must be true when AUTH_COOKIE_SAME_SITE is none',
    );
  }

  if (configService.get<string>('NODE_ENV') === 'production' && !secure) {
    throw new Error('AUTH_COOKIE_SECURE must be true in production');
  }

  return {
    cookie: {
      sameSite,
      secure,
    },
    jwt: {
      audience: configService.getOrThrow<string>('JWT_AUDIENCE'),
      expiresInSeconds: parseDuration(
        configService.getOrThrow<string>('JWT_EXPIRES_IN'),
      ),
      issuer: configService.getOrThrow<string>('JWT_ISSUER'),
      secret,
    },
    loginThrottle: {
      limit: parsePositiveInteger(
        configService.getOrThrow<string>('AUTH_LOGIN_THROTTLE_LIMIT'),
        'AUTH_LOGIN_THROTTLE_LIMIT',
      ),
      windowSeconds: parsePositiveInteger(
        configService.getOrThrow<string>('AUTH_LOGIN_THROTTLE_WINDOW_SECONDS'),
        'AUTH_LOGIN_THROTTLE_WINDOW_SECONDS',
      ),
    },
    webOrigin: parseWebOrigin(configService.getOrThrow<string>('WEB_ORIGIN')),
  };
};
