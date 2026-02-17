import { IsString, Length } from "class-validator";

export class CreateLibroDto {

  @IsString()
  @Length(1, 100)
  titulo: string;

  @IsString()
  @Length(1, 100)
  autor: string;
}
