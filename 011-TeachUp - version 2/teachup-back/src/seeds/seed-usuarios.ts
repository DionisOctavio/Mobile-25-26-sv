import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Role } from '../roles/entities/role.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

async function seedUsuarios() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usuarioRepo: Repository<Usuario> = app.get(getRepositoryToken(Usuario));
  const roleRepo: Repository<Role> = app.get(getRepositoryToken(Role));

  // Obtener los roles existentes
  const roleUser = await roleRepo.findOne({ where: { nombre: 'USER' } });
  const roleAdmin = await roleRepo.findOne({ where: { nombre: 'ADMIN' } });
  const roleProfesor = await roleRepo.findOne({ where: { nombre: 'PROFESOR' } });

  if (!roleUser || !roleAdmin || !roleProfesor) {
    console.error('❌ Los roles no existen. Ejecuta primero el SQL para crear los roles.');
    await app.close();
    return;
  }

  // Crear usuarios de prueba
  const usuarios = [
    {
      nombre: 'Ana',
      apellido: 'Martínez',
      email: 'ana.martinez@teachup.com',
      password: '123456',
      rol_id: roleUser.id,
    },
    {
      nombre: 'Carlos',
      apellido: 'García',
      email: 'carlos.garcia@teachup.com',
      password: '123456',
      rol_id: roleAdmin.id,
    },
    {
      nombre: 'Laura',
      apellido: 'Rodríguez',
      email: 'laura.rodriguez@teachup.com',
      password: '123456',
      rol_id: roleProfesor.id,
    },
  ];

  console.log('🌱 Creando usuarios de prueba...');

  for (const userData of usuarios) {
    const existente = await usuarioRepo.findOne({ where: { email: userData.email } });
    
    if (!existente) {
      const usuario = usuarioRepo.create(userData);
      await usuarioRepo.save(usuario);
      console.log(`✅ Usuario creado: ${userData.nombre} ${userData.apellido} (${userData.email})`);
    } else {
      console.log(`⚠️  Usuario ya existe: ${userData.email}`);
    }
  }

  console.log('✅ Seed de usuarios completado');
  await app.close();
}

seedUsuarios().catch((err) => {
  console.error('❌ Error en seed:', err);
  process.exit(1);
});
