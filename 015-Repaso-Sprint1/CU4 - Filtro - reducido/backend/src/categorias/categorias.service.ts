import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { CreateCategoriaDto } from './dtos/create-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepo: Repository<Categoria>,
  ) {}

  create(dto: CreateCategoriaDto) {
    const categoria = this.categoriaRepo.create(dto);
    return this.categoriaRepo.save(categoria);
  }

  // GET /categorias
  findAll() {
    return this.categoriaRepo.find({
      order: { nombre: 'ASC' },
    });
  }
}