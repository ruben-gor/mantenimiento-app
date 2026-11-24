# DIRECTRICES

Normas que el código de Develop **tiene que cumplir**. Testing las revisa una a una.

## Calidad
- **D1** — `npm run lint` sin errores.
- **D2** — `npm test` pasa; toda función de `lib/` tiene al menos un test.
- **D3** — `npm run build` termina sin errores. TypeScript estricto, sin `any`.

## Datos y seguridad
- **D4** — Toda llamada a Supabase comprueba `error` y lo gestiona (mensaje al usuario o excepción controlada).
- **D5** — Los datos del formulario se validan en el servidor con `validarIncidencia` antes de guardarse.
- **D6** — No hay claves ni URLs de Supabase escritas en el código; se leen de `process.env`.
- **D7** — El acceso a la base de datos solo ocurre en el servidor (Server Components / Server Actions).
- **D8** — Si faltan las variables de entorno, la app muestra un aviso claro en vez de romperse.

## Interfaz
- **D9** — Todos los campos del formulario tienen `<label>` asociado.
- **D10** — Se ve bien en móvil (ancho 375 px) sin scroll horizontal.
- **D11** — Textos en español y sin faltas.

## Despliegue
- **D12** — La app funciona sin iniciar sesión en ningún sitio (URL pública).
