import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CochesService } from './coches.service';
import { CreateCocheDto } from './dtos/create-coches.dto';
import { FilterCochesDto } from './dtos/filter-coches.dto';

@Controller('coches')
export class CochesController {

    constructor(
        private cochesService: CochesService
    ){}

    @Get()
    findAll(@Query() filtro?: FilterCochesDto){
        return this.cochesService.findAll(filtro);
    }

    @Post()
    create(@Body() createCocheDto: CreateCocheDto){
        return this.cochesService.create(createCocheDto);
    }
}