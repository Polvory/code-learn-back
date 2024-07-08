import { Injectable, Logger } from '@nestjs/common';
import { Users } from './users.model';
import { InjectModel } from '@nestjs/sequelize';
import { createUser } from './dto/createUser.dto';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name)

    constructor(
        @InjectModel(Users) private UsersRepository: typeof Users,
    ) { }

    async createUser(dto: createUser) {
        let validate_user = await this.validate(dto.user_id)
        console.log(validate_user)
        if (!validate_user) return await this.UsersRepository.create(dto)
        return validate_user
    }

    async DeleteUser(user_id: string) {
        return await this.UsersRepository.destroy({ where: { user_id } })
    }

    async getCardUsers() {
        return await this.UsersRepository.findAll()
    }

    async validate(user_id: string) {
        return await this.UsersRepository.findOne({ where: { user_id } })
    }
    addDaysToCurrentDate(days) {
        // Получаем текущую дату
        let currentDate = new Date();

        // Добавляем указанное количество дней
        currentDate.setDate(currentDate.getDate() + days);

        // Возвращаем дату в миллисекундах с 1 января 1970 года
        return String(currentDate.getTime())
    }
    isCurrentDateNotGreaterThan(timestamp) {
        // Получаем текущее время в миллисекундах
        let currentTime = Date.now();
        // Проверяем, не больше ли текущее время переданного времени
        return currentTime <= timestamp;
    }

    async reduceRequests(user_id: string) {
        let validate_user = await this.validate(user_id)
        const isCurrentDate = this.isCurrentDateNotGreaterThan(validate_user.subscription_date)
        this.logger.log(`Проверяем дату подписки ${user_id} :${isCurrentDate}`)
        if (validate_user.reqvests >= 0 && isCurrentDate) {
            validate_user.reqvests = validate_user.reqvests - 1
            await validate_user.save()
            return validate_user.reqvests
        } else {
            return false
        }
    }


    async getAllUsers() {
        return await this.UsersRepository.findAll()
    }

    async getCardUser(user_id: string, type: string) {
        const user = await this.UsersRepository.findOne({ where: { user_id: user_id }, include: { all: true } });
        return this.includesType(user.cards, type)
    }
    includesType(cards, type) {
        return cards.some(card => card.type === type);
    }
}
