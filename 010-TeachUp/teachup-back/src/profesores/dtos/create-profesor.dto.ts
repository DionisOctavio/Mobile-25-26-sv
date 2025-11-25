import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  Min,
  IsNumber,
  IsOptional,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProfesorDto {
  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(50)
  readonly nombre: string;

  @IsString()
  @MaxLength(50)
  @IsOptional()
  readonly apellido?: string;

  @IsString()
  @MaxLength(300)
  @IsOptional()
  readonly descripcion?: string;

  @IsString()
  @IsNotEmpty({ message: 'La categoría es obligatoria' })
  readonly categoria: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0, { message: 'El precio mínimo es 0€' })
  readonly precio_hora: number;

  @IsString()
  @IsOptional()
  readonly thumbnailKey?: string;

  // 🔥 CAMPOS NUEVOS
  @IsString()
  @IsOptional()
  readonly telefono?: string;

  @IsEmail()
  @IsOptional()
  readonly email?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  readonly titulo_curso: string;

  @Type(() => Number)
  @IsOptional()
  readonly experiencia_anios?: number;

  @IsString()
  @IsOptional()
  readonly estudios?: string;

  @IsString()
  @IsOptional()
  readonly video_presentacion_url?: string;

  @IsString()
  @IsOptional()
  readonly modalidad?: string;

  @IsString()
  @IsOptional()
  readonly ubicacion?: string;

  @IsString()
  @IsOptional()
  readonly disponibilidad?: string;

  @IsString()
  @IsOptional()
  readonly idiomas?: string;

  @IsString()
  @IsOptional()
  readonly habilidades?: string;

  @Type(() => Number)
  @IsOptional()
  @Min(0)
  readonly valoracion?: number;
}
