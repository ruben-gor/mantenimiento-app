export const PRIORIDADES = ["baja", "media", "alta"] as const;
export const ESTADOS = ["pendiente", "en_curso", "resuelta"] as const;

export type Prioridad = (typeof PRIORIDADES)[number];
export type Estado = (typeof ESTADOS)[number];

export interface Incidencia {
  id: number;
  ubicacion: string;
  descripcion: string;
  prioridad: Prioridad;
  estado: Estado;
  created_at: string;
}

export interface NuevaIncidencia {
  ubicacion: string;
  descripcion: string;
  prioridad: Prioridad;
}

export type Resultado<T> = { ok: true; datos: T } | { ok: false; error: string };

export function validarIncidencia(entrada: {
  ubicacion: unknown;
  descripcion: unknown;
  prioridad: unknown;
}): Resultado<NuevaIncidencia> {
  const ubicacion = typeof entrada.ubicacion === "string" ? entrada.ubicacion.trim() : "";
  const descripcion = typeof entrada.descripcion === "string" ? entrada.descripcion.trim() : "";
  const prioridad = entrada.prioridad;

  if (ubicacion.length < 1 || ubicacion.length > 60) {
    return { ok: false, error: "La ubicación es obligatoria (máx. 60 caracteres)." };
  }
  if (descripcion.length < 5 || descripcion.length > 500) {
    return { ok: false, error: "La descripción debe tener entre 5 y 500 caracteres." };
  }
  if (!PRIORIDADES.includes(prioridad as Prioridad)) {
    return { ok: false, error: "Prioridad no válida." };
  }
  return { ok: true, datos: { ubicacion, descripcion, prioridad: prioridad as Prioridad } };
}

export function esEstado(valor: unknown): valor is Estado {
  return ESTADOS.includes(valor as Estado);
}

export function siguienteEstado(estado: Estado): Estado {
  if (estado === "pendiente") return "en_curso";
  if (estado === "en_curso") return "resuelta";
  return "pendiente";
}

export const ETIQUETA_ESTADO: Record<Estado, string> = {
  pendiente: "Pendiente",
  en_curso: "En curso",
  resuelta: "Resuelta",
};

const PESO: Record<Prioridad, number> = { alta: 0, media: 1, baja: 2 };

/** Ordena: no resueltas primero, luego por prioridad y más recientes antes. */
export function ordenarIncidencias(lista: Incidencia[]): Incidencia[] {
  return [...lista].sort((a, b) => {
    const ra = a.estado === "resuelta" ? 1 : 0;
    const rb = b.estado === "resuelta" ? 1 : 0;
    if (ra !== rb) return ra - rb;
    if (PESO[a.prioridad] !== PESO[b.prioridad]) return PESO[a.prioridad] - PESO[b.prioridad];
    return b.created_at.localeCompare(a.created_at);
  });
}
