import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { ProfesoresService } from './profesores.service';
import { CreateProfesorDto } from './dtos/create-profesor.dto';
import { UpdateProfesorDto } from './dtos/update-profesor.dto';

@Controller('profesores')
export class ProfesoresController {
  constructor(private readonly service: ProfesoresService) {}

  @Get()
  findFiltered(@Query() query: any) {
    return this.service.findFiltered(query);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateProfesorDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateProfesorDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
