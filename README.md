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

La dirección de la API se configura en `src/environments/environment.ts`. Si el backend usa otra dirección, cambia el valor de `urlApi`.

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

## Estructura del frontend Angular

```text
src/
├── app/
│   ├── components/
│   │   └── app/                 # Pantalla principal, plantilla y estilos
│   ├── models/                  # Tipos de usuario, grupo, gasto y mensaje
│   ├── services/                # Llamadas a FastAPI y token de sesión
│   ├── app.config.ts            # Configuración de Angular
│   └── app.routes.ts            # Rutas de la aplicación
└── environments/
    └── environment.ts          # Dirección del backend
```

`components` contiene la interfaz, `services` centraliza la comunicación con la API y `models` describe los datos intercambiados. `environment.ts` guarda la URL base de FastAPI.

## Comprobar la compilación

```bash
npm run build
```

## Guía de estudio

El PDF para repasar el proyecto está en `docs/guia-estudio.pdf`. Su fuente editable es `docs/guia-estudio.html`; para volver a generar el PDF en macOS:

```bash
swift docs/generar-pdf.swift "$PWD/docs"
```
