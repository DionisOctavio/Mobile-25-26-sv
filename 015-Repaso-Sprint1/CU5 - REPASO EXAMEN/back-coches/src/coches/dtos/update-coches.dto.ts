import { PartialType } from '@nestjs/mapped-types';
import { CreateCocheDto } from './create-coches.dto';
export class UpdateCocheDto extends PartialType(CreateCocheDto) {}