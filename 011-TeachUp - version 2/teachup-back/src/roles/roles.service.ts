import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
  ) {}

  findAll() {
    return this.roleRepo.find({ relations: ['usuarios'] });
  }

  findOne(id: number) {
    return this.roleRepo.findOne({ where: { id }, relations: ['usuarios'] });
  }

  async create(dto: CreateRoleDto) {
    const role = this.roleRepo.create(dto);
    return this.roleRepo.save(role);
  }

  async update(id: number, dto: UpdateRoleDto) {
    const role = await this.roleRepo.findOne({ where: { id } });

    if (!role) throw new Error('Rol no encontrado');

    Object.assign(role, dto);

    return this.roleRepo.save(role);
  }

  async remove(id: number) {
    return this.roleRepo.delete(id);
  }
}
