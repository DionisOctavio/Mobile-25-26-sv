import { IsDateString, IsInt } from "class-validator";
import { Type } from "class-transformer";

export class CreateReservaDto {

  @Type(() => Number)
  @IsInt()
  id_usuario: number;

  @Type(() => Number)
  @IsInt()
  id_libro: number;

  @IsDateString()
  fecha: string;
}
