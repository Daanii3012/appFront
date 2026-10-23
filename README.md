# Cuenta Clara

Frontend Angular para gestionar grupos y gastos compartidos. La interfaz está en español y se conecta con la API FastAPI del proyecto.

## Requisitos

- Node.js 20.19 o posterior
- El backend FastAPI iniciado en `http://127.0.0.1:8000`

## Iniciar el frontend

```bash
npm install
npm start
```

Abre [http://localhost:4200](http://localhost:4200) en el navegador.

La dirección de la API se configura en `src/app/infrastructure/configuracion.ts`. Si el backend usa otra dirección, cambia el valor de `urlApi`.

## Iniciar el backend

Desde la carpeta del backend:

```bash
source .venv/bin/activate
uvicorn app.main:app --reload
```

El backend debe permitir los orígenes locales `http://localhost:4200` y `http://127.0.0.1:4200` en CORS.

## Funciones incluidas

- Registro e inicio de sesión con token.
- Creación y consulta de grupos.
- Invitaciones y aceptación o rechazo.
- Registro de gastos, selección de quién pagó y reparto porcentual.
- Consulta de pagos y balances del grupo.
- Mensajes entre las personas del grupo.

Solo el creador ve las opciones para invitar integrantes y registrar gastos. El cobro del dinero se realiza fuera de la aplicación.

## Estructura del proyecto

El código está separado por responsabilidades siguiendo Clean Architecture:

```text
src/app/
├── domain/
│   ├── models/                  # Tipos de usuario, grupo, gasto y mensaje
│   └── repositories/            # Contratos que necesita la aplicación
├── application/
│   └── use-cases/               # Acciones de autenticación y gestión de grupos
├── infrastructure/
│   ├── api/                     # Adaptadores HTTP para FastAPI
│   ├── interceptors/            # Interceptor para enviar el token
│   └── configuracion.ts         # Dirección del backend
├── presentation/
│   └── pages/app/               # Pantalla, plantilla y estilos de Angular
└── app.config.ts                # Composición de dependencias de Angular
```

La capa `presentation` conoce los casos de uso, pero no realiza peticiones HTTP. Los casos de uso dependen de contratos de `domain` y `infrastructure` los conecta con FastAPI; así se puede sustituir el backend sin reescribir las pantallas.

## Comprobar la compilación

```bash
npm run build
```

## Guía de estudio

El PDF para repasar el proyecto está en `docs/guia-estudio.pdf`. Su fuente editable es `docs/guia-estudio.html`; para volver a generar el PDF en macOS:

```bash
swift docs/generar-pdf.swift "$PWD/docs"
```
