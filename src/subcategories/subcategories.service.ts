import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subcategory } from './subcategory.entity';

@Injectable()
export class SubcategoriesService {
    constructor(
        @InjectRepository(Subcategory)
        private subcategoryRepository: Repository<Subcategory>,
    ) { }

    async findAll(): Promise<Subcategory[]> {
        return this.subcategoryRepository.find({ relations: ['category'] });
    }

    async findOne(id: number): Promise<Subcategory> {
        const sub = await this.subcategoryRepository.findOne({
            where: { id },
            relations: ['category'],
        });
        if (!sub) throw new NotFoundException(`Subcategory ${id} not found`);
        return sub;
    }

    async create(data: Partial<Subcategory>): Promise<Subcategory> {
        const sub = this.subcategoryRepository.create(data);
        return this.subcategoryRepository.save(sub);
    }

    async update(id: number, data: Partial<Subcategory>): Promise<Subcategory> {
        await this.findOne(id);
        await this.subcategoryRepository.update(id, data);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.findOne(id);
        await this.subcategoryRepository.delete(id);
    }
}
