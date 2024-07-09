import { Injectable, Logger } from '@nestjs/common';
import { Hears, Start, Update, Action } from 'nestjs-telegraf';
import { Context, Markup, Telegram } from 'telegraf';
import { Cron } from '@nestjs/schedule';
import { UsersService } from '../users/users.service'
import { getBotConfig } from '../config/bot.config'
import { JwtService } from '../jwt/jwt.service'
import { QuestionService } from '../questions/question.service'
import * as fs from 'fs';

@Update()
@Injectable()
export class BotService {
    private readonly logger = new Logger(BotService.name)
    bot: Telegram
    constructor(
        private QuestionService: QuestionService,
        private JwtService: JwtService,
        private UsersService: UsersService
    ) { this.bot = new Telegram(getBotConfig().token) }

    @Start()
    async startCommand(ctx: Context) {
        const plans: any = await this.QuestionService.getAllCards()
        const plan_list = plans.map(item => { return `✅ ${item.type}\n` });

        const webAppUrl = 'https://code-learn.ru/'
        ctx.sendMessage(`Привет! Code-Learn — это твой персональный тренер по подготовке к техническим собеседованиям.\nКак он работает: выбираешь нужную тему для тренировки, нажимаешь на кнопку получения вопроса, присылаешь ответ, и бот проверяет твой ответ.
Сейчас в боте доступны следующие темы для тренировки:

${plan_list.map(item => item.trim(','))}\n
Если тебе нужна другая специальность, напиши @polvory — мы с радостью добавим её.

Наш сервис работает в тестовом режиме, поэтому есть небольшие ограничения. Мы предоставляем бесплатно 20 ответов каждый день в течение недели, и запросы пополняются раз в день. Если тебе понравится наш сервис, можно оформить премиум-подписку, которая дает 50 ответов в день в течение месяца. Напиши @polvory

Присоединяйтесь к нашему чату, чтобы сообщать о багах, предлагать идеи и делиться своим мнением.
@code_learn_chat
`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: `Видео инструкция`, callback_data: `sendvideo` }],
                    [{ text: `Запустить веб-app`, web_app: { url: webAppUrl } }]
                ],
                resize_keyboard: true
            }
        }
        )
    }
    @Hears('/token')
    async getTiken(ctx: Context) {
        const user: any = ctx.message.from
        if (String(user.id) === '6935066908') {
            let token = await this.JwtService.signPayload(String(user.id))
            await ctx.sendMessage(token)
        }

    }
    @Cron('0 0 * * *')
    async updateRequests(ctx: Context) {
        const users = await this.UsersService.getAllUsers()
        this.logger.log(JSON.stringify(users))
        for (let user of users) {
            this.logger.log(JSON.stringify(user.user_id))
            if (user.premium) {
                const count = 50
                user.reqvests = count
                await user.save()
                this.bot.sendMessage(user.user_id, `Запросы обновлены! Доступно ${count}`)
            } else {
                const count = 20
                user.reqvests = count
                await user.save()
                this.bot.sendMessage(user.user_id, `Запросы обновлены! Доступно ${count}`)
            }


        }
    }
    @Action(/sendvideo/)
    async sendVideo(ctx: Context) {
        const ctx_update: any = ctx.update
        const user_id = String(ctx_update.callback_query.from.id)
        let videoPath = '/home/ai/video/preview.mp4'
        const videoStream = fs.createReadStream(videoPath)
        ctx.sendMessage('Минутку 😊')
        ctx.sendVideo({ source: videoStream });
    }
}
