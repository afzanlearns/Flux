import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const generateId = () => crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

const defaultAccounts = [
  { id: generateId(), type: 'wallet', name: 'Wallet', balance: 0, color: '#10B981', lastUpdated: new Date().toISOString() },
  { id: generateId(), type: 'checking', name: 'Bank Account', balance: 0, color: '#BE185D', lastUpdated: new Date().toISOString() }
]

const useAccountStore = create(
  persist(
    (set, get) => ({
      accounts: defaultAccounts,

      setAccountBalance: (id, balance) => {
        set((state) => ({
          accounts: state.accounts.map((a) =>
            a.id === id ? { ...a, balance, lastUpdated: new Date().toISOString() } : a
          )
        }))
      },

      addAccount: (account) => {
        const newAccount = {
          id: generateId(),
          lastUpdated: new Date().toISOString(),
          ...account
        }
        set((state) => ({ accounts: [...state.accounts, newAccount] }))
        return newAccount
      },

      removeAccount: (id) => {
        set((state) => ({ accounts: state.accounts.filter((a) => a.id !== id) }))
      },

      clearAll: () => set({ accounts: defaultAccounts }),
      setAll: (accounts) => set({ accounts })
    }),
    {
      name: 'flux-accounts'
    }
  )
)

export default useAccountStore
