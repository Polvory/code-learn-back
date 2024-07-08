import { Module } from '@nestjs/common';
import { QwestionsController } from './question.controller';
import { QuestionService } from './question.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { DataQw } from './dataQw.model';
import { Cards } from './cards.model';
import { UsersModule } from '../users/users.module';
import { UsersQw } from './usersQw.model';
import { OpenAiModule } from '../ai/open-ai.module'
import { CardsToUser } from './CardsToUser.model'
import { JwtCustomModule } from '../jwt/jwt.module'
import { JwtModule } from '@nestjs/jwt';

@Module({
    controllers: [QwestionsController],
    providers: [QuestionService],
    imports: [
        JwtCustomModule,
        JwtModule,
        UsersModule,
        OpenAiModule,
        SequelizeModule.forFeature([DataQw, Cards, UsersQw, CardsToUser]),
    ],
    exports: [QuestionService]
})
export class QwestionsModule { }
