import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './products.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { Category } from '../categories/category.entity';
import { Subcategory } from '../subcategories/subcategory.entity';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
        @InjectRepository(Category)
        private categoriesRepository: Repository<Category>,
        @InjectRepository(Subcategory)
        private subcategoriesRepository: Repository<Subcategory>,
        private websocketGateway: WebsocketGateway,
    ) { }

    async findAll(): Promise<Product[]> {
        return this.productsRepository.find({ 
            relations: ['category', 'subcategory'],
            order: { name: 'ASC' } 
        });
    }

    async findById(id: number): Promise<Product> {
        const product = await this.productsRepository.findOne({ 
            where: { id },
            relations: ['category', 'subcategory']
        });
        if (!product) throw new NotFoundException('Produto não encontrado');
        return product;
    }

    async create(createProductDto: CreateProductDto): Promise<Product> {
        const category = await this.categoriesRepository.findOne({ 
            where: { id: createProductDto.categoryId } 
        });
        if (!category) throw new NotFoundException('Categoria não encontrada');

        let subcategory: Subcategory | null = null;
        if (createProductDto.subcategoryId) {
            subcategory = await this.subcategoriesRepository.findOne({ 
                where: { id: createProductDto.subcategoryId } 
            });
            if (!subcategory) throw new NotFoundException('Subcategoria não encontrada');
        }

        const product = this.productsRepository.create({
            ...createProductDto,
            category,
            subcategory
        });

        const savedProduct = await this.productsRepository.save(product);
        this.websocketGateway.server.emit('stockUpdated', savedProduct);
        return savedProduct;
    }

    async updateStock(id: number, updateStockDto: UpdateStockDto): Promise<Product> {
        const product = await this.findById(id);
        product.stock += updateStockDto.quantity;

        if (product.stock < 0) product.stock = 0;

        const updatedProduct = await this.productsRepository.save(product);
        this.websocketGateway.server.emit('stockUpdated', updatedProduct);

        return updatedProduct;
    }

    async update(id: number, updateData: Partial<CreateProductDto>): Promise<Product> {
        const product = await this.findById(id);
        
        if (updateData.categoryId) {
            const category = await this.categoriesRepository.findOne({ 
                where: { id: updateData.categoryId } 
            });
            if (!category) throw new NotFoundException('Categoria não encontrada');
            product.category = category;
        }

        if (updateData.subcategoryId !== undefined) {
            if (updateData.subcategoryId === null) {
                product.subcategory = null;
            } else {
                const subcategory = await this.subcategoriesRepository.findOne({ 
                    where: { id: updateData.subcategoryId } 
                });
                if (!subcategory) throw new NotFoundException('Subcategoria não encontrada');
                product.subcategory = subcategory;
            }
        }

        if (updateData.name) product.name = updateData.name;
        if (updateData.price) product.price = updateData.price;
        if (updateData.stock !== undefined) product.stock = updateData.stock;

        const updatedProduct = await this.productsRepository.save(product);
        this.websocketGateway.server.emit('stockUpdated', updatedProduct);
        return updatedProduct;
    }

    async remove(id: number): Promise<void> {
        const product = await this.findById(id);
        await this.productsRepository.remove(product);
        this.websocketGateway.server.emit('stockRemoved', { id });
    }

    async findByCategory(categoryId: number): Promise<Product[]> {
        return this.productsRepository.find({
            where: { category: { id: categoryId } },
            relations: ['category', 'subcategory'],
            order: { name: 'ASC' }
        });
    }

    async findBySubcategory(subcategoryId: number): Promise<Product[]> {
        return this.productsRepository.find({
            where: { subcategory: { id: subcategoryId } },
            relations: ['category', 'subcategory'],
            order: { name: 'ASC' }
        });
    }
}