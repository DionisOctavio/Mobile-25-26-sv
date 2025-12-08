import { Injectable } from '@nestjs/common';
import { Usuario } from './entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsuarioDto } from './dtos/create-usuario.dto';

@Injectable()
export class UsuariosService {

  constructor(
    @InjectRepository(Usuario)
    private readonly repo: Repository<Usuario>,
  ) {}

  async findAll() {
    const qb = this.repo.createQueryBuilder('usuario');
    return qb.getMany();
  }

  async create(dto: CreateUsuarioDto) {
    const nuevo = this.repo.create(dto);
    return this.repo.save(nuevo);
  }
}