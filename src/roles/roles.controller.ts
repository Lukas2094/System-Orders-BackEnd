import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
    constructor(private rolesService: RolesService) { }

    @Get()
    findAll() {
        return this.rolesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.rolesService.findOne(+id);
    }

    @Post()
    create(@Body('name') name: string) {
        return this.rolesService.create(name);
    }
}
