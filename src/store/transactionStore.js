import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import useAccountStore from './accountStore'

const generateId = () => crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

const useTransactionStore = create(
  persist(
    (set, get) => ({
      transactions: [],

      addTransaction: (transaction) => {
        const accounts = useAccountStore.getState().accounts
        const accountId = transaction.accountId || accounts[0]?.id
        const account = accounts.find(a => a.id === accountId)

        const newTransaction = {
          id: generateId(),
          createdAt: new Date().toISOString(),
          ...transaction,
          accountId,
          date: transaction.date || new Date().toISOString().split('T')[0]
        }

        set((state) => ({
          transactions: [newTransaction, ...state.transactions]
        }))

        if (account) {
          const delta = transaction.type === 'income' ? transaction.amount : -transaction.amount
          useAccountStore.getState().setAccountBalance(accountId, account.balance + delta)
        }

        return newTransaction
      },

      updateTransaction: (id, updates) => {
        const old = get().transactions.find(t => t.id === id)
        if (!old) return

        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          )
        }))

        const accounts = useAccountStore.getState().accounts
        const oldAccountId = old.accountId || accounts[0]?.id
        const newAccountId = updates.accountId || oldAccountId

        const oldDelta = old.type === 'income' ? old.amount : -old.amount
        const newAmount = updates.amount ?? old.amount
        const newType = updates.type ?? old.type
        const newDelta = newType === 'income' ? newAmount : -newAmount

        if (oldAccountId === newAccountId) {
          const account = accounts.find(a => a.id === oldAccountId)
          if (account) {
            useAccountStore.getState().setAccountBalance(oldAccountId, account.balance - oldDelta + newDelta)
          }
        } else {
          const oldAccount = accounts.find(a => a.id === oldAccountId)
          const newAccount = accounts.find(a => a.id === newAccountId)
          if (oldAccount) {
            useAccountStore.getState().setAccountBalance(oldAccountId, oldAccount.balance - oldDelta)
          }
          if (newAccount) {
            useAccountStore.getState().setAccountBalance(newAccountId, newAccount.balance + newDelta)
          }
        }
      },

      deleteTransaction: (id) => {
        const transaction = get().transactions.find(t => t.id === id)
        if (!transaction) return

        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id)
        }))

        const accounts = useAccountStore.getState().accounts
        const accountId = transaction.accountId || accounts[0]?.id
        const account = accounts.find(a => a.id === accountId)

        if (account) {
          const delta = transaction.type === 'income' ? -transaction.amount : transaction.amount
          useAccountStore.getState().setAccountBalance(accountId, account.balance + delta)
        }
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
