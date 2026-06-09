import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const generateId = () => crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

const useDebtStore = create(
  persist(
    (set, get) => ({
      debts: [],
      milestones: [],

      addDebt: (debt) => {
        const newDebt = {
          id: generateId(),
          status: 'active',
          startDate: new Date().toISOString(),
          payments: [],
          ...debt
        }
        set((state) => ({ debts: [...state.debts, newDebt] }))
        return newDebt
      },

      updateDebt: (id, updates) => {
        set((state) => ({
          debts: state.debts.map((d) =>
            d.id === id ? { ...d, ...updates } : d
          )
        }))
      },

      deleteDebt: (id) => {
        set((state) => ({
          debts: state.debts.filter((d) => d.id !== id)
        }))
      },

      addPayment: (debtId, payment) => {
        const newPayment = {
          id: generateId(),
          date: new Date().toISOString().split('T')[0],
          ...payment
        }

        set((state) => {
          const debts = state.debts.map((d) => {
            if (d.id !== debtId) return d
            const newBalance = d.currentBalance - newPayment.amount
            const isPaidOff = newBalance <= 0
            const milestone = isPaidOff
              ? {
                  id: generateId(),
                  type: 'debt_paid',
                  amount: d.originalAmount,
                  date: new Date().toISOString(),
                  note: `Paid off ${d.name}`,
                  celebrated: false
                }
              : null

            return {
              ...d,
              currentBalance: Math.max(0, newBalance),
              payments: [...(d.payments || []), newPayment],
              status: isPaidOff ? 'paid_off' : 'active'
            }
          })

          return {
            debts,
            milestones: milestone
              ? [...state.milestones, milestone]
              : state.milestones
          }
        })
      },

      addMilestone: (milestone) => {
        const newMilestone = {
          id: generateId(),
          date: new Date().toISOString(),
          celebrated: false,
          ...milestone
        }
        set((state) => ({ milestones: [...state.milestones, newMilestone] }))
        return newMilestone
      },

      celebrateMilestone: (id) => {
        set((state) => ({
          milestones: state.milestones.map((m) =>
            m.id === id ? { ...m, celebrated: true } : m
          )
        }))
      },

      getActive: () => get().debts.filter((d) => d.status === 'active'),
      getPaid: () => get().debts.filter((d) => d.status === 'paid_off'),

      clearAll: () => set({ debts: [], milestones: [] }),
      setAll: (debts) => set({ debts })
    }),
    {
      name: 'flux-debts'
    }
  )
)

export default useDebtStore
