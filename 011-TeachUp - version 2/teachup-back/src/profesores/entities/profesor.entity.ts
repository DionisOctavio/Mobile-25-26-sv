import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('profesores')
export class Profesor {
  @PrimaryGeneratedColumn()
  id: number;

  // Datos personales
  @Column({ type: 'text' })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  apellido: string;

  @Column({ type: 'text', nullable: true })
  telefono: string;

  @Column({ type: 'text', nullable: true })
  email: string;

  // Información profesional
  @Column({ type: 'text' })
  titulo_curso: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'text' })
  categoria: string;

  @Column({ type: 'int', nullable: true })
  experiencia_anios: number;

  @Column({ type: 'text', nullable: true })
  estudios: string;

  // Medios
  @Column({ type: 'text', nullable: true })
  imagen_url: string;

  @Column({ type: 'text', nullable: true })
  video_presentacion_url: string;

  // Clases
  @Column({ type: 'float', nullable: true })
  precio_hora: number;

  @Column({ type: 'text', nullable: true })
  modalidad: string;

  @Column({ type: 'text', nullable: true })
  ubicacion: string;

  // Extra
  @Column({ type: 'text', nullable: true })
  disponibilidad: string;

  @Column({ type: 'text', nullable: true })
  idiomas: string;

  @Column({ type: 'text', nullable: true })
  habilidades: string;

  @Column({ type: 'int', nullable: true })
  valoracion: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
