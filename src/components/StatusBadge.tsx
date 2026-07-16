import type { SubtopikStatus } from '../types'

interface Props {
  status: SubtopikStatus
}

export function StatusBadge({ status }: Props) {
  if (status === 'selesai') {
    return <span className="badge badge-green">Selesai</span>
  }
  if (status === 'sedang_belajar') {
    return <span className="badge badge-yellow">Sedang Belajar</span>
  }
  return <span className="badge badge-gray">Belum Mula</span>
}
