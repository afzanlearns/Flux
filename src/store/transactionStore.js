import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const generateId = () => crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

const useTransactionStore = create(
  persist(
    (set, get) => ({
      transactions: [],

      addTransaction: (transaction) => {
        const newTransaction = {
          id: generateId(),
          createdAt: new Date().toISOString(),
          ...transaction,
          date: transaction.date || new Date().toISOString().split('T')[0]
        }
        set((state) => ({
          transactions: [newTransaction, ...state.transactions]
        }))
        return newTransaction
      },

      updateTransaction: (id, updates) => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          )
        }))
      },

      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id)
        }))
      },

      getTransactionsByMonth: (year, month) => {
        const { transactions } = get()
        return transactions.filter((t) => {
          const d = new Date(t.date)
          return d.getFullYear() === year && d.getMonth() === month
        })
      },

      getRecentTransactions: (limit = 10) => {
        return get().transactions.slice(0, limit)
      },

      clearAll: () => set({ transactions: [] }),
      setAll: (transactions) => set({ transactions })
    }),
    {
      name: 'flux-transactions'
    }
  )
)

export default useTransactionStore
