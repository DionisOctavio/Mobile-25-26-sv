import { IsString, Length } from 'class-validator';

export class CreateUsuarioDto {

  @IsString()
  @Length(1, 50)
  nombre: string;
}
