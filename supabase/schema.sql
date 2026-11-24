-- Ejecutar en Supabase > SQL Editor
create table if not exists public.incidencias (
  id bigint generated always as identity primary key,
  ubicacion text not null check (char_length(ubicacion) between 1 and 60),
  descripcion text not null check (char_length(descripcion) between 5 and 500),
  prioridad text not null default 'media' check (prioridad in ('baja', 'media', 'alta')),
  estado text not null default 'pendiente' check (estado in ('pendiente', 'en_curso', 'resuelta')),
  created_at timestamptz not null default now()
);

alter table public.incidencias enable row level security;

-- App de demostración pública: cualquiera puede leer y escribir.
create policy "lectura publica" on public.incidencias for select using (true);
create policy "alta publica" on public.incidencias for insert with check (true);
create policy "cambio publico" on public.incidencias for update using (true) with check (true);
create policy "borrado publico" on public.incidencias for delete using (true);

insert into public.incidencias (ubicacion, descripcion, prioridad, estado) values
  ('Hab. 214', 'El aire acondicionado no enfría', 'alta', 'pendiente'),
  ('Piscina', 'La bomba de depuración hace ruido', 'media', 'en_curso'),
  ('Recepción', 'Cambiar fluorescente fundido', 'baja', 'resuelta');
