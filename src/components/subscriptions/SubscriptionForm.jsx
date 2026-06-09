import { useState } from 'react'
import Button from '../common/Button'
import Input from '../common/Input'

export default function SubscriptionForm({ onSubmit, onClose, initialData }) {
  const [name, setName] = useState(initialData?.name || '')
  const [cost, setCost] = useState(initialData?.cost?.toString() || '')
  const [frequency, setFrequency] = useState(initialData?.frequency || 'monthly')
  const [lastUsed, setLastUsed] = useState(initialData?.lastUsed?.split('T')[0] || '')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) { setError('Name is required'); return }
    const numCost = parseFloat(cost)
    if (!cost || isNaN(numCost) || numCost <= 0) { setError('Valid cost is required'); return }
    setError('')
    onSubmit({
      name: name.trim(),
      cost: numCost,
      frequency,
      lastUsed: lastUsed ? new Date(lastUsed).toISOString() : undefined,
      notes: ''
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Name"
        placeholder="Netflix, Spotify..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoFocus
      />

      <Input
        label="Cost"
        type="number"
        placeholder="0"
        value={cost}
        onChange={(e) => setCost(e.target.value)}
        prefix="₹"
        error={error}
      />

      <div className="flex flex-col gap-1.5">
        <label className="input-label">Frequency</label>
        <div className="flex gap-2">
          {['monthly', 'yearly'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFrequency(f)}
              className={`filter-pill flex-1 ${frequency === f ? 'active' : ''}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <Input
        label="Last used (optional)"
        type="date"
        value={lastUsed}
        onChange={(e) => setLastUsed(e.target.value)}
      />

      <div className="flex gap-3 pt-2">
        <Button variant="secondary" onClick={onClose} className="flex-1" type="button">Cancel</Button>
        <Button variant="primary" className="flex-1" type="submit">Save</Button>
      </div>
    </form>
  )
}
