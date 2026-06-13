# DIMUSAL-2026 — Requisitos del proyecto

## Programas necesarios (instalar manualmente)

| Programa   | Versión | Descarga                              |
| ---------- | ------- | ------------------------------------- |
| Node.js    | v20 LTS | https://nodejs.org                    |
| PostgreSQL | v17     | https://www.postgresql.org/download   |
| pgAdmin 4  | v8      | https://www.pgadmin.org/download      |
| VS Code    | última  | https://code.visualstudio.com         |
| nodemailer | v6+     | Se instala con npm install nodemailer |

## Extensiones de VS Code necesarias

- **Live Server** — Ritwick Dey
- **PostgreSQL** — Chris Kolkman

## Dependencias Node.js (se instalan automáticamente)

Dentro de la carpeta del proyecto ejecutar:

npm install

Esto instalará automáticamente desde package.json:

| Paquete    | Para qué sirve                           |
| ---------- | ---------------------------------------- |
| express    | Servidor backend                         |
| pg         | Conexión con PostgreSQL                  |
| bcryptjs   | Encriptar contraseñas                    |
| dotenv     | Variables de entorno (.env)              |
| cors       | Permitir conexión frontend-backend       |
| nodemailer | Enviar correos de verificación por Gmail |

## Configurar archivo .env

Crear un archivo `.env` en la raíz del proyecto con esto:

DB_HOST=localhost
DB_PORT=5432
DB_NAME=dimusal
DB_USER=postgres
DB_PASSWORD=tu_contraseña_aqui
PORT=3000

## Base de datos PostgreSQL

Ejecutar en pgAdmin → Query Tool:

CREATE TABLE users (
id SERIAL PRIMARY KEY,
nombre_completo VARCHAR(100) NOT NULL,
telefono VARCHAR(20) NOT NULL,
dui VARCHAR(20) NOT NULL,
correo VARCHAR(100) UNIQUE NOT NULL,
password VARCHAR(255) NOT NULL,
departamento VARCHAR(50) NOT NULL,
municipio VARCHAR(50) NOT NULL,
tipo VARCHAR(50),
nombre_artistico VARCHAR(100),
portafolio VARCHAR(255),
objetivo VARCHAR(50),
spotify VARCHAR(255),
instagram VARCHAR(100),
youtube VARCHAR(255),
tiktok VARCHAR(100),
created_at TIMESTAMP DEFAULT NOW()
);

## Correr el proyecto

1. Abrir VS Code en la carpeta del proyecto
2. Abrir terminal y ejecutar:

node server.js

3. Abrir `templates/register.html` con Live Server
4. Listo 🚀

## Librerías CDN (ya incluidas en el HTML)

- **SweetAlert2** — alertas bonitas
  https://cdn.jsdelivr.net/npm/sweetalert2@11

## Configuración de correo Gmail

Para que funcione el envío de códigos de verificación:

1. Ir a: https://myaccount.google.com/security
2. Activar **verificación en 2 pasos**
3. Ir a: https://myaccount.google.com/apppasswords
4. Escribir un nombre (ej: "Dimusal") y clic en **Crear**
5. Copiar la contraseña de 16 caracteres generada
6. Agregarla al .env sin espacios:

GMAIL_USER=tucorreo@gmail.com
GMAIL_PASS=xxxxxxxxxxxxxxxx

## Instalar nodemailer

npm install nodemailer
Es para instalar multer, que es la librería que maneja la subida de archivos (imágenes) en el servidor.
npm install multer
