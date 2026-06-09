import { useState } from 'react'
import { Wallet, Clock } from 'lucide-react'
import Card from '../common/Card'
import Button from '../common/Button'
import useAccountStore from '../../store/accountStore'

export default function WalletBalance() {
  const accounts = useAccountStore((s) => s.accounts)
  const setBalance = useAccountStore((s) => s.setAccountBalance)
  const wallet = accounts.find(a => a.type === 'wallet')
  const [amount, setAmount] = useState(wallet?.balance?.toString() || '0')
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)

  if (!wallet) return null

  const handleSave = () => {
    const num = parseInt(amount) || 0
    setBalance(wallet.id, num)
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-5">
      <Card className="text-center">
        <div className="w-12 h-12 rounded-full bg-accent-subtle flex items-center justify-center mx-auto mb-4">
          <Wallet size={24} className="text-accent" />
        </div>

        {editing ? (
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-48">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-mono text-text-tertiary">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-field text-center text-3xl font-mono font-semibold pl-8 pr-4 py-3"
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <Button variant="primary" size="sm" onClick={handleSave}>Save</Button>
              <Button variant="secondary" size="sm" onClick={() => { setEditing(false); setAmount(wallet.balance.toString()) }}>Cancel</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="font-mono text-4xl font-semibold text-text-primary mb-2">
              ₹{wallet.balance.toLocaleString('en-IN')}
            </div>
            <p className="text-sm text-text-secondary mb-4">Current cash in wallet</p>
            <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>Update cash</Button>
          </>
        )}

        {saved && (
          <p className="text-xs text-success mt-2 animate-fadeIn">Updated!</p>
        )}

        <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-text-tertiary">
          <Clock size={12} />
          Last updated: {new Date(wallet.lastUpdated).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
        </div>
      </Card>

      <Card className="text-sm">
        <p className="text-text-secondary leading-relaxed">
          Cash is easy to forget. Track it to see the full picture.
        </p>
      </Card>
    </div>
  )
}
