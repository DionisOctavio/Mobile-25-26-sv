import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profesor } from './entities/profesor.entity';
import { CreateProfesorDto } from './dtos/create-profesor.dto';
import { UpdateProfesorDto } from './dtos/update-profesor.dto';

@Injectable()
export class ProfesoresService {
  constructor(
    @InjectRepository(Profesor)
    private profesorRepo: Repository<Profesor>,
  ) {}

  findAll() {
    return this.profesorRepo.find();
  }

  findOne(id: number) {
    return this.profesorRepo.findOne({ where: { id } });
  }

  create(dto: CreateProfesorDto) {
    const profesor = this.profesorRepo.create(dto);
    return this.profesorRepo.save(profesor);
  }

  async update(id: number, dto: UpdateProfesorDto) {
    const profesor = await this.profesorRepo.findOne({ where: { id } });

    if (!profesor) throw new Error('Profesor no encontrado');

    Object.assign(profesor, dto);
    return this.profesorRepo.save(profesor);
  }

  remove(id: number) {
    return this.profesorRepo.delete(id);
  }
}
