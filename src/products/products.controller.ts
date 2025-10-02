import { Controller, Get, Post, Body, Param, Patch, Delete, Query, Put, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('products')
export class ProductsController {
    constructor(private productsService: ProductsService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(@Query('category') categoryId?: number, @Query('subcategory') subcategoryId?: number) {
        if (categoryId) {
            return this.productsService.findByCategory(+categoryId);
        }
        if (subcategoryId) {
            return this.productsService.findBySubcategory(+subcategoryId);
        }
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

    @Put(':id')
    update(@Param('id') id: number, @Body() updateData: Partial<CreateProductDto>) {
        return this.productsService.update(+id, updateData);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.productsService.remove(+id);
    }

    // Novas rotas para filtros específicos
    @Get('category/:categoryId')
    findByCategory(@Param('categoryId') categoryId: number) {
        return this.productsService.findByCategory(+categoryId);
    }

    @Get('subcategory/:subcategoryId')
    findBySubcategory(@Param('subcategoryId') subcategoryId: number) {
        return this.productsService.findBySubcategory(+subcategoryId);
    }
}