import { Controller, Get, Post, Body, Param, Put, Delete, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

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
    const result = await this.usersService.update(id, updateUserDto);
    return result;
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.usersService.remove(+id);
  }

    @Post(':id/token')
    async refreshToken(@Param('id') id: number, @Res({ passthrough: true }) res: Response) {
        const user = await this.usersService.findById(id);

        const payload = {
            sub: user.id,
            name: user.name,
            role: user.role.name,
            roleId: user.role.id,
        };

        const token = this.jwtService.sign(payload);
        res.cookie('token', token, { httpOnly: true, path: '/', maxAge: 24 * 60 * 60 * 1000 });
        return { token };
    }
}
