import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoriaDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la categoría es obligatorio' })
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;
}
