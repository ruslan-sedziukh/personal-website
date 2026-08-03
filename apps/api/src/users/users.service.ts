import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

export interface CreateInitialUserInput {
  readonly email: string;
  readonly passwordHash: string;
}

export class UserAlreadyExistsError extends Error {
  constructor() {
    super('The single user account already exists');
  }
}

const INITIAL_USER_CREATION_LOCK_KEY = 718479259138243;

export const normalizeEmail = (email: string): string =>
  email.trim().toLowerCase();

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.usersRepository.create(createUserDto);

    return this.usersRepository.save(newUser);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async createInitialUser(input: CreateInitialUserInput): Promise<User> {
    return this.usersRepository.manager.transaction(async (manager) => {
      await manager.query('SELECT pg_advisory_xact_lock($1::bigint)', [
        INITIAL_USER_CREATION_LOCK_KEY,
      ]);

      if (await manager.exists(User, { where: {} })) {
        throw new UserAlreadyExistsError();
      }

      const user = manager.create(User, {
        email: normalizeEmail(input.email),
        passwordHash: input.passwordHash,
      });
      const savedUser = await manager.save(user);

      return manager.findOneByOrFail(User, { id: savedUser.id });
    });
  }

  findByEmailWithPasswordHash(email: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email: normalizeEmail(email) })
      .getOne();
  }

  async findSoleUser(): Promise<User | null> {
    const [user] = await this.usersRepository.find({
      order: { id: 'ASC' },
      take: 1,
    });

    return user ?? null;
  }

  async updatePasswordHash(
    userId: number,
    passwordHash: string,
  ): Promise<void> {
    await this.usersRepository.update(userId, { passwordHash });
  }
}
