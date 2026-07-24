import { z } from 'zod'
import type { ContentIndex, Subtopik } from '../types'

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const NotaSectionSchema = z.object({
  tajuk: z.string(),
  kandungan: z.string(),
  imej: z.string().optional(),
  contoh: z.string().optional(),
})

const SoalanSchema = z.object({
  id: z.string(),
  soalan: z.string(),
  pilihan: z.array(z.string()).min(2),
  jawapan_betul: z.number().int().min(0),
  penjelasan: z.string(),
  langkah: z.array(z.string()),
  audio_file: z.string().optional(),
  sub_kemahiran: z.string(),
  imej: z.string().optional(),
})

const SubtopikSchema = z.object({
  id: z.string(),
  tajuk_subtopik: z.string(),
  nota: z.array(NotaSectionSchema),
  soalan: z.array(SoalanSchema),
})

const SubtopikIndexSchema = z.object({
  id: z.string(),
  tajuk_subtopik: z.string(),
  fail: z.string(),
})

const ContentIndexSchema = z.object({
  subtopik: z.array(SubtopikIndexSchema),
})

// ---------------------------------------------------------------------------
// Validated fetch helpers (replace raw casts in content.ts)
// ---------------------------------------------------------------------------

const BASE = '/content'

export async function fetchIndex(): Promise<ContentIndex> {
  const res = await fetch(`${BASE}/index.json`)
  if (!res.ok) throw new Error('Gagal muatkan senarai subtopik')
  const raw: unknown = await res.json()
  const result = ContentIndexSchema.safeParse(raw)
  if (!result.success) {
    console.error('[validation] index.json tidak sah:', result.error.format())
    throw new Error('Format index.json tidak sah')
  }
  return result.data
}

export async function fetchSubtopik(fail: string): Promise<Subtopik> {
  const res = await fetch(`${BASE}/${fail}`)
  if (!res.ok) throw new Error(`Gagal muatkan subtopik: ${fail}`)
  const raw: unknown = await res.json()
  const result = SubtopikSchema.safeParse(raw)
  if (!result.success) {
    console.error(`[validation] ${fail} tidak sah:`, result.error.format())
    throw new Error(`Format ${fail} tidak sah`)
  }
  return result.data
}

// ---------------------------------------------------------------------------
// Exported schemas (for use in Curriculum Compiler — Fasa 3)
// ---------------------------------------------------------------------------

export { NotaSectionSchema, SoalanSchema, SubtopikSchema, ContentIndexSchema }
