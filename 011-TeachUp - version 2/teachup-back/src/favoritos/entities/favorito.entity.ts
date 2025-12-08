import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, Unique } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Profesor } from '../../profesores/entities/profesor.entity';

@Entity('favoritos')
@Unique(['usuario', 'profesor'])  // evita duplicados
export class Favorito {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Profesor, (profesor) => profesor.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profesor_id' })
  profesor: Profesor;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
