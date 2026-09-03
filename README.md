# TrimLink

Acortador de URLs con analíticas de país y dispositivo, construido con
**Next.js 14 (App Router)**, **TypeScript estricto**, **Tailwind CSS** y
**Supabase** (Postgres + Row Level Security). La redirección de los enlaces
cortos corre en el **Middleware de Next.js**, en el Edge.

## ✨ Stack

- Next.js 14 — App Router, Server Actions, Server/Client Components
- TypeScript estricto (sin `any`)
- Tailwind CSS — estética "Soft Organic / Pastel Clean"
- Supabase — Postgres, Auth (magic link) y Row Level Security
- Zod — validación de todas las entradas de usuario
- Recharts — gráficos de clics por país / dispositivo

## 🗂️ Estructura

```
trimlink/
├── middleware.ts              # Resuelve /[code] en el Edge y trackea el clic
├── supabase/migrations/       # Schema SQL + políticas RLS
├── src/
│   ├── app/
│   │   ├── page.tsx           # Landing
│   │   ├── login/             # Auth por magic link
│   │   ├── auth/callback/     # Intercambio de código OAuth/OTP
│   │   ├── dashboard/         # Panel de control (protegido)
│   │   ├── link-invalid/      # 404 "amigable" para códigos inválidos/expirados
│   │   └── not-found.tsx      # 404 global de la app
│   ├── components/
│   │   ├── ui/                # Button, Card, Input, Skeleton, WaveDivider…
│   │   ├── landing/           # Hero, ShortenForm, Features
│   │   └── dashboard/         # LinkList, LinkCard, StatsChart
│   ├── lib/
│   │   ├── supabase/          # Clientes (browser / server / middleware)
│   │   ├── validations/       # Esquemas Zod (URL, alias, email)
│   │   ├── actions/           # Server Actions (links, auth)
│   │   └── utils/              # nanoid, detección de dispositivo, cn()
│   └── types/database.ts      # Tipado del schema de Supabase
```

## 🔒 Privacidad (GDPR-friendly)

- **Nunca se guarda la IP en crudo.** El país se obtiene de los headers de
  geolocalización del Edge (`request.geo` / `x-vercel-ip-country`).
- Si en algún momento se necesitara un identificador anti-abuso, la IP se
  hashea con salt (`SHA-256` vía Web Crypto) **en memoria**, y el valor
  crudo se descarta inmediatamente — solo el hash llega a la base de datos.
- El tipo de dispositivo se infiere del `User-Agent` sin librerías externas
  (compatible con el runtime Edge).

## 🚀 Puesta en marcha local

### 1. Clonar e instalar

```bash
npm install
```

### 2. Crear el proyecto en Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. Ve a **SQL Editor** y ejecuta el contenido de
   `supabase/migrations/0001_init.sql`.
3. En **Authentication → URL Configuration**, agrega
   `http://localhost:3000/auth/callback` como Redirect URL (y la URL de
   producción cuando despliegues).
4. Copia la **Project URL** y la **anon public key** desde
   **Settings → API**.

### 3. Variables de entorno

```bash
cp .env.example .env.local
```

Completa `.env.local` con tus credenciales de Supabase y un `IP_HASH_SALT`
aleatorio (por ejemplo, generado con `openssl rand -hex 32`).

### 4. Levantar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## 📦 Build de producción

```bash
npm run build
npm run start
```

## ☁️ Deploy (proyecto de portfolio)

La forma más simple es **Vercel** (el middleware usa `request.geo`, que
Vercel provee automáticamente en el Edge sin configuración extra):

1. Sube el repo a GitHub.
2. Importa el proyecto en [vercel.com/new](https://vercel.com/new).
3. Agrega las mismas variables de `.env.local` en
   **Settings → Environment Variables**.
4. Actualiza `NEXT_PUBLIC_SITE_URL` con tu dominio de Vercel y agrega
   `https://tu-dominio.vercel.app/auth/callback` como Redirect URL en
   Supabase.
5. Deploy 🎉 — el plan gratuito de Vercel + el free tier de Supabase
   cubren perfectamente un proyecto de portfolio.

> Nota: si despliegas en un proveedor distinto a Vercel, `request.geo`
> puede no estar disponible; en ese caso el país cae a `"XX"` salvo que
> configures tu propio header de geolocalización en el edge/CDN.

## 🧭 Cómo funciona la redirección

1. Un usuario visita `tudominio.com/aB3xQ9z`.
2. El `middleware.ts` intercepta la request (corre en el Edge, antes de
   tocar cualquier página de la app).
3. Consulta la tabla `links` en Supabase por `code = "aB3xQ9z"`.
4. Si existe y no expiró: registra el clic (país + dispositivo, sin IP) y
   responde con un `307` hacia la URL original.
5. Si no existe o expiró: redirige a `/link-invalid` con una pantalla
   amigable.
