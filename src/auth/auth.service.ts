import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private usersService: UsersService,
    ) { }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && (await user.comparePassword(pass))) { 
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async register(registerDto: RegisterDto) {
        const existing = await this.userRepository.findOne({ where: { email: registerDto.email } });
        if (existing) throw new ConflictException('Email já cadastrado');

        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        const newUser = this.userRepository.create({
            email: registerDto.email,
            password: hashedPassword,
            roleId: registerDto.roleId || 1,
        });

        await this.userRepository.save(newUser);
        return { message: 'Usuário registrado com sucesso' };
    }

    async resetPassword(email: string, newPassword: string) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) throw new NotFoundException('Usuário não encontrado');

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        await this.userRepository.save(user);
        return { message: 'Senha redefinida com sucesso' };
    }
}
