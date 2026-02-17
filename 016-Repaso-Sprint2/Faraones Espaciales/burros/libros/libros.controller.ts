import { Body, Controller, Get, Post } from '@nestjs/common';
import { LibrosService } from './libros.service';
import { CreateLibroDto } from './dtos/create-libro.dto';

@Controller('libros')
export class LibrosController {

  constructor(
    private librosService: LibrosService
  ) {}

  // ✔️ Primer endpoint: traer todos los libros
  @Get()
  findAll() {
    return this.librosService.findAll();
  }

  // ✔️ Crear libro
  @Post()
  create(@Body() dto: CreateLibroDto) {
    return this.librosService.create(dto);
  }
}