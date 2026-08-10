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
const CORAL_STAGES = new Set(["Check", "Kesilapan_Biasa", "Problem"]);

function isMathLike(s: string): boolean {
  const t = s.trim();
  if (!t || t.length > 60) return false;
  return /^[0-9xyzpq\s+\-*/=.(),²³]+$/.test(t) && /[=+\-*/]/.test(t) && /[0-9xyzpq]/.test(t);
}

function prettify(k: string): string {
  return k.replace(/_/g, " ");
}

function findKey(obj: AnyObj, patterns: RegExp[]): string | null {
  const keys = Object.keys(obj || {});
  for (const p of patterns) {
    const hit = keys.find((k) => p.test(k));
    if (hit) return hit;
  }
  return null;
}

function normalize(s: string): string {
  return String(s).trim().toLowerCase().replace(/\s+/g, " ");
}

// ---------- math rendering ----------

function Katex({ expr }: { expr: string }) {
  const html = katex.renderToString(expr, { throwOnError: false });
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

function tokenizeEquation(expr: string): string[] {
  return expr.match(/\d+\.?\d*|[a-zA-Z]|[+\-*/=()]/g) || [expr];
}

function EquationVisual({ expr }: { expr: string }) {
  const tokens = tokenizeEquation(expr);
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 py-5">
      {tokens.map((tok, i) => {
        if (/^\d+\.?\d*$/.test(tok)) {
          return (
            <div
              key={i}
              className="min-w-[44px] h-11 px-2 flex items-center justify-center rounded-xl border-2 border-[#E5E3DC] dark:border-[#3A382F] bg-white dark:bg-[#211F1B] text-lg font-bold"
            >
              {tok}
            </div>
          );
        }
        if (/^[a-zA-Z]$/.test(tok)) {
          return (
            <div
              key={i}
              className="min-w-[44px] h-11 px-2 flex items-center justify-center rounded-xl bg-[#E1F5EE] dark:bg-[#0F6E56] border-2 border-[#0F6E56] dark:border-[#9FE1CB] text-lg font-bold text-[#0F6E56] dark:text-[#9FE1CB]"
            >
              {tok}
            </div>
          );
        }
        if (tok === "=") {
          return (
            <div key={i} className="text-2xl font-bold text-[#6B6960] dark:text-[#B7B4A9] px-1">
              =
            </div>
          );
        }
        return (
          <div key={i} className="text-xl font-bold text-[#6B6960] dark:text-[#B7B4A9] px-1">
            {tok}
          </div>
        );
      })}
    </div>
  );
}

function MathBlock({ expr, visual }: { expr: string; visual?: boolean }) {
  if (visual) return <EquationVisual expr={expr} />;
  return (
    <div className="py-2 text-center text-base">
      <Katex expr={expr} />
    </div>
  );
}

// ---------- generic fallback renderer ----------

function RenderValue({ val, visual = false }: { val: any; visual?: boolean }) {
  if (val === null || val === undefined) return null;

  if (typeof val === "string") {
    if (isMathLike(val)) return <MathBlock expr={val} visual={visual} />;
    return <p className="mb-2 text-[15px] leading-relaxed">{val}</p>;
  }

  if (typeof val === "number") return <p className="mb-2 text-[15px]">{val}</p>;

  if (Array.isArray(val)) {
    if (val.every((v) => typeof v === "string")) {
      const mathCount = val.filter((v) => isMathLike(v)).length;
      if (val.length > 0 && mathCount / val.length >= 0.6) {
        return (
          <div className="flex flex-wrap gap-2 mb-2">
            {val.map((v, i) => (
              <div
                key={i}
                className="px-3 py-2 rounded-xl border border-[#E5E3DC] dark:border-[#3A382F] bg-[#F4F3EF] dark:bg-[#2A2823] text-sm"
              >
                {isMathLike(v) ? <Katex expr={v} /> : v}
              </div>
            ))}
          </div>
        );
      }
      return (
        <ul className="list-disc pl-5 mb-2 space-y-1">
          {val.map((v, i) => (
            <li key={i} className="text-[15px] leading-relaxed">
              {v}
            </li>
          ))}
        </ul>
      );
    }
    return (
      <>
        {val.map((v, i) => (
          <div key={i} className="bg-[#F4F3EF] dark:bg-[#2A2823] rounded-[10px] p-3 mb-2">
            <RenderValue val={v} visual={visual} />
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
              <RenderValue val={v} visual={visual} />
            </div>
          );
        })}
      </>
    );
  }

  return null;
}

// ---------- interactive Try / Prediction card ----------

function TryCard({ data }: { data: any }) {
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<"idle" | "correct" | "wrong">("idle");
  const [revealed, setRevealed] = useState(false);

  if (typeof data !== "object" || data === null) return <RenderValue val={data} />;

  const soalanKey = findKey(data, [/soalan/i, /question/i]);
  const jawapanKey = findKey(data, [/^jawapan$/i, /respons_diharapkan/i, /^answer$/i]);
  const tujuanKey = findKey(data, [/tujuan/i, /purpose/i]);

  if (!soalanKey) return <RenderValue val={data} />;

  const question = data[soalanKey];
  const correctAnswer = jawapanKey ? String(data[jawapanKey]) : null;

  const check = () => {
    if (!correctAnswer) return;
    setResult(normalize(answer) === normalize(correctAnswer) ? "correct" : "wrong");
  };

  return (
    <div>
      <p className="text-[15px] leading-relaxed mb-4 font-medium">{question}</p>

      {correctAnswer ? (
        <>
          <input
            type="text"
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              setResult("idle");
            }}
            placeholder="Taip jawapan anda"
            className="w-full px-3 py-[11px] rounded-[10px] border border-[#E5E3DC] dark:border-[#3A382F] bg-[#F4F3EF] dark:bg-[#2A2823] text-[15px] mb-2 focus:outline-none focus:border-[#0F6E56]"
          />
          <button
            onClick={check}
            className="w-full py-[11px] rounded-[10px] bg-[#0F6E56] text-white text-sm font-medium mb-2"
          >
            Semak
          </button>
          {result === "correct" && (
            <div className="px-3 py-2 rounded-[10px] bg-[#EAF3DE] dark:bg-[#27500A] text-[#3B6D11] dark:text-[#C0DD97] text-sm">
              Betul! Jawapannya ialah {correctAnswer}.
            </div>
          )}
          {result === "wrong" && (
            <div className="px-3 py-2 rounded-[10px] bg-[#FCEBEB] dark:bg-[#791F1F] text-[#A32D2D] dark:text-[#F7C1C1] text-sm">
              Belum tepat, cuba lagi.
            </div>
          )}
        </>
      ) : tujuanKey ? (
        <>
          <textarea
            placeholder="Tulis fikiran anda di sini..."
            rows={3}
            className="w-full px-3 py-[11px] rounded-[10px] border border-[#E5E3DC] dark:border-[#3A382F] bg-[#F4F3EF] dark:bg-[#2A2823] text-[15px] mb-2 focus:outline-none focus:border-[#0F6E56] resize-none"
          />
          {!revealed ? (
            <span
              className="text-[13px] font-bold text-[#D85A30] dark:text-[#F5C4B3] cursor-pointer"
              onClick={() => setRevealed(true)}
            >
              Lihat tujuan soalan ini
            </span>
          ) : (
            <div className="px-3 py-2 rounded-[10px] bg-[#FAECE7] dark:bg-[#993C1D] text-[#D85A30] dark:text-[#F5C4B3] text-sm">
              {data[tujuanKey]}
            </div>
          )}
        </>
      ) : (
        <RenderValue val={Object.fromEntries(Object.entries(data).filter(([k]) => k !== soalanKey))} />
      )}
    </div>
  );
}

// ---------- Build: step-through revealer ----------

function LangkahStepper({ langkah, intro }: { langkah: any[]; intro?: React.ReactNode }) {
  const [shown, setShown] = useState(1);
  const visible = langkah.slice(0, shown);

  return (
    <div>
      {intro}
      {visible.map((step, i) => {
        const rep = step.Representation || step.Representasi || step.Equation || step.Persamaan;
        const meaning = step.Meaning || step.Maksud || step.Reason || step.Sebab;
        return (
          <div
            key={i}
            className="bg-[#F4F3EF] dark:bg-[#2A2823] rounded-xl p-4 mb-3 transition-opacity duration-300"
          >
            <div className="text-[11px] font-bold text-[#0F6E56] dark:text-[#9FE1CB] mb-1">
              Langkah {step.Step ?? i + 1}
            </div>
            {rep && (typeof rep === "string" ? <MathBlock expr={rep} visual /> : <RenderValue val={rep} visual />)}
            {step.Action && <p className="text-[15px] mb-1">{step.Action}</p>}
            {meaning && <p className="text-[13px] text-[#6B6960] dark:text-[#B7B4A9]">{meaning}</p>}
          </div>
        );
      })}
      {shown < langkah.length && (
        <button
          onClick={() => setShown(shown + 1)}
          className="w-full py-[11px] rounded-[10px] border border-[#0F6E56] text-[#0F6E56] dark:text-[#9FE1CB] dark:border-[#9FE1CB] text-sm font-medium"
        >
          Lihat langkah seterusnya
        </button>
      )}
    </div>
  );
}

function BuildBlock({ data }: { data: any }) {
  if (!data || typeof data !== "object") return <RenderValue val={data} visual />;
  const langkah = data.Langkah;
  if (Array.isArray(langkah)) {
    const introFields = Object.entries(data).filter(([k]) => k !== "Langkah");
    const intro =
      introFields.length > 0 ? (
        <div className="mb-3">
          {introFields.map(([k, v]) => (
            <RenderValue key={k} val={{ [k]: v }} />
          ))}
        </div>
      ) : undefined;
    return <LangkahStepper langkah={langkah} intro={intro} />;
  }
  return <RenderValue val={data} visual />;
}

// ---------- Formalism: examples grid ----------

function FormalismBlock({ data }: { data: any }) {
  if (!data || typeof data !== "object") return <RenderValue val={data} />;
  const contoh: string[] | undefined = data.Contoh;
  const bukan: string[] | undefined = data.Bukan_Contoh;
  const rest = Object.fromEntries(
    Object.entries(data).filter(([k]) => k !== "Contoh" && k !== "Bukan_Contoh")
  );
  return (
    <div>
      <RenderValue val={rest} />
      {(contoh || bukan) && (
        <div className="grid grid-cols-2 gap-2 mt-2">
          {contoh && (
            <div>
              <div className="text-[11px] font-bold text-[#3B6D11] dark:text-[#C0DD97] mb-1.5">Contoh</div>
              {contoh.map((c, i) => (
                <div
                  key={i}
                  className="px-2.5 py-2 rounded-lg bg-[#EAF3DE] dark:bg-[#27500A] mb-1.5 text-sm flex items-center gap-1.5"
                >
                  <span className="text-[#3B6D11] dark:text-[#C0DD97]">✓</span>
                  {isMathLike(c) ? <Katex expr={c} /> : c}
                </div>
              ))}
            </div>
          )}
          {bukan && (
            <div>
              <div className="text-[11px] font-bold text-[#A32D2D] dark:text-[#F7C1C1] mb-1.5">Bukan contoh</div>
              {bukan.map((c, i) => (
                <div
                  key={i}
                  className="px-2.5 py-2 rounded-lg bg-[#FCEBEB] dark:bg-[#791F1F] mb-1.5 text-sm flex items-center gap-1.5"
                >
                  <span className="text-[#A32D2D] dark:text-[#F7C1C1]">✕</span>
                  {isMathLike(c) ? <Katex expr={c} /> : c}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------- Practice: reveal cards ----------

function PracticeItem({ item }: { item: any }) {
  const [revealed, setRevealed] = useState(false);
  if (typeof item === "string") {
    return <div className="bg-[#F4F3EF] dark:bg-[#2A2823] rounded-[10px] p-3 mb-2 text-[15px]">{item}</div>;
  }
  const soalanKey = findKey(item, [/soalan/i]);
  const answerKey = findKey(item, [/jawapan_asas/i, /^jawapan$/i, /fokus/i]);
  if (!soalanKey) return <RenderValue val={item} />;
  return (
    <div className="bg-[#F4F3EF] dark:bg-[#2A2823] rounded-[10px] p-3 mb-2">
      <p className="text-[15px] mb-1.5">{item[soalanKey]}</p>
      {answerKey && (
        <>
          <span
            className="text-[13px] font-bold text-[#0F6E56] dark:text-[#9FE1CB] cursor-pointer"
            onClick={() => setRevealed(!revealed)}
          >
            {revealed ? "Sembunyi" : "Lihat panduan"}
          </span>
          {revealed && (
            <div className="mt-1.5 px-2.5 py-2 rounded-lg bg-[#E1F5EE] dark:bg-[#0F6E56] text-[#0F6E56] dark:text-[#E1F5EE] text-sm">
              {item[answerKey]}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function PracticeBlock({ practice }: { practice: any }) {
  if (Array.isArray(practice)) {
    return (
      <>
        {practice.map((item, i) => (
          <PracticeItem key={i} item={item} />
        ))}
      </>
    );
  }
  return (
    <>
      {Object.entries(practice).map(([k, v]) =>
        /^Tahap_/i.test(k) ? (
          <div key={k}>
            <div className="text-[13px] font-bold text-[#6B6960] dark:text-[#B7B4A9] mt-3 mb-1.5">{prettify(k)}</div>
            {Array.isArray(v) ? (
              (v as any[]).map((item, i) => <PracticeItem key={i} item={item} />)
            ) : (
              <RenderValue val={v} />
            )}
          </div>
        ) : (
          <RenderValue key={k} val={{ [k]: v }} />
        )
      )}
    </>
  );
}

// ---------- Check ----------

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

// ---------- Kesilapan biasa ----------

function KesilapanBlock({ items }: { items: string[] }) {
  return (
    <>
      {items.map((item, i) => (
        <div
          key={i}
          className="flex items-start gap-2 bg-[#FAECE7] dark:bg-[#3A2118] rounded-[10px] p-3 mb-2 text-[15px]"
        >
          <span className="text-[#D85A30] dark:text-[#F5C4B3] mt-0.5">⚠</span>
          <span>{item}</span>
        </div>
      ))}
    </>
  );
}

// ---------- flow assembly ----------

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
  if (pp.Hook !== undefined) screens.push({ key: "Hook", label: STAGE_LABELS.Hook, node: <RenderValue val={pp.Hook} visual /> });
  if (pp.Try !== undefined) screens.push({ key: "Try", label: STAGE_LABELS.Try, node: <TryCard data={pp.Try} /> });
  if (pp.Prediction !== undefined)
    screens.push({ key: "Prediction", label: STAGE_LABELS.Prediction, node: <TryCard data={pp.Prediction} /> });
  if (pp.Problem !== undefined)
    screens.push({ key: "Problem", label: STAGE_LABELS.Problem, node: <RenderValue val={pp.Problem} /> });
  if (pp.Reveal !== undefined)
    screens.push({ key: "Reveal", label: STAGE_LABELS.Reveal, node: <RenderValue val={pp.Reveal} visual /> });

  if (p.Build !== undefined) screens.push({ key: "Build", label: STAGE_LABELS.Build, node: <BuildBlock data={p.Build} /> });
  if (p.Formalism !== undefined)
    screens.push({ key: "Formalism", label: STAGE_LABELS.Formalism, node: <FormalismBlock data={p.Formalism} /> });
  if (p.Connect !== undefined) screens.push({ key: "Connect", label: STAGE_LABELS.Connect, node: <RenderValue val={p.Connect} /> });

  if (p.Practice !== undefined)
    screens.push({ key: "Practice", label: STAGE_LABELS.Practice, node: <PracticeBlock practice={p.Practice} /> });
  if (p.Vary !== undefined) screens.push({ key: "Vary", label: STAGE_LABELS.Vary, node: <RenderValue val={p.Vary} /> });
  if (p.Check !== undefined) screens.push({ key: "Check", label: STAGE_LABELS.Check, node: <CheckBlock check={p.Check} /> });
  if (p.Kesilapan_Biasa !== undefined)
    screens.push({
      key: "Kesilapan_Biasa",
      label: STAGE_LABELS.Kesilapan_Biasa,
      node: <KesilapanBlock items={p.Kesilapan_Biasa} />,
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

        {view === "flow" && subtopikIdx !== null && persoalanIdx !== null && (() => {
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
                    className={`flex-1 h-[3px] rounded-full ${i <= idx ? "bg-[#0F6E56]" : "bg-[#E5E3DC] dark:bg-[#3A382F]"}`}
                  />
                ))}
              </div>
              <div
                key={s.key}
                className="bg-white dark:bg-[#211F1B] border border-[#E5E3DC] dark:border-[#3A382F] rounded-2xl p-5 min-h-[280px] flex flex-col"
              >
                <div
                  className={`text-xs font-bold uppercase tracking-wide mb-2.5 ${
                    CORAL_STAGES.has(s.key) ? "text-[#D85A30] dark:text-[#F5C4B3]" : "text-[#0F6E56] dark:text-[#9FE1CB]"
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
        })()}
      </div>
    </div>
  );
}
