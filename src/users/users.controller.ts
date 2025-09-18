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
    const { user, token } = await this.usersService.update(id, {});

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',  
      maxAge: 24 * 60 * 60 * 1000
    });

    return { success: true, user, token };
  }
}
