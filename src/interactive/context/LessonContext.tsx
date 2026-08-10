import { createContext, useContext, useReducer, type ReactNode, type Dispatch } from 'react'
import type { Lesson, LessonStatus, PageConfig } from '../types'

interface LessonState {
  lessons: Lesson[]
  currentLessonIndex: number
  currentPageIndex: number
  lessonStatuses: Record<string, LessonStatus>
  pageCompletions: Record<string, boolean>
}

type LessonAction =
  | { type: 'SET_LESSONS'; lessons: Lesson[] }
  | { type: 'SELECT_LESSON'; index: number }
  | { type: 'GO_TO_PAGE'; index: number }
  | { type: 'NEXT_PAGE' }
  | { type: 'PREV_PAGE' }
  | { type: 'COMPLETE_PAGE'; pageId: string }
  | { type: 'COMPLETE_LESSON'; lessonId: string }

function lessonReducer(state: LessonState, action: LessonAction): LessonState {
  switch (action.type) {
    case 'SET_LESSONS':
      return { ...state, lessons: action.lessons }
    case 'SELECT_LESSON':
      return { ...state, currentLessonIndex: action.index, currentPageIndex: 0 }
    case 'GO_TO_PAGE':
      return { ...state, currentPageIndex: action.index }
    case 'NEXT_PAGE': {
      const lesson = state.lessons[state.currentLessonIndex]
      if (!lesson) return state
      const next = state.currentPageIndex + 1
      if (next >= lesson.pages.length) return state
      return { ...state, currentPageIndex: next }
    }
    case 'PREV_PAGE': {
      const prev = state.currentPageIndex - 1
      if (prev < 0) return state
      return { ...state, currentPageIndex: prev }
    }
    case 'COMPLETE_PAGE':
      return {
        ...state,
        pageCompletions: { ...state.pageCompletions, [action.pageId]: true },
      }
    case 'COMPLETE_LESSON':
      return {
        ...state,
        lessonStatuses: { ...state.lessonStatuses, [action.lessonId]: 'completed' },
      }
    default:
      return state
  }
}

const initialState: LessonState = {
  lessons: [],
  currentLessonIndex: -1,
  currentPageIndex: 0,
  lessonStatuses: {},
  pageCompletions: {},
}

interface LessonContextValue {
  state: LessonState
  dispatch: Dispatch<LessonAction>
  currentLesson: Lesson | null
  currentPage: PageConfig | null
  isLastPage: boolean
  isFirstPage: boolean
  progressPercent: number
}

const LessonContext = createContext<LessonContextValue | null>(null)

export function LessonProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(lessonReducer, initialState)

  const currentLesson = state.lessons[state.currentLessonIndex] ?? null
  const currentPage = currentLesson?.pages[state.currentPageIndex] ?? null
  const isLastPage = currentLesson
    ? state.currentPageIndex >= currentLesson.pages.length - 1
    : false
  const isFirstPage = state.currentPageIndex === 0
  const progressPercent = currentLesson
    ? Math.round(
        (Object.keys(state.pageCompletions).filter((id) =>
          currentLesson.pages.some((p) => p.id === id),
        ).length /
          currentLesson.pages.length) *
          100,
      )
    : 0

  return (
    <LessonContext.Provider
      value={{
        state,
        dispatch,
        currentLesson,
        currentPage,
        isLastPage,
        isFirstPage,
        progressPercent,
      }}
    >
      {children}
    </LessonContext.Provider>
  )
}

export function useLesson() {
  const ctx = useContext(LessonContext)
  if (!ctx) throw new Error('useLesson must be used within LessonProvider')
  return ctx
}