import { Module } from '@nestjs/common';
import { FavoritosService } from './favoritos.service';
import { FavoritosController } from './favoritos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorito } from './entities/favorito.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Profesor } from '../profesores/entities/profesor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Favorito, Usuario, Profesor]),
  ],
  controllers: [FavoritosController],
  providers: [FavoritosService],
})
export class FavoritosModule {}
