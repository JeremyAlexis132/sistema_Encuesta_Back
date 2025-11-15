
--
-- Base de datos: `criptografia`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Administrador`
--

CREATE TABLE `Administrador` (
  `idAdministrador` int NOT NULL,
  `username` varchar(20) NOT NULL,
  `password` varchar(100) NOT NULL,
  `correo` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `Administrador`
--

INSERT INTO `Administrador` (`idAdministrador`, `username`, `password`, `correo`) VALUES
(1, 'admin', '$2b$10$WTxlE5DC6ba1OdXF0QUJfuvqNGgeN7RPUgA6scomr0mQiR.L/gpgu', 'admin@criptografia.com');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Encuesta`
--

CREATE TABLE `Encuesta` (
  `idEncuesta` int NOT NULL,
  `nombre` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `EncuestaAsignada`
--

CREATE TABLE `EncuestaAsignada` (
  `idEncuestaAsignada` int NOT NULL,
  `idEncuesta` int NOT NULL,
  `idUsuario` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `OpcionRespuesta`
--

CREATE TABLE `OpcionRespuesta` (
  `idOpcionRespuesta` int NOT NULL,
  `idPregunta` int NOT NULL,
  `opcion` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Pregunta`
--

CREATE TABLE `Pregunta` (
  `idPregunta` int NOT NULL,
  `idEncuesta` int NOT NULL,
  `texto` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Respuesta`
--

CREATE TABLE `Respuesta` (
  `idRespuesta` int NOT NULL,
  `idUsuario` int NOT NULL,
  `idPregunta` int NOT NULL,
  `fechaRespuesta` timestamp NOT NULL,
  `idOpcionRespuesta` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Usuario`
--

CREATE TABLE `Usuario` (
  `idUsuario` int NOT NULL,
  `numeroCuenta` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `correo` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `privateKey` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `Usuario`
--

INSERT INTO `Usuario` (`idUsuario`, `numeroCuenta`, `correo`, `privateKey`, `password`) VALUES
(1, 'A00789012', 'newuser@test.com', '541b7a13392ca654db06326606dea1e8ef83d2753ff7b746411f5d45620bc570', '$2b$10$RLvEoOs1SUAcOWCpUk2nGusJml4sFdxigTHQs1kyF046/89Dj/Br.'),
(2, 'PruebaFront', 'pruebafront@gmail.com', '5e70a7d3790c21fba09dfd07f5a72b4f9348ebff84d4e01c2fa5ec2a0e0032f0', '$2b$10$MDkHLNNSjFzYBsfPFIcxkeMbYHDPr85slprRoA85AEEs5YDN/ayE2');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `Administrador`
--
ALTER TABLE `Administrador`
  ADD PRIMARY KEY (`idAdministrador`);

--
-- Indices de la tabla `Encuesta`
--
ALTER TABLE `Encuesta`
  ADD PRIMARY KEY (`idEncuesta`);

--
-- Indices de la tabla `EncuestaAsignada`
--
ALTER TABLE `EncuestaAsignada`
  ADD PRIMARY KEY (`idEncuestaAsignada`),
  ADD KEY `fk_ea_encuesta` (`idEncuesta`),
  ADD KEY `fk_ea_usuario` (`idUsuario`);

--
-- Indices de la tabla `OpcionRespuesta`
--
ALTER TABLE `OpcionRespuesta`
  ADD PRIMARY KEY (`idOpcionRespuesta`),
  ADD KEY `fk_opr_pregunta` (`idPregunta`);

--
-- Indices de la tabla `Pregunta`
--
ALTER TABLE `Pregunta`
  ADD PRIMARY KEY (`idPregunta`),
  ADD KEY `fk_preg_enca` (`idEncuesta`);

--
-- Indices de la tabla `Respuesta`
--
ALTER TABLE `Respuesta`
  ADD PRIMARY KEY (`idRespuesta`),
  ADD KEY `fk_resp_usuario` (`idUsuario`),
  ADD KEY `fk_resp_preg` (`idPregunta`),
  ADD KEY `fk_resp_opcion` (`idOpcionRespuesta`);

--
-- Indices de la tabla `Usuario`
--
ALTER TABLE `Usuario`
  ADD PRIMARY KEY (`idUsuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `Administrador`
--
ALTER TABLE `Administrador`
  MODIFY `idAdministrador` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `Encuesta`
--
ALTER TABLE `Encuesta`
  MODIFY `idEncuesta` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `EncuestaAsignada`
--
ALTER TABLE `EncuestaAsignada`
  MODIFY `idEncuestaAsignada` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `OpcionRespuesta`
--
ALTER TABLE `OpcionRespuesta`
  MODIFY `idOpcionRespuesta` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `Pregunta`
--
ALTER TABLE `Pregunta`
  MODIFY `idPregunta` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `Respuesta`
--
ALTER TABLE `Respuesta`
  MODIFY `idRespuesta` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `Usuario`
--
ALTER TABLE `Usuario`
  MODIFY `idUsuario` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `EncuestaAsignada`
--
ALTER TABLE `EncuestaAsignada`
  ADD CONSTRAINT `fk_ea_encuesta` FOREIGN KEY (`idEncuesta`) REFERENCES `Encuesta` (`idEncuesta`),
  ADD CONSTRAINT `fk_ea_usuario` FOREIGN KEY (`idUsuario`) REFERENCES `Usuario` (`idUsuario`);

--
-- Filtros para la tabla `OpcionRespuesta`
--
ALTER TABLE `OpcionRespuesta`
  ADD CONSTRAINT `fk_opr_pregunta` FOREIGN KEY (`idPregunta`) REFERENCES `Pregunta` (`idPregunta`);

--
-- Filtros para la tabla `Pregunta`
--
ALTER TABLE `Pregunta`
  ADD CONSTRAINT `fk_preg_enca` FOREIGN KEY (`idEncuesta`) REFERENCES `Encuesta` (`idEncuesta`);

--
-- Filtros para la tabla `Respuesta`
--
ALTER TABLE `Respuesta`
  ADD CONSTRAINT `fk_resp_opcion` FOREIGN KEY (`idOpcionRespuesta`) REFERENCES `OpcionRespuesta` (`idOpcionRespuesta`),
  ADD CONSTRAINT `fk_resp_preg` FOREIGN KEY (`idPregunta`) REFERENCES `Pregunta` (`idPregunta`),
  ADD CONSTRAINT `fk_resp_usuario` FOREIGN KEY (`idUsuario`) REFERENCES `Usuario` (`idUsuario`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;