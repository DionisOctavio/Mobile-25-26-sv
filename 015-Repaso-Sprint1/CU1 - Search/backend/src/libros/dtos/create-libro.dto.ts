import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLibroDto {
  @IsString()
  @IsNotEmpty({ message: 'El título es obligatorio' })
  titulo: string;

  @IsString()
  @IsOptional()
  autor?: string;

  @Type(() => Number)
  @IsInt({ message: 'Las páginas deben ser un número entero' })
  paginas: number;

  @IsDateString()
  @IsOptional()
  fecha_publicacion?: string;

  @Type(() => Number)
  @IsInt({ message: 'La categoría es obligatoria y debe ser numérica' })
  id_categoria: number;
}
