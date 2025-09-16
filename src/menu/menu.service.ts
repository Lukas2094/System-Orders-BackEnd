import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { Menu } from "./menu.entity";
import { Submenu } from "src/submenu/submenu.entity";
import { Role } from "src/roles/roles.entity";
import { WebsocketGateway } from "src/websocket/websocket.gateway";
import { CreateMenuDto, UpdateMenuDto } from "./dto/create-menu.dto";
import { CreateSubmenuDto } from "src/submenu/dto/create-submenu.dto";

@Injectable()
export class MenuService {
    constructor(
        @InjectRepository(Menu)
        private menuRepo: Repository<Menu>,

        @InjectRepository(Submenu)
        private submenuRepo: Repository<Submenu>,

        @InjectRepository(Role)
        private roleRepo: Repository<Role>,

        private readonly websocketGateway: WebsocketGateway
    ) { }

    // Criar menu
    async create(dto: CreateMenuDto) {
        const menu = this.menuRepo.create({
            name: dto.name,
            path: dto.path,
            icon: dto.icon
        });

        if (dto.roleIds?.length) {
            menu.roles = await this.roleRepo.findBy({ id: In(dto.roleIds) });
        }

        const savedMenu = await this.menuRepo.save(menu);

        if (dto.submenus?.length) {
            const submenus = dto.submenus.map(s =>
                this.submenuRepo.create({
                    name: s.name,
                    path: s.path,
                    icon: s.icon || "FaBox", // fallback
                    menu: savedMenu,
                    roles: menu.roles
                })
            );
            await this.submenuRepo.save(submenus);
            savedMenu.submenus = submenus;
        }

        this.websocketGateway.emitMenuCreated(savedMenu);

        return savedMenu;
    }

    // Atualizar menu
    async update(id: number, dto: UpdateMenuDto) {
        const menu = await this.menuRepo.findOne({
            where: { id },
            relations: ["roles", "submenus", "submenus.roles"],
        });
        if (!menu) throw new Error("Menu não encontrado");

        Object.assign(menu, {
            name: dto.name ?? menu.name,
            path: dto.path ?? menu.path,
            icon: dto.icon ?? menu.icon,
        });

        if (dto.roleIds) {
            menu.roles = await this.roleRepo.findBy({ id: In(dto.roleIds) });
        }

        await this.menuRepo.save(menu);

        if (dto.submenus) {
            for (const s of dto.submenus) {
                if (s.id) {
                    // Submenu existente → atualizar
                    const existing = menu.submenus.find(sub => sub.id === s.id);
                    if (existing) {
                        Object.assign(existing, {
                            name: s.name ?? existing.name,
                            path: s.path ?? existing.path,
                            icon: s.icon ?? existing.icon,
                        });
                        existing.roles = menu.roles;
                        await this.submenuRepo.save(existing);
                    }
                } else {
                    // Submenu novo → criar
                    const newSub = this.submenuRepo.create({
                        name: s.name,
                        path: s.path,
                        icon: s.icon || "FaBox",
                        menu: menu,
                        roles: menu.roles,
                    });
                    await this.submenuRepo.save(newSub);
                }
            }

            // Remover submenus que não estão no update
            const dtoIds = dto.submenus.filter(s => s.id).map(s => s.id);
            const toRemove = menu.submenus.filter(
                sub => sub.id && !dtoIds.includes(sub.id),
            );
            if (toRemove.length > 0) {
                await this.submenuRepo.remove(toRemove);
            }
        }

        // 🔥 Recarregar menu atualizado com submenus certos
        const refreshedMenu = await this.menuRepo.findOne({
            where: { id: menu.id },
            relations: ["roles", "submenus", "submenus.roles"],
        });

        this.websocketGateway.emitMenuUpdated(refreshedMenu);

        return refreshedMenu;
    }


    // Deletar menu
    async remove(id: number) {
        const result = await this.menuRepo.delete(id);
        this.websocketGateway.emitMenuDeleted(id);
        return result;
    }

    // Buscar todos menus com roles e submenus
    async findAll() {
        return this.menuRepo.find({ relations: ["roles", "submenus", "submenus.roles"] });
    }

    // Buscar menu por ID
    async findOne(id: number) {
        return this.menuRepo.findOne({ where: { id }, relations: ["roles", "submenus", "submenus.roles"] });
    }

    // Criar submenu
    async createSubmenu(dto: CreateSubmenuDto) {
        const submenu = this.submenuRepo.create({
            name: dto.name,
            path: dto.path,
            icon: dto.icon || "FaBox",
            menu: { id: dto.menuId } as Menu,
        });

        if (dto.roleIds?.length) {
            submenu.roles = await this.roleRepo.findBy({ id: In(dto.roleIds) });
        }

        const savedSubmenu = await this.submenuRepo.save(submenu);

        // 🔥 Agora emitimos o evento de SUBMENU criado
        this.websocketGateway.emitSubmenuCreated({
            ...savedSubmenu,
            menuId: dto.menuId,
        });

        return savedSubmenu;
    }
    async removeSubmenu(id: number) {
        const submenu = await this.submenuRepo.findOne({ where: { id }, relations: ["menu"] });
        if (!submenu) throw new Error("Submenu não encontrado");

        await this.submenuRepo.delete(id);

        // 🔥 Forçar reload do menu pai sem esse submenu
        const refreshedMenu = await this.menuRepo.findOne({
            where: { id: submenu.menu.id },
            relations: ["roles", "submenus", "submenus.roles"],
        });

        this.websocketGateway.emitMenuUpdated(refreshedMenu);

        return true;
    }

    // Buscar submenus de um menu
    async findByMenu(menuId: number) {
        return this.submenuRepo.find({
            where: { menu: { id: menuId } },
            relations: ["roles"]
        });
    }

    // Buscar menus (e submenus) por role
    async findByRole(roleId: number) {
        const role = await this.roleRepo.findOne({
            where: { id: roleId },
            relations: ["menus", "menus.roles", "menus.submenus", "menus.submenus.roles"],
        });

        if (!role) throw new Error(`Role com ID ${roleId} não encontrada`);

        const filteredMenus = await Promise.all(
            role.menus
                .filter(menu => menu.roles.some(r => r.id === roleId))
                .map(async menu => {
                    const dbMenu = await this.menuRepo.findOne({
                        where: { id: menu.id },
                        relations: ["submenus", "submenus.roles", "roles"],
                    });

                    if (!dbMenu) {
                        return null; 
                    }

                    return {
                        ...dbMenu,
                        submenus: dbMenu.submenus.filter(sub =>
                            sub.roles.some(r => r.id === roleId),
                        ),
                    };
                }),
        );

        return filteredMenus.filter(m => m !== null);
    }
}
