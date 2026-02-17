import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { CreateReservaDto } from './dtos/create-reserva.dto';

@Controller('reservas')
export class ReservasController {

  constructor(private reservasService: ReservasService) {}

  @Get()
  findAll() {
    return this.reservasService.findAll();
  }

  @Get('libro/:id')
  findByLibro(@Param('id') id: number) {
    return this.reservasService.findByLibro(id);
  }

  @Post()
  create(@Body() dto: CreateReservaDto) {
    return this.reservasService.create(dto);
  }
}