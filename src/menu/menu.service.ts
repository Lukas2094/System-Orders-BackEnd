import { WebsocketGateway } from "src/websocket/websocket.gateway";
import { CreateMenuDto, UpdateMenuDto } from "./dto/create-menu.dto";
import { Role } from "src/roles/roles.entity";
import { Repository } from "typeorm";
import { Menu } from "./menu.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MenuService {
    constructor(
        @InjectRepository(Menu)
        private menuRepo: Repository<Menu>,
        @InjectRepository(Role)
        private roleRepo: Repository<Role>,
        private readonly websocketGateway: WebsocketGateway 
    ) { }

    async findAll() {
        return this.menuRepo.find({ relations: ["roles"] });
    }

    // Buscar menu por ID
    async findOne(id: number) {
        return this.menuRepo.findOne({ where: { id }, relations: ["roles"] });
    }

    // Buscar menus por role
    async findByRole(roleId: number) {
        const role = await this.roleRepo.findOne({ where: { id: roleId }, relations: ["menus"] });
        return role?.menus || [];
    }

    async create(dto: CreateMenuDto) {
        const menu = this.menuRepo.create(dto);

        if (dto.roleIds && dto.roleIds.length > 0) {
            menu.roles = await this.roleRepo.findByIds(dto.roleIds);
        }

        const savedMenu = await this.menuRepo.save(menu);

        // Emitir evento via WebSocket
        this.websocketGateway.emitMenuCreated(savedMenu);

        return savedMenu;
    }

    async update(id: number, dto: UpdateMenuDto) {
        const menu = await this.menuRepo.findOne({ where: { id }, relations: ['roles'] });
        if (!menu) throw new Error('Menu não encontrado');

        Object.assign(menu, dto);

        if (dto.roleIds) {
            menu.roles = await this.roleRepo.findByIds(dto.roleIds);
        }

        const savedMenu = await this.menuRepo.save(menu);

        // Emitir evento via WebSocket
        this.websocketGateway.emitMenuUpdated(savedMenu);

        return savedMenu;
    }

    async remove(id: number) {
        const result = await this.menuRepo.delete(id);

        // Emitir evento via WebSocket
        this.websocketGateway.emitMenuDeleted(id);

        return result;
    }
}
