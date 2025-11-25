import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Libro } from './entities/libro.entity';
import { CreateLibroDto } from '../libros/dtos/create-libro.dto';
import { UpdateLibroDto } from '../libros/dtos/update-libro.dto';

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

  // GET /libros?search=algo&categoriaId=1
  findAll(search?: string, categoriaId?: number) {
    const qb = this.libroRepo
        .createQueryBuilder('libro')
        .leftJoinAndSelect('libro.categoria', 'categoria');

    if (search) {
        qb.andWhere(
        '(LOWER(libro.titulo) LIKE :search OR LOWER(libro.autor) LIKE :search)',
        { search: `%${search.toLowerCase()}%` },
        );
    }

    if (categoriaId) {
        qb.andWhere('libro.id_categoria = :categoriaId', { categoriaId });
    }

    qb.orderBy('libro.titulo', 'ASC');

    return qb.getMany();
    }

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

  async update(id: number, dto: UpdateLibroDto) {
    const libro = await this.findOne(id);
    Object.assign(libro, dto);
    return this.libroRepo.save(libro);
  }

  async remove(id: number) {
    const libro = await this.findOne(id);
    return this.libroRepo.remove(libro);
  }
}
