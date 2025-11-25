import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibrosController } from './libros.controller';
import { LibrosService } from './libros.service';
import { Libro } from './entities/libro.entity';
import { Categoria } from '../categorias/entities/categoria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Libro, Categoria])],
  controllers: [LibrosController],
  providers: [LibrosService],
})
export class LibrosModule {}
