import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './products.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
        private websocketGateway: WebsocketGateway,
    ) { }

    async findAll(): Promise<Product[]> {
        return this.productsRepository.find({ order: { name: 'ASC' } });
    }

    async findById(id: number): Promise<Product> {
        const product = await this.productsRepository.findOne({ where: { id } });
        if (!product) throw new NotFoundException('Produto não encontrado');
        return product;
    }

    async create(createProductDto: CreateProductDto): Promise<Product> {
        const product = this.productsRepository.create(createProductDto);
        const savedProduct = await this.productsRepository.save(product);
        this.websocketGateway.server.emit('stockUpdated', savedProduct);
        return savedProduct;
    }

    async updateStock(id: number, updateStockDto: UpdateStockDto): Promise<Product> {
        const product = await this.findById(id);
        product.stock += updateStockDto.quantity;

        if (product.stock < 0) product.stock = 0; // evita estoque negativo

        const updatedProduct = await this.productsRepository.save(product);
        this.websocketGateway.server.emit('stockUpdated', updatedProduct);

        return updatedProduct;
    }

    async update(id: number, updateData: Partial<CreateProductDto>): Promise<Product> {
        const product = await this.findById(id);
        Object.assign(product, updateData);
        const updatedProduct = await this.productsRepository.save(product);
        this.websocketGateway.server.emit('stockUpdated', updatedProduct);
        return updatedProduct;
    }

    async remove(id: number): Promise<void> {
        const product = await this.findById(id);
        await this.productsRepository.remove(product);
        this.websocketGateway.server.emit('stockRemoved', { id });
    }
}
