import type { Lesson } from '../types'
import sixOneOne from './six-one-one'
import sixOneTwo from './six-one-two'
import sixOneThree from './six-one-three'
import sixOneFour from './six-one-four'
import sixTwoOne from './six-two-one'
import sixTwoTwo from './six-two-two'
import sixTwoThree from './six-two-three'
import sixTwoFour from './six-two-four'
import sixThreeOne from './six-three-one'
import sixThreeTwo from './six-three-two'
import sixThreeThree from './six-three-three'

export const lessons: Lesson[] = [
  sixOneOne,
  sixOneTwo,
  sixOneThree,
  sixOneFour,
  sixTwoOne,
  sixTwoTwo,
  sixTwoThree,
  sixTwoFour,
  sixThreeOne,
  sixThreeTwo,
  sixThreeThree,
]

export function getLesson(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id)
}

export function getLessonIndex(id: string): number {
  return lessons.findIndex((l) => l.id === id)
}