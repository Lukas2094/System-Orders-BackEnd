import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './roles.entity';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role)
        private rolesRepository: Repository<Role>,
    ) { }

    findAll(): Promise<Role[]> {
        return this.rolesRepository.find();
    }

    async findOne(id: number): Promise<Role> {
        const role = await this.rolesRepository.findOne({ where: { id } });
        if (!role) throw new NotFoundException('Role não encontrada');
        return role;
    }

    create(name: string): Promise<Role> {
        const role = this.rolesRepository.create({ name });
        return this.rolesRepository.save(role);
    }
}
