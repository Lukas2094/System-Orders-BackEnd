import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './products.entity';
import { WebsocketModule } from '../websocket/websocket.module';
import { Category } from '../categories/category.entity';
import { Subcategory } from '../subcategories/subcategory.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Product, Category, Subcategory]), 
        WebsocketModule
    ],
    providers: [ProductsService],
    controllers: [ProductsController],
    exports: [ProductsService]
})
export class ProductsModule { }