import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useUIStore = create(
  persist(
    (set) => ({
      theme: 'system',
      currency: 'INR',
      hideAmounts: false,
      onboardingComplete: false,
      lastAuditMonth: null,
      currentPage: 'dashboard',

      setTheme: (theme) => set({ theme }),
      setCurrency: (currency) => set({ currency }),
      toggleHideAmounts: () => set((s) => ({ hideAmounts: !s.hideAmounts })),
      completeOnboarding: () => set({ onboardingComplete: true }),
      setCurrentPage: (page) => set({ currentPage: page }),
      setLastAuditMonth: (month) => set({ lastAuditMonth: month }),
    }),
    {
      name: 'flux-ui'
    }
  )
)

export default useUIStore
