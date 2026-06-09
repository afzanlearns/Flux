import { LayoutDashboard, ArrowRightLeft, Repeat, Banknote, Landmark, BarChart3 } from 'lucide-react'
import useUIStore from '../../store/uiStore'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowRightLeft },
  { id: 'subscriptions', label: 'Subscriptions', icon: Repeat },
  { id: 'debts', label: 'Debts', icon: Banknote },
  { id: 'insights', label: 'Insights', icon: BarChart3 },
  { id: 'wallet', label: 'Wallet', icon: Landmark }
]

export default function BottomNav() {
  const currentPage = useUIStore((s) => s.currentPage)
  const setCurrentPage = useUIStore((s) => s.setCurrentPage)

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-40 pb-safe shadow-subtle">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`
                flex flex-col items-center gap-0.5 py-2 px-2 min-w-0 flex-1
                transition-colors duration-150 cursor-pointer relative
                ${isActive ? 'text-accent' : 'text-text-tertiary hover:text-text-primary'}
              `}
            >
              {isActive && (
                <span className="absolute -top-px left-1/4 right-1/4 h-0.5 bg-accent rounded-full" />
              )}
              <Icon size={18} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="text-[10px] font-medium leading-none truncate max-w-full">
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
