import { useState } from 'react'
import { Wallet, Building2, Banknote } from 'lucide-react'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import useUIStore from '../store/uiStore'
import useAccountStore from '../store/accountStore'
import useDebtStore from '../store/debtStore'


const slides = [
  {
    title: 'Welcome to Flux',
    subtitle: 'Your money, clearly.',
    description: 'See your financial reality without judgment. All your money, one place, completely offline.',
    icon: Wallet
  },
  {
    title: 'Your Cash',
    subtitle: 'How much cash is in your wallet right now?',
    description: 'Cash is easy to forget. Let\'s start there.',
    icon: Banknote,
    isWallet: true
  },
  {
    title: 'Your Accounts',
    subtitle: 'What about your bank accounts?',
    description: 'Add your bank balances to see your full picture.',
    icon: Building2,
    isAccounts: true
  },
  {
    title: 'Any Debts?',
    subtitle: 'Optional, but helpful for the full picture.',
    description: 'Add debts to see your true balance and payoff timeline.',
    icon: Banknote,
    isDebts: true
  }
]

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const [walletAmount, setWalletAmount] = useState('')
  const [bankAmount, setBankAmount] = useState('')
  const [debtName, setDebtName] = useState('')
  const [debtAmount, setDebtAmount] = useState('')
  const [skipDebt, setSkipDebt] = useState(false)

  const completeOnboarding = useUIStore((s) => s.completeOnboarding)
  const setAccountBalance = useAccountStore((s) => s.setAccountBalance)
  const accounts = useAccountStore((s) => s.accounts)
  const addDebt = useDebtStore((s) => s.addDebt)

  const isLastStep = step === slides.length - 1

  const handleNext = () => {
    if (step === 1) {
      const wallet = accounts.find(a => a.type === 'wallet')
      if (wallet) setAccountBalance(wallet.id, parseInt(walletAmount) || 0)
    }
    if (step === 2) {
      const checking = accounts.find(a => a.type === 'checking')
      if (checking) setAccountBalance(checking.id, parseInt(bankAmount) || 0)
    }
    if (step === 3) {
      if (!skipDebt && debtName && debtAmount) {
        addDebt({
          name: debtName,
          originalAmount: parseFloat(debtAmount),
          currentBalance: parseFloat(debtAmount),
          payments: []
        })
      }
      completeOnboarding()
      return
    }
    setStep(step + 1)
  }

  const slide = slides[step]
  const Icon = slide.icon

  return (
    <div className="min-h-dvh flex flex-col bg-bg-primary text-text-primary p-6">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-subtle mx-auto mb-8">
          <Icon size={32} className="text-accent" />
        </div>

        <h1 className="text-2xl font-bold text-center mb-2 text-text-primary">{slide.title}</h1>
        <p className="text-base text-text-secondary text-center mb-2">{slide.subtitle}</p>
        <p className="text-sm text-text-tertiary text-center mb-8">{slide.description}</p>

        {slide.isWallet && (
          <div className="mb-6">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-mono text-text-tertiary">₹</span>
              <input
                type="number"
                value={walletAmount}
                onChange={(e) => setWalletAmount(e.target.value)}
                placeholder="0"
                className="input-field text-center text-3xl font-mono font-semibold pl-8 pr-4 py-4"
                autoFocus
              />
            </div>
          </div>
        )}

        {slide.isAccounts && (
          <div className="mb-6">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-mono text-text-tertiary">₹</span>
              <input
                type="number"
                value={bankAmount}
                onChange={(e) => setBankAmount(e.target.value)}
                placeholder="0"
                className="input-field text-center text-3xl font-mono font-semibold pl-8 pr-4 py-4"
                autoFocus
              />
            </div>
          </div>
        )}

        {slide.isDebts && (
          <div className="space-y-3 mb-6">
            <Input
              placeholder="Debt name (e.g. Student Loan)"
              value={debtName}
              onChange={(e) => setDebtName(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Amount owed"
              value={debtAmount}
              onChange={(e) => setDebtAmount(e.target.value)}
              prefix="₹"
            />
            <button
              onClick={() => { setSkipDebt(true); completeOnboarding() }}
              className="w-full text-sm text-text-tertiary hover:text-accent transition-colors cursor-pointer py-2"
            >
              Skip, I have no debts
            </button>
          </div>
        )}

        {step === 0 && (
          <div className="text-center mb-8">
            <div className="text-5xl font-mono font-bold tracking-tight text-accent mb-2">
              Flux
            </div>
            <p className="text-xs text-text-tertiary">
              Your money, clearly.
            </p>
          </div>
        )}

        <div className="flex items-center justify-center gap-1.5 mb-6">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-6 bg-accent' : 'w-1.5 bg-border'
              }`}
            />
          ))}
        </div>

        <Button size="lg" className="w-full" onClick={handleNext}>
          {isLastStep ? 'Start using Flux' : 'Next'}
        </Button>
      </div>
    </div>
  )
}
