"use client";

import { useActionState, useEffect, useRef } from "react";
import { crearIncidencia, type EstadoFormulario } from "./actions";

const inicial: EstadoFormulario = { error: null, ok: false };

export function Formulario() {
  const [estado, accion, enviando] = useActionState(crearIncidencia, inicial);
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (estado.ok) form.current?.reset();
  }, [estado]);

  return (
    <form ref={form} action={accion} className="tarjeta formulario">
      <h2>Nueva incidencia</h2>

      <label htmlFor="ubicacion">Habitación o zona</label>
      <input id="ubicacion" name="ubicacion" placeholder="Ej.: Hab. 214, piscina, cocina" maxLength={60} required />

      <label htmlFor="descripcion">Descripción</label>
      <textarea id="descripcion" name="descripcion" rows={3} placeholder="¿Qué pasa?" minLength={5} maxLength={500} required />

      <label htmlFor="prioridad">Prioridad</label>
      <select id="prioridad" name="prioridad" defaultValue="media">
        <option value="baja">Baja</option>
        <option value="media">Media</option>
        <option value="alta">Alta</option>
      </select>

      {estado.error && <p className="error" role="alert">{estado.error}</p>}
      {estado.ok && <p className="exito" role="status">Incidencia guardada.</p>}

      <button type="submit" disabled={enviando}>{enviando ? "Guardando…" : "Añadir incidencia"}</button>
    </form>
  );
}
