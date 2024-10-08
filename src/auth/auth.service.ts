import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signup(email: string, password: string, name: string): Promise<User> {
    const alreadyExist = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
    console.log('EXIST', alreadyExist);

    if (alreadyExist) {
      throw new ConflictException('Email Already Exist');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      name,
      points: 0,
    });
    return this.userRepository.save(user);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    console.log('payload', payload);

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async findAll() {
    return this.userRepository.find();
  }

  async findOne(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }
}
