import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(30)
  readonly username!: string;

  @IsEmail()
  readonly email!: string;

  @IsString()
  @MinLength(6)
  readonly password!: string;
}
