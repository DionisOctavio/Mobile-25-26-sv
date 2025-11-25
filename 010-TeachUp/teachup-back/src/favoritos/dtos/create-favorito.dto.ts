import { IsNumber, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFavoritoDto {
  @Type(() => Number)
  @IsNumber({}, { message: 'usuario_id debe ser un número' })
  @IsNotEmpty({ message: 'usuario_id es obligatorio' })
  readonly usuario_id: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'profesor_id debe ser un número' })
  @IsNotEmpty({ message: 'profesor_id es obligatorio' })
  readonly profesor_id: number;
}
