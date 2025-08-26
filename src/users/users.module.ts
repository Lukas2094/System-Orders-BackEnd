// users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { WebsocketModule } from 'src/websocket/websocket.module'; 
import { Role } from 'src/roles/roles.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User , Role]),
        WebsocketModule, 
    ],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService],
})
export class UsersModule { }
