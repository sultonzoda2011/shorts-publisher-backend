import { Body, Controller, Post } from '@nestjs/common';
import { PublishService } from './publish.service';

@Controller('publish')
export class PublishController {
  constructor(private readonly publish: PublishService) {}

  @Post()
  publishVideo(@Body() body: { sourceUrl: string; title: string; description?: string; tags?: string[] }) {
    return this.publish.publish(body);
  }
}