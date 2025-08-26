import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { SubcategoriesService } from './subcategories.service';
import { Subcategory } from './subcategory.entity';

@Controller('subcategories')
export class SubcategoriesController {
    constructor(private readonly subcategoriesService: SubcategoriesService) { }

    @Get()
    findAll(): Promise<Subcategory[]> {
        return this.subcategoriesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Subcategory> {
        return this.subcategoriesService.findOne(id);
    }

    @Post()
    create(@Body() data: Partial<Subcategory>): Promise<Subcategory> {
        return this.subcategoriesService.create(data);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() data: Partial<Subcategory>): Promise<Subcategory> {
        return this.subcategoriesService.update(id, data);
    }

    @Delete(':id')
    remove(@Param('id') id: number): Promise<void> {
        return this.subcategoriesService.remove(id);
    }
}
