import type { Soalan, Cadangan } from '../types'

export function kiraSkor(soalan: Soalan[], jawapan: Record<string, number>): number {
  if (soalan.length === 0) return 0
  const betul = soalan.filter((s) => jawapan[s.id] === s.jawapan_betul).length
  return Math.round((betul / soalan.length) * 100)
}

export function kiraSubKemahiran(
  soalan: Soalan[],
  jawapan: Record<string, number>
): Record<string, { betul: number; jumlah: number }> {
  const stats: Record<string, { betul: number; jumlah: number }> = {}

  for (const s of soalan) {
    const sk = s.sub_kemahiran
    if (!stats[sk]) stats[sk] = { betul: 0, jumlah: 0 }
    stats[sk].jumlah++
    if (jawapan[s.id] === s.jawapan_betul) stats[sk].betul++
  }

  return stats
}

export function janaCadangan(
  skor: number,
  subKemahiranStats: Record<string, { betul: number; jumlah: number }>,
  subtopikSeterusnyaId?: string
): Cadangan {
  const kemahiranLemah = Object.entries(subKemahiranStats)
    .filter(([, v]) => v.jumlah > 0 && v.betul / v.jumlah < 0.6)
    .map(([k]) => k)

  if (skor >= 80) {
    return {
      jenis: 'teruskan',
      mesej: subtopikSeterusnyaId
        ? 'Bagus! Teruskan ke subtopik seterusnya.'
        : 'Tahniah! Anda telah menguasai semua subtopik yang ada.',
      kemahiran_lemah: [],
      subtopik_seterusnya: subtopikSeterusnyaId,
    }
  }

  if (skor >= 50) {
    const listKemahiran = kemahiranLemah.length ? kemahiranLemah.join(', ') : 'kemahiran yang lemah'
    return {
      jenis: 'latihan_fokus',
      mesej: `Elok! Cuba buat semula soalan pada sub-kemahiran: ${listKemahiran}.`,
      kemahiran_lemah: kemahiranLemah,
    }
  }

  return {
    jenis: 'ulang_semua',
    mesej: 'Baca semula nota subtopik ini, kemudian cuba kuiz semula.',
    kemahiran_lemah: kemahiranLemah,
  }
}
