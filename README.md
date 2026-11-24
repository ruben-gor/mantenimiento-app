# Mantenimiento · Incidencias

App Next.js para registrar incidencias de mantenimiento de un hotel, hecha con un equipo de 3 agentes de Claude Code.

## Agentes

- **Orquestador** → `CLAUDE.md`: reparte el trabajo y controla el bucle Develop ⇄ Testing.
- **Develop** → `.claude/agents/develop.md`: cómo programar en este proyecto.
- **Testing** → `.claude/agents/testing.md` + `DIRECTRICES.md`: revisa y devuelve fallos hasta `ESTADO: PASA`.

Ejemplo en Claude Code: `Añade un filtro por estado a la lista` → el orquestador planifica, Develop implementa, Testing revisa.

## Puesta en marcha

1. **Supabase** (gratis): crea un proyecto → *SQL Editor* → pega y ejecuta `supabase/schema.sql`.
   Copia *Project URL* y *anon public key* (Settings → API).
2. **Local**: `cp .env.example .env.local`, rellena las dos variables, y luego `npm install` y `npm run dev`.
3. **GitHub**: sube el repositorio (sin `.env.local`).
4. **Vercel** (gratis): *Add New → Project* → importa el repo → en *Environment Variables* añade
   `SUPABASE_URL` y `SUPABASE_ANON_KEY` → *Deploy*.
5. **URL pública**: en Vercel → *Settings → Deployment Protection* → desactiva **Vercel Authentication**.
   Comprueba la URL `https://<proyecto>.vercel.app` en una ventana de incógnito.

## Comandos

- `npm run dev`: servidor local
- `npm run check`: lint + tests + build (lo que ejecuta Testing)

Documento de desarrollo: `DESARROLLO.md`.
