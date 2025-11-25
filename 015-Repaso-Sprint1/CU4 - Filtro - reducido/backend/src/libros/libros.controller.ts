// libros.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { LibrosService } from './libros.service';
import { CreateLibroDto } from './dtos/create-libro.dto';
import { UpdateLibroDto } from './dtos/update-libro.dto';

@Controller('libros')
export class LibrosController {
  constructor(private readonly librosService: LibrosService) {}

  @Post()
  create(@Body() dto: CreateLibroDto) {
    return this.librosService.create(dto);
  }

  // GET /libros?categoriaId=1
  @Get()
  findAll(@Query('categoriaId') categoriaId?: string) {
    const categoriaNumber = categoriaId ? parseInt(categoriaId, 10) : undefined;
    return this.librosService.findAll(categoriaNumber);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.librosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLibroDto,
  ) {
    return this.librosService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.librosService.remove(id);
  }
}