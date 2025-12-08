import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reserva } from './entities/reserva.entity';
import { CreateReservaDto } from './dtos/create-reserva.dto';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Libro } from 'src/libros/entities/libro.entity';

@Injectable()
export class ReservasService {

  constructor(
    @InjectRepository(Reserva)
    private readonly repo: Repository<Reserva>,

    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,

    @InjectRepository(Libro)
    private readonly libroRepo: Repository<Libro>,
  ) {}

  // ✔️ Endpoint usado por el front
  async findByLibro(id_libro: number) {
    return this.repo
      .createQueryBuilder('reserva')
      .leftJoinAndSelect('reserva.usuario', 'usuario')
      .leftJoinAndSelect('reserva.libro', 'libro')
      .where('libro.id_libro = :id', { id: id_libro })
      .getMany();
  }

  // Opcional para debug o listar todo
  async findAll() {
    return this.repo
      .createQueryBuilder('reserva')
      .leftJoinAndSelect('reserva.usuario', 'usuario')
      .leftJoinAndSelect('reserva.libro', 'libro')
      .getMany();
  }

  // ✔️ Crear reserva
  async create(dto: CreateReservaDto) {

    const usuario = await this.usuarioRepo.findOneBy({ id_usuario: dto.id_usuario });
    if (!usuario) {
      throw new NotFoundException(`Usuario ${dto.id_usuario} no existe`);
    }

    const libro = await this.libroRepo.findOneBy({ id_libro: dto.id_libro });
    if (!libro) {
      throw new NotFoundException(`Libro ${dto.id_libro} no existe`);
    }

    const nueva = this.repo.create({
      fecha: dto.fecha,
      usuario,
      libro,
    });

    return this.repo.save(nueva);
  }
}
