/* ============================================
   TABLA ROLES
   ============================================ */
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre TEXT UNIQUE NOT NULL,   -- USER / ADMIN / PROFESOR
    descripcion TEXT
);

/* ============================================
   TABLA USUARIOS
   ============================================ */
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    apellido TEXT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    rol_id INTEGER,  -- Rol asignado al usuario
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_rol_usuario
        FOREIGN KEY (rol_id)
        REFERENCES roles(id)
        ON DELETE SET NULL
);

/* ============================================
   TABLA PROFESORES
   ============================================ */
CREATE TABLE profesores (
    id SERIAL PRIMARY KEY,

    -- Datos personales
    nombre TEXT NOT NULL,
    apellido TEXT,
    telefono TEXT,
    email TEXT,

    -- Información profesional
    titulo_curso TEXT NOT NULL,
    descripcion TEXT,
    categoria TEXT NOT NULL,

    experiencia_anios INTEGER,
    estudios TEXT,

    -- Medios
    imagen_url TEXT,
    video_presentacion_url TEXT,

    -- Clases
    precio_hora REAL,
    modalidad TEXT,            -- online / presencial / mixto
    ubicacion TEXT,

    -- Info extra
    disponibilidad TEXT,
    idiomas TEXT,
    habilidades TEXT,
    valoracion INTEGER,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* ============================================
   TABLA FAVORITOS
   ============================================ */
CREATE TABLE favoritos (
    id SERIAL PRIMARY KEY,

    usuario_id INTEGER NOT NULL,
    profesor_id INTEGER NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_usuario
        FOREIGN KEY(usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_profesor
        FOREIGN KEY(profesor_id)
        REFERENCES profesores(id)
        ON DELETE CASCADE,

    -- Evita duplicados
    CONSTRAINT unico_favorito UNIQUE(usuario_id, profesor_id)
);



/* ============================================
   DATOS INICIALES DE ROLES
   ============================================ */
INSERT INTO roles (nombre, descripcion) VALUES
('USER', 'Usuario estándar de TeachUp'),
('ADMIN', 'Administrador con control total'),
('PROFESOR', 'Rol asignado a profesores (opcional)');
