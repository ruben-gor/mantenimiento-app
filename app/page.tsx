import { getSupabase } from "@/lib/supabase";
import { ETIQUETA_ESTADO, ordenarIncidencias, type Incidencia } from "@/lib/incidencias";
import { avanzarEstado, borrarIncidencia } from "./actions";
import { Formulario } from "./formulario";

export const dynamic = "force-dynamic";

async function cargar(): Promise<{ lista: Incidencia[]; aviso: string | null }> {
  const supabase = getSupabase();
  if (!supabase) {
    return { lista: [], aviso: "Falta configurar SUPABASE_URL y SUPABASE_ANON_KEY." };
  }
  const { data, error } = await supabase
    .from("incidencias")
    .select("id, ubicacion, descripcion, prioridad, estado, created_at");
  if (error) return { lista: [], aviso: "No se pudieron cargar las incidencias." };
  return { lista: ordenarIncidencias((data ?? []) as Incidencia[]), aviso: null };
}

export default async function Inicio() {
  const { lista, aviso } = await cargar();
  const abiertas = lista.filter((i) => i.estado !== "resuelta").length;

  return (
    <main>
      <header>
        <h1>🔧 Mantenimiento</h1>
        <p>Registro de incidencias del hotel · <strong>{abiertas}</strong> abiertas</p>
      </header>

      {aviso && <p className="aviso" role="alert">{aviso}</p>}

      <Formulario />

      <section aria-label="Incidencias">
        {lista.length === 0 && !aviso && <p className="vacio">No hay incidencias. ¡Todo en orden!</p>}
        <ul className="lista">
          {lista.map((i) => (
            <li key={i.id} className={`tarjeta incidencia ${i.estado}`}>
              <div className="cabecera">
                <strong>{i.ubicacion}</strong>
                <span className={`prioridad ${i.prioridad}`}>{i.prioridad}</span>
              </div>
              <p>{i.descripcion}</p>
              <div className="pie">
                <time dateTime={i.created_at}>
                  {new Date(i.created_at).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Madrid" })}
                </time>
                <form action={avanzarEstado}>
                  <input type="hidden" name="id" value={i.id} />
                  <input type="hidden" name="estado" value={i.estado} />
                  <button type="submit" className="estado" title="Cambiar estado">{ETIQUETA_ESTADO[i.estado]} ↻</button>
                </form>
                <form action={borrarIncidencia}>
                  <input type="hidden" name="id" value={i.id} />
                  <button type="submit" className="borrar" aria-label={`Borrar incidencia de ${i.ubicacion}`}>✕</button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
