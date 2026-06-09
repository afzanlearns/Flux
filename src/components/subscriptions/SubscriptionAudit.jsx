import { useState } from 'react'
import { X, Check, AlertTriangle } from 'lucide-react'
import Card from '../common/Card'
import Button from '../common/Button'
import { daysSince } from '../../utils/dateHelpers'

export default function SubscriptionAudit({ subscriptions, totalMonthly, onCancel, onDismiss }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const unused = subscriptions.filter(s => daysSince(s.lastUsed) > 60)

  if (unused.length === 0) return null

  const current = unused[currentIndex]

  if (!current) return null

  const handleDecision = (subId, decision) => {
    if (decision === 'cancel') onCancel(subId)
    setTimeout(() => {
      if (currentIndex < unused.length - 1) {
        setCurrentIndex(prev => prev + 1)
      } else {
        onDismiss()
      }
    }, 300)
  }

  const handleDismissAll = () => {
    onDismiss()
  }

  return (
    <Card className="border-warning/30 animate-fadeIn">
      <div className="absolute top-0 left-0 right-0 h-1 bg-warning-subtle rounded-t-xl overflow-hidden">
        <div
          className="h-full bg-warning transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / unused.length) * 100}%` }}
        />
      </div>

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle size={18} className="text-warning" />
          <span className="text-sm font-semibold text-text-primary">Subscription audit</span>
        </div>
        <button onClick={handleDismissAll} className="btn-icon">
          <X size={16} />
        </button>
      </div>

      <p className="text-sm text-text-secondary mb-4">
        You're paying <span className="font-semibold text-text-primary">₹{totalMonthly.toLocaleString('en-IN')}/month</span>.
        {unused.length} haven't been used in 60+ days.
      </p>

      <div className="p-3 bg-bg-secondary rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-sm text-text-primary">{current.name}</span>
          <span className="font-mono text-sm font-semibold text-text-primary">₹{current.cost.toLocaleString('en-IN')}/{current.frequency === 'yearly' ? 'yr' : 'mo'}</span>
        </div>
        <p className="text-xs text-text-tertiary">
          Last used: {daysSince(current.lastUsed)} days ago
        </p>
        <p className="text-xs text-warning font-medium mt-1">
          That's ₹{(current.frequency === 'yearly' ? current.cost : current.cost * 12).toLocaleString('en-IN')}/year
        </p>
      </div>

      <div className="flex gap-2 mt-4">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1 text-success border-success/30 hover:bg-success-subtle"
          onClick={() => handleDecision(current.id, 'keep')}
        >
          <Check size={14} /> Keep
        </Button>
        <Button
          variant="danger"
          size="sm"
          className="flex-1"
          onClick={() => handleDecision(current.id, 'cancel')}
        >
          Cancel
        </Button>
      </div>

      <p className="text-[10px] text-text-tertiary mt-2 text-center">
        {unused.length - currentIndex - 1} more to review
      </p>
    </Card>
  )
}
