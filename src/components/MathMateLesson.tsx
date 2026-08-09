import { useState } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

// ---------- schema is intentionally loose: MathMate Bab JSON varies field-to-field ----------
type AnyObj = Record<string, any>;

export interface MathMateLessonProps {
  data: { Bab: AnyObj };
}

const STAGE_LABELS: Record<string, string> = {
  intro: "Soalan",
  Hook: "Mulakan",
  Try: "Cuba",
  Prediction: "Ramalan",
  Problem: "Masalah",
  Reveal: "Pendedahan",
  Build: "Bina faham",
  Formalism: "Formal",
  Connect: "Kaitan",
  Practice: "Latihan",
  Vary: "Variasi",
  Check: "Semak faham",
  Kesilapan_Biasa: "Kesilapan biasa",
};
const CORAL_STAGES = new Set(["Check", "Kesilapan_Biasa"]);

function isMathLike(s: string): boolean {
  const t = s.trim();
  if (!t || t.length > 60) return false;
  return /^[0-9xyzpq\s+\-*/=.(),²³]+$/.test(t) && /[=+\-*/]/.test(t) && /[0-9xyzpq]/.test(t);
}

function prettify(k: string): string {
  return k.replace(/_/g, " ");
}

function Katex({ expr }: { expr: string }) {
  const html = katex.renderToString(expr, { throwOnError: false });
  return <div className="py-3 text-center text-lg" dangerouslySetInnerHTML={{ __html: html }} />;
}

function RenderValue({ val }: { val: any }) {
  if (val === null || val === undefined) return null;

  if (typeof val === "string") {
    if (isMathLike(val)) return <Katex expr={val} />;
    return <p className="mb-2 text-[15px] leading-relaxed">{val}</p>;
  }

  if (typeof val === "number") return <p className="mb-2 text-[15px]">{val}</p>;

  if (Array.isArray(val)) {
    if (val.every((v) => typeof v === "string")) {
      return (
        <ul className="list-disc pl-5 mb-2 space-y-1">
          {val.map((v, i) =>
            isMathLike(v) ? (
              <li key={i}>
                <Katex expr={v} />
              </li>
            ) : (
              <li key={i} className="text-[15px] leading-relaxed">
                {v}
              </li>
            )
          )}
        </ul>
      );
    }
    return (
      <>
        {val.map((v, i) => (
          <div key={i} className="bg-[#F4F3EF] dark:bg-[#2A2823] rounded-[10px] p-3 mb-2">
            <RenderValue val={v} />
          </div>
        ))}
      </>
    );
  }

  if (typeof val === "object") {
    return (
      <>
        {Object.entries(val).map(([k, v]) => {
          if (k === "ID" || k === "Step") return null;
          return (
            <div key={k} className="mb-3">
              <div className="text-xs font-bold text-[#6B6960] dark:text-[#B7B4A9] mb-1 capitalize">
                {prettify(k)}
              </div>
              <RenderValue val={v} />
            </div>
          );
        })}
      </>
    );
  }

  return null;
}

function PracticeBlock({ practice }: { practice: any }) {
  if (Array.isArray(practice)) return <RenderValue val={practice} />;
  return (
    <>
      {Object.entries(practice).map(([k, v]) =>
        /^Tahap_/i.test(k) ? (
          <div key={k}>
            <div className="text-[13px] font-bold text-[#6B6960] dark:text-[#B7B4A9] mt-3 mb-1.5">
              {prettify(k)}
            </div>
            <RenderValue val={v} />
          </div>
        ) : (
          <RenderValue key={k} val={{ [k]: v }} />
        )
      )}
    </>
  );
}

function CheckBlock({ check }: { check: any }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const soalan: string[] | undefined = check?.Soalan_Makna || check?.Soalan_Prosedur || check?.Soalan;
  const kriteria: string | undefined = check?.Kriteria_Lulus;
  if (!soalan) return <RenderValue val={check} />;
  return (
    <>
      {soalan.map((q, i) => (
        <div key={i} className="bg-[#F4F3EF] dark:bg-[#2A2823] rounded-[10px] p-3 mb-2">
          <p className="mb-1.5 text-[15px]">{q}</p>
          {kriteria && (
            <>
              <span
                className="text-[13px] font-bold text-[#D85A30] dark:text-[#F5C4B3] cursor-pointer"
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
              >
                Lihat kriteria faham
              </span>
              {openIdx === i && (
                <div className="mt-2 px-3 py-2 bg-[#FAECE7] dark:bg-[#993C1D] text-[#D85A30] dark:text-[#F5C4B3] rounded-[10px] text-[13px]">
                  {kriteria}
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </>
  );
}

interface Screen {
  key: string;
  label: string;
  node: React.ReactNode;
}

function buildFlow(p: AnyObj): Screen[] {
  const screens: Screen[] = [];
  screens.push({
    key: "intro",
    label: STAGE_LABELS.intro,
    node: (
      <>
        <h3 className="text-lg font-bold mb-1">{p.Persoalan}</h3>
        {p.Standard_Pembelajaran && (
          <p className="text-[#6B6960] dark:text-[#B7B4A9] text-sm mb-2">{p.Standard_Pembelajaran}</p>
        )}
        {p.Objektif_Pemahaman && <RenderValue val={p.Objektif_Pemahaman} />}
      </>
    ),
  });

  const pp = p.Pengalaman_Permulaan || {};
  (["Hook", "Try", "Prediction", "Problem", "Reveal"] as const).forEach((k) => {
    if (pp[k] !== undefined) screens.push({ key: k, label: STAGE_LABELS[k], node: <RenderValue val={pp[k]} /> });
  });

  (["Build", "Formalism", "Connect"] as const).forEach((k) => {
    if (p[k] !== undefined) screens.push({ key: k, label: STAGE_LABELS[k], node: <RenderValue val={p[k]} /> });
  });

  if (p.Practice !== undefined)
    screens.push({ key: "Practice", label: STAGE_LABELS.Practice, node: <PracticeBlock practice={p.Practice} /> });
  if (p.Vary !== undefined) screens.push({ key: "Vary", label: STAGE_LABELS.Vary, node: <RenderValue val={p.Vary} /> });
  if (p.Check !== undefined) screens.push({ key: "Check", label: STAGE_LABELS.Check, node: <CheckBlock check={p.Check} /> });
  if (p.Kesilapan_Biasa !== undefined)
    screens.push({
      key: "Kesilapan_Biasa",
      label: STAGE_LABELS.Kesilapan_Biasa,
      node: <RenderValue val={p.Kesilapan_Biasa} />,
    });

  return screens;
}

type View = "home" | "subtopik" | "flow";

export default function MathMateLesson({ data }: MathMateLessonProps) {
  const bab = data.Bab;
  const [view, setView] = useState<View>("home");
  const [subtopikIdx, setSubtopikIdx] = useState<number | null>(null);
  const [persoalanIdx, setPersoalanIdx] = useState<number | null>(null);
  const [stageIdx, setStageIdx] = useState(0);

  const goHome = () => {
    setView("home");
    setSubtopikIdx(null);
    setPersoalanIdx(null);
    setStageIdx(0);
  };
  const goSubtopik = (i: number) => {
    setView("subtopik");
    setSubtopikIdx(i);
    setPersoalanIdx(null);
    setStageIdx(0);
  };
  const goFlow = (si: number, pi: number) => {
    setView("flow");
    setSubtopikIdx(si);
    setPersoalanIdx(pi);
    setStageIdx(0);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#171613] text-[#1C1B18] dark:text-[#F3F1EA] font-sans">
      <div className="max-w-[480px] mx-auto px-4 pt-5 pb-12">
        {view === "home" && (
          <>
            <div className="mb-5">
              <h1 className="text-2xl font-bold mb-1">{bab.Nama}</h1>
              <p className="text-[#6B6960] dark:text-[#B7B4A9] text-sm">{bab.Subtopik.length} subtopik</p>
            </div>
            {bab.Subtopik.map((st: AnyObj, i: number) => (
              <button
                key={st.ID}
                onClick={() => goSubtopik(i)}
                className="block w-full text-left bg-white dark:bg-[#211F1B] border border-[#E5E3DC] dark:border-[#3A382F] rounded-2xl p-[18px] mb-3 active:scale-[0.98] transition-transform"
              >
                <span className="inline-block text-xs font-bold text-[#0F6E56] dark:text-[#9FE1CB] bg-[#E1F5EE] dark:bg-[#0F6E56] px-[9px] py-[3px] rounded-full mb-2">
                  {st.ID}
                </span>
                <h3 className="font-bold mb-1">{st.Nama_Subtopik}</h3>
                <p className="text-[#6B6960] dark:text-[#B7B4A9] text-sm">
                  {(st.Matlamat_Utama || "").slice(0, 110)}
                  {st.Matlamat_Utama?.length > 110 ? "…" : ""}
                </p>
              </button>
            ))}
          </>
        )}

        {view === "subtopik" && subtopikIdx !== null && (
          <>
            <button onClick={goHome} className="text-[#6B6960] dark:text-[#B7B4A9] text-sm mb-4">
              &larr; Bab
            </button>
            <div className="mb-5">
              <h2 className="text-xl font-bold mb-1">{bab.Subtopik[subtopikIdx].Nama_Subtopik}</h2>
              <p className="text-[#6B6960] dark:text-[#B7B4A9] text-sm">{bab.Subtopik[subtopikIdx].Matlamat_Utama}</p>
            </div>
            {bab.Subtopik[subtopikIdx].Persoalan_Utama.map((p: AnyObj, i: number) => (
              <button
                key={p.ID}
                onClick={() => goFlow(subtopikIdx, i)}
                className="block w-full text-left bg-white dark:bg-[#211F1B] border border-[#E5E3DC] dark:border-[#3A382F] rounded-2xl p-[18px] mb-3 active:scale-[0.98] transition-transform"
              >
                <span className="inline-block text-xs font-bold text-[#0F6E56] dark:text-[#9FE1CB] bg-[#E1F5EE] dark:bg-[#0F6E56] px-[9px] py-[3px] rounded-full mb-2">
                  {p.ID}
                </span>
                <p className="font-medium">{p.Persoalan}</p>
              </button>
            ))}
          </>
        )}

        {view === "flow" && subtopikIdx !== null && persoalanIdx !== null && (
          (() => {
            const st = bab.Subtopik[subtopikIdx];
            const p = st.Persoalan_Utama[persoalanIdx];
            const screens = buildFlow(p);
            const idx = Math.max(0, Math.min(stageIdx, screens.length - 1));
            const s = screens[idx];
            return (
              <>
                <button onClick={() => goSubtopik(subtopikIdx)} className="text-[#6B6960] dark:text-[#B7B4A9] text-sm mb-4">
                  &larr; {st.ID}
                </button>
                <div className="flex gap-[5px] mb-4">
                  {screens.map((_, i) => (
                    <span
                      key={i}
                      className={`flex-1 h-[3px] rounded-full ${
                        i <= idx ? "bg-[#0F6E56]" : "bg-[#E5E3DC] dark:bg-[#3A382F]"
                      }`}
                    />
                  ))}
                </div>
                <div className="bg-white dark:bg-[#211F1B] border border-[#E5E3DC] dark:border-[#3A382F] rounded-2xl p-5 min-h-[280px] flex flex-col">
                  <div
                    className={`text-xs font-bold uppercase tracking-wide mb-2.5 ${
                      CORAL_STAGES.has(s.key)
                        ? "text-[#D85A30] dark:text-[#F5C4B3]"
                        : "text-[#0F6E56] dark:text-[#9FE1CB]"
                    }`}
                  >
                    {s.label}
                  </div>
                  {s.node}
                </div>
                <div className="flex gap-2.5 mt-4">
                  <button
                    disabled={idx === 0}
                    onClick={() => setStageIdx(idx - 1)}
                    className="flex-1 py-[11px] rounded-[10px] border border-[#E5E3DC] dark:border-[#3A382F] bg-[#F4F3EF] dark:bg-[#2A2823] text-sm font-medium disabled:opacity-40"
                  >
                    Kembali
                  </button>
                  <button
                    onClick={() => (idx === screens.length - 1 ? goSubtopik(subtopikIdx) : setStageIdx(idx + 1))}
                    className="flex-1 py-[11px] rounded-[10px] bg-[#0F6E56] text-white text-sm font-medium"
                  >
                    {idx === screens.length - 1 ? "Selesai" : "Seterusnya"}
                  </button>
                </div>
              </>
            );
          })()
        )}
      </div>
    </div>
  );
}
