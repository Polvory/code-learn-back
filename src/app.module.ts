import { Module } from '@nestjs/common';
import { BotModule } from './bot/bot.module';
import { DbModule } from './db/db.module';
import { QwestionsModule } from './questions/question.module';
import { UsersModule } from './users/users.module';
import { OpenAiModule } from './ai/open-ai.module';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtCustomModule } from './jwt/jwt.module'

@Module({
  imports: [ScheduleModule.forRoot(), DbModule, QwestionsModule, UsersModule, OpenAiModule, BotModule, JwtCustomModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
