import { useMemo } from 'react'
import useTransactionStore from '../store/transactionStore'
import useAccountStore from '../store/accountStore'
import useSubscriptionStore from '../store/subscriptionStore'
import useDebtStore from '../store/debtStore'
import {
  calcTrueBalance,
  calcMonthlyIncome,
  calcMonthlyExpenses,
  calcNetMonthly,
  calcExpensesByCategory,
  calcMonthlySubTotal,
  calcSubscriptionAnnual,
  calcDebtTotal,
  calcDebtPaidTotal,
  calcSpendingPatterns,
  calcComparison
} from '../utils/calculations'

export const useDashboardData = () => {
  const transactions = useTransactionStore((s) => s.transactions)
  const accounts = useAccountStore((s) => s.accounts)
  const subscriptions = useSubscriptionStore((s) => s.subscriptions)
  const debts = useDebtStore((s) => s.debts)
  const milestones = useDebtStore((s) => s.milestones)

  return useMemo(() => {
    const balance = calcTrueBalance(accounts, debts)
    const income = calcMonthlyIncome(transactions)
    const expenses = calcMonthlyExpenses(transactions)
    const net = income - expenses
    const monthlySubTotal = calcMonthlySubTotal(subscriptions)
    const comparison = calcComparison(transactions)
    const activeDebts = debts.filter(d => d.status === 'active')
    const totalDebt = activeDebts.reduce((s, d) => s + d.currentBalance, 0)
    const totalPaid = calcDebtPaidTotal(debts)

    return {
      balance,
      income,
      expenses,
      net,
      monthlySubTotal,
      incomeChange: comparison.incomeChange,
      expenseChange: comparison.expenseChange,
      totalDebt,
      totalPaid,
      activeDebts,
      milestones
    }
  }, [transactions, accounts, subscriptions, debts, milestones])
}

export const useInsightsData = (date = new Date()) => {
  const transactions = useTransactionStore((s) => s.transactions)
  const subscriptions = useSubscriptionStore((s) => s.subscriptions)

  return useMemo(() => {
    const income = calcMonthlyIncome(transactions, date)
    const expenses = calcMonthlyExpenses(transactions, date)
    const net = income - expenses
    const categories = calcExpensesByCategory(transactions, date)
    const patterns = calcSpendingPatterns(transactions, date)
    const comparison = calcComparison(transactions, date)
    const monthlySubTotal = calcMonthlySubTotal(subscriptions)
    const annualSubTotal = calcSubscriptionAnnual(subscriptions)

    return {
      income,
      expenses,
      net,
      categories,
      patterns,
      comparison,
      monthlySubTotal,
      annualSubTotal
    }
  }, [transactions, subscriptions, date])
}

export const useSubscriptionData = () => {
  const subscriptions = useSubscriptionStore((s) => s.subscriptions)
  const getActive = useSubscriptionStore((s) => s.getActive)
  const getCancelled = useSubscriptionStore((s) => s.getCancelled)

  return useMemo(() => {
    const active = getActive()
    const cancelled = getCancelled()
    const monthlyTotal = calcMonthlySubTotal(active)

    const cancelledSavings = cancelled.reduce((s, sub) => {
      return s + (sub.frequency === 'yearly' ? sub.cost : sub.cost * 12)
    }, 0)

    return { active, cancelled, monthlyTotal, cancelledSavings }
  }, [subscriptions, getActive, getCancelled])
}

export const useDebtData = () => {
  const debts = useDebtStore((s) => s.debts)
  const milestones = useDebtStore((s) => s.milestones)
  const getActive = useDebtStore((s) => s.getActive)
  const getPaid = useDebtStore((s) => s.getPaid)

  return useMemo(() => {
    const active = getActive()
    const paid = getPaid()
    const totalDebt = calcDebtTotal(debts)
    const totalPaid = calcDebtPaidTotal(debts)
    const recentMilestones = milestones.filter((m) => !m.celebrated).slice(0, 5)

    return { active, paid, totalDebt, totalPaid, milestones: recentMilestones }
  }, [debts, milestones, getActive, getPaid])
}
