import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import { google } from 'googleapis';
import { createWriteStream } from 'node:fs';
import { mkdir, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { AuthService } from './auth.service';

@Injectable()
export class PublishService {
  constructor(private readonly auth: AuthService) {}

  private validateSource(sourceUrl: string) {
    let url: URL;
    try { url = new URL(sourceUrl); } catch { throw new BadRequestException('Invalid source URL'); }
    if (url.protocol !== 'https:') throw new BadRequestException('Source URL must use HTTPS');
    const allowed = (process.env.ALLOWED_SOURCE_HOSTS || '').split(',').map(v => v.trim()).filter(Boolean);
    if (!allowed.includes(url.hostname)) {
      throw new BadRequestException('Source host is not authorized. Use media you own or are licensed to publish.');
    }
    return url;
  }

  async publish(input: { sourceUrl: string; title: string; description?: string; tags?: string[] }) {
    if (!input.title?.trim()) throw new BadRequestException('Title is required');
    const url = this.validateSource(input.sourceUrl);
    const auth = await this.auth.getClient();
    if (!auth) throw new UnauthorizedException('Connect YouTube first');

    const dir = join(process.cwd(), '.data');
    await mkdir(dir, { recursive: true });
    const file = join(dir, `upload-${Date.now()}.mp4`);

    try {
      const response = await axios.get(url.toString(), { responseType: 'stream', timeout: 120000, maxContentLength: 500 * 1024 * 1024 });
      await pipeline(response.data, createWriteStream(file));

      const youtube = google.youtube({ version: 'v3', auth });
      const result = await youtube.videos.insert({
        part: ['snippet', 'status'],
        requestBody: {
          snippet: {
            title: input.title.trim(),
            description: input.description?.trim() || '',
            tags: input.tags?.filter(Boolean),
            categoryId: '22',
          },
          status: { privacyStatus: 'private', selfDeclaredMadeForKids: false },
        },
        media: { body: createReadStream(file) },
      });

      const id = result.data.id;
      return { status: 'published', privacyStatus: 'private', videoId: id, url: id ? `https://www.youtube.com/watch?v=${id}` : null };
    } finally {
      await unlink(file).catch(() => undefined);
    }
  }
}

function createReadStream(path: string) {
  return require('node:fs').createReadStream(path);
}