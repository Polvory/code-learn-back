import { Body, Controller, Get, HttpCode, HttpStatus, UseGuards, Delete, Param, Post, Query } from '@nestjs/common';
import { ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service'
import { createUser } from './dto/createUser.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';


@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private UsersService: UsersService) { }

    @ApiResponse({ status: 200, type: createUser })


    @ApiResponse({ status: 200 })
    @Get('/get/users')
    async getCardUsers() {
        return await this.UsersService.getCardUsers()
    }
    @ApiResponse({ status: 200 })
    @Delete('/Delete/user')
    async DeleteUser(@Query('user_id') user_id: string) {
        return await this.UsersService.DeleteUser(user_id)
    }

    @Post('/create/users')
    @HttpCode(HttpStatus.OK)
    createUser(@Body() dto: createUser) {
        return this.UsersService.createUser(dto)
    }

    @ApiResponse({ status: 200 })
    @Get('/get/user/card')
    async getCardUser(@Query('user_id') user_id: string, @Query('type') type: string) {
        return await this.UsersService.getCardUser(user_id, type)
    }

    @ApiResponse({ status: 200 })
    @ApiBearerAuth('JWT') // Указываем, что используем Bearer token с именем 'JWT'
    @UseGuards(JwtAuthGuard)
    @Get('/add/premium')
    async getPremium(@Query('user_id') user_id: string, @Query('premium') premium: string) {
        const user = await this.UsersService.validate(user_id)
        if (user) {
            user.reqvests = 50
            user.subscription_date = this.UsersService.addDaysToCurrentDate(30)
            user.premium = Boolean(premium)
            return await user.save()
        }

    }
}
