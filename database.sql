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
  respuesta VARCHAR(50),
  FOREIGN KEY (idEncuesta) REFERENCES Encuesta(idEncuesta)
);
