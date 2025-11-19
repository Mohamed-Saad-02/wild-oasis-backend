import { UserDto } from '@/users/dto/user.dto';
import { UserProvider, UserRole } from '@/users/entities/user.entity';
import { UsersService } from '@/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserGoogleProfile } from './strategies/google.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create({
      ...registerDto,
      role: UserRole.GUEST,
    });

    const userDto = plainToInstance(UserDto, user);
    const payload = { id: userDto.id, role: userDto.role };
    const token = this.generateToken(payload);

    return {
      message: 'User registered successfully',
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findOneByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.provider === UserProvider.CREDENTIALS && loginDto?.password) {
      const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        user.password ?? '',
      );
      if (!isPasswordValid)
        throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { id: user.id, role: user.role };
    const token = this.generateToken(payload);

    return {
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    };
  }

  async googleAuth(googleUser: UserGoogleProfile) {
    const existingUser = await this.usersService.findOneByEmail(
      googleUser.email,
    );

    const payload: { id: number; role: UserRole } = {
      id: existingUser ? existingUser.id : 0,
      role: UserRole.GUEST,
    };

    if (!existingUser) {
      const newUser = await this.usersService.create({
        name: googleUser.name,
        email: googleUser.email,
        role: UserRole.GUEST,
        provider: UserProvider.GOOGLE,
        avatar: googleUser.avatar,
      });
      const newUserDto = plainToInstance(UserDto, newUser);
      payload.id = newUserDto.id;
      payload.role = newUserDto.role;
    }

    const token = this.generateToken(payload);
    return {
      message: 'User logged in successfully',
      token,
    };
  }

  generateToken(payload: { id: number; role: UserRole }) {
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '7d',
    });
    return token;
  }
}
