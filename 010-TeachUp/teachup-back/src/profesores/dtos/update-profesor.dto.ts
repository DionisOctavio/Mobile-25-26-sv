import { PartialType } from '@nestjs/mapped-types';
import { CreateProfesorDto } from './create-profesor.dto';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateProfesorDto extends PartialType(CreateProfesorDto) {
  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'thumbnailUrl debe ser una URL válida' })
  thumbnailUrl?: string;
}
