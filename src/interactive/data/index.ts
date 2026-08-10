import type { Lesson } from '../types'
import sixOneOne from './six-one-one'
import sixOneTwo from './six-one-two'
import sixOneThree from './six-one-three'
import sixOneFour from './six-one-four'

export const lessons: Lesson[] = [
  sixOneOne,
  sixOneTwo,
  sixOneThree,
  sixOneFour,
]

export function getLesson(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id)
}

export function getLessonIndex(id: string): number {
  return lessons.findIndex((l) => l.id === id)
}