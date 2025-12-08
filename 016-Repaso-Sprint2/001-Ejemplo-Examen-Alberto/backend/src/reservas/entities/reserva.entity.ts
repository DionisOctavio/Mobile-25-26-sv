import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Libro } from 'src/libros/entities/libro.entity';

@Entity({ name: 'reservas' })
export class Reserva {

  @PrimaryGeneratedColumn()
  id_reserva: number;

  @Column({ type: 'text' })
  fecha: string;

  @ManyToOne(() => Usuario, usuario => usuario.reservas)
  usuario: Usuario;

  @ManyToOne(() => Libro, libro => libro.reservas)
  libro: Libro;
}
