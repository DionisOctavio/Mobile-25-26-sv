import { Controller, Get, Post, Param, Body, Delete } from '@nestjs/common';
import { FavoritosService } from './favoritos.service';
import { CreateFavoritoDto } from './dtos/create-favorito.dto';

@Controller('favoritos')
export class FavoritosController {
  constructor(private readonly favoritosService: FavoritosService) {}

  @Get()
  findAll() {
    return this.favoritosService.findAll();
  }

  @Get('usuario/:id')
  getByUsuario(@Param('id') id: number) {
    return this.favoritosService.findByUsuario(id);
  }

  @Post()
  create(@Body() dto: CreateFavoritoDto) {
    return this.favoritosService.create(dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.favoritosService.remove(id);
  }
}
