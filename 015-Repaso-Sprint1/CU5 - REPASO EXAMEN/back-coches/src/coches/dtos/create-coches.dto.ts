
import {
    IsString,
    IsNotEmpty,
    MaxLength
  } from 'class-validator';
  
  export class CreateCocheDto {
    
    @IsString()
    @IsNotEmpty({ message: 'La matricula es obligatoria' })
    @MaxLength(100, { message: 'La matricula no puede tener mas de 100 caracteres' })
    readonly matricula: string;

    @IsString()
    @IsNotEmpty({ message: 'La marca es obligatoria' })
    @MaxLength(100, { message: 'La marca no puede tener mas de 100 caracteres' })
    readonly marca: string;

    @IsString()
    @IsNotEmpty({ message: 'El modelo es obligatorio' })
    @MaxLength(100, { message: 'El modelo no puede tener mas de 100 caracteres' })
    readonly modelo: string;
  
    @IsString()
    @IsNotEmpty({ message: 'La fecha de matriculacion es obligatoria' })
    readonly fecha_matriculacion: string;

    @IsNotEmpty({ message: 'La categoría es obligatoria' })
    readonly id_categoria: number;
  }