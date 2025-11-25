import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Libro } from '../../libros/entities/libro.entity';

@Entity({ name: 'categorias' })
export class Categoria {
  @PrimaryGeneratedColumn({ name: 'id_categoria' })
  id_categoria: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @OneToMany(() => Libro, (libro) => libro.categoria)
  libros: Libro[];
}
