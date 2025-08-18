import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]), 
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'secretKey', 
            signOptions: { expiresIn: '1h' },
        }),
        UsersModule, 
    ],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [AuthService], 
})
export class AuthModule { }