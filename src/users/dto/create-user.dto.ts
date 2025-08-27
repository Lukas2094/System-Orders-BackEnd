import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsNumber()
    roleId?: number;
}
