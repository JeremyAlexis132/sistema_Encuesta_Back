# Sistema de Encuestas Backend

Backend con Node.js, Express, MySQL con autenticación x-api-key, hashing bcryptjs y firma ciega.

## ⚙️ Configuración

- **Puerto**: 3002 (configurable en `.env`)
- **Base de datos**: MySQL (criptofrafia)
- **Autenticación**: x-api-key (JWT en header personalizado)
- **ORM**: conexión directa con `mysql2`

## 🚀 Inicio Rápido

```bash
npm install
npm start
```

Servidor en: `http://localhost:3002`

## 📋 Headers Requeridos

Para todos los endpoints protegidos, incluye el header:
```
x-api-key: {JWT_TOKEN}
```

## 📋 Endpoints

### 🔐 Autenticación (sin token requerido)

#### POST `/auth/registro`
Registro de usuario (auto-registro)
```json
{
  "numeroCuenta": "user001",
  "correo": "user@example.com",
  "password": "password123"
}
```
Response: Recibe `publicKey`

#### POST `/auth/login`
Login de usuario
```json
{
  "numeroCuenta": "user001",
  "password": "password123"
}
```
Response: Recibe JWT `token` (usar en header `x-api-key`)

#### POST `/admin/login`
Login de administrador
```json
{
  "username": "admin1",
  "password": "admin123"
}
```
Response: Recibe JWT `token` (usar en header `x-api-key`)

---

### 👤 Administrador (requiere x-api-key)

#### POST `/admin/crear-usuario`
Crear usuario (solo admin)
```json
{
  "numeroCuenta": "user002",
  "correo": "user2@example.com",
  "password": "pass123"
}
```

#### POST `/admin/crear-admin`
Crear administrador (solo admin)
```json
{
  "username": "admin2",
  "password": "password123",
  "correo": "admin2@example.com"
}
```

#### POST `/admin/editar-usuario`
Editar usuario
```json
{
  "idUsuario": 1,
  "correo": "newemail@example.com",
  "password": "newpass123"
}
```

#### POST `/admin/editar-admin`
Editar administrador
```json
{
  "idAministrador": 1,
  "correo": "newemail@example.com",
  "password": "newpass123"
}
```

#### GET `/admin/usuarios`
Obtener lista de usuarios

#### GET `/admin/administradores`
Obtener lista de administradores

---

### 📊 Encuestas (requiere token)

#### POST `/encuestas/crear`
Crear encuesta (solo admin)
```json
{
  "idUsuario": 1
}
```

#### POST `/encuestas/:id/preguntas`
Agregar pregunta a encuesta (solo admin)
```json
{
  "pregunta": "¿Cuál es tu opinión?"
}
```

#### GET `/encuestas`
Obtener todas las encuestas

#### GET `/encuestas/:id`
Obtener encuesta específica

---

### 💬 Respuestas (requiere token)

#### POST `/respuestas/:idPregunta`
Responder una pregunta
```json
{
  "respuesta": "Excelente servicio"
}
```

#### GET `/respuestas/encuesta/:idEncuesta`
Obtener respuestas de una encuesta

#### GET `/respuestas/pregunta/:idPregunta`
Obtener respuesta de una pregunta específica

---

### 🔐 Firma Ciega (requiere token)

#### POST `/firma-ciega/obtener-clave-publica`
Obtener clave pública del usuario (solo usuario)

#### POST `/firma-ciega/generar-firma`
Generar firma ciega (solo usuario)
```json
{
  "idEncuesta": 1,
  "mensajeCegado": "mensaje_cifrado..."
}
```

#### POST `/firma-ciega/verificar-firma`
Verificar firma ciega (sin token requerido)
```json
{
  "idUsuario": 1,
  "mensajeCegado": "mensaje_cifrado...",
  "firmaBlind": "firma_hash..."
}
```

---

## 🔑 Autenticación JWT

Todos los endpoints (excepto `/auth/registro`, `/auth/login`, `/admin/login`) requieren:

```
Authorization: Bearer <JWT_TOKEN>
```

Los tokens expiran en **24 horas**.

---

## 🔒 Seguridad

✅ Contraseñas hasheadas con bcryptjs (10 rounds)
✅ JWT con SECRET_KEY del .env
✅ Validación de duplicidad (numeroCuenta, correo, username)
✅ Claves privadas generadas automáticamente
✅ Firma ciega con SHA-256

---

## 📦 Dependencias

- **express**: Framework web
- **jsonwebtoken**: Generación JWT
- **bcryptjs**: Hashing de contraseñas
- **mysql2**: Conexión MySQL con pool
- **dotenv**: Variables de entorno

---

## 📝 .env

```
PORT=3002
environment=local
DB_NAME=criptofrafia
DBUSER=root
DBPASSWORD=
SECRET_KEY=G8dJ5*n#qW1dX3kD*B8Xwn2sM$tVoZ6Y
```

---

## 📚 Schema Base de Datos

Ver `database.sql` para crear las tablas:
- Administrador
- Usuario
- Encuesta
- Pregunta
