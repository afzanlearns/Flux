import { useState } from 'react'
import { Trash2, Edit3, CheckCircle, XCircle, Calendar } from 'lucide-react'
import useUIStore from '../../store/uiStore'
import { daysSince } from '../../utils/dateHelpers'

export default function SubscriptionList({ subscriptions, onDelete, onEdit, onCancel, onMarkUsed }) {
  const [sortBy, setSortBy] = useState('cost')
  const hideAmounts = useUIStore((s) => s.hideAmounts)

  const sorted = [...subscriptions].sort((a, b) => {
    if (sortBy === 'cost') return b.cost - a.cost
    if (sortBy === 'lastUsed') return daysSince(a.lastUsed) - daysSince(b.lastUsed)
    return 0
  })

  if (sorted.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon-wrap">
          <Calendar size={28} />
        </div>
        <p className="text-sm text-text-secondary">
          {subscriptions.length === 0 ? 'No subscriptions added yet' : 'No active subscriptions'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-text-tertiary">Sort:</span>
        <button
          onClick={() => setSortBy('cost')}
          className={`text-xs px-2 py-1 rounded cursor-pointer font-medium transition-colors ${
            sortBy === 'cost' ? 'text-accent bg-accent-subtle' : 'text-text-tertiary hover:text-text-primary'
          }`}
        >
          Cost
        </button>
        <button
          onClick={() => setSortBy('lastUsed')}
          className={`text-xs px-2 py-1 rounded cursor-pointer font-medium transition-colors ${
            sortBy === 'lastUsed' ? 'text-accent bg-accent-subtle' : 'text-text-tertiary hover:text-text-primary'
          }`}
        >
          Last used
        </button>
      </div>

      {sorted.map((sub) => {
        const daysSinceUsed = daysSince(sub.lastUsed)
        const isUnused = daysSinceUsed > 60

        return (
          <div key={sub.id} className="transaction-item">
            <div className={`icon-wrap ${
              sub.status === 'active' ? 'icon-wrap-accent' : 'icon-wrap-surface'
            }`}>
              <span className="text-sm font-bold">{sub.name.charAt(0).toUpperCase()}</span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-text-primary truncate">{sub.name}</span>
                {sub.status === 'cancelled' && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-bg-secondary text-text-tertiary font-medium">Cancelled</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-text-tertiary">
                <span>{hideAmounts ? '—' : `₹${sub.cost.toLocaleString('en-IN')}`}/{sub.frequency === 'yearly' ? 'yr' : 'mo'}</span>
                <span>·</span>
                <span className={isUnused && sub.status === 'active' ? 'text-warning font-medium' : ''}>
                  {daysSinceUsed === 0 ? 'Used today' : `${daysSinceUsed}d ago`}
                </span>
              </div>
            </div>

            <div className="tx-hover-actions">
              <button
                onClick={() => onMarkUsed(sub.id)}
                className="btn-icon"
                title="Mark as used"
              >
                <CheckCircle size={14} />
              </button>
              <button onClick={() => onEdit(sub)} className="btn-icon">
                <Edit3 size={14} />
              </button>
              {sub.status === 'active' && (
                <button
                  onClick={() => onCancel(sub.id)}
                  className="btn-icon text-warning"
                  title="Cancel subscription"
                >
                  <XCircle size={14} />
                </button>
              )}
              <button onClick={() => onDelete(sub.id)} className="btn-icon text-danger">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
