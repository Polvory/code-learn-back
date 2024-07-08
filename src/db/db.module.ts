import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getDbConfig } from '../config/db.config';
import { DataQw } from '../questions/dataQw.model';
import { Users } from '../users/users.model';
import { Cards } from '../questions/cards.model';
import { UsersQw } from '../questions/usersQw.model';
import { CardsToUser } from '../questions/CardsToUser.model';
import { CardsToQw } from '../questions/CardsToQw.model';

@Module({
    imports: [
        SequelizeModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: () => ({
                dialect: 'postgres',
                host: getDbConfig().host,
                port: getDbConfig().port,
                username: getDbConfig().username,
                password: getDbConfig().password,
                database: getDbConfig().database,
                models: [
                    DataQw,
                    Users,
                    Cards,
                    UsersQw,
                    CardsToUser,
                    CardsToQw
                ],
                logging: false,
                autoLoadModels: true
            })
        }),
    ]
})
export class DbModule { }