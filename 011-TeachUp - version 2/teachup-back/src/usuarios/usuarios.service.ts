import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dtos/create-usuario.dto';
import { UpdateUsuarioDto } from './dtos/update-usuario.dto';
import { Role } from '../roles/entities/role.entity';

@Injectable()
export class UsuariosService {
    constructor(
        @InjectRepository(Usuario)
        private usuarioRepo: Repository<Usuario>,

        @InjectRepository(Role)
        private roleRepo: Repository<Role>,
    ) {}

    findAll() {
        return this.usuarioRepo.find({ relations: ['rol'] });
    }

    findOne(id: number) {
        return this.usuarioRepo.findOne({ where: { id }, relations: ['rol'] });
    }

    async create(dto: CreateUsuarioDto) {
    const usuario: Usuario = this.usuarioRepo.create(dto) as Usuario;

    if (dto.rol_id) {
        usuario.rol = await this.roleRepo.findOne({ where: { id: dto.rol_id } });
    }

    return this.usuarioRepo.save(usuario);
    }

    async update(id: number, dto: UpdateUsuarioDto) {
    const usuario = await this.usuarioRepo.findOne({ where: { id } }) as Usuario;

    if (!usuario) {
        throw new Error('Usuario no encontrado');
    }

    Object.assign(usuario, dto);

    if (dto.rol_id) {
        usuario.rol = await this.roleRepo.findOne({ where: { id: dto.rol_id } });
    }

    return this.usuarioRepo.save(usuario);
    }


    async remove(id: number) {
        return this.usuarioRepo.delete(id);
    }
}
