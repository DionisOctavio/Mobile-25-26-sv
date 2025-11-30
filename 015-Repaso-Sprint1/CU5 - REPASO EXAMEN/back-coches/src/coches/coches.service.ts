import { Injectable, NotFoundException } from '@nestjs/common';
import { Coche } from './entities/coche.entity';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { Repository } from 'typeorm';
import { CreateCocheDto } from './dtos/create-coches.dto';
import { Categoria } from 'src/categorias/entities/categoria.entity';
import { FilterCochesDto } from './dtos/filter-coches.dto';


@Injectable()
export class CochesService {

    constructor(
        @InjectRepository(Coche)
        private readonly repo:Repository<Coche>,
        @InjectRepository(Categoria)
        private readonly categoriaRepo: Repository<Categoria>,
    ){}

    async findAll(filtro?: FilterCochesDto) {
        const qb = this.repo
            .createQueryBuilder('coche')
            .leftJoinAndSelect('coche.categoria', 'categoria');
        if (filtro?.categoriaId) {
            qb.where('categoria.id_categoria = :categoriaId', {
            categoriaId: filtro.categoriaId,
            });
        }
        return qb.getMany();
    }

    async create(dto: CreateCocheDto) {
        const nuevoCoche = this.repo.create(dto);
        if (dto.id_categoria) {
            const categoria = await this.categoriaRepo.findOneBy({
                id: dto.id_categoria,
            });
            if (!categoria) {
            throw new NotFoundException(`La categoría con id ${dto.id_categoria} no existe`);
            }
            nuevoCoche.categoria = categoria;
        }
        return this.repo.save(nuevoCoche);
    }


}