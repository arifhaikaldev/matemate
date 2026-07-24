/**
 * Web Speech API (TTS) hook
 * - Uses ms-MY voice if available, otherwise disables speech entirely
 * - Synchronises step display with `boundary` event
 */

import { useCallback, useEffect, useRef, useState } from 'react'

export function useTTS() {
  const [tersedia, setTersedia] = useState<boolean | null>(() =>
    typeof window !== 'undefined' && !('speechSynthesis' in window) ? false : null
  )
  const [muted, setMuted] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!('speechSynthesis' in window)) return // already set to false via lazy init

    const check = () => {
      const voices = window.speechSynthesis.getVoices()
      if (voices.length === 0) return // not loaded yet
      const hasMsMY = voices.some(
        (v) => v.lang === 'ms-MY' || v.lang === 'ms' || v.lang.startsWith('ms')
      )
      setTersedia(hasMsMY)
    }

    window.speechSynthesis.addEventListener('voiceschanged', check)
    check()

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', check)
    }
  }, [])

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel()
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [])

  const baca = useCallback(
    (
      teks: string,
      audioFile?: string,
      onBoundary?: (charIndex: number) => void,
      onEnd?: () => void
    ) => {
      if (muted) {
        onEnd?.()
        return
      }

      // Use pre-recorded audio if provided
      if (audioFile) {
        const audio = new Audio(audioFile)
        audioRef.current = audio
        audio.onended = () => {
          onEnd?.()
          audioRef.current = null
        }
        audio.play().catch(() => {
          onEnd?.()
        })
        return
      }

      if (!tersedia) {
        onEnd?.()
        return
      }

      window.speechSynthesis.cancel()

      const utter = new SpeechSynthesisUtterance(teks)
      utter.lang = 'ms-MY'

      const voices = window.speechSynthesis.getVoices()
      const msVoice = voices.find(
        (v) => v.lang === 'ms-MY' || v.lang === 'ms' || v.lang.startsWith('ms')
      )
      if (msVoice) utter.voice = msVoice

      utter.rate = 0.9
      utter.pitch = 1

      if (onBoundary) utter.onboundary = (e) => onBoundary(e.charIndex)
      if (onEnd) utter.onend = () => onEnd()
      utter.onerror = () => onEnd?.()

      utteranceRef.current = utter
      window.speechSynthesis.speak(utter)
    },
    [tersedia, muted]
  )

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      if (!m) stop() // if going muted, stop current speech
      return !m
    })
  }, [stop])

  useEffect(
    () => () => {
      stop()
    },
    [stop]
  )

  return { tersedia, muted, toggleMute, baca, stop }
}
