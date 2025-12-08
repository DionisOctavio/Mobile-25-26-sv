// Script para crear usuarios de prueba vía API
// Ejecutar con: node crear-usuarios.js

const axios = require('axios');

const API_URL = 'http://localhost:3000';

const usuarios = [
  {
    nombre: 'Ana',
    apellido: 'Martínez',
    email: 'ana.martinez@teachup.com',
    password: '123456',
    rol_id: 1, // USER
  },
  {
    nombre: 'Carlos',
    apellido: 'García',
    email: 'carlos.garcia@teachup.com',
    password: '123456',
    rol_id: 2, // ADMIN
  },
  {
    nombre: 'Laura',
    apellido: 'Rodríguez',
    email: 'laura.rodriguez@teachup.com',
    password: '123456',
    rol_id: 3, // PROFESOR
  },
];

async function crearUsuarios() {
  console.log('🌱 Creando usuarios de prueba...\n');

  for (const usuario of usuarios) {
    try {
      const response = await axios.post(`${API_URL}/usuarios`, usuario);
      console.log(`✅ Usuario creado: ${usuario.nombre} ${usuario.apellido} (${usuario.email})`);
      console.log(`   ID: ${response.data.id}, Rol ID: ${response.data.rol_id}\n`);
    } catch (error) {
      if (error.response?.status === 409 || error.response?.data?.message?.includes('duplicate')) {
        console.log(`⚠️  Usuario ya existe: ${usuario.email}\n`);
      } else {
        console.error(`❌ Error creando ${usuario.email}:`, error.message);
        if (error.response?.data) {
          console.error('   Detalles:', error.response.data);
        }
        console.log('');
      }
    }
  }

  console.log('✅ Proceso completado');
}

crearUsuarios().catch((err) => {
  console.error('❌ Error fatal:', err.message);
  process.exit(1);
});
