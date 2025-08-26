import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subcategory } from './subcategory.entity';
import { SubcategoriesService } from './subcategories.service';
import { SubcategoriesController } from './subcategories.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Subcategory])],
    providers: [SubcategoriesService],
    controllers: [SubcategoriesController],
    exports: [SubcategoriesService],
})
export class SubcategoriesModule { }
