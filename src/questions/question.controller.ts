import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Logger, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { QuestionService } from './question.service'
import { addQwToUser } from './dto/addQwToUser.dto';
import { AiAnswerDto } from './dto/AiAnswer.dto';
import { createCardsDto, createQw, createQwList } from './dto/createDataQw.dto';
import { dataQwCreationAttrs } from './dataQw.model';
import { UsersService } from '../users/users.service'
import { dataUserQwCreationAttrs } from './usersQw.model';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('questions')
@Controller('questions')
export class QwestionsController {
    private readonly logger = new Logger(QwestionsController.name)

    constructor(
        private UsersService: UsersService,
        private QuestionService: QuestionService
    ) { }

    @ApiOperation({ summary: 'Запрос к chatGPT' })
    @ApiResponse({ status: 200 })
    @Post('/ai/answer')
    @HttpCode(HttpStatus.OK)
    getAiAnswer(@Body() dto: AiAnswerDto) {
        return this.QuestionService.getAiAnswer(dto)
    }

    // @ApiOperation({ summary: 'Удалить все планы у юзера' })
    // @ApiResponse({ status: 200 })
    // @ApiBearerAuth('JWT') // Указываем, что используем Bearer token с именем 'JWT'
    // @UseGuards(JwtAuthGuard)
    // @Delete('/delete/plan')
    // @HttpCode(HttpStatus.OK)
    // deletePlan(@Query('user_id') user_id: string) {
    //     return this.QuestionService.deletePlan(user_id)
    // }

    @ApiOperation({ summary: 'Создать карточку тем' })
    @ApiResponse({ status: 200 })
    @ApiBearerAuth('JWT') // Указываем, что используем Bearer token с именем 'JWT'
    @UseGuards(JwtAuthGuard)
    @Post('/create/cards')
    @HttpCode(HttpStatus.OK)
    createCards(@Body() dto: createCardsDto) {
        return this.QuestionService.createCards(dto)
    }

    @ApiOperation({ summary: 'Редактировать карточку тем' })
    @ApiResponse({ status: 200 })
    @ApiBearerAuth('JWT') // Указываем, что используем Bearer token с именем 'JWT'
    @UseGuards(JwtAuthGuard)
    @Put('/edith/plan')
    @HttpCode(HttpStatus.OK)
    edithCards(@Body() dto: createCardsDto) {
        return this.QuestionService.edithCards(dto)
    }

    @ApiOperation({ summary: 'Удалить карточку тем' })
    @ApiResponse({ status: 200 })
    @ApiBearerAuth('JWT') // Указываем, что используем Bearer token с именем 'JWT'
    @UseGuards(JwtAuthGuard)
    @Delete('/delete/card')
    @HttpCode(HttpStatus.OK)
    deleteCards(@Query('id') id: string, @Query('type') type: string) {
        return this.QuestionService.deleteCards(id, type)
    }


    @ApiOperation({ summary: 'Получить карточки тем' })
    @ApiResponse({ status: 200 })
    @Get('/get/cards')
    getAllCards() {
        return this.QuestionService.getAllCards()
    }

    @ApiOperation({ summary: 'Создать вопрос' })
    @ApiResponse({ status: 201, type: createQwList })
    @ApiBearerAuth('JWT') // Указываем, что используем Bearer token с именем 'JWT'
    @UseGuards(JwtAuthGuard)
    @Post('/create/questions')
    @HttpCode(HttpStatus.OK)
    async createQwestions(@Body() dto: createQwList) {
        try {
            const card = await this.QuestionService.getCardsById(dto.card_id)
            for (let index = 0; index < dto.list.length; index++) {
                const element: createQw = dto.list[index];
                this.logger.log('Создаем вопрос в бд')
                const payloud: dataQwCreationAttrs = {
                    type: card.type,
                    question: element.question,
                    hint: element.hint
                }
                const question = await this.QuestionService.createDataQw(payloud)
                this.logger.log(JSON.stringify(question))
                card.$add('question', question.id)
                await card.save()
                this.logger.log('Добавили')
            }
            return card
        } catch (error) {
            return error
        }

    }

    @ApiOperation({ summary: 'Добавить план юзеру' })
    @ApiResponse({ status: 201 })
    @Post('/add/plan')
    async addPlan(@Query('user_id') user_id: string, @Query('card_id') card_id: string) {
        try {
            let question_list = []
            this.logger.log('Ищем юзера в карточке')
            const card = await this.QuestionService.getCardsById(card_id)
            const have_user = card.users.filter((e) => e.user_id === user_id)
            this.logger.log(have_user.length)

            // return false
            if (have_user.length === 0) {
                this.logger.log('Ищем юзера')
                const user = await this.UsersService.validate(user_id)
                user.$add('cards', card.id)
                await user.save()
                this.logger.log('Добавили карточку')
                this.logger.log('Добавили карточку')


                for (let index = 0; index < card.questions.length; index++) {
                    const element = card.questions[index];
                    const payloud: any = {
                        user_id: user.user_id,
                        type: card.type,
                        question: element.question,
                        hint: element.hint,
                        result: false

                    }
                    this.logger.log(JSON.stringify(payloud))
                    this.QuestionService.createUsersQw(payloud)

                }


                return "create"
            }
        } catch (error) {
            return error
        }


    }
    @ApiOperation({ summary: 'Удалить план' })
    @ApiResponse({ status: 200 })
    @Delete('/delete/plan')
    async DeletePlan(@Query('user_id') user_id: string, @Query('type') type: string) {
        return await this.QuestionService.DeletePlan(user_id, type)
    }


    @ApiOperation({ summary: 'Создать вопросы' })
    @ApiResponse({ status: 200 })
    @Get('/get/questions/length')
    getQwestionsLength(@Query('user_id') user_id: string, @Query('type') type: string) {
        return this.QuestionService.getQwestionsLength(user_id, type)
    }
    @ApiOperation({ summary: 'Получить вопрос' })
    @ApiResponse({ status: 200 })
    @Get('/get/user')
    getQuestionUser(@Query('id') id: string, @Query('type') type: string) {
        return this.QuestionService.getQwestionsUser(id, type)
    }

    // @ApiOperation({ summary: 'Создать вопрос' })
    // @ApiResponse({ status: 200 })
    // @Post('/edithe/qwestions')
    // @HttpCode(HttpStatus.OK)
    // editheQwestions(@Body() dto: createDataQw) {
    //     return this.QuestionsService.editheQwestions(dto)
    // }

    // @ApiResponse({ status: 200 })
    // @Post('/get/qwestions')
    // getQwestions(@Body() dto: addQwToUser) {
    //     return this.QuestionsService.getQwestions(dto)
    // }


    // @ApiResponse({ status: 200 })
    // @Get('/get/user')
    // getQwestionsUser(@Query('id') id: string, @Query('type') type: string,) {
    //     return this.QuestionsService.getQwestionsUser(id, type)
    // }
}
