import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DataQw } from './dataQw.model';
import { Cards } from './cards.model';
import { addQwToUser } from './dto/addQwToUser.dto';
import { UsersService } from '../users/users.service'
import { UsersQw } from './usersQw.model';
import { OpenAiService } from '../ai/open-ai.service'
import { AiAnswerDto } from './dto/AiAnswer.dto';
import { createCardsDto, createQw, createQwList } from './dto/createDataQw.dto';
import { dataQwCreationAttrs } from './dataQw.model'
import { CardsToUser } from './CardsToUser.model'
const { Op } = require('sequelize');
@Injectable()
export class QuestionService {
    private readonly logger = new Logger(QuestionService.name)

    constructor(
        @InjectModel(DataQw) private DataQwRepository: typeof DataQw,
        @InjectModel(Cards) private CardsRepository: typeof Cards,
        @InjectModel(UsersQw) private UsersQwRepository: typeof UsersQw,
        @InjectModel(CardsToUser) private CardsToUserRepository: typeof CardsToUser,

        private OpenAiService: OpenAiService,
        private UsersService: UsersService
    ) { }


    async getCardsById(id: string) {

        return await this.CardsRepository.findOne({ where: { id: id }, include: { all: true } })
    }
    async createDataQw(dto: createQw) {
        return await this.DataQwRepository.create(dto)
    }

    async createUsersQw(dto: any) {
        return await this.UsersQwRepository.create(dto)
    }

    async DeletePlan(user_id: string, type: string) {
        const user = await this.UsersService.validate(user_id)
        this.logger.log(user.id)
        this.logger.log(user_id)
        const card_id = await this.CardsRepository.findOne({ where: { type: type } })
        this.logger.log(card_id.id)
        let resQw = await this.UsersQwRepository.destroy({ where: { user_id: String(user_id), type: type } })
        let resCards = await this.CardsToUserRepository.destroy({ where: { user_id: user.id, cards_id: card_id.id } })
        this.logger.log(resQw)
        this.logger.log(resCards)

        return await resCards

    }



    async getAiAnswer(dto: AiAnswerDto) {

        try {
            const user_requests = await this.UsersService.reduceRequests(String(dto.user_id))
            if (!user_requests) return 'end_reqwest'

            this.logger.log('ищем пользователя')
            let user = await this.UsersService.validate(String(dto.user_id))
            if (!user) throw new HttpException('USER NOT_FOUND', HttpStatus.NOT_FOUND);
            // this.logger.log('Изщем вопрос в плане юзера')
            let Qw = await this.UsersQwRepository.findOne({ where: { id: dto.last_question_id } })
            if (!Qw) throw new HttpException('QW NOT_FOUND', HttpStatus.NOT_FOUND);
            this.logger.log(JSON.stringify(Qw))
            let answer = [
                {
                    role: 'user', content: `
                    Ты являешься IT-экспертом с 10-летним опытом работы в ${dto.type} который сейчас проводит собеседование.
                    Отвечай только в формате JSON Вот пример структуры ответа:{"result":"Результат моего Ответа в формате bolean true или false","description":"Результат проверки ответа с комментарием , значение в формате Markdown"}`
                },
                { role: 'assistant', content: `${dto.question}` },
                {
                    role: 'user', content: `${dto.text}`
                }
            ]
            const progress = await this.getQwestionsLength(dto.user_id, dto.type)

            this.logger.log(progress)
            return {
                result: true,
                progress: progress,
                requests: user_requests,
                text: 'хуй'
            }
            // this.logger.warn('Проверяем ответ')
            // const ai_answer: any = await this.OpenAiService.getCompletions(answer)
            // this.logger.log(ai_answer)
            // if (ai_answer) {
            //     const ai_answer_parse = JSON.parse(await ai_answer)
            //     this.logger.warn(ai_answer_parse['result'])
            //     if (ai_answer_parse['result']) {
            //         this.logger.log('Сохраняем результат')
            //         Qw.result = true
            //         await Qw.save()
            //     }
            //     this.logger.log(ai_answer_parse['description'])
            //     if (ai_answer_parse['description'] != "") {
            //         const progress = await this.getQwestionsLength(dto.user_id, dto.type)
            //         return {
            //             result: ai_answer_parse['result'],
            //             progress: progress,
            //             requests: user_requests,
            //             text: ai_answer_parse['description']
            //         }
            //     } else {
            //         throw new HttpException('NO_CONTENT', HttpStatus.NO_CONTENT);
            //     }

            // }
        } catch (error) {
            console.log(error)
            return error
        }

    }

    async createCards(dto: createCardsDto) {
        this.logger.log('Создали карточку')
        return await this.CardsRepository.create(dto)
    }

    async edithCards(dto: createCardsDto) {

    }
    async deleteCards(id: string, type: string) {
        await this.DataQwRepository.destroy({ where: { type: type } })
        return await this.CardsRepository.destroy({ where: { id: id } })

    }


    async getQwestions(user_id: string, type: string) {
        const res = await this.UsersQwRepository.findAll({ where: { user_id: user_id, type: type, result: false } })
        console.log(res)

        if (!res) throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
        return res
    }



    async createQwestions(dto: createQwList) {

        this.logger.log('Ищем карточку')
        let card = await this.CardsRepository.findOne({ where: { id: dto.card_id } })

        for (let index = 0; index < dto.list.length; index++) {
            const element = dto.list[index];
            this.logger.log(JSON.stringify(element))
            this.logger.log('Создаем вопрос в бд')
            const payloud: dataQwCreationAttrs = {
                type: card.type,
                question: element.question,
                hint: element.hint
            }
            this.logger.log(JSON.stringify(payloud))
            const question = await this.DataQwRepository.create(payloud)
            if (!question) this.logger.error(payloud)
            card.$add('question', question.id)
            await card.save()
            this.logger.log('Добавили')
        }


        return card
    }





    async getQwestionsLength(user_id: string, type: string) {

        let qwestions = this.UsersQwRepository.findAll({ where: { type: type, user_id: user_id } })
        let good_list = (await qwestions).filter((e) => e.result === true)

        return {
            good: good_list.length,
            length: (await qwestions).length
        }
    }


    async getQwestionsUser(id: string, type: string) {
        // Получаем все записи, соответствующие критериям
        const results = await this.UsersQwRepository.findAll({ where: { user_id: id, type: type, result: false } });

        if (results.length === 0) {
            throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
        }

        // Выбираем случайный элемент из массива
        const randomIndex = Math.floor(Math.random() * results.length);
        const res = results[randomIndex];

        return res;

    }




    async getAllCards(searchValue?: string) {
        const whereClause = searchValue ? { type: { [Op.like]: searchValue } } : {};
        return this.CardsRepository.findAll({
            where: whereClause,
            order: [['createdAt', 'ASC']], // Сортировка по дате создания
            include: { all: true }
        })
    }
}
