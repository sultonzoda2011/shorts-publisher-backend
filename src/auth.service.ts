import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

@Injectable()
export class AuthService {
  private readonly dir = join(process.cwd(), '.data');
  private readonly tokenFile = join(this.dir, 'youtube-token.json');

  private client() {
    return new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_CALLBACK_URL,
    );
  }

  getAuthUrl() {
    return this.client().generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: ['https://www.googleapis.com/auth/youtube.upload'],
    });
  }

  async callback(code: string) {
    const client = this.client();
    const { tokens } = await client.getToken(code);
    await mkdir(this.dir, { recursive: true });
    await writeFile(this.tokenFile, JSON.stringify(tokens, null, 2), 'utf8');
  }

  async getClient() {
    const client = this.client();
    try {
      const raw = await readFile(this.tokenFile, 'utf8');
      client.setCredentials(JSON.parse(raw));
      return client;
    } catch {
      return null;
    }
  }

  async status() {
    return { connected: Boolean(await this.getClient()) };
  }
}