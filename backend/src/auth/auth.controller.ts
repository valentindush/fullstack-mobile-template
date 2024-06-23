import { Controller, Post, Body, Res, HttpStatus, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
@ApiTags("Auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() data: LoginDTO, @Res() res: Response) {
    try {
      const { accessToken, refreshToken, user } = await this.authService.login(data);
      return res.status(HttpStatus.OK).json({ accessToken, refreshToken, user });
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid credentials' });
    }
  }

  @Post('register')
  async register(@Body() data: RegisterDTO, @Res() res) {
    try {
      const { accessToken, refreshToken, user } = await this.authService.register(data);
      return res.status(HttpStatus.CREATED).json({ accessToken, refreshToken, user });
    } catch (error) {
      console.log(error)
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Registration failed', error: error.message });
    }
  }

  @Post('refresh-token')
  async refreshToken(@Body() body: { refreshToken: string }, @Res() res: Response) {
    try {
      const { accessToken } = await this.authService.refreshToken(body.refreshToken);
      return res.status(HttpStatus.OK).json({ accessToken });
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid or expired refresh token' });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getProfile(@Req() req:Request) {
    return req.user;
  }
}