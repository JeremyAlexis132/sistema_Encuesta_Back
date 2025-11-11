CREATE TABLE Administrador (
  idAdministrador INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(20) NOT NULL,
  password VARCHAR(100) NOT NULL,
  correo VARCHAR(50) NOT NULL
);

CREATE TABLE Usuario (
  idUsuario INT AUTO_INCREMENT PRIMARY KEY,
  numeroCuenta VARCHAR(20) NOT NULL,
  password VARCHAR(100) NOT NULL,
  correo VARCHAR(50) NOT NULL,
  privateKey VARCHAR(50) NOT NULL
);

CREATE TABLE Encuesta (
  idEncuesta INT AUTO_INCREMENT PRIMARY KEY,
  idUsuario INT,
  FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario)
);

CREATE TABLE Pregunta (
  idPregunta INT AUTO_INCREMENT PRIMARY KEY,
  idEncuesta INT,
  pregunta VARCHAR(50) NOT NULL,
  FOREIGN KEY (idEncuesta) REFERENCES Encuesta(idEncuesta)
);

-- CAMBIOS APLICADOS A LA BASE DE DATOS
-- =====================================

-- 1. Eliminar columna 'respuesta' de la tabla Pregunta (si aún existe)
ALTER TABLE Pregunta DROP COLUMN IF EXISTS respuesta;

-- 2. Crear nueva tabla Respuesta
CREATE TABLE IF NOT EXISTS Respuesta (
  idRespuesta INT AUTO_INCREMENT PRIMARY KEY,
  idPregunta INT NOT NULL,
  idUsuario INT NOT NULL,
  respuesta TEXT NOT NULL,
  fechaRespuesta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (idPregunta) REFERENCES Pregunta(idPregunta) ON DELETE CASCADE,
  FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario) ON DELETE CASCADE,
  UNIQUE KEY unique_respuesta (idPregunta, idUsuario)
);

-- 3. Crear índices para optimizar búsquedas
CREATE INDEX idx_respuesta_pregunta ON Respuesta(idPregunta);
CREATE INDEX idx_respuesta_usuario ON Respuesta(idUsuario);

