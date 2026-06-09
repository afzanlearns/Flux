import { useState, useRef } from 'react'
import { Trash2, Edit3, Coffee, Car, Repeat, Briefcase, Package, Wallet, PenTool, ArrowRightLeft } from 'lucide-react'
import useUIStore from '../../store/uiStore'

const categoryIcons = {
  Food: Coffee,
  Transport: Car,
  Subscriptions: Repeat,
  Work: Briefcase,
  Other: Package,
  Salary: Wallet,
  Freelance: PenTool
}

const categoryColors = {
  Food: 'icon-wrap-warning',
  Transport: 'icon-wrap-accent',
  Subscriptions: 'icon-wrap-surface',
  Work: 'icon-wrap-success',
  Other: 'icon-wrap-surface',
  Salary: 'icon-wrap-success',
  Freelance: 'icon-wrap-accent'
}

export default function TransactionList({ transactions, onDelete, onEdit, type }) {
  const [swipedId, setSwipedId] = useState(null)
  const touchStart = useRef(null)

  const filtered = type === 'all'
    ? transactions
    : transactions.filter(t => t.type === type)

  if (filtered.length === 0) {
    return (
      <div className="empty-state animate-fadeIn">
        <div className="empty-state-icon-wrap">
          <ArrowRightLeft size={28} />
        </div>
        <h3>No transactions yet</h3>
        <p>Start by logging your first income or expense.</p>
      </div>
    )
  }

  const handleTouchStart = (id) => (e) => {
    touchStart.current = { id, x: e.touches[0].clientX }
  }

  const handleTouchEnd = (id) => (e) => {
    if (!touchStart.current) return
    const diff = e.changedTouches[0].clientX - touchStart.current.x
    if (diff < -60) setSwipedId(id)
    else setSwipedId(null)
    touchStart.current = null
  }

  return (
    <div className="space-y-2">
      {filtered.map((t, i) => {
        const Icon = categoryIcons[t.category] || Package
        const iconColor = categoryColors[t.category] || 'icon-wrap-surface'

        return (
          <div
            key={t.id}
            className="relative overflow-hidden rounded-lg animate-fadeIn"
            style={{ animationDelay: `${i * 0.03}s` }}
            onTouchStart={handleTouchStart(t.id)}
            onTouchEnd={handleTouchEnd(t.id)}
          >
            <div
              className="transaction-item"
              style={{
                transform: swipedId === t.id ? 'translateX(-80px)' : 'translateX(0)'
              }}
            >
              <div className={`icon-wrap ${iconColor}`}>
                <Icon size={18} strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-text-primary truncate">{t.category}</span>
                  {t.note && (
                    <span className="text-xs text-text-tertiary truncate">· {t.note}</span>
                  )}
                </div>
                <span className="text-xs text-text-tertiary font-mono">
                  {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className="text-right flex-shrink-0 flex items-center gap-2">
                <div className={`tx-amount ${t.type === 'income' ? 'income' : 'expense'}`}>
                  {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                </div>
                <div className="tx-hover-actions">
                  <button
                    onClick={(e) => { e.stopPropagation(); onEdit(t); setSwipedId(null) }}
                    className="btn-icon text-accent hover:bg-accent-subtle"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(t.id); setSwipedId(null) }}
                    className="btn-icon text-danger hover:bg-danger-subtle"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
