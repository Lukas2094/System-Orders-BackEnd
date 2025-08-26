import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Get()
    findAll(): Promise<Category[]> {
        return this.categoriesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Category> {
        return this.categoriesService.findOne(id);
    }

    @Post()
    create(@Body() data: Partial<Category>): Promise<Category> {
        return this.categoriesService.create(data);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() data: Partial<Category>): Promise<Category> {
        return this.categoriesService.update(id, data);
    }

    @Delete(':id')
    remove(@Param('id') id: number): Promise<void> {
        return this.categoriesService.remove(id);
    }
}
