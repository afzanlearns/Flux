import { useState, useMemo } from 'react'
import Header from '../components/common/Header'
import TrueBalance from '../components/dashboard/TrueBalance'
import QuickStats from '../components/dashboard/QuickStats'
import ActionButtons from '../components/dashboard/ActionButtons'
import SubscriptionAudit from '../components/subscriptions/SubscriptionAudit'
import MilestoneCelebration from '../components/debts/MilestoneCelebration'
import Modal from '../components/common/Modal'
import TransactionForm from '../components/transactions/TransactionForm'
import useUIStore from '../store/uiStore'
import useTransactionStore from '../store/transactionStore'
import useSubscriptionStore from '../store/subscriptionStore'
import useDebtStore from '../store/debtStore'
import { useDashboardData } from '../hooks/useCalculations'
import { getMonthKey } from '../utils/dateHelpers'
import { formatAmount } from '../utils/currencyFormatter'

export default function Dashboard({ onNavigate }) {
  const [showIncomeModal, setShowIncomeModal] = useState(false)
  const [showExpenseModal, setShowExpenseModal] = useState(false)
  const addTransaction = useTransactionStore((s) => s.addTransaction)
  const subscriptions = useSubscriptionStore((s) => s.subscriptions)
  const cancelSubscription = useSubscriptionStore((s) => s.cancelSubscription)
  const celebrateMilestone = useDebtStore((s) => s.celebrateMilestone)
  const milestones = useDebtStore((s) => s.milestones)
  const lastAuditMonth = useUIStore((s) => s.lastAuditMonth)
  const setLastAuditMonth = useUIStore((s) => s.setLastAuditMonth)

  const data = useDashboardData()

  const balanceFormatted = {
    netFormatted: formatAmount(data.balance.net),
    cashFormatted: formatAmount(data.balance.cash),
    onlineFormatted: formatAmount(data.balance.online),
    owedFormatted: formatAmount(data.balance.owed)
  }

  const incomeFormatted = formatAmount(data.income)
  const expensesFormatted = formatAmount(data.expenses)
  const debtFormatted = formatAmount(data.totalDebt)

  const showAudit = useMemo(() => {
    const currentKey = getMonthKey()
    if (lastAuditMonth === currentKey) return false
    const activeSubs = subscriptions.filter(s => s.status === 'active')
    return activeSubs.length > 0
  }, [subscriptions, lastAuditMonth])

  const handleDismissAudit = () => {
    setLastAuditMonth(getMonthKey())
  }

  return (
    <div className="pb-28">
      <Header onSettingsClick={() => onNavigate('settings')} />

      <div className="space-y-5 animate-fadeIn">
        <TrueBalance balance={balanceFormatted} />

        <QuickStats
          income={incomeFormatted}
          expenses={expensesFormatted}
          incomeChange={data.incomeChange}
          expenseChange={data.expenseChange}
          totalDebt={debtFormatted}
        />

        <MilestoneCelebration
          milestones={milestones}
          onCelebrate={celebrateMilestone}
        />

        {showAudit && (
          <SubscriptionAudit
            subscriptions={subscriptions.filter(s => s.status === 'active')}
            totalMonthly={data.monthlySubTotal}
            onCancel={cancelSubscription}
            onDismiss={handleDismissAudit}
          />
        )}

        <ActionButtons
          onIncome={() => setShowIncomeModal(true)}
          onExpense={() => setShowExpenseModal(true)}
        />
      </div>

      <Modal isOpen={showIncomeModal} onClose={() => setShowIncomeModal(false)} title="Log Income">
        <TransactionForm
          type="income"
          onSubmit={(t) => { addTransaction(t); setShowIncomeModal(false) }}
          onClose={() => setShowIncomeModal(false)}
        />
      </Modal>

      <Modal isOpen={showExpenseModal} onClose={() => setShowExpenseModal(false)} title="Log Expense">
        <TransactionForm
          type="expense"
          onSubmit={(t) => { addTransaction(t); setShowExpenseModal(false) }}
          onClose={() => setShowExpenseModal(false)}
        />
      </Modal>
    </div>
  )
}
