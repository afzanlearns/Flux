import { useState } from 'react'
import { Wallet, Building2, Clock } from 'lucide-react'
import Card from '../common/Card'
import Button from '../common/Button'
import useAccountStore from '../../store/accountStore'

export default function WalletBalance() {
  const accounts = useAccountStore((s) => s.accounts)
  const setBalance = useAccountStore((s) => s.setAccountBalance)
  const wallet = accounts.find(a => a.type === 'wallet')
  const online = accounts.find(a => a.type !== 'wallet')
  const [cashAmount, setCashAmount] = useState(wallet?.balance?.toString() || '0')
  const [cashEditing, setCashEditing] = useState(false)
  const [cashSaved, setCashSaved] = useState(false)
  const [onlineAmount, setOnlineAmount] = useState(online?.balance?.toString() || '0')
  const [onlineEditing, setOnlineEditing] = useState(false)
  const [onlineSaved, setOnlineSaved] = useState(false)

  if (!wallet || !online) return null

  const handleCashSave = () => {
    const num = parseFloat(cashAmount) || 0
    setBalance(wallet.id, num)
    setCashEditing(false)
    setCashSaved(true)
    setTimeout(() => setCashSaved(false), 2000)
  }

  const handleOnlineSave = () => {
    const num = parseFloat(onlineAmount) || 0
    setBalance(online.id, num)
    setOnlineEditing(false)
    setOnlineSaved(true)
    setTimeout(() => setOnlineSaved(false), 2000)
  }

  return (
    <div className="space-y-5">
      <Card className="text-center">
        <div className="w-12 h-12 rounded-full bg-accent-subtle flex items-center justify-center mx-auto mb-4">
          <Wallet size={24} className="text-accent" />
        </div>

        {cashEditing ? (
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-48">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-mono text-text-tertiary">₹</span>
              <input
                type="number"
                value={cashAmount}
                onChange={(e) => setCashAmount(e.target.value)}
                className="input-field text-center text-3xl font-mono font-semibold pl-8 pr-4 py-3"
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <Button variant="primary" size="sm" onClick={handleCashSave}>Save</Button>
              <Button variant="secondary" size="sm" onClick={() => { setCashEditing(false); setCashAmount(wallet.balance.toString()) }}>Cancel</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="font-mono text-4xl font-semibold text-text-primary mb-2">
              ₹{wallet.balance.toLocaleString('en-IN')}
            </div>
            <p className="text-sm text-text-secondary mb-4">Current cash in wallet</p>
            <Button variant="secondary" size="sm" onClick={() => setCashEditing(true)}>Update cash</Button>
          </>
        )}

        {cashSaved && (
          <p className="text-xs text-success mt-2 animate-fadeIn">Updated!</p>
        )}

        <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-text-tertiary">
          <Clock size={12} />
          Last updated: {new Date(wallet.lastUpdated).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
        </div>
      </Card>

      <Card className="text-center">
        <div className="w-12 h-12 rounded-full bg-accent-subtle flex items-center justify-center mx-auto mb-4">
          <Building2 size={24} className="text-accent" />
        </div>

        {onlineEditing ? (
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-48">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-mono text-text-tertiary">₹</span>
              <input
                type="number"
                value={onlineAmount}
                onChange={(e) => setOnlineAmount(e.target.value)}
                className="input-field text-center text-3xl font-mono font-semibold pl-8 pr-4 py-3"
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <Button variant="primary" size="sm" onClick={handleOnlineSave}>Save</Button>
              <Button variant="secondary" size="sm" onClick={() => { setOnlineEditing(false); setOnlineAmount(online.balance.toString()) }}>Cancel</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="font-mono text-4xl font-semibold text-text-primary mb-2">
              ₹{online.balance.toLocaleString('en-IN')}
            </div>
            <p className="text-sm text-text-secondary mb-4">Online cash (bank accounts)</p>
            <Button variant="secondary" size="sm" onClick={() => setOnlineEditing(true)}>Update online cash</Button>
          </>
        )}

        {onlineSaved && (
          <p className="text-xs text-success mt-2 animate-fadeIn">Updated!</p>
        )}

        <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-text-tertiary">
          <Clock size={12} />
          Last updated: {new Date(online.lastUpdated).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
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
