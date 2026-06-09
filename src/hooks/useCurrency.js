import { useMemo } from 'react'
import useUIStore from '../store/uiStore'

export const useCurrency = () => {
  const currency = useUIStore((s) => s.currency)

  const formatter = useMemo(() => {
    const configs = {
      INR: { locale: 'en-IN', symbol: '₹' },
      USD: { locale: 'en-US', symbol: '$' },
      EUR: { locale: 'de-DE', symbol: '€' },
      GBP: { locale: 'en-GB', symbol: '£' }
    }

    const config = configs[currency] || configs.INR

    return {
      format: (amount, options = {}) => {
        const { compact = false, decimals = 0 } = options
        const abs = Math.abs(amount)

        if (compact && abs >= 100000) {
          return `${config.symbol}${(abs / 100000).toFixed(1)}L`
        }

        return new Intl.NumberFormat(config.locale, {
          style: 'currency',
          currency,
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        }).format(amount)
      },
      symbol: config.symbol
    }
  }, [currency])

  return formatter
}
