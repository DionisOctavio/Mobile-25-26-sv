import { Controller, Get, Post, Param, Body, Patch, Delete } from '@nestjs/common';
import { ProfesoresService } from './profesores.service';
import { CreateProfesorDto } from './dtos/create-profesor.dto';
import { UpdateProfesorDto } from './dtos/update-profesor.dto';

@Controller('profesores')
export class ProfesoresController {
  constructor(private readonly profesoresService: ProfesoresService) {}

  @Get()
  findAll() {
    return this.profesoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.profesoresService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateProfesorDto) {
    return this.profesoresService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateProfesorDto) {
    return this.profesoresService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.profesoresService.remove(id);
  }
}
