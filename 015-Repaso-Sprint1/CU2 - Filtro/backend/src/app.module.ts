import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LibrosModule } from './libros/libros.module';
import { CategoriasService } from './categorias/categorias.service';
import { CategoriasController } from './categorias/categorias.controller';
import { CategoriasModule } from './categorias/categorias.module';
import { DatabaseModule } from './database/database.module';

@Module({
  
  imports: [DatabaseModule,LibrosModule, CategoriasModule],
  controllers: [AppController, CategoriasController],
  providers: [AppService, CategoriasService],
})
export class AppModule {}
