"use server";

import { revalidatePath } from "next/cache";
import { getSupabase } from "@/lib/supabase";
import { esEstado, siguienteEstado, validarIncidencia } from "@/lib/incidencias";

export interface EstadoFormulario {
  error: string | null;
  ok: boolean;
}

export async function crearIncidencia(
  _prev: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  const r = validarIncidencia({
    ubicacion: formData.get("ubicacion"),
    descripcion: formData.get("descripcion"),
    prioridad: formData.get("prioridad"),
  });
  if (!r.ok) return { error: r.error, ok: false };

  const supabase = getSupabase();
  if (!supabase) return { error: "La base de datos no está configurada.", ok: false };

  const { error } = await supabase.from("incidencias").insert(r.datos);
  if (error) return { error: "No se pudo guardar la incidencia. Inténtalo de nuevo.", ok: false };

  revalidatePath("/");
  return { error: null, ok: true };
}

export async function avanzarEstado(formData: FormData): Promise<void> {
  const id = Number(formData.get("id"));
  const estado = formData.get("estado");
  if (!Number.isInteger(id) || !esEstado(estado)) return;

  const supabase = getSupabase();
  if (!supabase) return;

  const { error } = await supabase
    .from("incidencias")
    .update({ estado: siguienteEstado(estado) })
    .eq("id", id);
  if (error) throw new Error("No se pudo actualizar el estado.");

  revalidatePath("/");
}

export async function borrarIncidencia(formData: FormData): Promise<void> {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  const supabase = getSupabase();
  if (!supabase) return;

  const { error } = await supabase.from("incidencias").delete().eq("id", id);
  if (error) throw new Error("No se pudo borrar la incidencia.");

  revalidatePath("/");
}
