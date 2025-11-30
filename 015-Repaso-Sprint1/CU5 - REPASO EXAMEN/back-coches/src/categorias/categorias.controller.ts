import { Controller, Post, Body, Get } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dtos/create-categorias.dto';

@Controller('categorias')
export class CategoriasController {

    constructor(
        private categoriaService: CategoriasService
    ){}

    @Get()
    findAll(){
        return this.categoriaService.findAll();
    }

    @Post()
    create(@Body() createCategoriaDto: CreateCategoriaDto){
        return this.categoriaService.create(createCategoriaDto);
    }

}
