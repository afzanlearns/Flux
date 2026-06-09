import Card from '../common/Card'
import useUIStore from '../../store/uiStore'
import { formatAmount } from '../../utils/currencyFormatter'

export default function DebtProgress({ totalDebt, totalPaid }) {
  const hideAmounts = useUIStore((s) => s.hideAmounts)

  if (totalDebt === 0 && totalPaid === 0) return null

  const totalOriginal = totalDebt + totalPaid
  const percent = totalOriginal > 0 ? Math.round((totalPaid / totalOriginal) * 100) : 0
  const mask = (val) => hideAmounts ? '—' : formatAmount(val)

  return (
    <Card className="animate-fadeIn">
      <div className="text-sm font-medium text-text-secondary mb-2">Total Progress</div>
      <div className="font-mono text-2xl font-semibold text-success">{mask(totalPaid)}</div>
      <p className="text-xs text-text-tertiary">paid off total</p>

      <div className="w-full h-2.5 bg-bg-secondary rounded-full overflow-hidden mt-3">
        <div
          className="h-full bg-success rounded-full transition-all duration-700"
          style={{ width: `${Math.min(100, percent)}%` }}
        />
      </div>

      <div className="flex items-center justify-between mt-2 text-xs text-text-tertiary">
        <span>Paid: {mask(totalPaid)}</span>
        <span>Remaining: {mask(totalDebt)}</span>
      </div>
    </Card>
  )
}
