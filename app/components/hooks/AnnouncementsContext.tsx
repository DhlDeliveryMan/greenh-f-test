import React, { createContext, useReducer, useRef, useEffect, useContext, ReactNode } from 'react'

export interface IAnnouncement {
  id: number
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  icon: ReactNode
  displayInTopBar: boolean
  timestamp: number
  duration: number
}

type AnnouncementsContextType = {
  announcements: IAnnouncement[]
  addAnnouncement: (announcement: IAnnouncement) => void
  removeAnnouncement: (id: number) => void
  currentAnnouncement: IAnnouncement | null
  dismissCurrent: () => void
}

const AnnouncementsContext = createContext<AnnouncementsContextType | undefined>(undefined)

const ANIMATION_DELAY = 200

const initialState = {
  announcements: [] as IAnnouncement[],
  queue: [] as IAnnouncement[],
  current: null as IAnnouncement | null,
}

type State = typeof initialState

type Action =
  | { type: 'ADD'; payload: IAnnouncement }
  | { type: 'REMOVE'; payload: number }
  | { type: 'CLEAR_CURRENT' }
  | { type: 'PROMOTE' }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD': {
      const announcement = action.payload
      const announcements = [...state.announcements, announcement]
      // If nothing is showing, show this immediately; otherwise push to queue
      if (!state.current) {
        return { ...state, announcements, current: announcement }
      }
      return { ...state, announcements, queue: [...state.queue, announcement] }
    }

    case 'REMOVE': {
      const id = action.payload
      const announcements = state.announcements.filter((a) => a.id !== id)
      const queue = state.queue.filter((a) => a.id !== id)
      const current = state.current && state.current.id === id ? null : state.current
      return { ...state, announcements, queue, current }
    }

    case 'CLEAR_CURRENT': {
      return { ...state, current: null }
    }

    case 'PROMOTE': {
      // If nothing is showing and queue has items, promote the first
      if (!state.current && state.queue.length > 0) {
        const next = state.queue[0]
        return { ...state, current: next, queue: state.queue.slice(1) }
      }
      return state
    }

    default:
      return state
  }
}

export function AnnouncementsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Auto-dismiss current announcement after its duration
  useEffect(() => {
    if (!state.current) return

    const id = state.current.id
    if (timerRef.current) clearTimeout(timerRef.current)

    timerRef.current = setTimeout(() => {
      dispatch({ type: 'REMOVE', payload: id })
      dispatch({ type: 'CLEAR_CURRENT' })
      // After animation, promote next
      setTimeout(() => dispatch({ type: 'PROMOTE' }), ANIMATION_DELAY)
    }, state.current.duration)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [state.current])

  const addAnnouncement = (announcement: IAnnouncement) => {
    dispatch({ type: 'ADD', payload: announcement })
  }

  const removeAnnouncement = (id: number) => {
    const isCurrent = state.current?.id === id
    if (isCurrent && timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    dispatch({ type: 'REMOVE', payload: id })
    if (isCurrent) {
      // allow exit animation then promote
      setTimeout(() => dispatch({ type: 'PROMOTE' }), ANIMATION_DELAY)
    }
  }

  const dismissCurrent = () => {
    if (!state.current) return
    const id = state.current.id
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    dispatch({ type: 'REMOVE', payload: id })
    dispatch({ type: 'CLEAR_CURRENT' })
    setTimeout(() => dispatch({ type: 'PROMOTE' }), ANIMATION_DELAY)
  }

  return (
    <AnnouncementsContext.Provider
      value={{
        announcements: state.announcements,
        addAnnouncement,
        removeAnnouncement,
        currentAnnouncement: state.current,
        dismissCurrent,
      }}
    >
      {children}
    </AnnouncementsContext.Provider>
  )
}

export const useAnnouncements = () => {
  const context = useContext(AnnouncementsContext)
  if (!context) {
    throw new Error('useAnnouncements must be used within an AnnouncementsProvider')
  }
  return context
}
