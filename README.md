# Trabajo Pr�ctico Integrador III
# Trabajo Práctico Integrador III: API REST de Eventos

API REST para gestionar usuarios, eventos y categorías, desarrollada con Node.js, Express y MongoDB (Mongoose). Incluye autenticación con JWT en cookies, contraseñas hasheadas con bcrypt, validaciones con express-validator, relaciones embebidas y referenciadas, virtual populate, eliminación lógica y eliminación en cascada.

## Tecnologías

- Node.js con ESModules
- Express
- MongoDB y Mongoose
- jsonwebtoken y cookie-parser (autenticación con JWT en cookie `httpOnly`)
- bcrypt (hasheo de contraseñas)
- express-validator (validaciones)
- cors y dotenv
- nodemon (desarrollo)

## Variables de entorno

Crear un archivo `.env` en la raíz con estas variables (el archivo `.env.example` muestra los nombres):

```
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/trabajo-practico-integrador-3
JWT_SECRET=una_clave_larga_y_secreta
JWT_EXPIRES_IN=1d
```

## Instalación y ejecución

```
git clone https://github.com/duartekeila14-hue/trabajo-practico-integrador-3.git
cd trabajo-practico-integrador-3
npm install
```

Crear el archivo `.env` (ver la sección anterior) y ejecutar:

```
npm run dev
```

Para ejecutarlo sin nodemon: `npm start`. El servidor queda en `http://localhost:3000`.

## Estructura del proyecto

```
├── app.js
├── package.json
├── .env.example
└── src/
    ├── config/
    │   └── db.js
    ├── models/
    │   ├── user.model.js
    │   ├── event.model.js
    │   └── category.model.js
    ├── routes/
    │   ├── auth.routes.js
    │   ├── user.routes.js
    │   ├── event.routes.js
    │   └── category.routes.js
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── users.controller.js
    │   ├── events.controller.js
    │   └── categories.controller.js
    ├── middlewares/
    │   ├── auth.middleware.js
    │   ├── role.middleware.js
    │   ├── validator.middleware.js
    │   └── validations/
    │       ├── auth.validation.js
    │       ├── user.validation.js
    │       ├── event.validation.js
    │       └── category.validation.js
    └── helpers/
        ├── bcrypt.helper.js
        └── jwt.helper.js
```

## Modelos y relaciones

| Relación | Tipo | Implementación |
|---|---|---|
| User ↔ Profile | 1:1 embebida | Campo `profile` dentro de `User` |
| Event ↔ Location | 1:1 embebida | Campo `location` dentro de `Event` |
| User → Event | 1:N referenciada | Campo `organizer` (ObjectId) en `Event` |
| Event ↔ Category | N:M referenciada | Array `categories` (ObjectId) en `Event` |

- **Populate**: `Event` popula `organizer` y `categories`.
- **Virtual populate**: `User` y `Category` tienen el virtual `events`.
- **Eliminación lógica**: los usuarios se eliminan con el campo `deletedAt`.
- **Eliminación en cascada**: al eliminar un usuario se eliminan sus eventos, y al eliminar una categoría se quita de todos los eventos que la referencian.

## Endpoints

### Autenticación (`/api/auth`)

| Método | Ruta | Acceso |
|---|---|---|
| POST | `/register` | Público |
| POST | `/login` | Público |
| GET | `/profile` | Usuario autenticado |
| PUT | `/profile` | Usuario autenticado |
| POST | `/logout` | Usuario autenticado |

### Usuarios (`/api/users`)

| Método | Ruta | Acceso |
|---|---|---|
| GET | `/` | Solo admin |
| GET | `/:id` | Solo admin |
| PUT | `/:id` | Solo admin |
| DELETE | `/:id` | Solo admin |

### Eventos (`/api/events`)

| Método | Ruta | Acceso |
|---|---|---|
| POST | `/` | Usuario autenticado |
| GET | `/` | Usuario autenticado |
| GET | `/my` | Usuario autenticado |
| GET | `/:id` | Usuario autenticado |
| PUT | `/:id` | Organizador o admin |
| DELETE | `/:id` | Organizador o admin |

### Categorías (`/api/categories`)

| Método | Ruta | Acceso |
|---|---|---|
| POST | `/` | Solo admin |
| GET | `/` | Usuario autenticado |
| GET | `/:id` | Usuario autenticado |
| PUT | `/:id` | Solo admin |
| DELETE | `/:id` | Solo admin |

## Comandos utilizados en el desarrollo

### 1. Verificar herramientas

```
node -v
npm -v
git --version
```

### 2. Repositorio y rama main

```
git init
"# Trabajo Práctico Integrador III" | Set-Content README.md
git add README.md
git commit -m "Crea el README inicial"
git branch -M main
git remote add origin https://github.com/duartekeila14-hue/trabajo-practico-integrador-3.git
git push -u origin main
```

### 3. Ramas develop e integrador-eventos

```
git checkout -b develop
git push -u origin develop
git checkout -b integrador-eventos
git push -u origin integrador-eventos
```

### 4. Proyecto Node y dependencias

```
npm init -y
npm install express mongoose cors dotenv jsonwebtoken bcrypt cookie-parser express-validator
npm install -D nodemon
```

En el `package.json` se agregó `"type": "module"` y los scripts `"dev": "nodemon app.js"` y `"start": "node app.js"`.

### 5. Estructura de carpetas y archivos

```
mkdir src\config, src\models, src\routes, src\controllers, src\middlewares\validations, src\helpers
New-Item app.js, .env, .env.example, .gitignore -ItemType File
```

### 6. Archivos ignorados

El `.gitignore` contiene `node_modules` y `.env`. Si alguno se hubiera agregado a Git antes:

```
git rm -r --cached node_modules
git rm --cached .env
```

### 7. Ejecutar el servidor

```
npm run dev
npm start
```

### 8. Commits durante el desarrollo

```
git status
git add src/models
git commit -m "Agrega modelos User, Event y Category"
git push
```

El mismo procedimiento se repitió para cada bloque terminado: helpers, middlewares, validaciones, controladores, rutas y `.env.example`.

### 9. Comprobaciones

```
git log --oneline
git rev-list --count develop..integrador-eventos
git branch
git remote -v
git check-ignore -v node_modules
```

### 10. Merges finales

```
git checkout develop
git pull
git merge integrador-eventos
git push

git checkout main
git pull
git merge develop
git push
```

## Autora

Keila Duarte