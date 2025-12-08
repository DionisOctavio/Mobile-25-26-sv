import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorito } from './entities/favorito.entity';
import { CreateFavoritoDto } from './dtos/create-favorito.dto';
import { UpdateFavoritoDto } from './dtos/update-favorito.dto';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Profesor } from '../profesores/entities/profesor.entity';

@Injectable()
export class FavoritosService {
  constructor(
    @InjectRepository(Favorito)
    private favoritoRepo: Repository<Favorito>,

    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,

    @InjectRepository(Profesor)
    private profesorRepo: Repository<Profesor>,
  ) {}

  findAll() {
    return this.favoritoRepo.find({
      relations: ['usuario', 'profesor'],
    });
  }

  findByUsuario(usuarioId: number) {
    return this.favoritoRepo.find({
      where: { usuario: { id: usuarioId } },
      relations: ['profesor'],
    });
  }

  async create(dto: CreateFavoritoDto) {
    const usuario = await this.usuarioRepo.findOne({ where: { id: dto.usuario_id } });
    const profesor = await this.profesorRepo.findOne({ where: { id: dto.profesor_id } });

    if (!usuario) throw new Error('Usuario no encontrado');
    if (!profesor) throw new Error('Profesor no encontrado');

    const favorito = this.favoritoRepo.create({ usuario, profesor });

    return this.favoritoRepo.save(favorito);
  }

  async remove(id: number) {
    return this.favoritoRepo.delete(id);
  }
}
