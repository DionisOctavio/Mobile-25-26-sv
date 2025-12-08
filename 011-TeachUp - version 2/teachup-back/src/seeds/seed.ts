import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Profesor } from '../profesores/entities/profesor.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const repo: Repository<Profesor> = app.get(getRepositoryToken(Profesor));

  const categorias = ['Matemáticas', 'Inglés', 'Programación', 'Música'];

  for (let i = 1; i <= 30; i++) {
    const profe = repo.create({
      nombre: `Profesor ${i}`,
      apellido: `Apellido ${i}`,
      titulo_curso: `Curso ${i}`,
      descripcion: `Descripción del profesor ${i}`,
      categoria: categorias[i % categorias.length],
      precio_hora: Math.floor(Math.random() * 40) + 10,
      imagen_url: `https://picsum.photos/seed/${i}/300/300`,
    });

    await repo.save(profe);
  }

  await app.close();
}

seed();
