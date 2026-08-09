import Dexie, { type Table } from 'dexie'
import type { SubtopikProgress } from '../types'
import type { LessonProgress } from '../eds/types'

// ── EDS lesson progress record (stored per lessonId) ─────────────────────────

export interface LessonProgressRecord {
  lessonId: string
  score: number // 0–100
  completed: boolean
  attempt: number
  masa_kemaskini: number // unix ms
}

class MateMateDB extends Dexie {
  progress!: Table<SubtopikProgress, string>
  lessonProgress!: Table<LessonProgressRecord, string>
  animasiProgress!: Table<AnimasiProgressRecord, string>

  constructor() {
    super('MateMateDB')
    this.version(1).stores({
      progress: 'id, status, masa_kemaskini',
    })
    // Version 2 adds EDS lesson progress table
    this.version(2).stores({
      progress: 'id, status, masa_kemaskini',
      lessonProgress: 'lessonId, completed, masa_kemaskini',
    })
    // Version 3 adds animasi progress table
    this.version(3).stores({
      progress: 'id, status, masa_kemaskini',
      lessonProgress: 'lessonId, completed, masa_kemaskini',
      animasiProgress: 'momentId, subtopic, completed, masa_kemaskini',
    })
  }
}

export interface AnimasiProgressRecord {
  momentId: string
  subtopic: string
  completed: boolean
  correct: boolean | null
  hintsUsed: number
  masa_kemaskini: number
}

export const db = new MateMateDB()

// ── Subtopik (T4) CRUD helpers ────────────────────────────────────────────────

export async function getProgress(id: string): Promise<SubtopikProgress | undefined> {
  return db.progress.get(id)
}

export async function getAllProgress(): Promise<SubtopikProgress[]> {
  return db.progress.toArray()
}

export async function saveProgress(p: SubtopikProgress): Promise<void> {
  await db.progress.put(p)
}

export async function resetProgress(id: string): Promise<void> {
  await db.progress.put({
    id,
    status: 'belum_mula',
    skor_terakhir: null,
    attempt: 0,
    jawapan: {},
    masa_kemaskini: Date.now(),
  })
}

// ── EDS Lesson (T1) CRUD helpers ──────────────────────────────────────────────

export async function getLessonProgress(
  lessonId: string
): Promise<LessonProgressRecord | undefined> {
  return db.lessonProgress.get(lessonId)
}

export async function getAllLessonProgress(): Promise<LessonProgressRecord[]> {
  return db.lessonProgress.toArray()
}

export async function saveLessonProgress(lessonProgress: LessonProgress): Promise<void> {
  const existing = await db.lessonProgress.get(lessonProgress.lessonId)
  await db.lessonProgress.put({
    lessonId: lessonProgress.lessonId,
    score: lessonProgress.score,
    completed: lessonProgress.completed,
    attempt: (existing?.attempt ?? 0) + 1,
    masa_kemaskini: Date.now(),
  })
}
