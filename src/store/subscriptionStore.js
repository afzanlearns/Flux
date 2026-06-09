import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const generateId = () => crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

const useSubscriptionStore = create(
  persist(
    (set, get) => ({
      subscriptions: [],

      addSubscription: (subscription) => {
        const newSub = {
          id: generateId(),
          status: 'active',
          startDate: new Date().toISOString(),
          lastUsed: new Date().toISOString(),
          renewalDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
          ...subscription
        }
        set((state) => ({ subscriptions: [...state.subscriptions, newSub] }))
        return newSub
      },

      updateSubscription: (id, updates) => {
        set((state) => ({
          subscriptions: state.subscriptions.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          )
        }))
      },

      deleteSubscription: (id) => {
        set((state) => ({
          subscriptions: state.subscriptions.filter((s) => s.id !== id)
        }))
      },

      cancelSubscription: (id) => {
        set((state) => ({
          subscriptions: state.subscriptions.map((s) =>
            s.id === id ? { ...s, status: 'cancelled' } : s
          )
        }))
      },

      markUsed: (id) => {
        set((state) => ({
          subscriptions: state.subscriptions.map((s) =>
            s.id === id ? { ...s, lastUsed: new Date().toISOString() } : s
          )
        }))
      },

      getActive: () => get().subscriptions.filter((s) => s.status === 'active'),
      getCancelled: () => get().subscriptions.filter((s) => s.status === 'cancelled'),

      clearAll: () => set({ subscriptions: [] }),
      setAll: (subscriptions) => set({ subscriptions })
    }),
    {
      name: 'flux-subscriptions'
    }
  )
)

export default useSubscriptionStore
