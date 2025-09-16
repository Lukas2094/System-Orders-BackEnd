import { Controller, Get, Post, Body, Param, Delete, Put, HttpException, HttpStatus } from "@nestjs/common";
import { MenuService } from "./menu.service";
import { CreateMenuDto, UpdateMenuDto } from "./dto/create-menu.dto";
import { CreateSubmenuDto } from "src/submenu/dto/create-submenu.dto";

@Controller("menus")
export class MenuController {
    constructor(private readonly menuService: MenuService) { }

    // Criar menu
    @Post()
    async create(@Body() dto: CreateMenuDto) {
        return this.menuService.create(dto);
    }

    // Criar submenu (rota separada para evitar conflito)
    @Post("submenu")
    async createSubmenu(@Body() dto: CreateSubmenuDto) {
        return this.menuService.createSubmenu(dto);
    }

    // Buscar todos os menus
    @Get()
    async findAll() {
        return this.menuService.findAll();
    }

    // Buscar menu por ID
    @Get(":id")
    async findOne(@Param("id") id: string) {
        return this.menuService.findOne(+id);
    }

    // Buscar submenus por menu
    @Get(":menuId/submenus")
    async findSubmenus(@Param("menuId") menuId: string) {
        return this.menuService.findByMenu(+menuId);
    }

    // Atualizar menu
    @Put(":id")
    async update(@Param("id") id: string, @Body() dto: UpdateMenuDto) {
        return this.menuService.update(+id, dto);
    }

    // Deletar menu
    @Delete(":id")
    async remove(@Param("id") id: string) {
        return this.menuService.remove(+id);
    }

    // Buscar menus (e submenus) por role
    @Get("role/:roleId")
    async findByRole(@Param("roleId") roleId: string) {
        try {
            const menus = await this.menuService.findByRole(+roleId);

            return {
                success: true,
                data: menus,
                count: menus.length,
                message: menus.length > 0
                    ? `Menus encontrados para a role ${roleId}`
                    : `Nenhum menu encontrado para a role ${roleId}`
            };
        } catch (error) {
            throw new HttpException({
                success: false,
                message: error.message
            }, HttpStatus.NOT_FOUND);
        }
    }
}
