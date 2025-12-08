import { Module } from '@nestjs/common';
import { ReservasController } from './reservas.controller';
import { ReservasService } from './reservas.service';
import { Reserva } from './entities/reserva.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Libro } from '../libros/entities/libro.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva, Usuario, Libro])],
  controllers: [ReservasController],
  providers: [ReservasService]
})
export class ReservasModule {}
