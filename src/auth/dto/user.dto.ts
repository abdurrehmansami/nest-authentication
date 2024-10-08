import { IsEmail, IsNotEmpty } from 'class-validator';
import { User } from '../entities/user.entity';

export class UserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  id: number;

  name: string;

  points: number;
  constructor(partial: Partial<User>) {
    this.id = partial.id;
    this.email = partial.email;
    this.name = partial.name;
    this.points = partial.points;
  }
}
