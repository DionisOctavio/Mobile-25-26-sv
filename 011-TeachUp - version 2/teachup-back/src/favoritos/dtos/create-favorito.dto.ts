import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateFavoritoDto {
  @IsNumber()
  @IsNotEmpty()
  usuario_id: number;

  @IsNumber()
  @IsNotEmpty()
  profesor_id: number;
}
