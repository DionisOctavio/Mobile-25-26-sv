import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoriaDto } from './create-categorias.dto';
export class UpdateCategoriaDto extends PartialType(CreateCategoriaDto) {}