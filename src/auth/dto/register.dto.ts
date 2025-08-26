// dto/register.dto.ts
import { IsEmail, IsString, MinLength , IsNumber } from 'class-validator';

export class RegisterDto {

    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsNumber()
    roleId?: number;
}
