# Parcial 2 – Aplicaciones Híbridas de Max Shevelev

## Prerrequisitos
- Node.js versión 16 o superior  
- Git  
- Conexión a MongoDB Atlas

---

## Instalación

### Backend
```bash
cd backend
npm install
cp .env.example .env
```
> Contenido de `.env`:
```env
PORT=3000
MONGODB_URI=mongodb+srv://<tu_usuario>:<tu_contraseña>@cluster0.mongodb.net/tienda_dev
SECRET_KEY=miclavesecreta
```

```bash
npm run dev
```
> Corre en: `http://localhost:3000`

---

### Frontend
```bash
cd ../frontend
npm install
npm run dev
```
> Corre en: `http://localhost:5173`

---

## Uso de la API

### Autenticación
- `POST /api/usuarios/register`
- `POST /api/usuarios/login`

### Productos (CRUD)
- `GET /api/productos`
- `POST /api/productos`
- `PUT /api/productos/:id`
- `DELETE /api/productos/:id`

> En rutas protegidas:  
`Authorization: Bearer <token>`

---

## Navegación del Frontend

- Home → `/`
- Productos → `/products`
- Registro → `/nuevo`
- Login → `/login`
- Admin Panel → `/backend`
- Logout (icono de salida)
- Avatar visible después de login

---

## Tecnologías Usadas
- React.js (Vite)
- Hooks (`useState`, `useEffect`, `useNavigate`, `useContext`)
- JWT (autenticación)
- MongoDB Atlas (`tienda_dev`)
- Express + Mongoose
- Gestión de sesión con localStorage y fetch
- React Router DOM
- CSS / Bootstrap / FontAwesome

---

## Estructura
- `/backend`: API REST
- `/frontend`: SPA React

Inicio automático:
```bash
npm install
npm start
```
(usa `concurrently` para levantar frontend y backend juntos)
