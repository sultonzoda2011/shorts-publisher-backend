import { Controller, Get, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth/google')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Get()
  login(@Res() res: Response) {
    return res.redirect(this.auth.getAuthUrl());
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Res() res: Response) {
    if (!code) return res.status(400).send('Missing authorization code');
    await this.auth.callback(code);
    return res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173');
  }

  @Get('status')
  status() {
    return this.auth.status();
  }
}