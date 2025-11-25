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

  // Una categoría puede tener muchos libros (relación 1:N)
  // Este lado NO tiene columna real en la base de datos.
  // Solo sirve para poder acceder a categoria.libros en el código.
  
  @OneToMany(() => Libro, (libro) => libro.categoria)
  libros: Libro[];
}
