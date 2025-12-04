import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Favorito } from 'src/favoritos/entities/favoritos.entity';

@Entity('profesores')
export class Profesor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  apellido: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column()
  categoria: string;

  @Column('real')
  precio_hora: number;

  @Column({ nullable: true })
  thumbnailKey: string;

  // 🔥 CAMPOS NUEVOS
  @Column({ nullable: true })
  telefono: string;

  @Column({ nullable: true })
  email: string;

  @Column({ default: 'Curso no especificado' })
  titulo_curso: string;

  @Column({ nullable: true })
  experiencia_anios: number;

  @Column({ nullable: true })
  estudios: string;

  @Column({ nullable: true })
  video_presentacion_url: string;

  @Column({ default: 'online' })
  modalidad: string;

  @Column({ nullable: true })
  ubicacion: string;

  @Column({ nullable: true })
  disponibilidad: string;

  @Column({ nullable: true })
  idiomas: string;

  @Column({ nullable: true })
  habilidades: string;

  @Column({ default: 0 })
  valoracion: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @OneToMany(() => Favorito, (fav) => fav.profesor)
  favoritos: Favorito[];
}
