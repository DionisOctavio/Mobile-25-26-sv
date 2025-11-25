import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorito } from './entities/favoritos.entity';
import { FavoritosService } from './favoritos.service';
import { FavoritosController } from './favoritos.controller';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Profesor } from 'src/profesores/entities/profesor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Favorito, Usuario, Profesor]),
  ],
  providers: [FavoritosService],
  controllers: [FavoritosController],
})
export class FavoritosModule {}
