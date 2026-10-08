import { Injectable, UnauthorizedException } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class AuthService {
  getClient() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN;

    if (!clientId || !clientSecret || !refreshToken) {
      throw new UnauthorizedException(
        'YouTube is not configured. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET and YOUTUBE_REFRESH_TOKEN.',
      );
    }

    const client = new google.auth.OAuth2(clientId, clientSecret);
    client.setCredentials({ refresh_token: refreshToken });
    return client;
  }

  status() {
    return {
      connected: Boolean(
        process.env.GOOGLE_CLIENT_ID &&
        process.env.GOOGLE_CLIENT_SECRET &&
        process.env.YOUTUBE_REFRESH_TOKEN,
      ),
      mode: 'server_refresh_token',
    };
  }
}
