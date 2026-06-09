import { useState, useMemo } from 'react'
import { Plus, Minus } from 'lucide-react'
import Header from '../components/common/Header'
import TransactionList from '../components/transactions/TransactionList'
import TransactionForm from '../components/transactions/TransactionForm'
import Modal from '../components/common/Modal'
import useTransactionStore from '../store/transactionStore'
import useUIStore from '../store/uiStore'
import { calcMonthlyIncome, calcMonthlyExpenses, calcNetMonthly } from '../utils/calculations'
import { formatAmount } from '../utils/currencyFormatter'

export default function Transactions({ onNavigate }) {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useTransactionStore()
  const hideAmounts = useUIStore((s) => s.hideAmounts)
  const [filter, setFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [formType, setFormType] = useState('expense')
  const [editing, setEditing] = useState(null)

  const monthlyIncome = useMemo(() => calcMonthlyIncome(transactions), [transactions])
  const monthlyExpenses = useMemo(() => calcMonthlyExpenses(transactions), [transactions])
  const monthlyNet = useMemo(() => calcNetMonthly(transactions), [transactions])

  const mask = (val) => hideAmounts ? '—' : formatAmount(val)

  const openAdd = (type) => {
    setFormType(type)
    setEditing(null)
    setShowForm(true)
  }

  const handleEdit = (transaction) => {
    setFormType(transaction.type)
    setEditing(transaction)
    setShowForm(true)
  }

  const handleSubmit = (data) => {
    if (editing) {
      updateTransaction(editing.id, data)
    } else {
      addTransaction(data)
    }
    setShowForm(false)
    setEditing(null)
  }

  return (
    <div className="pb-28">
      <Header onSettingsClick={() => onNavigate('settings')} />

      <div className="animate-fadeIn">
        <div className="card mb-5">
          <div className="flex items-center justify-around text-center">
            <div>
              <div className="text-xs text-text-secondary mb-1 font-medium">Income</div>
              <div className="font-mono text-base font-semibold text-success">{mask(monthlyIncome)}</div>
            </div>
            <div className="w-px h-10 bg-border" />
            <div>
              <div className="text-xs text-text-secondary mb-1 font-medium">Expenses</div>
              <div className="font-mono text-base font-semibold text-warning">{mask(monthlyExpenses)}</div>
            </div>
            <div className="w-px h-10 bg-border" />
            <div>
              <div className="text-xs text-text-secondary mb-1 font-medium">Net</div>
              <div className={`font-mono text-base font-semibold ${monthlyNet >= 0 ? 'text-success' : 'text-danger'}`}>{mask(monthlyNet)}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          {['all', 'income', 'expense'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`filter-pill capitalize ${filter === f ? 'active' : ''}`}
            >
              {f}
            </button>
          ))}
          <div className="flex-1" />
          <button
            onClick={() => openAdd('income')}
            className="btn-icon text-success"
            title="Add income"
          >
            <Plus size={18} />
          </button>
          <button
            onClick={() => openAdd('expense')}
            className="btn-icon text-danger"
            title="Add expense"
          >
            <Minus size={18} />
          </button>
        </div>

        <TransactionList
          transactions={transactions}
          type={filter}
          onDelete={deleteTransaction}
          onEdit={handleEdit}
        />
      </div>

      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditing(null) }}
        title={editing ? 'Edit Transaction' : `Log ${formType}`}
      >
        <TransactionForm
          type={formType}
          onSubmit={handleSubmit}
          onClose={() => { setShowForm(false); setEditing(null) }}
          initialData={editing}
        />
      </Modal>
    </div>
  )
}
