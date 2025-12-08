import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ProfesoresModule } from './profesores/profesores.module';
import { FavoritosModule } from './favoritos/favoritos.module';
import { UploadsModule } from './uploads/uploads.module';
import { MulterModule } from '@nestjs/platform-express'; // <-- IMPORTANTE
import { RolesModule } from './roles/roles.module';


@Module({
  imports: [
    DatabaseModule,
    UsuariosModule,
    ProfesoresModule,
    FavoritosModule,
    UploadsModule,

    // 🔵 NECESARIO PARA MULTIPART-FORMDATA (SUBIDA DE IMÁGENES)
    MulterModule.register({
      limits: { fileSize: 5 * 1024 * 1024 }, // Máximo 5MB
    }),

    RolesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
