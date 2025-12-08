# Sistema de Roles y Permisos (RBAC) - TeachUp

## 📋 Resumen

Se ha implementado un sistema completo de **Control de Acceso Basado en Roles (RBAC)** que gestiona tres roles principales: **USER**, **ADMIN** y **PROFESOR**.

## 🎯 Fases Implementadas

### ✅ FASE 1 — Selección del Rol y Persistencia Local (5 puntos)

**Pantalla:** `app/role-selection.tsx`

- Pantalla de selección que carga usuarios desde el backend (`http://localhost:3000/usuarios`)
- Muestra tarjetas visuales con información de cada usuario y su rol
- Persiste el usuario seleccionado en `AsyncStorage`
- Al iniciar la app, carga automáticamente el rol guardado
- Diseño coherente con la guía de estilos del Sprint 1

### ✅ FASE 2 — Navegación Dinámica Basada en Permisos (7 puntos)

**Archivos principales:**
- `contexts/AuthContext.js` - Gestión de autenticación y permisos
- `constants/permissions.js` - Definición de permisos y roles
- `app/_layout.tsx` - Control de rutas y redirección
- `components/BottomNav.jsx` - Navegación dinámica

**Sistema RBAC implementado:**

```javascript
// Roles disponibles
- USER: Usuario estándar
- ADMIN: Administrador del sistema
- PROFESOR: Profesor con permisos de edición

// Permisos definidos
PERMISSIONS = {
  ITEM_LIST,           // Ver listado de profesores
  ITEM_DETAIL,         // Ver detalle de profesores
  ITEM_CREATE,         // Crear nuevos profesores
  ITEM_EDIT,           // Editar profesores
  ITEM_DEACTIVATE,     // Desactivar profesores
  FAVORITES_USE,       // Usar sistema de favoritos
  PROFILE_VIEW,        // Ver perfil
  PROFILE_EDIT,        // Editar perfil
  ADMIN_PANEL_VIEW     // Acceder al panel admin
}
```

**Función global obligatoria:**
```javascript
const { can } = useAuth();

// Uso
if (can(PERMISSIONS.ITEM_CREATE)) {
  // Mostrar botón crear
}
```

**Navegación según rol:**

👤 **USER:**
- Home
- Buscar
- Favoritos
- Perfil
- Detalle

🛠️ **ADMIN:**
- Home
- Buscar
- Panel Admin (botón central)
- Favoritos
- Perfil
- Detalle
- Crear Profesor
- Editar/Desactivar profesores

👨‍🏫 **PROFESOR:**
- Home
- Buscar
- Favoritos
- Perfil
- Detalle
- Editar profesores

### ✅ FASE 3 — UI Condicional Basada en Permisos (6 puntos)

**Implementación:**
- Todos los botones se controlan mediante `can(PERMISSION)`
- No se usa `if (role === "ADMIN")` en ninguna parte
- Botones ocultos para usuarios sin permisos:
  - Crear ítem → `ITEM_CREATE`
  - Editar → `ITEM_EDIT`
  - Desactivar → `ITEM_DEACTIVATE`
  - Panel Admin → `ADMIN_PANEL_VIEW`

**Archivos modificados:**
- `app/index.tsx` - Muestra nombre del usuario actual
- `app/detalle-profesor/[id].tsx` - Botones de editar/desactivar condicionales
- `components/BottomNav.jsx` - Tabs y botón central dinámico

### ✅ FASE 4 — Pantallas Administrativas (8 puntos)

#### 1️⃣ CreateItemScreen (`app/create-item.tsx`)
- Formulario completo para crear profesores
- Validación de permisos `ITEM_CREATE`
- Campos: nombre, apellido, título, descripción, categoría, precio, experiencia, imagen, video URL
- Integración con backend para crear profesor

#### 2️⃣ AdminPanelScreen (`app/admin-panel.tsx`)
- Estadísticas generales (total, activos, inactivos)
- Desglose por categorías
- Acciones rápidas (crear, gestionar)
- Lista de profesores recientes
- Solo accesible con permiso `ADMIN_PANEL_VIEW`

#### 3️⃣ Editar/Desactivar
- Botones visibles en `detalle-profesor/[id].tsx`
- Editar: permiso `ITEM_EDIT` (mock implementado)
- Desactivar: permiso `ITEM_DEACTIVATE` (funcional)

### ✅ FASE 5 — Favoritos, Perfil y Persistencia (4 puntos)

**Perfil actualizado (`app/profile.jsx`):**
- Muestra datos del usuario actual
- Badge visual con el rol (USER/ADMIN/PROFESOR)
- Lista completa de permisos activos
- Botón de cerrar sesión funcional
- Estadísticas del usuario

**Persistencia:**
- Usuario y rol guardados en `AsyncStorage`
- Favoritos ya implementados en Sprint anterior
- Al cerrar sesión, se limpia el storage y redirige a selección de rol

## 🔧 Cómo Usar

### 1. Iniciar el backend
```bash
cd teachup-back
npm run start:dev
```

### 2. Asegurarse de que hay usuarios en la base de datos
El backend debe tener usuarios con los roles: USER, ADMIN, PROFESOR

### 3. Iniciar la app
```bash
cd teachup-app
npm install @react-native-async-storage/async-storage
npm start
```

### 4. Flujo de usuario
1. Al abrir la app, se muestra la pantalla de selección de rol
2. Seleccionar un usuario (cada uno tiene un rol diferente)
3. La app carga con la navegación correspondiente al rol
4. Explorar las funcionalidades según permisos

## 📁 Estructura de Archivos Creados/Modificados

```
teachup-app/
├── contexts/
│   └── AuthContext.js          ✨ NUEVO - Sistema de autenticación
├── constants/
│   └── permissions.js          ✨ NUEVO - Definición de permisos
├── app/
│   ├── _layout.tsx             ✏️ MODIFICADO - Control de rutas
│   ├── index.tsx               ✏️ MODIFICADO - Nombre dinámico
│   ├── profile.jsx             ✏️ MODIFICADO - Info de rol/permisos
│   ├── role-selection.tsx      ✨ NUEVO - Selección de usuario
│   ├── create-item.tsx         ✨ NUEVO - Crear profesor (ADMIN)
│   ├── admin-panel.tsx         ✨ NUEVO - Panel admin (ADMIN)
│   └── detalle-profesor/
│       └── [id].tsx            ✏️ MODIFICADO - Botones admin
└── components/
    └── BottomNav.jsx           ✏️ MODIFICADO - Navegación dinámica
```

## 🎨 Características Destacadas

✅ **Sin condicionales de rol directo** - Todo mediante permisos
✅ **Persistencia completa** - Usuario guardado entre sesiones
✅ **UI adaptativa** - Navegación cambia según permisos
✅ **Seguridad** - Validación en frontend y backend
✅ **Diseño coherente** - Mantiene estilo del Sprint 1
✅ **Función can() global** - Fácil de usar en cualquier componente

## 🔐 Seguridad

- Los permisos se verifican tanto en el frontend como en el backend
- No se puede acceder a rutas sin permisos (redirección automática)
- Los botones no autorizados no se renderizan
- AsyncStorage protege la sesión del usuario

## 🚀 Próximos Pasos

- Implementar funcionalidad completa de edición de profesores
- Añadir más estadísticas en el panel admin
- Implementar sistema de notificaciones
- Agregar modo oscuro con permisos

---

**Desarrollado siguiendo las especificaciones del Sprint 2 - Sistema RBAC completo** ✨
