import { useState } from 'react'
import { Plus } from 'lucide-react'
import Header from '../components/common/Header'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import Input from '../components/common/Input'
import DebtList from '../components/debts/DebtList'
import DebtProgress from '../components/debts/DebtProgress'
import MilestoneCelebration from '../components/debts/MilestoneCelebration'
import useDebtStore from '../store/debtStore'
import { useDebtData } from '../hooks/useCalculations'
import { formatAmount } from '../utils/currencyFormatter'

export default function Debts({ onNavigate }) {
  const { addDebt, updateDebt, deleteDebt, addPayment, celebrateMilestone } = useDebtStore()
  const { active, paid, totalDebt, totalPaid, milestones } = useDebtData()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)

  const totalDebtFormatted = formatAmount(totalDebt)
  const totalPaidFormatted = formatAmount(totalPaid)

  const handleSave = (data) => {
    if (editing) {
      updateDebt(editing.id, data)
    } else {
      addDebt(data)
    }
    setShowForm(false)
    setEditing(null)
  }

  return (
    <div className="pb-28">
      <Header onSettingsClick={() => onNavigate('settings')} />

      <div className="animate-fadeIn space-y-5">
        <div className="number-hero">
          <div className="text-sm font-medium text-text-secondary mb-1">Total Debt</div>
          <div className="number-hero-value text-danger">{totalDebtFormatted}</div>
          <div className="number-hero-label">
            {active.length === 0
              ? 'No active debts'
              : `${active.length} active ${active.length === 1 ? 'debt' : 'debts'}`
            }
          </div>
        </div>

        <MilestoneCelebration milestones={milestones} onCelebrate={celebrateMilestone} />

        <DebtProgress totalDebt={totalDebt} totalPaid={totalPaid} />

        {totalPaid > 0 && (
          <Card className="text-center">
            <div className="text-xs text-text-secondary mb-1 font-medium">Total Paid (Ever)</div>
            <div className="font-mono text-xl font-semibold text-success">{totalPaidFormatted}</div>
          </Card>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">
            {active.length} active {active.length === 1 ? 'debt' : 'debts'}
          </span>
          <Button variant="primary" size="sm" icon={Plus} onClick={() => { setEditing(null); setShowForm(true) }}>
            Add debt
          </Button>
        </div>

        <DebtList
          debts={active}
          onDelete={deleteDebt}
          onEdit={(debt) => { setEditing(debt); setShowForm(true) }}
          onAddPayment={addPayment}
        />

        {paid.length > 0 && (
          <Card>
            <div className="text-sm font-medium text-text-primary mb-3">Paid off</div>
            <div className="space-y-3">
              {paid.map((d) => (
                <div key={d.id} className="flex items-center justify-between text-sm">
                  <span className="text-text-primary">{d.name}</span>
                  <span className="font-mono font-semibold text-success">{formatAmount(d.originalAmount)}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditing(null) }}
        title={editing ? 'Edit Debt' : 'Add Debt'}
      >
        <DebtForm onSubmit={handleSave} onClose={() => { setShowForm(false); setEditing(null) }} initialData={editing} />
      </Modal>
    </div>
  )
}

function DebtForm({ onSubmit, onClose, initialData }) {
  const [name, setName] = useState(initialData?.name || '')
  const [originalAmount, setOriginalAmount] = useState(initialData?.originalAmount?.toString() || '')
  const [currentBalance, setCurrentBalance] = useState(initialData?.currentBalance?.toString() || '')
  const [interestRate, setInterestRate] = useState(initialData?.interestRate?.toString() || '')
  const [minimumPayment, setMinimumPayment] = useState(initialData?.minimumPayment?.toString() || '')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim() || !originalAmount) {
      setError('Name and amount are required')
      return
    }
    setError('')
    onSubmit({
      name: name.trim(),
      originalAmount: parseFloat(originalAmount),
      currentBalance: parseFloat(currentBalance || originalAmount),
      interestRate: interestRate ? parseFloat(interestRate) : undefined,
      minimumPayment: minimumPayment ? parseFloat(minimumPayment) : undefined
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Student Loan, Credit Card..." autoFocus />
      <Input label="Original Amount" type="number" value={originalAmount} onChange={(e) => setOriginalAmount(e.target.value)} prefix="₹" error={error} />
      <Input label="Current Balance" type="number" value={currentBalance} onChange={(e) => setCurrentBalance(e.target.value)} prefix="₹" />
      <Input label="Interest Rate (%)" type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} placeholder="Optional" />
      <Input label="Minimum Monthly Payment" type="number" value={minimumPayment} onChange={(e) => setMinimumPayment(e.target.value)} prefix="₹" placeholder="Optional" />
      <div className="flex gap-3 pt-2">
        <Button variant="secondary" onClick={onClose} className="flex-1" type="button">Cancel</Button>
        <Button variant="primary" className="flex-1" type="submit">Save</Button>
      </div>
    </form>
  )
}
