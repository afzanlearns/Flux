import { TrendingUp, TrendingDown, BadgeIndianRupee } from 'lucide-react'
import Card from '../common/Card'
import useUIStore from '../../store/uiStore'

export default function QuickStats({ income, expenses, incomeChange, expenseChange, totalDebt }) {
  const hideAmounts = useUIStore((s) => s.hideAmounts)
  const mask = (v) => hideAmounts ? '—' : v

  return (
    <div className="grid grid-cols-3 gap-3">
      <Card className="stat-card stagger-1">
        <div className="stat-card-label">
          <TrendingUp size={14} className="text-success" />
          <span>Income</span>
        </div>
        <div className="stat-card-value text-success">{mask(income)}</div>
        {incomeChange !== 0 && (
          <span className={`stat-card-change ${incomeChange > 0 ? 'text-success' : 'text-danger'}`}>
            {incomeChange > 0 ? '+' : ''}{incomeChange}%
          </span>
        )}
      </Card>

      <Card className="stat-card stagger-2">
        <div className="stat-card-label">
          <TrendingDown size={14} className="text-warning" />
          <span>Expenses</span>
        </div>
        <div className="stat-card-value text-warning">{mask(expenses)}</div>
        {expenseChange !== 0 && (
          <span className={`stat-card-change ${expenseChange > 0 ? 'text-danger' : 'text-success'}`}>
            {expenseChange > 0 ? '+' : ''}{expenseChange}%
          </span>
        )}
      </Card>

      <Card className="stat-card stagger-3">
        <div className="stat-card-label">
          <BadgeIndianRupee size={14} className="text-accent" />
          <span>Debt</span>
        </div>
        <div className="stat-card-value text-danger">{mask(totalDebt)}</div>
      </Card>
    </div>
  )
}
