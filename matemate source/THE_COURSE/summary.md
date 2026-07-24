# THE_COURSE — Ringkasan Projek

## Apa Itu THE_COURSE?

Sistem untuk menukar kandungan buku teks Matematik sekolah menengah Malaysia (Tingkatan 1–5) kepada **pengalaman pembelajaran interaktif gaya Brilliant.org**.

## Komponen Utama

| Komponen | Penerangan |
|---|---|
| `T1B1.json` | Input buku teks — Form 1 Bab 1: Nombor Nisbah (5 subtopik, 20 persoalan utama) |
| `curriculum-creator.MD` | Prompt AI — arahan untuk LLM menukar JSON buku teks ke lesson JSON |
| `design-system.md` | PRD — spesifikasi sistem reka bentuk pendidikan (komponen React, renderer, tema) |
| `validator.md` | Spesifikasi Curriculum Compiler — 10 peringkat pengesahan lesson JSON |

## Senarai Subtopik (dari T1B1.json)

| Subtopik | Tajuk | Bilangan Persoalan |
|---|---|---|
| 1.1 | Integer | 4 |
| 1.2 | Operasi Asas Aritmetik yang Melibatkan Integer | 5 |
| 1.3 | Pecahan Positif dan Pecahan Negatif | 4 |
| 1.4 | Perpuluhan Positif dan Perpuluhan Negatif | 4 |
| 1.5 | Nombor Nisbah | 3 |
| **Jumlah** | | **20 lessons** |

## Rantai Pembinaan

```
Buku Teks (JSON)
    ↓
AI Lesson Generator (curriculum-creator.MD)
    ↓
Lesson JSON (20 fail)
    ↓
Curriculum Compiler (validator.md)
    ├── Schema Validation
    ├── Pedagogy Validation
    ├── Dependency Validation
    ├── Difficulty Validation
    ├── Asset Validation
    ├── Coverage Validation
    ├── App Compatibility
    ↓
Educational Design System (design-system.md)
    ├── Lesson Renderer
    ├── Screen Renderer
    ├── Visual Renderer
    ├── Component Library (NumberLine, FractionBar, dll.)
    ↓
Interactive Learning Experience
```

## Aliran Pedagogi Setiap Pelajaran

1. **Hook / Observation** — perkenalkan situasi tanpa minta jawapan
2. **Prediction / Interaktif** — pelajar buat tekaan/gerak
3. **Guided Interaction** — soalan multipleChoice / numberInput / dragOrder / dragNumberLine
4. **Pattern Discovery** — pelajar nampak pola
5. **Generalization (Reflection)** — rumuskan konsep
6. **Application (workedExample)** — contoh langkah demi langkah
7. **Mastery Check** — soalan akhir

Setiap lesson: 6–10 screens, mesti berakhir dengan `mastery`.

## Perincian Tugas

### Fasa 1: Projek Asas ✅ SELESAI
- [x] Tetapkan struktur direktori projek — `src/components/`, `src/pages/`, `src/lib/`, `src/hooks/`, `src/types/`
- [x] TypeScript config — `tsconfig.json` strict mode, ES2020, sudah ada
- [x] ESLint — `eslint.config.js` ditambah (2025-07-24): `@typescript-eslint`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `eslint-config-prettier`; `npm run lint` lulus 0 amaran
- [x] Prettier — `.prettierrc` ditambah (2025-07-24): singleQuote, no semi, trailingComma es5; `npm run format` dijalankan ke atas semua fail; `npm run format:check` lulus
- [x] Type definitions — `src/types/index.ts`: `Soalan`, `Subtopik`, `SubtopikProgress`, `KuizSession`, `Cadangan`
- [x] Utility functions — `src/lib/content.ts`, `src/lib/db.ts`, `src/lib/recommendation.ts`
- [x] Runtime JSON validation — `src/lib/validation.ts` ditambah (2025-07-24): Zod schemas untuk `Soalan`, `Subtopik`, `ContentIndex`; `fetchIndex()` dan `fetchSubtopik()` kini validate sebelum return

### Fasa 2: Educational Design System (EDS) ✅ SELESAI (2025-07-24)

**Fail yang dicipta: `src/eds/`**

#### Types (`src/eds/types/index.ts`)
- `Lesson`, `Screen`, `ScreenType`, `Difficulty`, `LessonProgress`, `ScreenStatus`
- Screen types: `ObservationScreen`, `MultipleChoiceScreen`, `NumberInputScreen`, `DragOrderScreen`, `DragNumberLineScreen`, `ReflectionScreen`, `WorkedExampleScreen`, `MasteryScreen`
- Visual types: `DirectionVisual`, `ElevatorVisual`, `TemperatureVisual`, `NumberLineVisual`, `FractionNumberLineVisual`

#### Visual Components (`src/eds/components/visuals/`)
- `NumberLine.tsx` — garis nombor SVG, ticks, highlights, interactive click-to-place, ARIA
- `FractionNumberLine.tsx` — garis nombor pecahan dengan denominator pilihan
- `Direction.tsx` — paparan kenderaan bergerak kiri/kanan dengan anak panah berwarna
- `Elevator.tsx` — keratan rentas bangunan, tingkat positif/negatif, tingkat semasa dihighlight
- `Temperature.tsx` — termometer SVG dengan skala, nilai semasa, warna berubah ikut nilai

#### Screen Components (`src/eds/components/screens/`)
- `ObservationScreen.tsx` — hook/intro, tiada interaksi, butang Teruskan
- `MultipleChoiceScreen.tsx` — 4 pilihan A/B/C/D, feedback warna, penerangan selepas submit
- `NumberInputScreen.tsx` — input teks angka, hint toggle, normalisasi jawapan, feedback
- `DragOrderScreen.tsx` — drag-and-drop + tap-to-swap, shuffle menggunakan lazy init
- `DragNumberLineScreen.tsx` — klik pada garis nombor untuk letak nilai
- `ReflectionScreen.tsx` — rumusan konsep dalam kotak biru, ikon mentol
- `WorkedExampleScreen.tsx` — langkah demi langkah reveal, jawapan akhir dalam kotak hijau
- `MasteryScreen.tsx` — soalan akhir bergaya oren, badge bintang, celebration selepas tamat

#### Renderers & Registry
- `src/eds/registry/VisualRenderer.tsx` — switch visual.kind → komponen, tiada hardcode
- `src/eds/renderers/ScreenRenderer.tsx` — switch screen.type → komponen
- `src/eds/renderers/LessonRenderer.tsx` — engine penuh: progress bar, dot status, score, completion screen
- `src/eds/index.ts` — barrel export semua public API

#### Ciri Tambahan
- Dark mode: semua komponen menyokong `dark:` Tailwind classes
- Mobile-first: SVG responsive, butang touch-friendly
- Accessibility: `role`, `aria-label`, `aria-valuemin/max/now`, `aria-pressed`, `role="alert"` pada feedback
- Animasi: progress bar transition 500ms, scale pada dot aktif

### Fasa 3: Curriculum Compiler ✅ SELESAI (2025-07-24)

**Fail yang dicipta: `src/compiler/`**

| Fail | Penerangan |
|---|---|
| `types.ts` | `Issue`, `StageResult`, `CompilerReport` — shared types |
| `stage1-schema.ts` | Zod schema penuh untuk semua Lesson/Screen/Visual types; `validateSchema()` |
| `stage2-pedagogy.ts` | Semak aliran pedagogi: observation → interactive → reflection → mastery |
| `stage3-flow.ts` | Semak navigasi skrin: tiada duplikat, mastery mesti last, reflection selepas interactive |
| `stage4-misconceptions.ts` | Semak ≥ 2 misconceptions, tiada placeholder pendek |
| `stage5-difficulty.ts` | Heuristik Jaccard: kesan lompatan difficulty yang tidak sesuai |
| `stage6-coverage.ts` | Semak keyword learningGoal ada dalam kandungan skrin |
| `stage7-assets.ts` | Semak semua visual kind + screen type disokong oleh EDS |
| `stage8-dependencies.ts` | Semak prasyarat lesson ada dalam curriculum; `DEFAULT_DEPENDENCY_MAP` |
| `stage9-repetition.ts` | Kesan skrin yang terlalu serupa (Jaccard similarity > 75%) |
| `stage10-appcompat.ts` | Gate terakhir: semua screen/visual 100% renderable |
| `report.ts` | `formatReport()` + `formatBatchReport()` — output CLI bergraf ASCII |
| `index.ts` | `compileLesson()` + `compileCurriculum()` — pipeline penuh dengan wajaran stage |
| `cli.ts` | CLI runner: `npx tsx src/compiler/cli.ts <lesson.json>` |

**Scripts baru:**
```
npm run compile -- <lesson.json>     ← semak satu lesson
npm run compile:all                  ← semak semua lesson
```

**Ujian CLI dengan lesson contoh: 100/100, Production Ready: YES**

### Fasa 4: Penjanaan Lesson JSON
- [ ] Subtopik 1.1: Integer (4 lessons)
- [ ] Subtopik 1.2: Operasi Asas Aritmetik Integer (5 lessons)
- [ ] Subtopik 1.3: Pecahan Positif dan Negatif (4 lessons)
- [ ] Subtopik 1.4: Perpuluhan Positif dan Negatif (4 lessons)
- [ ] Subtopik 1.5: Nombor Nisbah (3 lessons)

### Fasa 5: Integrasi & Pengujian
- [ ] Compile semua lesson JSON melalui Curriculum Compiler
- [ ] Render semua lesson melalui EDS untuk pengesahan visual
- [ ] Ujian mobile (responsif, sentuhan)
- [ ] Ujian kebolehcapaian
- [ ] Ujian prestasi (< 100ms screen change, 60 FPS)