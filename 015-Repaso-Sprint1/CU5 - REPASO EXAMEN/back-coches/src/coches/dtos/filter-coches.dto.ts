import { Type } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";

export class FilterCochesDto {
    
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    categoriaId?: number;

}