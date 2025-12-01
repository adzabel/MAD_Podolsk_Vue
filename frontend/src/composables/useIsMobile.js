import { shallowRef, readonly } from 'vue'

// Composable: useIsMobile
// Returns a reactive `isMobile` ref that tracks `(max-width: 767px)`.
// Singleton pattern: single matchMedia listener shared across all components.
// Uses shallowRef for minimal reactivity overhead.

const isMobile = shallowRef(false)
let initialized = false

function init() {
  if (initialized || typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
  initialized = true
  const mq = window.matchMedia('(max-width: 767px)')
  isMobile.value = mq.matches
  // Single listener for the entire app — no cleanup needed (lives for app lifetime)
  mq.addEventListener('change', (e) => { isMobile.value = e.matches })
}

export function useIsMobile() {
  init()
  return { isMobile: readonly(isMobile) }
}
