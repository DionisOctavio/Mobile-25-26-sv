import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Categoria } from '../../categorias/entities/categoria.entity';

@Entity({ name: 'libros' })
export class Libro {
  @PrimaryGeneratedColumn({ name: 'id_libro' })
  id_libro: number;

  @Column({ type: 'varchar', length: 200 })
  titulo: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  autor?: string;

  @Column({ type: 'int' })
  paginas: number;

  @Column({ type: 'date', nullable: true })
  fecha_publicacion?: string;

  @Column({ type: 'int', name: 'id_categoria' })
  id_categoria: number;

  // Muchos libros pertenecen a una categoría (lado N de 1:N)
  // Aquí SÍ está la clave foránea real: id_categoria

  @ManyToOne(() => Categoria, (categoria) => categoria.libros)

  @JoinColumn({ name: 'id_categoria' }) // nombre de la columna FK en la tabla libros
  categoria: Categoria;
}