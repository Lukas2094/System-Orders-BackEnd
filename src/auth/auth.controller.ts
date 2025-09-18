import { Controller, Post, Body, UnauthorizedException, Res } from '@nestjs/common';
import { Response } from 'express'; 
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset.password.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

@Post('login')
async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response
) {
    const { email, password } = loginDto;
    const { access_token } = await this.authService.login(email, password);

    res.cookie('token', access_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 3600 * 1000,
    });

    return { access_token };
}

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.authService.resetPassword(
            resetPasswordDto.email,
            resetPasswordDto.newPassword,
        );
    }

    @Post('logout')
    logout(@Res() res: Response) {
        // Remove o cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });

        return res.status(200).json({ message: 'Logout realizado com sucesso' });
    }
}
