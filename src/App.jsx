import { useEffect } from 'react'
import useUIStore from './store/uiStore'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Subscriptions from './pages/Subscriptions'
import Debts from './pages/Debts'
import Insights from './pages/Insights'
import Wallet from './pages/Wallet'
import Settings from './pages/Settings'
import BottomNav from './components/common/BottomNav'
import OfflineIndicator from './components/common/OfflineIndicator'
import InstallBanner from './components/common/InstallBanner'

export default function App() {
  const onboardingComplete = useUIStore((s) => s.onboardingComplete)
  const currentPage = useUIStore((s) => s.currentPage)
  const setCurrentPage = useUIStore((s) => s.setCurrentPage)
  const theme = useUIStore((s) => s.theme)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else if (theme === 'light') {
      root.classList.remove('dark')
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.toggle('dark', prefersDark)
    }
  }, [theme])

  if (!onboardingComplete) {
    return <Onboarding />
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard onNavigate={setCurrentPage} />
      case 'transactions': return <Transactions onNavigate={setCurrentPage} />
      case 'subscriptions': return <Subscriptions onNavigate={setCurrentPage} />
      case 'debts': return <Debts onNavigate={setCurrentPage} />
      case 'insights': return <Insights onNavigate={setCurrentPage} />
      case 'wallet': return <Wallet onNavigate={setCurrentPage} />
      case 'settings': return <Settings onNavigate={setCurrentPage} />
      default: return <Dashboard onNavigate={setCurrentPage} />
    }
  }

  return (
    <div className="min-h-dvh bg-bg-primary text-text-primary">
      <OfflineIndicator />
      <main className="max-w-lg mx-auto px-4 pt-2">
        {renderPage()}
      </main>
      <BottomNav />
      <InstallBanner />
    </div>
  )
}
