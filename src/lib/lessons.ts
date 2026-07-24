// src/lib/lessons.ts
// Fetch helpers for EDS lesson JSON files with Zod runtime validation

import { z } from 'zod'
import type { Lesson } from '../eds/types'

// ── Index schema ─────────────────────────────────────────────────────────────

const LessonIndexItemSchema = z.object({
  lessonId: z.string(),
  tajuk: z.string(),
  fail: z.string(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  estimatedMinutes: z.number(),
})

const SubtopikIndexSchema = z.object({
  no: z.string(),
  tajuk: z.string(),
  lessons: z.array(LessonIndexItemSchema),
})

const ChapterIndexSchema = z.object({
  chapter: z.number(),
  tajuk: z.string(),
  tingkatan: z.number(),
  subtopik: z.array(SubtopikIndexSchema),
})

export type LessonIndexItem = z.infer<typeof LessonIndexItemSchema>
export type SubtopikIndex = z.infer<typeof SubtopikIndexSchema>
export type ChapterIndex = z.infer<typeof ChapterIndexSchema>

// ── Fetch helpers ─────────────────────────────────────────────────────────────

const BASE = '/lessons'

export async function fetchChapterIndex(tingkatan: number, chapter: number): Promise<ChapterIndex> {
  const res = await fetch(`${BASE}/form${tingkatan}/index.json`)
  if (!res.ok) throw new Error(`Gagal muatkan indeks bab ${chapter} Tingkatan ${tingkatan}`)
  const raw: unknown = await res.json()
  const result = ChapterIndexSchema.safeParse(raw)
  if (!result.success) {
    console.error('[lessons] index.json tidak sah:', result.error.format())
    throw new Error('Format indeks bab tidak sah')
  }
  return result.data
}

export async function fetchLesson(fail: string): Promise<Lesson> {
  const res = await fetch(`${BASE}/${fail}`)
  if (!res.ok) throw new Error(`Gagal muatkan lesson: ${fail}`)
  // Lesson JSON is already validated by the compiler at build time.
  // We do a lightweight shape check here — full Zod validation is in the compiler.
  const raw: unknown = await res.json()
  if (typeof raw !== 'object' || raw === null || !('lessonId' in raw) || !('screens' in raw)) {
    throw new Error(`Format lesson tidak sah: ${fail}`)
  }
  return raw as Lesson
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function flattenLessons(index: ChapterIndex): LessonIndexItem[] {
  return index.subtopik.flatMap((s) => s.lessons)
}

export function findLessonMeta(index: ChapterIndex, lessonId: string): LessonIndexItem | undefined {
  return flattenLessons(index).find((l) => l.lessonId === lessonId)
}

export function findNextLesson(index: ChapterIndex, lessonId: string): LessonIndexItem | undefined {
  const flat = flattenLessons(index)
  const idx = flat.findIndex((l) => l.lessonId === lessonId)
  return idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : undefined
}
