const currencyConfig = {
  INR: { symbol: '₹', locale: 'en-IN' },
  USD: { symbol: '$', locale: 'en-US' },
  EUR: { symbol: '€', locale: 'de-DE' },
  GBP: { symbol: '£', locale: 'en-GB' }
}

export const formatCurrency = (amount, currency = 'INR') => {
  const config = currencyConfig[currency] || currencyConfig.INR
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export const formatCurrencyShort = (amount, currency = 'INR') => {
  const config = currencyConfig[currency] || currencyConfig.INR
  const abs = Math.abs(amount)

  if (abs >= 10000000) {
    return `${config.symbol}${(abs / 10000000).toFixed(1)}Cr`
  }
  if (abs >= 100000) {
    return `${config.symbol}${(abs / 100000).toFixed(1)}L`
  }
  if (abs >= 1000) {
    return `${config.symbol}${(abs / 1000).toFixed(1)}k`
  }

  return formatCurrency(amount, currency)
}

export const formatAmount = (amount) => {
  const isNegative = amount < 0
  const abs = Math.abs(amount)
  const formatted = abs.toLocaleString('en-IN')
  return isNegative ? `-₹${formatted}` : `₹${formatted}`
}

export const formatAmountFull = (amount) => {
  const isNegative = amount < 0
  const abs = Math.abs(amount)
  const formatted = abs.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return isNegative ? `-₹${formatted}` : `₹${formatted}`
}
