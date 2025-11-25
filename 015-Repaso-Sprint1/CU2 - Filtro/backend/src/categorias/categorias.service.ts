import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { CreateCategoriaDto } from '../categorias/dtos/create-categoria.dto';
import { UpdateCategoriaDto } from '../categorias/dtos/update-categoria.dto';

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

  // GET /categorias?search=algo
  findAll(search?: string) {
    if (search) {
      return this.categoriaRepo.find({
        where: { nombre: ILike(`%${search}%`) },
        order: { nombre: 'ASC' },
      });
    }

    return this.categoriaRepo.find({
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number) {
    const categoria = await this.categoriaRepo.findOne({
      where: { id_categoria: id },
    });

    if (!categoria) {
      throw new NotFoundException('Categoría no encontrada');
    }

    return categoria;
  }

  async update(id: number, dto: UpdateCategoriaDto) {
    const categoria = await this.findOne(id);
    Object.assign(categoria, dto);
    return this.categoriaRepo.save(categoria);
  }

  async remove(id: number) {
    const categoria = await this.findOne(id);
    return this.categoriaRepo.remove(categoria);
  }
}
