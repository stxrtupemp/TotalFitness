# TotalFitness

App web de gestión de gimnasio. React + Vite + Supabase.

---

## Estructura

```
src/
├── components/
│   ├── Navbar.jsx / .css
│   ├── Footer.jsx / .css
│   ├── ProtectedRoute.jsx
│   └── PaymentModal.jsx / .css
├── context/
│   └── AuthContext.jsx
├── hooks/
│   └── useSubscription.js
├── lib/
│   └── supabase.js
├── pages/
│   ├── Home.jsx / .css
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx / .css
│   ├── Admin.jsx / .css
│   └── Auth.css
├── styles/
│   └── globals.css
├── App.jsx
└── main.jsx
```

---

## Setup

### 1. Supabase

1. Crear proyecto en [supabase.com](https://supabase.com)
2. En **SQL Editor**, ejecutar el contenido de `supabase-schema.sql`
3. En **Authentication > Providers**, asegúrate de que Email está habilitado
4. Copiar **Project URL** y **anon public key** desde Project Settings > API

### 2. Variables de entorno

```bash
cp .env.example .env
```

Editar `.env`:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### 3. Instalar y arrancar

```bash
npm install
npm run dev
```

### 4. Crear administrador

Después de registrar un usuario, ejecuta en el SQL Editor de Supabase:

```sql
update public.users
set role = 'admin'
where email = 'tu@email.com';
```

Ese usuario verá el enlace `/admin` en el navbar.

---

## Rutas

| Ruta         | Acceso      | Descripción                   |
|--------------|-------------|-------------------------------|
| `/`          | Público     | Home con promociones          |
| `/login`     | Público     | Inicio de sesión              |
| `/register`  | Público     | Registro de cuenta            |
| `/dashboard` | Autenticado | Panel de usuario / suscripción|
| `/admin`     | Admin only  | Gestión de usuarios           |

---

## Deploy en Netlify

1. Conectar repo en Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Añadir variables de entorno en Netlify > Site settings > Environment variables
5. El archivo `netlify.toml` ya gestiona el SPA routing

---

## Simulación de pagos

El modal de pago es una simulación visual (sin backend real):
- Valida formato de tarjeta, caducidad y CVV
- Muestra animación de procesamiento (2.2s)
- Al completar, llama a Supabase para activar la suscripción
- No realiza ningún cargo real
