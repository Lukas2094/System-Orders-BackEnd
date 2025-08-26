import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) { }

    async findAll(): Promise<Category[]> {
        return this.categoryRepository.find({ relations: ['subcategories'] });
    }

    async findOne(id: number): Promise<Category> {
        const category = await this.categoryRepository.findOne({
            where: { id },
            relations: ['subcategories'],
        });
        if (!category) throw new NotFoundException(`Category ${id} not found`);
        return category;
    }

    async create(data: Partial<Category>): Promise<Category> {
        const category = this.categoryRepository.create(data);
        return this.categoryRepository.save(category);
    }

    async update(id: number, data: Partial<Category>): Promise<Category> {
        await this.findOne(id);
        await this.categoryRepository.update(id, data);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.findOne(id);
        await this.categoryRepository.delete(id);
    }
}
