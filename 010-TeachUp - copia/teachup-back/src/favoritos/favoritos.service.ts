import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorito } from './entities/favoritos.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Profesor } from 'src/profesores/entities/profesor.entity';
import { CreateFavoritoDto } from './dtos/create-favorito.dto';
import { DeleteFavoritoDto } from './dtos/delete-favorito.dto';

@Injectable()
export class FavoritosService {
  constructor(
    @InjectRepository(Favorito)
    private readonly repo: Repository<Favorito>,

    @InjectRepository(Usuario)
    private readonly usuariosRepo: Repository<Usuario>,

    @InjectRepository(Profesor)
    private readonly profesoresRepo: Repository<Profesor>,
  ) {}

  async findByUsuario(usuarioId: number) {
  const favoritos = await this.repo.find({
    where: { usuario: { id: usuarioId } },
    relations: ['profesor'],
  });

  return favoritos.map((fav) => {
    const profesor = fav.profesor;

    return {
      ...fav,
      profesor: {
        ...profesor,
        thumbnailUrlPublica: profesor.thumbnailKey
          ? `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${profesor.thumbnailKey}`
          : null,
      },
    };
  });
}


  async create(dto: CreateFavoritoDto) {
    const usuario = await this.usuariosRepo.findOne({
      where: { id: dto.usuario_id },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${dto.usuario_id} no existe`);
    }

    const profesor = await this.profesoresRepo.findOne({
      where: { id: dto.profesor_id },
    });

    if (!profesor) {
      throw new NotFoundException(`Profesor con id ${dto.profesor_id} no existe`);
    }

    const favorito = this.repo.create({
      usuario,
      profesor,
    });

    return this.repo.save(favorito);
  }

  removeById(id: number) {
    return this.repo.delete(id);
  }

  removeByUserAndProfe(dto: DeleteFavoritoDto) {
    return this.repo.delete({
      usuario: { id: dto.usuario_id },
      profesor: { id: dto.profesor_id },
    });
  }
}
