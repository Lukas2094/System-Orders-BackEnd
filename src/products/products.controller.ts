import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

@Controller('products')
export class ProductsController {
    constructor(private productsService: ProductsService) { }

    @Get()
    findAll() {
        return this.productsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.productsService.findById(+id);
    }

    @Post()
    create(@Body() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }

    @Patch(':id/stock')
    updateStock(@Param('id') id: number, @Body() updateStockDto: UpdateStockDto) {
        return this.productsService.updateStock(+id, updateStockDto);
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() updateData: Partial<CreateProductDto>) {
        return this.productsService.update(+id, updateData);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.productsService.remove(+id);
    }
}
