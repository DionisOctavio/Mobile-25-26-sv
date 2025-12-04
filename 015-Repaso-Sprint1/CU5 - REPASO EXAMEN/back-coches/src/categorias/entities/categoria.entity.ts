import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Coche } from 'src/coches/entities/coche.entity';

@Entity({ name: 'categorias' })
export class Categoria {
  @PrimaryGeneratedColumn({name: 'id_categoria'})
  id: number; 

  @Column({ type: 'varchar', length: 20 , name: 'nombre'})
  nombre: string;

  @Column({ type: 'varchar', length: 50 , name: 'descripcion'})
  descripcion: string;

  @OneToMany(() => Coche, (coche) => coche.categoria)
  coches: Coche[];
}