import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { getJwtConfig } from '../config/jwt.config'



@Injectable()
export class JwtService {
    constructor() { }

    async signPayload(pauloud: string) {
        try {
            const secret = getJwtConfig().secret;
            console.log(secret)
            return jwt.sign(pauloud, secret);
        } catch (error) {
            console.log(error)
            return 'false'
        }

    }
}