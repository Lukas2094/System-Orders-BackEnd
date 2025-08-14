import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './products.entity';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
    imports: [TypeOrmModule.forFeature([Product]), WebsocketModule],
    providers: [ProductsService],
    controllers: [ProductsController],
})
export class ProductsModule { }
