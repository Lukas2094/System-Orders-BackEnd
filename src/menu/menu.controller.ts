// menu.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Put } from "@nestjs/common";
import { MenuService } from "./menu.service";
import { CreateMenuDto, UpdateMenuDto } from "./dto/create-menu.dto";

@Controller("menus")
export class MenuController {
    constructor(private readonly menuService: MenuService) { }

    @Post()
    create(@Body() dto: CreateMenuDto) {
        return this.menuService.create(dto);
    }

    @Get()
    findAll() {
        return this.menuService.findAll();
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.menuService.findOne(+id);
    }

    @Put(":id")
    update(@Param("id") id: string, @Body() dto: UpdateMenuDto) {
        return this.menuService.update(+id, dto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.menuService.remove(+id);
    }

    @Get("/role/:roleId")
    findByRole(@Param("roleId") roleId: string) {
        return this.menuService.findByRole(+roleId);
    }
}
