import { useState } from 'react'
import { ArrowLeft, Download, Upload, Trash2, Moon, Sun, Monitor } from 'lucide-react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import useUIStore from '../store/uiStore'
import useTransactionStore from '../store/transactionStore'
import useAccountStore from '../store/accountStore'
import useSubscriptionStore from '../store/subscriptionStore'
import useDebtStore from '../store/debtStore'
import { exportData } from '../utils/dataExport'
import { importData } from '../utils/dataImport'

export default function Settings({ onNavigate }) {
  const { theme, setTheme, currency, setCurrency, clearDismissals } = useUIStore()
  const transactions = useTransactionStore((s) => s.transactions)
  const accounts = useAccountStore((s) => s.accounts)
  const subscriptions = useSubscriptionStore((s) => s.subscriptions)
  const debts = useDebtStore((s) => s.debts)
  const setAllTransactions = useTransactionStore((s) => s.setAll)
  const setAllAccounts = useAccountStore((s) => s.setAll)
  const setAllSubscriptions = useSubscriptionStore((s) => s.setAll)
  const setAllDebts = useDebtStore((s) => s.setAll)
  const clearTransactions = useTransactionStore((s) => s.clearAll)
  const clearAccounts = useAccountStore((s) => s.clearAll)
  const clearSubscriptions = useSubscriptionStore((s) => s.clearAll)
  const clearDebts = useDebtStore((s) => s.clearAll)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [importStatus, setImportStatus] = useState('')
  const [exportStatus, setExportStatus] = useState('')

  const handleExport = () => {
    exportData({ transactions, accounts, subscriptions, debts })
    setExportStatus('Exported!')
    setTimeout(() => setExportStatus(''), 2000)
  }

  const handleImport = async () => {
    try {
      const data = await importData()
      if (data.transactions) setAllTransactions(data.transactions)
      if (data.accounts) setAllAccounts(data.accounts)
      if (data.subscriptions) setAllSubscriptions(data.subscriptions)
      if (data.debts) setAllDebts(data.debts)
      setImportStatus('Imported successfully!')
      setTimeout(() => setImportStatus(''), 3000)
    } catch (err) {
      setImportStatus(err.message || 'Import failed')
      setTimeout(() => setImportStatus(''), 3000)
    }
  }

  const handleClearAll = () => {
    clearTransactions()
    clearAccounts()
    clearSubscriptions()
    clearDebts()
    clearDismissals()
    setShowClearConfirm(false)
  }

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor }
  ]

  const currencies = ['INR', 'USD', 'EUR', 'GBP']

  return (
    <div className="pb-28">
      <header className="flex items-center gap-3 py-4 px-1">
        <button onClick={() => onNavigate('dashboard')} className="btn-icon">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold text-text-primary">Settings</h1>
      </header>

      <div className="animate-fadeIn space-y-5">
        <Card>
          <h3 className="text-sm font-medium text-text-secondary mb-4">Appearance</h3>
          <div className="segmented">
            {themes.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className={`segmented-item ${theme === value ? 'active' : ''}`}
              >
                <Icon size={16} className="mx-auto mb-1" />
                {label}
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-text-secondary mb-4">Currency</h3>
          <div className="segmented">
            {currencies.map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`segmented-item ${currency === c ? 'active' : ''}`}
              >
                {c}
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-text-secondary mb-4">Data</h3>
          <div className="space-y-3">
            <Button variant="secondary" className="w-full justify-start" icon={Download} onClick={handleExport}>
              Export data as JSON
            </Button>
            {exportStatus && <p className="text-xs text-success animate-fadeIn">{exportStatus}</p>}

            <Button variant="secondary" className="w-full justify-start" icon={Upload} onClick={handleImport}>
              Import data from JSON
            </Button>
            {importStatus && (
              <p className={`text-xs animate-fadeIn ${importStatus.includes('success') ? 'text-success' : 'text-danger'}`}>
                {importStatus}
              </p>
            )}

            <div className="pt-3 border-t border-border">
              {showClearConfirm ? (
                <div className="space-y-2">
                  <p className="text-xs text-danger font-medium">This will delete ALL your data. This cannot be undone.</p>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" className="flex-1" onClick={() => setShowClearConfirm(false)}>Cancel</Button>
                    <Button variant="danger" size="sm" className="flex-1" onClick={handleClearAll}>Delete everything</Button>
                  </div>
                </div>
              ) : (
                <Button variant="ghost" className="w-full justify-start text-danger" icon={Trash2} onClick={() => setShowClearConfirm(true)}>
                  Clear all data
                </Button>
              )}
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-text-secondary mb-4">About</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Version</span>
              <span className="font-medium text-text-primary">1.0.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Data storage</span>
              <span className="font-medium text-text-primary">100% on-device</span>
            </div>
            <p className="text-xs text-text-tertiary pt-1">
              Flux keeps all your data on your device. Nothing is sent anywhere.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
