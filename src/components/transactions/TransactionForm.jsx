import { useState } from 'react'
import { Camera, X, Wallet, Building2 } from 'lucide-react'
import Button from '../common/Button'
import Input from '../common/Input'
import useAccountStore from '../../store/accountStore'

const incomeCategories = ['Salary', 'Freelance', 'Other']
const expenseCategories = ['Food', 'Transport', 'Subscriptions', 'Work', 'Other']

export default function TransactionForm({ type, onSubmit, onClose, initialData }) {
  const accounts = useAccountStore((s) => s.accounts)
  const defaultAccountId = accounts[0]?.id || null
  const [amount, setAmount] = useState(initialData?.amount?.toString() || '')
  const [category, setCategory] = useState(initialData?.category || (type === 'income' ? 'Freelance' : 'Food'))
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0])
  const [note, setNote] = useState(initialData?.note || '')
  const [photo, setPhoto] = useState(initialData?.photoURL || null)
  const [accountId, setAccountId] = useState(initialData?.accountId || defaultAccountId)
  const [error, setError] = useState('')

  const categories = type === 'income' ? incomeCategories : expenseCategories

  const handlePhoto = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (ev) => setPhoto(ev.target.result)
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const numAmount = parseFloat(amount)
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount')
      return
    }
    setError('')
    onSubmit({
      type,
      amount: numAmount,
      category,
      date,
      accountId,
      note: note.trim() || undefined,
      photoURL: photo || undefined
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Amount"
        type="number"
        placeholder="0"
        value={amount}
        onChange={(e) => { setAmount(e.target.value); setError('') }}
        prefix="₹"
        autoFocus
        error={error}
      />

      <div className="flex flex-col gap-1.5">
        <label className="input-label">Category</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`filter-pill ${category === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="input-label">Account</label>
        <div className="flex flex-wrap gap-2">
          {accounts.map((acct) => (
            <button
              key={acct.id}
              type="button"
              onClick={() => setAccountId(acct.id)}
              className={`filter-pill flex items-center gap-1.5 ${accountId === acct.id ? 'active' : ''}`}
            >
              {acct.type === 'wallet' ? <Wallet size={14} /> : <Building2 size={14} />}
              {acct.name}
            </button>
          ))}
        </div>
      </div>

      <Input
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <div className="flex flex-col gap-1.5">
        <label className="input-label">
          Note {note && <span className="text-text-tertiary font-normal">({note.length})</span>}
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What was this for?"
          rows={2}
          maxLength={200}
          className="input-field resize-none"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handlePhoto}
          className="flex items-center gap-2 text-sm text-text-tertiary hover:text-accent transition-colors cursor-pointer"
        >
          <Camera size={16} />
          {photo ? 'Change photo' : 'Add photo'}
        </button>
        {photo && (
          <button
            type="button"
            onClick={() => setPhoto(null)}
            className="text-danger text-sm flex items-center gap-1 cursor-pointer"
          >
            <X size={14} /> Remove
          </button>
        )}
      </div>

      {photo && (
        <div className="rounded-lg overflow-hidden border border-border">
          <img src={photo} alt="Receipt" className="max-h-40 w-full object-cover" />
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button variant="secondary" onClick={onClose} className="flex-1" type="button">
          Cancel
        </Button>
        <Button variant={type === 'income' ? 'primary' : 'danger'} className="flex-1" type="submit">
          Save
        </Button>
      </div>
    </form>
  )
}
