import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Profesor } from 'src/profesores/entities/profesor.entity';

@Entity('favoritos')
export class Favorito {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.favoritos, { onDelete: 'CASCADE' })
  usuario: Usuario;

  @ManyToOne(() => Profesor, (profe) => profe.favoritos, { onDelete: 'CASCADE' })
  profesor: Profesor;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
