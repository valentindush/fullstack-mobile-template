import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt'
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class AuthService {

  constructor(private jwtService: JwtService, private prisma: PrismaService) { }

  async generateAccessToken(user: User) {
    const payload = { fullName: user.fullName, username: user.email, sub: user.id, role: user.role };
    return this.jwtService.sign(payload, {secret: `${process.env.JWT_SECRET}`});
  }

  async generateRefreshToken(user: User) {
    const token = this.jwtService.sign({ sub: user.id }, { expiresIn: '7d' , secret: `${process.env.JWT_SECRET}`});
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    return token;
  }

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && await bcrypt.compare(pass, user.password)) {
      return user;
    }
    return null;
  }

  async login(data: LoginDTO) {
    const { email, password } = data
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    delete user.password

    return { accessToken, refreshToken, user };
  }

  async register(data: RegisterDTO) {
    const {fullName, email, password} = data

    const emailTaken = await this.prisma.user.findUnique({
      where: {email}
    })

    if(emailTaken){
      throw new BadRequestException('Email taken')
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        role: Role.USER,
      },
    });

    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);
    delete user.password
    return { accessToken, refreshToken, user };
  }


  async refreshToken(token: string) {
    const existingToken = await this.prisma.refreshToken.findUnique({ where: { token } });
    if (!existingToken || existingToken.expiresAt < new Date()) {
      throw new Error('Invalid or expired refresh token');
    }

    const user = await this.prisma.user.findUnique({ where: { id: existingToken.userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const accessToken = await this.generateAccessToken(user);
    return { accessToken };
  }
}
