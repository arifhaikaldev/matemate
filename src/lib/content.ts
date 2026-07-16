import type { ContentIndex, Subtopik } from '../types'

const BASE = '/content'

export async function fetchIndex(): Promise<ContentIndex> {
  const res = await fetch(`${BASE}/index.json`)
  if (!res.ok) throw new Error('Gagal muatkan senarai subtopik')
  return res.json() as Promise<ContentIndex>
}

export async function fetchSubtopik(fail: string): Promise<Subtopik> {
  const res = await fetch(`${BASE}/${fail}`)
  if (!res.ok) throw new Error(`Gagal muatkan subtopik: ${fail}`)
  return res.json() as Promise<Subtopik>
}
