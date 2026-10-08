import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { PublishController } from './publish.controller';
import { PublishService } from './publish.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [PublishController],
  providers: [AuthService, PublishService],
})
export class AppModule {}
