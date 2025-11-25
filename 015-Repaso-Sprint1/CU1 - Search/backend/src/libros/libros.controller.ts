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
import { CreateLibroDto } from '../libros/dtos/create-libro.dto';
import { UpdateLibroDto } from '../libros/dtos/update-libro.dto';

@Controller('libros')
export class LibrosController {
  constructor(private readonly librosService: LibrosService) {}

  @Post()
  create(@Body() dto: CreateLibroDto) {
    return this.librosService.create(dto);
  }

  // GET /libros?search=harry&categoriaId=1
  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('categoriaId') categoriaId?: string,
  ) {
    const categoriaIdNumber = categoriaId ? parseInt(categoriaId, 10) : undefined;
    return this.librosService.findAll(search, categoriaIdNumber);
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
