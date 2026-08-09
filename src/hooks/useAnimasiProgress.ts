import { useCallback } from 'react'
import { db } from '../lib/db'
import type { AnimasiProgressRecord } from '../animasi/bab6/types'

export function useAnimasiProgress() {
  const getProgress = useCallback(
    async (momentId: string): Promise<AnimasiProgressRecord | undefined> => {
      return db.animasiProgress.get(momentId)
    },
    [],
  )

  const saveProgress = useCallback(
    async (record: AnimasiProgressRecord): Promise<void> => {
      await db.animasiProgress.put(record)
    },
    [],
  )

  const getSubtopicProgress = useCallback(
    async (subtopic: string): Promise<AnimasiProgressRecord[]> => {
      return db.animasiProgress.where('subtopic').equals(subtopic).toArray()
    },
    [],
  )

  const getScoreForSubtopic = useCallback(
    async (subtopic: string): Promise<number> => {
      const records = await getSubtopicProgress(subtopic)
      const answered = records.filter((r) => r.correct !== null)
      if (answered.length === 0) return 0
      const correct = answered.filter((r) => r.correct === true).length
      return Math.round((correct / answered.length) * 100)
    },
    [getSubtopicProgress],
  )

  return { getProgress, saveProgress, getSubtopicProgress, getScoreForSubtopic }
}