import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString } from "class-validator";

export class FilterLibrosDto {
  
  @IsOptional()
  @IsString()
  autor?: string;
}
