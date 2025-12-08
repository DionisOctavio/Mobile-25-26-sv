import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateProfesorDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsOptional()
  @IsString()
  apellido?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsString()
  @IsNotEmpty()
  titulo_curso: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsString()
  categoria: string;

  @IsOptional()
  @IsNumber()
  experiencia_anios?: number;

  @IsOptional()
  @IsString()
  estudios?: string;

  @IsOptional()
  @IsString()
  imagen_url?: string;

  @IsOptional()
  @IsString()
  video_presentacion_url?: string;

  @IsOptional()
  @IsNumber()
  precio_hora?: number;

  @IsOptional()
  @IsString()
  modalidad?: string;

  @IsOptional()
  @IsString()
  ubicacion?: string;

  @IsOptional()
  @IsString()
  disponibilidad?: string;

  @IsOptional()
  @IsString()
  idiomas?: string;

  @IsOptional()
  @IsString()
  habilidades?: string;

  @IsOptional()
  @IsNumber()
  valoracion?: number;
}
