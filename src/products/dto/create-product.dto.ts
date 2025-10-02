import { IsString, IsNumber, IsPositive, IsOptional, IsInt, isString } from 'class-validator';

export class CreateProductDto {
    @IsString()
    name: string;

    @IsNumber()
    @IsPositive()
    price: number;

    @IsInt()
    stock: number;

    @IsInt()
    @IsPositive()
    categoryId: number;

    @IsOptional()
    @IsInt()
    @IsPositive()
    subcategoryId?: number | null;

    @IsOptional()
    @IsString()
    isbn?: string | null;
}