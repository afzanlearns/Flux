import { getMonthDateRange, getMonthKey, isCurrentMonth } from './dateHelpers'

export const calcTrueBalance = (accounts, debts) => {
  const cash = accounts.filter(a => a.type === 'wallet').reduce((sum, a) => sum + a.balance, 0)
  const online = accounts.filter(a => a.type !== 'wallet').reduce((sum, a) => sum + a.balance, 0)
  const owed = debts.filter(d => d.status === 'active').reduce((sum, d) => sum + d.currentBalance, 0)
  return { cash, online, owed, net: cash + online - owed }
}

export const calcMonthlyIncome = (transactions, date = new Date()) => {
  const { start, end } = getMonthDateRange(date)
  return transactions
    .filter(t => t.type === 'income' && t.date >= start && t.date <= end)
    .reduce((sum, t) => sum + t.amount, 0)
}

export const calcMonthlyExpenses = (transactions, date = new Date()) => {
  const { start, end } = getMonthDateRange(date)
  return transactions
    .filter(t => t.type === 'expense' && t.date >= start && t.date <= end)
    .reduce((sum, t) => sum + t.amount, 0)
}

export const calcNetMonthly = (transactions, date = new Date()) => {
  return calcMonthlyIncome(transactions, date) - calcMonthlyExpenses(transactions, date)
}

export const calcExpensesByCategory = (transactions, date = new Date()) => {
  const { start, end } = getMonthDateRange(date)
  const expenses = transactions.filter(t => t.type === 'expense' && t.date >= start && t.date <= end)
  const total = expenses.reduce((sum, t) => sum + t.amount, 0)
  const byCategory = {}

  expenses.forEach(t => {
    byCategory[t.category] = (byCategory[t.category] || 0) + t.amount
  })

  return Object.entries(byCategory).map(([category, amount]) => ({
    category,
    amount,
    percentage: total > 0 ? Math.round((amount / total) * 100) : 0
  })).sort((a, b) => b.amount - a.amount)
}

export const calcMonthlySubTotal = (subscriptions) => {
  return subscriptions
    .filter(s => s.status === 'active')
    .reduce((sum, s) => {
      return sum + (s.frequency === 'yearly' ? s.cost / 12 : s.cost)
    }, 0)
}

export const calcSubscriptionAnnual = (subscriptions) => {
  return subscriptions
    .filter(s => s.status === 'active')
    .reduce((sum, s) => {
      return sum + (s.frequency === 'yearly' ? s.cost : s.cost * 12)
    }, 0)
}

export const calcDebtTotal = (debts) => {
  return debts.filter(d => d.status === 'active').reduce((sum, d) => sum + d.currentBalance, 0)
}

export const calcDebtPaidTotal = (debts) => {
  return debts.reduce((sum, d) => {
    const payments = d.payments?.reduce((ps, p) => ps + p.amount, 0) || 0
    return sum + payments
  }, 0)
}

export const calcDebtProgress = (debt) => {
  const paid = debt.originalAmount - debt.currentBalance
  const percent = debt.originalAmount > 0 ? Math.round((paid / debt.originalAmount) * 100) : 0
  return { paid, percent, remaining: debt.currentBalance }
}

export const calcPayoffMonths = (debt) => {
  if (!debt.minimumPayment || debt.minimumPayment <= 0) return null
  const monthlyPayment = debt.minimumPayment
  const monthlyInterest = debt.interestRate ? (debt.currentBalance * (debt.interestRate / 100 / 12)) : 0
  const effectivePayment = monthlyPayment - monthlyInterest
  if (effectivePayment <= 0) return null
  return Math.ceil(debt.currentBalance / effectivePayment)
}

export const calcSpendingPatterns = (transactions, date = new Date()) => {
  const { start, end } = getMonthDateRange(date)
  const expenses = transactions.filter(t => t.type === 'expense' && t.date >= start && t.date <= end)

  if (expenses.length === 0) return null

  const dayCounts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
  const dayAmounts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }

  expenses.forEach(t => {
    const day = new Date(t.date).getDay()
    dayCounts[day]++
    dayAmounts[day] += t.amount
  })

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  let maxDay = 0
  let maxAmount = 0

  Object.entries(dayAmounts).forEach(([day, amount]) => {
    if (amount > maxAmount) {
      maxAmount = amount
      maxDay = parseInt(day)
    }
  })

  const weekdayTotal = [1, 2, 3, 4].reduce((s, d) => s + (dayAmounts[d] || 0), 0)
  const weekendTotal = [0, 5, 6].reduce((s, d) => s + (dayAmounts[d] || 0), 0)
  const total = weekdayTotal + weekendTotal

  const subscriptionAmount = expenses.filter(t => t.category === 'Subscriptions').reduce((s, t) => s + t.amount, 0)
  const foodAmount = expenses.filter(t => t.category === 'Food').reduce((s, t) => s + t.amount, 0)
  const predictable = subscriptionAmount + foodAmount
  const discretionary = total - predictable

  return {
    peakDay: dayNames[maxDay],
    peakAmount: maxAmount,
    weekendPercent: total > 0 ? Math.round((weekendTotal / total) * 100) : 0,
    weekdayPercent: total > 0 ? Math.round((weekdayTotal / total) * 100) : 0,
    predictablePercent: total > 0 ? Math.round((predictable / total) * 100) : 0,
    discretionaryPercent: total > 0 ? Math.round((discretionary / total) * 100) : 0
  }
}

export const calcComparison = (transactions, date = new Date()) => {
  const { start: thisStart, end: thisEnd } = getMonthDateRange(date)
  const prevMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1)
  const { start: prevStart, end: prevEnd } = getMonthDateRange(prevMonth)

  const thisIncome = transactions.filter(t => t.type === 'income' && t.date >= thisStart && t.date <= thisEnd).reduce((s, t) => s + t.amount, 0)
  const thisExpenses = transactions.filter(t => t.type === 'expense' && t.date >= thisStart && t.date <= thisEnd).reduce((s, t) => s + t.amount, 0)
  const prevIncome = transactions.filter(t => t.type === 'income' && t.date >= prevStart && t.date <= prevEnd).reduce((s, t) => s + t.amount, 0)
  const prevExpenses = transactions.filter(t => t.type === 'expense' && t.date >= prevStart && t.date <= prevEnd).reduce((s, t) => s + t.amount, 0)

  return {
    incomeChange: prevIncome > 0 ? Math.round(((thisIncome - prevIncome) / prevIncome) * 100) : 0,
    expenseChange: prevExpenses > 0 ? Math.round(((thisExpenses - prevExpenses) / prevExpenses) * 100) : 0
  }
}
