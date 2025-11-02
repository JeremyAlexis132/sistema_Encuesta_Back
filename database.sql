CREATE TABLE `Administrador` (
  `idAministrador` integer PRIMARY KEY AUTOINCREMENT,
  `username` varchar(20),
  `password` varchar(100),
  `correo` varchar(50)
);

CREATE TABLE `Usuario` (
  `idUsuario` integer PRIMARY KEY AUTOINCREMENT,
  `numeroCuenta` varchar(20),
  `password` varchar(100),
  `correo` varchar(50),
  `privateKey` varchar(50)
);

CREATE TABLE `Encuesta` (
  `idEncuesta` integer PRIMARY KEY AUTOINCREMENT,
  `idUsuario` integer
);

CREATE TABLE `Pregunta` (
  `idPregunta` integer PRIMARY KEY AUTOINCREMENT,
  `idEncuesta` integer,
  `pregunta` varchar(50),
  `respuesta` varchar(50)
);

-- Relaciones (Foreign Keys)
ALTER TABLE `Encuesta` ADD FOREIGN KEY (`idUsuario`) REFERENCES `Usuario` (`idUsuario`);
ALTER TABLE `Pregunta` ADD FOREIGN KEY (`idEncuesta`) REFERENCES `Encuesta` (`idEncuesta`);
