import { describe, expect, it } from "vitest";
import {
  esEstado,
  ordenarIncidencias,
  siguienteEstado,
  validarIncidencia,
  type Incidencia,
} from "./incidencias";

describe("validarIncidencia", () => {
  it("acepta datos correctos y recorta espacios", () => {
    const r = validarIncidencia({ ubicacion: " Hab. 214 ", descripcion: "Gotea el grifo", prioridad: "alta" });
    expect(r).toEqual({ ok: true, datos: { ubicacion: "Hab. 214", descripcion: "Gotea el grifo", prioridad: "alta" } });
  });
  it("rechaza ubicación vacía", () => {
    expect(validarIncidencia({ ubicacion: "  ", descripcion: "Gotea el grifo", prioridad: "alta" }).ok).toBe(false);
  });
  it("rechaza descripción corta", () => {
    expect(validarIncidencia({ ubicacion: "Piscina", descripcion: "mal", prioridad: "baja" }).ok).toBe(false);
  });
  it("rechaza prioridad inventada", () => {
    expect(validarIncidencia({ ubicacion: "Piscina", descripcion: "Bomba ruidosa", prioridad: "urgente" }).ok).toBe(false);
  });
});

describe("estados", () => {
  it("esEstado reconoce valores válidos", () => {
    expect(esEstado("en_curso")).toBe(true);
    expect(esEstado("cerrada")).toBe(false);
  });
  it("siguienteEstado hace el ciclo", () => {
    expect(siguienteEstado("pendiente")).toBe("en_curso");
    expect(siguienteEstado("en_curso")).toBe("resuelta");
    expect(siguienteEstado("resuelta")).toBe("pendiente");
  });
});

describe("ordenarIncidencias", () => {
  const base = (id: number, prioridad: Incidencia["prioridad"], estado: Incidencia["estado"], created_at: string): Incidencia => ({
    id, ubicacion: "x", descripcion: "xxxxx", prioridad, estado, created_at,
  });
  it("pone resueltas al final y alta prioridad primero", () => {
    const lista = [
      base(1, "alta", "resuelta", "2026-01-03"),
      base(2, "baja", "pendiente", "2026-01-02"),
      base(3, "alta", "pendiente", "2026-01-01"),
    ];
    expect(ordenarIncidencias(lista).map((i) => i.id)).toEqual([3, 2, 1]);
  });
});
