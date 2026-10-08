import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class AuthService {
  private client() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN;

    if (!clientId || !clientSecret || !refreshToken) {
      return null;
    }

    const client = new google.auth.OAuth2(clientId, clientSecret);
    client.setCredentials({ refresh_token: refreshToken });
    return client;
  }

  async getClient() {
    return this.client();
  }

  async status() {
    return {
      connected: Boolean(this.client()),
      mode: 'refresh_token',
    };
  }
}
