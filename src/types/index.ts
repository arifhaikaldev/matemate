// Content types matching PRD Section 6

export interface NotaSection {
  tajuk: string
  kandungan: string
  imej?: string
  contoh?: string
}

export interface Soalan {
  id: string
  soalan: string
  pilihan: string[]
  jawapan_betul: number
  penjelasan: string
  langkah: string[]
  audio_file?: string
  sub_kemahiran: string
  imej?: string
}

export interface Subtopik {
  id: string
  tajuk_subtopik: string
  nota: NotaSection[]
  soalan: Soalan[]
}

export interface SubtopikIndex {
  id: string
  tajuk_subtopik: string
  fail: string
}

export interface ContentIndex {
  subtopik: SubtopikIndex[]
}

// Progress / state types

export type SubtopikStatus = 'belum_mula' | 'sedang_belajar' | 'selesai'

export interface SubtopikProgress {
  id: string
  status: SubtopikStatus
  skor_terakhir: number | null          // 0–100
  attempt: number
  jawapan: Record<string, number>       // soalan_id -> pilihan index
  masa_kemaskini: number                // unix ms
}

export interface AppProgress {
  subtopik: Record<string, SubtopikProgress>
}

// Quiz session (in-memory, not persisted until result)

export interface KuizSession {
  subtopikId: string
  jawapan: Record<string, number>   // soalan_id -> pilihan
  semasa: number                     // index soalan semasa
}

// Recommendation result

export interface Cadangan {
  jenis: 'teruskan' | 'latihan_fokus' | 'ulang_semua'
  mesej: string
  kemahiran_lemah: string[]
  subtopik_seterusnya?: string
}
