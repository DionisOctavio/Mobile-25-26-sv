import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { LibrosModule } from './libros/libros.module';
import { ReservasModule } from './reservas/reservas.module';

@Module({
  imports: [DatabaseModule, UsuariosModule, LibrosModule, ReservasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
