import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('home')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Página inicial da API' })
  getHome() {
    return {
      message: '🚀 Bem-vindo à API Orders',
      docs: '/api/docs', // Swagger
    };
  }
}
