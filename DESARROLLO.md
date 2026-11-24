# Documento de desarrollo

## 1. Objetivo de la prueba

Crear con Claude Code un proyecto Next.js que trabaje con un equipo de **3 agentes** (Orquestador, Develop y Testing) y usarlo para construir una app de tema libre. La app usa una base de datos gratuita (Supabase), está publicada gratis en Vercel y se abre desde una **URL pública** sin iniciar sesión.

## 2. La app: Mantenimiento · Incidencias

Es un registro de averías para el equipo de mantenimiento de un hotel. El tema viene de mi trabajo real como técnico de mantenimiento en hostelería.

- Alta de incidencias: habitación o zona, descripción y prioridad (baja, media o alta).
- Cambio de estado con un toque: Pendiente → En curso → Resuelta.
- Borrado de incidencias.
- Lista ordenada: las abiertas primero, luego por prioridad y por fecha.
- Contador de incidencias abiertas.
- Se puede instalar en el móvil como app (PWA): abrir la URL y elegir "Añadir a pantalla de inicio".

## 3. Arquitectura

```
Navegador ──► Next.js en Vercel (Server Components + Server Actions) ──► Supabase (Postgres)
```

- **Next.js (App Router) + TypeScript estricto.**
- **Todo el acceso a datos ocurre en el servidor**: el navegador nunca habla con Supabase directamente y las claves no llegan al cliente.
- **Validación doble**: en el servidor con `validarIncidencia` (`lib/incidencias.ts`) y en la base de datos con restricciones `check`.
- **Supabase**: tabla `incidencias` con RLS activado y políticas públicas, porque es una demo abierta (`supabase/schema.sql`).
- **PWA**: `app/manifest.ts` e iconos en `public/`.

| Archivo | Qué hace |
|---|---|
| `app/page.tsx` | Página principal: carga y muestra las incidencias |
| `app/formulario.tsx` | Formulario de alta (componente cliente) |
| `app/actions.ts` | Server Actions: crear, cambiar estado y borrar |
| `lib/incidencias.ts` | Tipos, validación y orden (lógica pura con tests) |
| `lib/supabase.ts` | Cliente de Supabase (solo servidor) |

## 4. El equipo de agentes

| Agente | Archivo | Papel |
|---|---|---|
| Orquestador | `CLAUDE.md` | Divide la petición en tareas, las reparte y controla el bucle. No programa. |
| Develop | `.claude/agents/develop.md` | Programa siguiendo las normas del proyecto (stack, estructura, cómo entregar). |
| Testing | `.claude/agents/testing.md` | Revisa contra `DIRECTRICES.md`, ejecuta lint, tests y build, y devuelve `PASA` o la lista de fallos. No edita código. |

### Flujo

```
Usuario ─► Orquestador ─► Develop ─► Testing ─┬─ PASA  ─► tarea cerrada
                              ▲               │
                              └──── FALLA ────┘   (máx. 5 vueltas)
```

Las **12 directrices** (`DIRECTRICES.md`) cubren calidad (lint, tests, build), datos y seguridad (gestión de errores, validación, sin claves en el código, acceso solo en el servidor), interfaz (labels, móvil, textos) y despliegue (URL pública). Cada fallo que devuelve Testing indica la directriz incumplida, el archivo, la línea y el arreglo.

## 5. Proceso seguido

1. Montaje del proyecto Next.js con TypeScript, ESLint y Vitest.
2. Definición del equipo: `CLAUDE.md`, los dos subagentes y `DIRECTRICES.md`.
3. Develop implementó la lógica pura con sus tests, luego las Server Actions y después la interfaz.
4. Testing ejecutó `npm run check`. En la primera vuelta encontró un aviso de ESLint en `eslint.config.mjs` (export anónimo, regla `import/no-anonymous-default-export`). Develop lo corrigió y la segunda vuelta dio `ESTADO: PASA`.
5. Se añadió la PWA (manifest e iconos) y se repitió la revisión.
6. Despliegue: Supabase, GitHub, Vercel y desactivación de *Vercel Authentication*.

## 6. Verificación

- `npm run lint`: sin errores ni avisos.
- `npm test`: 7 tests superados (validación, estados y orden).
- `npm run build`: compila sin errores.
- Sin variables de entorno, la app muestra un aviso en vez de romperse (D8).
- URL comprobada en una ventana de incógnito, sin login (D12).

## 7. Seguridad

**Lo que está protegido**
- Las claves de Supabase solo están en variables de entorno (`.env.local` y Vercel). No están en el código ni en el repositorio, porque `.gitignore` excluye `.env*`.
- La base de datos solo se consulta desde el servidor. `lib/supabase.ts` importa `server-only`, así que el build falla si alguien intenta usarlo en el navegador.
- Los datos se validan dos veces: en el servidor con `validarIncidencia` (longitudes y prioridad permitida) y en Postgres con restricciones `check`.
- Las consultas usan el cliente de Supabase, que parametriza los valores. Así se evita la inyección SQL.
- React escapa el texto que se muestra, así que no se puede inyectar HTML ni scripts (XSS).
- RLS (Row Level Security) está activado en la tabla.

**Limitación consciente (es una demo pública)**
- La prueba exige una URL pública sin login. Por eso las políticas RLS permiten a cualquier visitante leer, crear, cambiar y borrar incidencias.
- No hay límite de peticiones: alguien podría llenar la tabla de spam.

**Qué haría para producción**
1. Login de empleados con Supabase Auth, y políticas RLS por usuario o rol (por ejemplo, solo el jefe de mantenimiento puede borrar).
2. Borrado lógico (marcar como archivada) en vez de borrado real, con historial de quién cambió qué.
3. Límite de peticiones por IP (Vercel Firewall o middleware) y CAPTCHA en el formulario.
4. Cabeceras de seguridad (CSP, HSTS) en `next.config`.

## 8. Cómo ejecutarlo

Ver `README.md`: Supabase → `.env.local` → `npm run dev` → Vercel.

## 9. Mejoras posibles

- Autenticación por empleado y políticas RLS por usuario.
- Fotos de la avería (Supabase Storage).
- Filtros por estado y zona, e historial de cambios.
- Notificaciones por WhatsApp al crear una incidencia de prioridad alta.

## 10. Entrega

- URL pública: `https://________.vercel.app`
- Repositorio: `https://github.com/ruben-gor/mantenimiento-app`
