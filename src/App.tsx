import { useEffect, useState, type ReactNode, type ChangeEvent } from "react";

/**
 * CAUJARAL — Alineación Estratégica (90 min)
 * Una sola página (bloques A–F) · Tema oscuro con línea superior 3px en header y cards
 * Exportar TXT legible · SID por pestaña (sessionStorage) + autosave por SID (localStorage)
 */

/* ======================== Tipos ======================== */
export type UUID = string;

export interface Frase {
  id: UUID;
  texto: string;
  simbolo: string;
}
export interface FortalezaReto {
  id: UUID;
  texto: string;
  anecdota: string;
}
export interface HMW {
  id: UUID;
  texto: string;
}
export interface CapRow {
  id: UUID;
  capacidad: string;
  importancia: number;
  nivel: number;
  comentario: string;
  responsable: string;
}
export interface InterfaceRow {
  id: UUID;
  areas: string;
  momento: string;
  regla: string;
  responsable: string;
}
export interface Part1 {
  bloqueA: { frases: Frase[] };
  bloqueB: { fortalezas: FortalezaReto[]; retos: FortalezaReto[] };
  bloqueC: { preguntasHMW: HMW[] };
  bloqueD: { capacidades: CapRow[] };
}
export interface Part2 {
  bloqueE: {
    aspiracion: string;
    capacidadCritica: string;
    barreraUrgente: string;
  };
  bloqueF: { interfaces: InterfaceRow[] };
}
export interface Meta {
  titulo: string;
  sessionId: string;
  lastSavedAt: string | null;
}
export interface AppState {
  version: string;
  meta: Meta;
  part1: Part1;
  part2: Part2;
}

/* ======================== Constantes ======================== */
const VERSION = "CaujaralCanvas-v1";
const DEFAULT_CAPACIDADES: string[] = [
  "Servicio al socio",
  "Deportes",
  "Alimentos y bebidas",
  "Infraestructura y mantenimiento",
  "Tecnología y datos",
  "Comunicación y marca",
  "Finanzas y administración",
  "Recursos humanos y formación",
];
const newId = () => crypto.randomUUID();

/* ======================== Estado inicial ======================== */
const initialState = (sid: string): AppState => ({
  version: VERSION,
  meta: {
    titulo:
      "1 · Alineación estratégica — Traducir la estrategia del club en lineamientos clave para el proyecto (90 min)",
    sessionId: sid,
    lastSavedAt: null,
  },
  part1: {
    bloqueA: {
      frases: [
        { id: newId(), texto: "", simbolo: "" },
        { id: newId(), texto: "", simbolo: "" },
      ],
    },
    bloqueB: { fortalezas: [], retos: [] },
    bloqueC: {
      preguntasHMW: [
        { id: newId(), texto: "" },
        { id: newId(), texto: "" },
      ],
    },
    bloqueD: {
      capacidades: DEFAULT_CAPACIDADES.map((c) => ({
        id: newId(),
        capacidad: c,
        importancia: 3,
        nivel: 3,
        comentario: "",
        responsable: "",
      })),
    },
  },
  part2: {
    bloqueE: { aspiracion: "", capacidadCritica: "", barreraUrgente: "" },
    bloqueF: {
      interfaces: [
        { id: newId(), areas: "", momento: "", regla: "", responsable: "" },
      ],
    },
  },
});

/* ======================== Utilidades ======================== */
function downloadFile(
  content: string,
  filename: string,
  mime = "text/plain;charset=utf-8"
) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function formatTxt(s: AppState): string {
  const L: string[] = [];
  const ts = new Date().toLocaleString();
  L.push("CAUJARAL — Alineación Estratégica (90 min)");
  L.push("Resumen legible para lectura posterior");
  L.push("—".repeat(72));
  L.push(`Sesión: ${s.meta.sessionId}`);
  L.push(`Exportado: ${ts}`);
  L.push("");

  L.push("A — Lo que hace único a Caujaral");
  if (s.part1.bloqueA.frases.length === 0) L.push("  (Sin contenido)");
  else
    s.part1.bloqueA.frases.forEach((f, i) =>
      L.push(`  ${i + 1}. ${f.simbolo ? f.simbolo + " " : ""}${f.texto}`)
    );
  L.push("");

  L.push("B — Fortalezas y Retos");
  L.push("  Fortalezas:");
  if (!s.part1.bloqueB.fortalezas.length) L.push("    — (sin elementos)");
  else
    s.part1.bloqueB.fortalezas.forEach((it, i) =>
      L.push(
        `    ${i + 1}. ${it.texto}${
          it.anecdota ? " — Anécdota: " + it.anecdota : ""
        }`
      )
    );
  L.push("  Retos:");
  if (!s.part1.bloqueB.retos.length) L.push("    — (sin elementos)");
  else
    s.part1.bloqueB.retos.forEach((it, i) =>
      L.push(
        `    ${i + 1}. ${it.texto}${
          it.anecdota ? " — Anécdota: " + it.anecdota : ""
        }`
      )
    );
  L.push("");

  L.push("C — ¿Cómo podríamos…? (HMW)");
  if (!s.part1.bloqueC.preguntasHMW.length) L.push("  — (sin preguntas)");
  else
    s.part1.bloqueC.preguntasHMW.forEach((q, i) =>
      L.push(`  ${i + 1}. ${q.texto}`)
    );
  L.push("");

  L.push("D — Mapa de Capacidades");
  s.part1.bloqueD.capacidades.forEach((c, i) => {
    const star = c.importancia >= 4 && c.nivel <= 2 ? " *PRIORIDAD" : "";
    L.push(
      `  ${i + 1}. ${c.capacidad} — Importancia: ${c.importancia} · Nivel: ${
        c.nivel
      }${star}${c.responsable ? " — Responsable: " + c.responsable : ""}${
        c.comentario ? " — Comentario: " + c.comentario : ""
      }`
    );
  });
  L.push("");

  L.push("E — Frase estratégica del grupo");
  L.push(
    `  Si el Club Caujaral quiere ser reconocido por: ${
      s.part2.bloqueE.aspiracion || "[sin definir]"
    },\n` +
      `  entonces necesitamos fortalecer nuestra capacidad para: ${
        s.part2.bloqueE.capacidadCritica || "[sin definir]"
      },\n` +
      `  y debemos resolver cuanto antes: ${
        s.part2.bloqueE.barreraUrgente || "[sin definir]"
      }.`
  );
  L.push("");

  L.push("F — Interfaces entre áreas (Cruces clave)");
  if (!s.part2.bloqueF.interfaces.length) L.push("  — (sin cruces)");
  else
    s.part2.bloqueF.interfaces.forEach((r, i) =>
      L.push(
        `  ${i + 1}. Áreas: ${r.areas} — Momento: ${r.momento} — Regla: ${
          r.regla
        } — Responsable: ${r.responsable}`
      )
    );

  L.push("");
  L.push("FIN");
  return L.join("\n");
}

/* ======================== UI helpers ======================== */
/* Paleta inspirada en la imagen:
   Fondo: #0b1220 · Cards: #0e1726 · Controles: #0f1b2e · Bordes: #22314a
   Accentos: gradiente cian→azul→violeta
*/
const Badge = ({ children }: { children: ReactNode }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border border-blue-700 bg-blue-600/15 text-blue-200">
    {children}
  </span>
);

const ToolbarButton = ({
  onClick,
  children,
}: {
  onClick?: () => void;
  children: ReactNode;
}) => (
  <button
    onClick={onClick}
    className="inline-flex items-center gap-2 rounded-xl border border-[#22314a] bg-[#0b1220] px-3 py-2 text-sm font-medium text-slate-200 shadow-sm hover:bg-[#0f1b2e] active:scale-[0.99]"
  >
    {children}
  </button>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  const { className = "", ...rest } = props;
  return (
    <input
      {...rest}
      className={`w-full rounded-xl border border-[#2a3a52] bg-[#0f1b2e] px-3 py-2 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
};

const TextArea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  const { className = "", ...rest } = props;
  return (
    <textarea
      {...rest}
      className={`w-full min-h-[76px] rounded-xl border border-[#2a3a52] bg-[#0f1b2e] px-3 py-2 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
};

const ImportanceCell = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) => (
  <select
    value={value}
    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
      onChange(Number(e.target.value))
    }
    className="w-full rounded-lg border border-[#2a3a52] bg-[#0f1b2e] px-2 py-1 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    {[1, 2, 3, 4, 5].map((n) => (
      <option key={n} value={n}>
        {n}
      </option>
    ))}
  </select>
);

const SectionCard = ({
  title,
  subtitle,
  emoji,
  children,
  anchor,
}: {
  title: string;
  subtitle?: string;
  emoji?: string;
  children: ReactNode;
  anchor?: string;
}) => (
  <section id={anchor} className="relative">
    <div className="relative rounded-2xl border border-[#22314a] bg-[#0e1726]/80 shadow-sm backdrop-blur-sm overflow-hidden">
      {/* Línea superior 3px a todo el ancho (cian → azul → violeta) */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500" />
      <div className="flex items-start justify-between gap-4 border-b border-[#22314a] p-4 md:p-5">
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-slate-100 flex items-center gap-2">
            <span className="text-xl md:text-2xl">{emoji}</span>
            {title}
          </h3>
          {subtitle && (
            <p className="mt-1 text-sm text-slate-300 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        {/* símbolo # eliminado */}
      </div>
      <div className="p-4 md:p-6 text-slate-200">{children}</div>
    </div>
  </section>
);

/* ======================== App ======================== */
export default function CaujaralCanvas() {
  /** SID por pestaña: estable y simultáneo */
  const [sid] = useState<string>(() => {
    const KEY = "caujaral_sid";
    let s = sessionStorage.getItem(KEY);
    if (!s) {
      s = crypto.randomUUID();
      sessionStorage.setItem(KEY, s);
    }
    return s;
  });

  const [state, setState] = useState<AppState>(() => initialState(sid));

  // Smoke checks ligeros
  useEffect(() => {
    try {
      console.assert(state.version === VERSION, "VERSION incorrecta");
      console.assert(
        Array.isArray(state.part1.bloqueA.frases),
        "Frases debe ser array"
      );
    } catch {}
  }, []);

  // Autosave namespaced por SID
  useEffect(() => {
    const key = `caujaral_matrix_${state.meta.sessionId}`;
    const next: AppState = {
      ...state,
      meta: { ...state.meta, lastSavedAt: new Date().toISOString() },
    };
    localStorage.setItem(key, JSON.stringify(next));
  }, [state]);

  /* ====== Acciones de toolbar ====== */
  const handleExportTxt = () =>
    downloadFile(
      formatTxt(state),
      `Caujaral_Canvas_${state.meta.sessionId}.txt`
    );
  const handleReset = () => {
    if (
      confirm(
        "¿Restablecer el canvas actual? Se generará una nueva sesión aleatoria."
      )
    ) {
      const newSid = crypto.randomUUID();
      sessionStorage.setItem("caujaral_sid", newSid);
      setState(() => initialState(newSid));
    }
  };

  /* ====== Mutaciones ====== */
  const addFortaleza = () =>
    setState((p) => ({
      ...p,
      part1: {
        ...p.part1,
        bloqueB: {
          ...p.part1.bloqueB,
          fortalezas: [
            ...p.part1.bloqueB.fortalezas,
            { id: newId(), texto: "", anecdota: "" },
          ],
        },
      },
    }));
  const addReto = () =>
    setState((p) => ({
      ...p,
      part1: {
        ...p.part1,
        bloqueB: {
          ...p.part1.bloqueB,
          retos: [
            ...p.part1.bloqueB.retos,
            { id: newId(), texto: "", anecdota: "" },
          ],
        },
      },
    }));

  const removeItem = (path: string[], id: UUID) => {
    setState((prev) => {
      const clone: AppState = structuredClone(prev);
      let ref: any = clone;
      for (let i = 0; i < path.length - 1; i++) ref = ref[path[i]];
      const key = path[path.length - 1];
      ref[key] = ref[key].filter((it: any) => it.id !== id);
      return clone;
    });
  };

  const updateField = (
    path: string[],
    id: UUID,
    field: string,
    value: unknown
  ) => {
    setState((prev) => {
      const clone: AppState = structuredClone(prev);
      let ref: any = clone;
      for (let i = 0; i < path.length - 1; i++) ref = ref[path[i]];
      const key = path[path.length - 1];
      ref[key] = ref[key].map((it: any) =>
        it.id === id ? { ...it, [field]: value } : it
      );
      return clone;
    });
  };

  const pushRow = (path: string[], row: unknown) => {
    setState((prev) => {
      const clone: AppState = structuredClone(prev);
      let ref: any = clone;
      for (let i = 0; i < path.length - 1; i++) ref = ref[path[i]];
      const key = path[path.length - 1];
      ref[key] = [...ref[key], row];
      return clone;
    });
  };

  const updateValue = (path: string[], value: unknown) => {
    setState((prev) => {
      const clone: AppState = structuredClone(prev);
      let ref: any = clone;
      for (let i = 0; i < path.length - 1; i++) ref = ref[path[i]];
      const key = path[path.length - 1];
      ref[key] = value;
      return clone;
    });
  };

  /* ======================== UI ======================== */
  return (
    <div className="min-h-screen w-full bg-[#0b1220] text-slate-100">
      {/* Topbar */}
      <div className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-[#0b1220]/85 bg-[#0b1220]/90 border-b border-[#22314a]">
        <div className="mx-auto max-w-7xl px-4 py-3 md:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-inner shadow-blue-900/30 flex items-center justify-center">
                <span className="text-white text-lg" aria-hidden>
                  🧭
                </span>
              </div>
              <div>
                <h1 className="text-base md:text-lg font-semibold">
                  Alineación Estratégica (Parte 1)
                </h1>
                <p className="text-xs md:text-sm text-slate-300">
                  Traducir la estrategia del club en lineamientos clave · 90 min
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ToolbarButton onClick={handleExportTxt}>
                <span className="i-lucide-download h-4 w-4" /> Exportar TXT
              </ToolbarButton>
              <ToolbarButton onClick={handleReset}>
                <span className="i-lucide-rotate-ccw h-4 w-4" /> Reset
              </ToolbarButton>
            </div>
          </div>
        </div>
        {/* Línea superior 3px a todo el ancho del header */}
        <div className="h-[3px] bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500" />
      </div>

      <main className="mx-auto max-w-7xl px-4 py-6 md:py-8 space-y-6">
        {/* Objetivo */}
        <section className="relative rounded-2xl border border-[#22314a] bg-[#0e1726]/80 shadow-sm p-5 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500" />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <Badge>🧭 Objetivo</Badge>
              <h2 className="text-xl md:text-2xl font-semibold">
                Organizar funciones por capas y clarificar responsabilidades
                clave
              </h2>
              <p className="text-sm text-slate-300 max-w-3xl">
                Clasifiquen tareas del Club en <strong>Estratégica</strong>,{" "}
                <strong>Integrativa</strong> u <strong>Operativa</strong>;
                asocien un área responsable. Completen el{" "}
                <strong>Mini RACI</strong> para seis funciones críticas.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge>⏱️ 90 min</Badge>
              <Badge>Local ✓</Badge>
            </div>
          </div>
        </section>

        {/* A */}
        <SectionCard
          anchor="bloque-a"
          emoji="🟢"
          title="SECCIÓN A — Lo que hace único a Caujaral"
          subtitle="Escriban 2–3 frases clave; pueden añadir un concepto breve."
        >
          <div className="grid md:grid-cols-3 gap-4">
            {state.part1.bloqueA.frases.map((f, idx) => (
              <div
                key={f.id}
                className="rounded-xl border border-[#22314a] p-3 bg-[#0e1726]/70"
              >
                <div className="text-[11px] text-slate-400 mb-1">
                  Frase #{idx + 1}
                </div>
                <Input
                  value={f.texto}
                  onChange={(e) =>
                    updateField(
                      ["part1", "bloqueA", "frases"],
                      f.id,
                      "texto",
                      e.target.value
                    )
                  }
                  placeholder="Escribe la idea principal…"
                />
                <div className="mt-2 flex items-center gap-2">
                  <Input
                    value={f.simbolo}
                    onChange={(e) =>
                      updateField(
                        ["part1", "bloqueA", "frases"],
                        f.id,
                        "simbolo",
                        e.target.value
                      )
                    }
                    placeholder="Palabra o concepto clave"
                    className="w-1/2"
                  />
                  <ToolbarButton
                    onClick={() =>
                      removeItem(["part1", "bloqueA", "frases"], f.id)
                    }
                  >
                    Eliminar
                  </ToolbarButton>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <ToolbarButton
              onClick={() =>
                pushRow(["part1", "bloqueA", "frases"], {
                  id: newId(),
                  texto: "",
                  simbolo: "",
                })
              }
            >
              + Agregar frase
            </ToolbarButton>
          </div>
        </SectionCard>

        {/* B */}
        <SectionCard
          anchor="bloque-b"
          emoji="💎"
          title="SECCIÓN B — Fortalezas y Retos"
          subtitle="Documenten fortalezas y retos clave."
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* Fortalezas */}
            <div>
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-slate-100">Fortalezas</h4>
              </div>
              <div className="mt-3 space-y-3">
                {state.part1.bloqueB.fortalezas.map((it) => (
                  <div
                    key={it.id}
                    className="rounded-xl border border-[#2a3a52] bg-blue-900/10 p-3"
                  >
                    <Input
                      value={it.texto}
                      onChange={(e) =>
                        updateField(
                          ["part1", "bloqueB", "fortalezas"],
                          it.id,
                          "texto",
                          e.target.value
                        )
                      }
                      placeholder="Describe la fortaleza…"
                    />
                    <TextArea
                      value={it.anecdota}
                      onChange={(e) =>
                        updateField(
                          ["part1", "bloqueB", "fortalezas"],
                          it.id,
                          "anecdota",
                          e.target.value
                        )
                      }
                      placeholder="Anécdota breve (opcional)"
                      className="mt-2"
                    />
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() =>
                          removeItem(["part1", "bloqueB", "fortalezas"], it.id)
                        }
                        className="ml-auto text-sm text-slate-300 hover:text-slate-100"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <ToolbarButton onClick={addFortaleza}>
                  + Agregar fortaleza
                </ToolbarButton>
              </div>
            </div>

            {/* Retos */}
            <div>
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-slate-100">Retos</h4>
              </div>
              <div className="mt-3 space-y-3">
                {state.part1.bloqueB.retos.map((it) => (
                  <div
                    key={it.id}
                    className="rounded-xl border border-[#2a3a52] bg-[#0f1b2e]/70 p-3"
                  >
                    <Input
                      value={it.texto}
                      onChange={(e) =>
                        updateField(
                          ["part1", "bloqueB", "retos"],
                          it.id,
                          "texto",
                          e.target.value
                        )
                      }
                      placeholder="Describe el reto…"
                    />
                    <TextArea
                      value={it.anecdota}
                      onChange={(e) =>
                        updateField(
                          ["part1", "bloqueB", "retos"],
                          it.id,
                          "anecdota",
                          e.target.value
                        )
                      }
                      placeholder="Anécdota breve (opcional)"
                      className="mt-2"
                    />
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() =>
                          removeItem(["part1", "bloqueB", "retos"], it.id)
                        }
                        className="ml-auto text-sm text-slate-300 hover:text-slate-100"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <ToolbarButton onClick={addReto}>+ Agregar reto</ToolbarButton>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* C */}
        <SectionCard
          anchor="bloque-c"
          emoji="❓"
          title="SECCIÓN C — Convertir retos en oportunidades (How Might We…)"
          subtitle="Seleccionen al menos 2 retos y reescríbanlos como preguntas orientadas a solución."
        >
          <div className="space-y-3">
            {state.part1.bloqueC.preguntasHMW.map((q) => (
              <div key={q.id} className="flex items-start gap-2">
                <div className="pt-2">•</div>
                <Input
                  value={q.texto}
                  onChange={(e) =>
                    updateField(
                      ["part1", "bloqueC", "preguntasHMW"],
                      q.id,
                      "texto",
                      e.target.value
                    )
                  }
                  placeholder="¿Cómo podríamos…?"
                />
                <button
                  onClick={() =>
                    removeItem(["part1", "bloqueC", "preguntasHMW"], q.id)
                  }
                  className="text-sm text-slate-300 hover:text-slate-100"
                >
                  Eliminar
                </button>
              </div>
            ))}
            <ToolbarButton
              onClick={() =>
                pushRow(["part1", "bloqueC", "preguntasHMW"], {
                  id: newId(),
                  texto: "",
                })
              }
            >
              + Agregar pregunta HMW
            </ToolbarButton>
          </div>
        </SectionCard>

        {/* D */}
        <SectionCard
          anchor="bloque-d"
          emoji="🔥"
          title="SECCIÓN D — Mapa de Capacidades Organizativas"
          subtitle="Importancia (1–5) · Nivel actual (1–5)."
        >
          <div className="overflow-auto">
            <table className="w-full min-w-[800px] text-sm">
              <thead>
                <tr className="text-left text-slate-300">
                  <th className="py-2 pr-4">Capacidad</th>
                  <th className="py-2 pr-4">Importancia</th>
                  <th className="py-2 pr-4">Nivel actual</th>
                  <th className="py-2 pr-4">Comentario</th>
                  <th className="py-2 pr-4">Responsable</th>
                </tr>
              </thead>
              <tbody>
                {state.part1.bloqueD.capacidades.map((row) => (
                  <tr key={row.id} className="border-t border-[#22314a]">
                    <td className="py-2 pr-4 font-medium text-slate-100">
                      {row.capacidad}
                    </td>
                    <td className="py-2 pr-4">
                      <ImportanceCell
                        value={row.importancia}
                        onChange={(v) =>
                          updateField(
                            ["part1", "bloqueD", "capacidades"],
                            row.id,
                            "importancia",
                            v
                          )
                        }
                      />
                    </td>
                    <td className="py-2 pr-4">
                      <ImportanceCell
                        value={row.nivel}
                        onChange={(v) =>
                          updateField(
                            ["part1", "bloqueD", "capacidades"],
                            row.id,
                            "nivel",
                            v
                          )
                        }
                      />
                    </td>
                    <td className="py-2 pr-4">
                      <Input
                        value={row.comentario}
                        onChange={(e) =>
                          updateField(
                            ["part1", "bloqueD", "capacidades"],
                            row.id,
                            "comentario",
                            e.target.value
                          )
                        }
                        placeholder="Comentario breve"
                      />
                    </td>
                    <td className="py-2 pr-4">
                      <Input
                        value={row.responsable}
                        onChange={(e) =>
                          updateField(
                            ["part1", "bloqueD", "capacidades"],
                            row.id,
                            "responsable",
                            e.target.value
                          )
                        }
                        placeholder="Nombre del responsable"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* E */}
        <SectionCard
          anchor="bloque-e"
          emoji="🔷"
          title="SECCIÓN E — Frase estratégica del grupo"
          subtitle="Si el Club quiere ser reconocido por [aspiración], entonces necesitamos fortalecer [capacidad], y debemos resolver cuanto antes [barrera]."
        >
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-slate-400">
                Aspiración futura
              </label>
              <TextArea
                value={state.part2.bloqueE.aspiracion}
                onChange={(e) =>
                  updateValue(
                    ["part2", "bloqueE", "aspiracion"],
                    e.target.value
                  )
                }
                placeholder="Descripción aspiracional…"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400">
                Capacidad organizativa a fortalecer
              </label>
              <TextArea
                value={state.part2.bloqueE.capacidadCritica}
                onChange={(e) =>
                  updateValue(
                    ["part2", "bloqueE", "capacidadCritica"],
                    e.target.value
                  )
                }
                placeholder="p. ej., Coordinación inter-áreas, Gestión de reservas…"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400">
                Barrera o problema urgente
              </label>
              <TextArea
                value={state.part2.bloqueE.barreraUrgente}
                onChange={(e) =>
                  updateValue(
                    ["part2", "bloqueE", "barreraUrgente"],
                    e.target.value
                  )
                }
                placeholder="¿Qué impide avanzar hoy?"
              />
            </div>
          </div>
        </SectionCard>

        {/* F */}
        <SectionCard
          anchor="bloque-f"
          emoji="🧩"
          title="SECCIÓN F — Interfaces entre áreas (Cruces clave)"
          subtitle="Identifiquen momentos donde dos o más áreas se cruzan y definan un estándar simple de coordinación."
        >
          <div className="overflow-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="text-left text-slate-300">
                  <th className="py-2 pr-4">Áreas que se cruzan</th>
                  <th className="py-2 pr-4">Momento</th>
                  <th className="py-2 pr-4">Regla / acuerdo</th>
                  <th className="py-2 pr-4">Responsable de la interfaz</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {state.part2.bloqueF.interfaces.map((row) => (
                  <tr key={row.id} className="border-t border-[#22314a]">
                    <td className="py-2 pr-4">
                      <Input
                        value={row.areas}
                        onChange={(e) =>
                          updateField(
                            ["part2", "bloqueF", "interfaces"],
                            row.id,
                            "areas",
                            e.target.value
                          )
                        }
                        placeholder="p. ej., Eventos y A&B"
                      />
                    </td>
                    <td className="py-2 pr-4">
                      <Input
                        value={row.momento}
                        onChange={(e) =>
                          updateField(
                            ["part2", "bloqueF", "interfaces"],
                            row.id,
                            "momento",
                            e.target.value
                          )
                        }
                        placeholder="p. ej., Organización de fiestas privadas"
                      />
                    </td>
                    <td className="py-2 pr-4">
                      <Input
                        value={row.regla}
                        onChange={(e) =>
                          updateField(
                            ["part2", "bloqueF", "interfaces"],
                            row.id,
                            "regla",
                            e.target.value
                          )
                        }
                        placeholder="p. ej., Agenda definida con 10 días de antelación"
                      />
                    </td>
                    <td className="py-2 pr-4">
                      <Input
                        value={row.responsable}
                        onChange={(e) =>
                          updateField(
                            ["part2", "bloqueF", "interfaces"],
                            row.id,
                            "responsable",
                            e.target.value
                          )
                        }
                        placeholder="Nombre"
                      />
                    </td>
                    <td className="py-2 pr-4 text-right">
                      <button
                        onClick={() =>
                          removeItem(["part2", "bloqueF", "interfaces"], row.id)
                        }
                        className="text-sm text-slate-300 hover:text-slate-100"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3">
            <ToolbarButton
              onClick={() =>
                pushRow(["part2", "bloqueF", "interfaces"], {
                  id: newId(),
                  areas: "",
                  momento: "",
                  regla: "",
                  responsable: "",
                })
              }
            >
              + Agregar cruce
            </ToolbarButton>
          </div>
        </SectionCard>

        <div className="pb-12" />
      </main>

      {/* Iconos fallback */}
      <style>{`
        .i-lucide-download::before{content:"\\2193";}
        .i-lucide-rotate-ccw::before{content:"\\21BA";}
      `}</style>
    </div>
  );
}
