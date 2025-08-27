import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './users.entity';
import { Role } from 'src/roles/roles.entity';
import { WebsocketGateway } from 'src/websocket/websocket.gateway';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
        private websocketGateway: WebsocketGateway,
    ) {}

    async findAll(): Promise<User[]> {
        return this.usersRepository.find({ relations: ['role'] });
    }

    async findById(id: number): Promise<User> {
        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ['role'],
        });
        if (!user) throw new NotFoundException('Usuário não encontrado');
        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository
            .createQueryBuilder('user')
            .addSelect('user.password')
            .where('user.email = :email', { email })
            .getOne();
    }

    async create(createUserDto: CreateUserDto & { roleId?: number }): Promise<User> {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const role = createUserDto.roleId
        ? await this.roleRepository.findOne({ where: { id: createUserDto.roleId } })
        : await this.roleRepository.findOne({ where: { id: 1 } });

        if (!role) throw new NotFoundException('Role não encontrada');

        const user = this.usersRepository.create({
            name: createUserDto.name,
            email: createUserDto.email,
            password: hashedPassword,
            phone: createUserDto.phone,
            roleId: role.id,
        });

        const savedUser = await this.usersRepository.save(user);

        const userWithRole = await this.usersRepository.findOne({
            where: { id: savedUser.id },
            relations: ['role'],
        });

        this.websocketGateway.emitUserUpdated(userWithRole);
        if (!userWithRole) throw new NotFoundException('Usuário não encontrado');
        return userWithRole;
    }

    async update(id: number, updateUserDto: UpdateUserDto & { roleId?: number }): Promise<User> {
        const user = await this.findById(id);

        if (updateUserDto.name) user.name = updateUserDto.name;
        if (updateUserDto.phone) user.phone = updateUserDto.phone;
        if (updateUserDto.email) user.email = updateUserDto.email;
        if (updateUserDto.password) {
            user.password = await bcrypt.hash(updateUserDto.password, 10);
        }

        if (updateUserDto.roleId) {
            const role = await this.roleRepository.findOne({ where: { id: updateUserDto.roleId } });
            if (!role) throw new NotFoundException('Role não encontrada');
            user.role = role;
            user.roleId = role.id;
        }

        const updatedUser = await this.usersRepository.save(user);

        const userWithRole = await this.usersRepository.findOne({
            where: { id: updatedUser.id },
            relations: ['role'],
        });

        // console.log('👤 User updated:', userWithRole);
        this.websocketGateway.emitUserUpdated(userWithRole);
        if (!userWithRole) throw new NotFoundException('Usuário não encontrado');
        return userWithRole;
    }

    async remove(id: number): Promise<void> {
        const user = await this.findById(id);
        await this.usersRepository.remove(user);
        this.websocketGateway.emitUserDeleted(id);
    }
}
