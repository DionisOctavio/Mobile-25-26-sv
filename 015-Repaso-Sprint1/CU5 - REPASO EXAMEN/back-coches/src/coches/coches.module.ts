import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categoria } from '../categorias/entities/categoria.entity';
import { CochesController } from './coches.controller';
import { CochesService } from './coches.service';
import { Coche } from './entities/coche.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Coche, Categoria])],
  controllers: [CochesController],
  providers: [CochesService],
})
export class CochesModule {}