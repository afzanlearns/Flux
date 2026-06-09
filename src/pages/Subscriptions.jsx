import { useState } from 'react'
import { Plus, AlertTriangle, ChevronDown } from 'lucide-react'
import Header from '../components/common/Header'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import SubscriptionList from '../components/subscriptions/SubscriptionList'
import SubscriptionForm from '../components/subscriptions/SubscriptionForm'
import useSubscriptionStore from '../store/subscriptionStore'
import { useSubscriptionData } from '../hooks/useCalculations'
import { formatAmount } from '../utils/currencyFormatter'

export default function Subscriptions({ onNavigate }) {
  const { addSubscription, updateSubscription, deleteSubscription, cancelSubscription, markUsed } = useSubscriptionStore()
  const { active, cancelled, monthlyTotal, cancelledSavings } = useSubscriptionData()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [showCancelled, setShowCancelled] = useState(false)
  const [confirmCancelId, setConfirmCancelId] = useState(null)

  const monthlyFormatted = formatAmount(monthlyTotal)
  const annualTotal = monthlyTotal * 12
  const annualFormatted = formatAmount(annualTotal)

  const handleSave = (data) => {
    if (editing) {
      updateSubscription(editing.id, data)
    } else {
      addSubscription(data)
    }
    setShowForm(false)
    setEditing(null)
  }

  const handleCancel = (id) => {
    setConfirmCancelId(id)
  }

  const confirmCancel = () => {
    if (confirmCancelId) {
      cancelSubscription(confirmCancelId)
      setConfirmCancelId(null)
    }
  }

  return (
    <div className="pb-28">
      <Header onSettingsClick={() => onNavigate('settings')} />

      <div className="animate-fadeIn space-y-5">
        <div className="number-hero">
          <div className="text-sm font-medium text-text-secondary mb-1">Monthly Total</div>
          <div className={`number-hero-value ${monthlyTotal > 300 ? 'text-warning' : ''}`}>
            {monthlyFormatted}
          </div>
          <div className="number-hero-label">{annualFormatted}/year</div>
          {monthlyTotal > 300 && (
            <div className="flex items-center justify-center gap-1.5 mt-3 text-xs font-medium text-warning">
              <AlertTriangle size={12} />
              That's {annualFormatted}/year
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">
            {active.length} active
          </span>
          <Button variant="primary" size="sm" icon={Plus} onClick={() => { setEditing(null); setShowForm(true) }}>
            Add
          </Button>
        </div>

        <SubscriptionList
          subscriptions={active}
          onDelete={deleteSubscription}
          onEdit={(sub) => { setEditing(sub); setShowForm(true) }}
          onCancel={handleCancel}
          onMarkUsed={markUsed}
        />

        {cancelled.length > 0 && (
          <Card>
            <button
              onClick={() => setShowCancelled(!showCancelled)}
              className="flex items-center justify-between w-full text-left cursor-pointer"
            >
              <div>
                <span className="text-sm font-medium text-text-primary">Cancelled</span>
                <span className="text-xs text-text-tertiary ml-2">Saved {formatAmount(cancelledSavings)}/year</span>
              </div>
              <ChevronDown size={16} className={`text-text-tertiary transition-transform ${showCancelled ? 'rotate-180' : ''}`} />
            </button>
            {showCancelled && (
              <div className="mt-3 pt-3 border-t border-border animate-slideDown">
                <SubscriptionList
                  subscriptions={cancelled}
                  onDelete={deleteSubscription}
                  onEdit={() => {}}
                  onCancel={() => {}}
                  onMarkUsed={() => {}}
                />
              </div>
            )}
          </Card>
        )}
      </div>

      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditing(null) }}
        title={editing ? 'Edit Subscription' : 'Add Subscription'}
      >
        <SubscriptionForm
          onSubmit={handleSave}
          onClose={() => { setShowForm(false); setEditing(null) }}
          initialData={editing}
        />
      </Modal>

      <Modal
        isOpen={!!confirmCancelId}
        onClose={() => setConfirmCancelId(null)}
        title="Cancel Subscription?"
      >
        <div className="text-center py-4">
          <p className="text-sm text-text-secondary mb-4">
            Ready to cancel? We'll take you to the login page so you can manage it.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setConfirmCancelId(null)}>Keep it</Button>
            <Button variant="danger" className="flex-1" onClick={confirmCancel}>Yes, cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
