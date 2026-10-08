import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PublishController } from './publish.controller';
import { PublishService } from './publish.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AuthController, PublishController],
  providers: [AuthService, PublishService],
})
export class AppModule {}