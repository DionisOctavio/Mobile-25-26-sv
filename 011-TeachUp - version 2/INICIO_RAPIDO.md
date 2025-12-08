# 🚀 Guía de Inicio Rápido - TeachUp

## 📋 Prerrequisitos

- Node.js instalado
- PostgreSQL corriendo (o base de datos configurada)
- Android Studio / Emulador de Android (o dispositivo físico)

---

## 🔧 Paso 1: Iniciar el Backend

### Opción A: Si ya tienes la base de datos configurada

```powershell
cd "d:\Github\Mobile-25-26-sv\011-TeachUp - version 2\teachup-back"
npm install
npm run start:dev
```

### Opción B: Si necesitas crear la base de datos

```powershell
cd "d:\Github\Mobile-25-26-sv\011-TeachUp - version 2\teachup-back"
npm install

# Configurar .env con tu conexión a PostgreSQL
# Ejecutar migraciones si es necesario
npm run start:dev
```

### ✅ Verificar que el backend está corriendo

Deberías ver en la consola:
```
🚀 TeachUp API iniciada correctamente
📡 Servidor corriendo en: http://localhost:3000
📚 Documentación Swagger: http://localhost:3000/docs
📱 Para Android Emulator usar: http://10.0.2.2:3000
```

**Probar en el navegador:**
- Abrir: http://localhost:3000/usuarios
- Deberías ver un JSON con la lista de usuarios

---

## 📱 Paso 2: Iniciar la App Mobile

### En otra terminal:

```powershell
cd "d:\Github\Mobile-25-26-sv\011-TeachUp - version 2\teachup-app"

# Si es la primera vez, instalar dependencias:
npm install

# Iniciar Expo
npm start
```

### Opciones para ejecutar:

1. **Emulador Android:** Presiona `a` en la terminal
2. **Dispositivo físico:** Escanea el código QR con Expo Go
3. **Navegador web:** Presiona `w`

---

## 🎯 Paso 3: Usar la App

### Primera vez:

1. La app abrirá en la **pantalla de selección de roles**
2. Verás 3 usuarios disponibles:
   - **Admin Demo** (ADMIN) - Acceso completo
   - **Profesor Demo** (PROFESOR) - Puede editar
   - **Usuario Demo** (USER) - Usuario estándar

3. Selecciona un usuario para probar las funcionalidades

### Funcionalidades según rol:

#### 👤 Usuario (USER):
- ✅ Ver home con profesores
- ✅ Buscar profesores
- ✅ Ver detalles de profesores
- ✅ Gestionar favoritos
- ✅ Ver y editar perfil

#### 👨‍🏫 Profesor (PROFESOR):
- ✅ Todo lo de USER +
- ✅ Editar información de profesores

#### 🛠️ Administrador (ADMIN):
- ✅ Todo lo anterior +
- ✅ **Panel Admin** (botón central morado con escudo)
- ✅ Crear nuevos profesores
- ✅ Editar cualquier profesor
- ✅ Desactivar profesores
- ✅ Ver estadísticas

---

## 🔍 Solución de Problemas

### ❌ Error 404 en la app:

**Causa:** El backend no está corriendo o la URL es incorrecta

**Solución:**
1. Verificar que el backend esté corriendo en `http://localhost:3000`
2. Probar abrir http://localhost:3000/usuarios en el navegador
3. Si usas emulador Android, la app usará automáticamente `http://10.0.2.2:3000`
4. Si usas dispositivo físico, cambiar la URL en `teachup-app/api/api.js` a tu IP local:
   ```javascript
   baseURL: "http://192.168.1.XXX:3000", // Tu IP local
   ```

### ⚠️ La app funciona sin backend:

La app tiene **datos mock** incorporados, así que puedes probar todas las funcionalidades aunque el backend no esté corriendo. Los datos se guardan localmente en AsyncStorage.

### 🔄 Reiniciar todo:

```powershell
# En la terminal del backend:
Ctrl+C  # Detener
npm run start:dev  # Reiniciar

# En la terminal de la app:
r  # Recargar la app
```

### 🗑️ Limpiar caché:

```powershell
cd "d:\Github\Mobile-25-26-sv\011-TeachUp - version 2\teachup-app"
npm start -- --clear
```

---

## 📚 Documentación Adicional

- **RBAC Implementation:** Ver `teachup-app/RBAC_IMPLEMENTATION.md`
- **Swagger API Docs:** http://localhost:3000/docs (cuando el backend esté corriendo)

---

## 🎨 Endpoints Disponibles

### Usuarios
- `GET /usuarios` - Listar usuarios
- `GET /usuarios/:id` - Usuario por ID
- `POST /usuarios` - Crear usuario
- `PATCH /usuarios/:id` - Actualizar usuario
- `DELETE /usuarios/:id` - Eliminar usuario

### Profesores
- `GET /profesores` - Listar profesores
- `GET /profesores/:id` - Profesor por ID
- `POST /profesores` - Crear profesor
- `PATCH /profesores/:id` - Actualizar profesor
- `DELETE /profesores/:id` - Eliminar profesor

### Favoritos
- `GET /favoritos` - Listar favoritos
- `GET /favoritos/usuario/:id` - Favoritos por usuario
- `POST /favoritos` - Crear favorito
- `DELETE /favoritos/:id` - Eliminar favorito

### Roles
- `GET /roles` - Listar roles
- `GET /roles/:id` - Rol por ID
- `POST /roles` - Crear rol
- `PATCH /roles/:id` - Actualizar rol
- `DELETE /roles/:id` - Eliminar rol

---

## ✨ ¡Listo!

Tu aplicación TeachUp con sistema RBAC completo está funcionando. Disfruta explorando las diferentes funcionalidades según el rol seleccionado. 🎉
