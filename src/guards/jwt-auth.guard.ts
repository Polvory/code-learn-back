// jwt-auth.guard.ts

import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { getJwtConfig } from '../config/jwt.config'


@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        console.log(request.headers)
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Отсутствует токен авторизации');
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, getJwtConfig().secret);
            request.user = decoded;
            return true;
        } catch (err) {
            throw new UnauthorizedException('Неверный токен авторизации');
        }
    }
}
