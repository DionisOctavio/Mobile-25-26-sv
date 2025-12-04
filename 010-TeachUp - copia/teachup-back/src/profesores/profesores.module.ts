import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profesor } from './entities/profesor.entity';
import { ProfesoresService } from './profesores.service';
import { ProfesoresController } from './profesores.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Profesor])],
  providers: [ProfesoresService],
  controllers: [ProfesoresController],
})
export class ProfesoresModule {}
