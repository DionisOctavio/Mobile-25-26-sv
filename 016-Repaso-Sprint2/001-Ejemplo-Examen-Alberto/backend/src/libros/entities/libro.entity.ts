import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Reserva } from 'src/reservas/entities/reserva.entity';

@Entity({ name: 'libros' })
export class Libro {

  @PrimaryGeneratedColumn()
  id_libro: number;

  @Column({ length: 100 })
  titulo: string;

  @Column({ length: 100 })
  autor: string;

  // relación preparada para reservas
  @OneToMany(() => Reserva, reserva => reserva.libro)
  reservas: Reserva[];
}
