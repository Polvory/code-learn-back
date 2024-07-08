// jwt.module.ts

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtService } from './jwt.service';
import { getJwtConfig } from '../config/jwt.config'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
@Module({
    imports: [
        JwtModule.register({
            secret: getJwtConfig().secret,
            signOptions: { expiresIn: getJwtConfig().expiresIn },
        }
        ),
    ],
    providers: [JwtService, JwtAuthGuard],
    exports: [JwtService],
})
export class JwtCustomModule { }

