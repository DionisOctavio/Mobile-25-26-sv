import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { FavoritosService } from './favoritos.service';
import { CreateFavoritoDto } from './dtos/create-favorito.dto';
import { DeleteFavoritoDto } from './dtos/delete-favorito.dto';

@Controller('favoritos')
export class FavoritosController {
  constructor(private readonly service: FavoritosService) {}

  @Get(':usuarioId')
  findByUsuario(@Param('usuarioId') usuarioId: number) {
    return this.service.findByUsuario(usuarioId);
  }

  @Post()
  create(@Body() dto: CreateFavoritoDto) {
    return this.service.create(dto);
  }

  @Delete('by-id/:id')
  removeById(@Param('id') id: number) {
    return this.service.removeById(id);
  }

  @Delete()
  removeByBody(@Body() dto: DeleteFavoritoDto) {
    return this.service.removeByUserAndProfe(dto);
  }
}
