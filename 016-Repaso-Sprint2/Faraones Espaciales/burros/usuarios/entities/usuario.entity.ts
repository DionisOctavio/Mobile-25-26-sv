import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Reserva } from 'src/reservas/entities/reserva.entity';

@Entity({ name: 'usuarios' })
export class Usuario {

  @PrimaryGeneratedColumn()
  id_usuario: number;

  @Column({ length: 50 })
  nombre: string;

  // Para la relación futura, no usamos todavía
  @OneToMany(() => Reserva, reserva => reserva.usuario)
  reservas: Reserva[];
}
