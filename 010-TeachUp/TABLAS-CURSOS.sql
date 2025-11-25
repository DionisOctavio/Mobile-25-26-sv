-- TABLA USUARIOS
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    apellido TEXT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE profesores (
    id SERIAL PRIMARY KEY,

    -- Datos personales básicos
    nombre TEXT NOT NULL,
    apellido TEXT,
    telefono TEXT,
    email TEXT,

    -- Información profesional
    titulo_curso TEXT NOT NULL,         -- Ej: "Profesor de Matemáticas ESO"
    descripcion TEXT,
    categoria TEXT NOT NULL,            -- Matemáticas, Inglés…

    experiencia_anios INTEGER,          -- Ej: 3 (años de experiencia)
    estudios TEXT,                      -- Ej: "Grado en Matemáticas"

    -- Medios
    imagen_url TEXT,                    -- Foto del profesor
    video_presentacion_url TEXT,        -- Opcional: video de presentación

    -- Clases
    precio_hora REAL,
    modalidad TEXT,                     -- "online" / "presencial" / "mixto"
    ubicacion TEXT,                     -- Ciudad o zona

    -- Extra útil para perfil
    disponibilidad TEXT,                -- Ej: "Lunes a viernes: 17:00–20:00"
    idiomas TEXT,                       -- Texto simple: "Español, Inglés"
    habilidades TEXT,        
    valoracion INTEGER,                    -- Texto simple: "Java, ESO, programación básica"

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- TABLA FAVORITOS
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

    CONSTRAINT unico_favorito UNIQUE(usuario_id, profesor_id)
);