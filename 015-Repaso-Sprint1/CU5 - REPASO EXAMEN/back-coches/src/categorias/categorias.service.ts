import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { CreateCategoriaDto } from './dtos/create-categorias.dto';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private readonly repo: Repository<Categoria>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  async create(createCategoriaDto: CreateCategoriaDto) {
    const nuevaCategoria = this.repo.create(createCategoriaDto);
    return this.repo.save(nuevaCategoria);
  }
}