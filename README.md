# Slack Clone - Fullstack Project

Este proyecto es un clon de Slack que incluye un backend en Node.js/Express y un frontend en React/Vite.

## 🚀 Pasos de Instalación

### Requisitos Previos
- Node.js (v18 o superior)
- MongoDB (Local o Atlas)

### 1. Configuración del Backend
1. Navega a la carpeta `backend`:
   ```bash
   cd backend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env` en la raíz de la carpeta `backend` con las siguientes variables:
   ```env
   MONGO_DB_URI=tu_uri_de_mongodb
   MONGO_DB_NAME=UTN-SLACK
   JWT_SECRET_KEY=tu_clave_secreta
   GMAIL_PASSWORD=tu_password_de_aplicacion_gmail
   GMAIL_USERNAME=tu_email_gmail
   URL_FRONTEND=http://localhost:5173
   URL_BACKEND=http://localhost:8080
   API_KEY=tu_api_key_generada
   ```
4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

### 2. Configuración del Frontend
1. Navega a la carpeta `frontend`:
   ```bash
   cd ../frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env` en la raíz de la carpeta `frontend`:
   ```env
   VITE_API_URL=http://localhost:8080
   VITE_API_KEY=tu_api_key_generada
   ```
4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

---

## 🛠️ Documentación de Endpoints (API)

Todos los endpoints (excepto Auth y Invitations) requieren el encabezado `x-api-key`.

### Autenticación (`/api/auth`)
| Método | Endpoint | Descripción | Cuerpo (JSON) |
| :--- | :--- | :--- | :--- |
| POST | `/register` | Registrar un nuevo usuario | `email, password, username` |
| POST | `/login` | Iniciar sesión | `email, password` |
| GET | `/verify-email` | Verificar email (vía token) | Query: `verification_email_token` |
| POST | `/forgot-password` | Solicitar recuperación de contraseña | `email` |
| PUT | `/reset-password` | Restablecer contraseña | `reset_token, password` |

### Invitaciones (`/api/invitations`)
| Método | Endpoint | Descripción | Query Params |
| :--- | :--- | :--- | :--- |
| GET | `/accept` | Aceptar invitación a workspace | `invitation_token` |

### Espacios de Trabajo (Workspaces) (`/api/workspace`)
*Requieren Autenticación (JWT)*

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| GET | `/` | Listar mis workspaces |
| POST | `/` | Crear un workspace (`title, image, description`) |
| GET | `/:workspace_id` | Obtener detalle de un workspace |
| PUT | `/:workspace_id` | Actualizar workspace (Solo Owner/Admin) |
| DELETE | `/:workspace_id` | Eliminar workspace (Solo Owner) |

### Miembros (`/api/workspace`)
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| GET | `/:workspace_id/members` | Listar miembros del workspace |
| POST | `/:workspace_id/members` | Invitar miembro (`email, role`) |
| PUT | `/:workspace_id/members/:member_id` | Actualizar rol (Solo Owner/Admin) |
| DELETE | `/:workspace_id/members/:member_id` | Expulsar miembro (Solo Owner/Admin) |

### Canales (`/api/workspace/:workspace_id/channels`)
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| GET | `/` | Listar canales del workspace |
| POST | `/` | Crear canal (`name`) (Solo Owner/Admin) |
| PUT | `/:channel_id` | Actualizar canal (Solo Owner/Admin) |
| DELETE | `/:channel_id` | Eliminar canal (Solo Owner/Admin) |

### Mensajes (`/api/workspace/:workspace_id/channels/:channel_id/messages`)
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| GET | `/` | Obtener mensajes del canal |
| POST | `/` | Enviar mensaje (`content`) |
| DELETE | `/:message_id` | Eliminar mensaje |
