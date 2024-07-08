import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotController } from './bot.controller';
import { TelegrafModule } from 'nestjs-telegraf';
import { getBotConfig } from '../config/bot.config';
import { session } from 'telegraf';
import { UsersModule } from '../users/users.module'
import { JwtCustomModule } from '../jwt/jwt.module'

@Module({
  imports: [
    JwtCustomModule,
    UsersModule,
    TelegrafModule.forRoot({
      token: getBotConfig().token,
      middlewares: [session()],
    }),
  ],
  providers: [BotService],
  controllers: [BotController]
})
export class BotModule { }
