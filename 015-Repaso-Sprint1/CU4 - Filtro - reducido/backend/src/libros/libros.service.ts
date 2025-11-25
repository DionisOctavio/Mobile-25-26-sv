// libros.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Libro } from './entities/libro.entity';
import { CreateLibroDto } from './dtos/create-libro.dto';
import { UpdateLibroDto } from './dtos/update-libro.dto';

@Injectable()
export class LibrosService {
  constructor(
    @InjectRepository(Libro)
    private readonly libroRepo: Repository<Libro>,
  ) {}

  create(dto: CreateLibroDto) {
    const libro = this.libroRepo.create(dto);
    return this.libroRepo.save(libro);
  }

  // GET /libros?categoriaId=1
  findAll(categoriaId?: number) {
    const where = categoriaId ? { id_categoria: categoriaId } : {};
    return this.libroRepo.find({
      where,
      relations: ['categoria'],
      order: { titulo: 'ASC' },
    });
  }

  // GET /libros/1
  async findOne(id: number) {
    const libro = await this.libroRepo.findOne({
      where: { id_libro: id },
      relations: ['categoria'],
    });

    if (!libro) {
      throw new NotFoundException('Libro no encontrado');
    }

    return libro;
  }

  // Lo mas basico
  async update(id: number, dto: UpdateLibroDto) {
    const libro = await this.findOne(id);
    Object.assign(libro, dto);
    return this.libroRepo.save(libro);
  }

  // Lo mas basico
  async remove(id: number) {
    const libro = await this.findOne(id);
    return this.libroRepo.remove(libro);
  }
}