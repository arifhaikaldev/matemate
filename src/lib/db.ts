import Dexie, { type Table } from 'dexie'
import type { SubtopikProgress } from '../types'

class MateMateDB extends Dexie {
  progress!: Table<SubtopikProgress, string>

  constructor() {
    super('MateMateDB')
    this.version(1).stores({
      progress: 'id, status, masa_kemaskini',
    })
  }
}

export const db = new MateMateDB()

// --- CRUD helpers ---

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
