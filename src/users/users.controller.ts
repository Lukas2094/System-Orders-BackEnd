import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get()
    async findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.usersService.findById(+id);
    }

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(+id, updateUserDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: number) {
        return this.usersService.remove(+id);
    }
}
