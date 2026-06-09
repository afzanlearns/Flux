import { useState } from 'react'
import { Trash2, Edit3, ChevronDown, CheckCircle2 } from 'lucide-react'
import Card from '../common/Card'
import Button from '../common/Button'
import { calcPayoffMonths } from '../../utils/calculations'

export default function DebtList({ debts, onDelete, onEdit, onAddPayment }) {
  const [expandedId, setExpandedId] = useState(null)

  if (debts.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon-wrap">
          <CheckCircle2 size={28} />
        </div>
        <p className="text-sm text-text-secondary">No active debts</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {debts.map((debt) => {
        const isExpanded = expandedId === debt.id
        const paid = debt.originalAmount - debt.currentBalance
        const percent = Math.round((paid / debt.originalAmount) * 100)
        const payoffMonths = calcPayoffMonths(debt)

        return (
          <Card key={debt.id} className="animate-fadeIn">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-sm text-text-primary">{debt.name}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => onEdit(debt)} className="btn-icon">
                  <Edit3 size={14} />
                </button>
                <button onClick={() => onDelete(debt.id)} className="btn-icon text-danger hover:text-danger">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="font-mono text-xl font-semibold text-text-primary mb-2">
              ₹{debt.currentBalance.toLocaleString('en-IN')}
            </div>

            <div className="w-full h-2 bg-bg-secondary rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-success to-[#059669] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, percent)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-text-tertiary mb-3">
              <span>Paid: ₹{paid.toLocaleString('en-IN')} of ₹{debt.originalAmount.toLocaleString('en-IN')}</span>
              <span>{percent}%</span>
            </div>

            {payoffMonths && (
              <div className="text-xs text-text-tertiary mb-2">
                {payoffMonths > 60
                  ? 'More than 5 years remaining'
                  : `${payoffMonths} months until debt-free`
                }
              </div>
            )}

            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => setExpandedId(isExpanded ? null : debt.id)}
            >
              <ChevronDown size={14} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              {isExpanded ? 'Hide' : 'Add payment'}
            </Button>

            {isExpanded && (
              <div className="mt-3 pt-3 border-t border-border animate-slideDown">
                <PaymentForm onSubmit={(payment) => { onAddPayment(debt.id, payment); setExpandedId(null) }} />
                {debt.payments?.length > 0 && (
                  <div className="mt-3 space-y-1">
                    <span className="text-xs font-medium text-text-tertiary">Payment history</span>
                    {debt.payments.slice(-5).reverse().map((p, i) => (
                      <div key={p.id || i} className="flex items-center justify-between text-xs py-1">
                        <span className="text-text-tertiary">{new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        <span className="font-mono font-medium text-success">-₹{p.amount.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}

function PaymentForm({ onSubmit }) {
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const num = parseFloat(amount)
    if (!amount || isNaN(num) || num <= 0) {
      setError('Enter a valid amount')
      return
    }
    onSubmit({ amount: num })
    setAmount('')
    setError('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="flex-1">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary text-sm font-mono">₹</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => { setAmount(e.target.value); setError('') }}
            placeholder="Amount"
            className="input-field !py-2 !pl-7 !text-sm"
            autoFocus
          />
        </div>
        {error && <span className="input-error-text">{error}</span>}
      </div>
      <Button variant="primary" size="sm" type="submit">Log payment</Button>
    </form>
  )
}
