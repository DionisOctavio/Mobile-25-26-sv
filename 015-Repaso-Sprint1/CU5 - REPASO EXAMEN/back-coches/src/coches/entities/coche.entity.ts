import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Categoria } from '../../categorias/entities/categoria.entity';

@Entity({ name: 'coches' })
export class Coche {
  @PrimaryGeneratedColumn({name: 'id_coche'})
  id: number; 

  @Column({ type: 'varchar', length: 20 , name: 'matricula'})
  matricula: string;

  @Column({ type: 'varchar', length: 50 , name: 'marca'})
  marca: string;

  @Column({ type: 'varchar', length: 50 , name: 'modelo'})
  modelo: string;

  @Column({ type: 'varchar', length: 100 ,nullable: true, name: 'nombre_propietario'})
  nombre_propietario?: string;

  @Column({ type: 'varchar', length: 100 ,nullable: true, name: 'apellido_propietario'})
  apellido_propietario?: string;

  @Column({ type: 'date', name: 'fecha_matriculacion'})
  fecha_matriculacion: Date;

  @ManyToOne(() => Categoria, (categoria) => categoria.coches)

  @JoinColumn({ name: 'id_categoria' })
  categoria: Categoria;
}