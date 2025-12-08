import { Injectable } from '@nestjs/common';
import { Libro } from './entities/libro.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLibroDto } from './dtos/create-libro.dto';

@Injectable()
export class LibrosService {

  constructor(
    @InjectRepository(Libro)
    private readonly repo: Repository<Libro>,
  ) {}

  // ✔️ Usado por la primera FlatList
  async findAll() {
    return this.repo.find();
  }

  // ✔️ Insertar libros
  async create(dto: CreateLibroDto) {
    const nuevo = this.repo.create(dto);
    return this.repo.save(nuevo);
  }
}
