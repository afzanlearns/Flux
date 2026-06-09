import { useRef, useEffect, useState } from 'react'
import { Eye, EyeOff, Wallet } from 'lucide-react'
import useUIStore from '../../store/uiStore'

export default function TrueBalance({ balance }) {
  const hideAmounts = useUIStore((s) => s.hideAmounts)
  const toggleHideAmounts = useUIStore((s) => s.toggleHideAmounts)
  const [animate, setAnimate] = useState(false)
  const prevNet = useRef(balance.net)

  useEffect(() => {
    if (prevNet.current !== balance.net) {
      setAnimate(true)
      const timer = setTimeout(() => setAnimate(false), 300)
      prevNet.current = balance.net
      return () => clearTimeout(timer)
    }
  }, [balance.net])

  const mask = (num) => hideAmounts ? '—' : num

  return (
    <div className="number-hero animate-fadeIn">
      <div className="flex items-center justify-between mb-4 relative">
        <div className="flex items-center gap-2">
          <Wallet size={18} className="text-accent" strokeWidth={1.5} />
          <span className="text-sm font-medium text-text-secondary">
            True Balance
          </span>
        </div>
        <button
          onClick={toggleHideAmounts}
          className="btn-icon"
        >
          {hideAmounts ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      <div className={`number-hero-value ${animate ? 'animate-numberUpdate' : ''}`}>
        {mask(balance.netFormatted)}
      </div>

      <p className="number-hero-label">
        Your money, right now
      </p>

      <div className="number-hero-breakdown">
        <div className="number-hero-breakdown-item">
          <div className={`number-hero-breakdown-value ${hideAmounts ? 'text-text-tertiary' : ''}`}>
            {mask(balance.cashFormatted)}
          </div>
          <div className="number-hero-breakdown-label">Cash</div>
        </div>
        <div className="number-hero-breakdown-item">
          <div className={`number-hero-breakdown-value ${hideAmounts ? 'text-text-tertiary' : ''}`}>
            {mask(balance.onlineFormatted)}
          </div>
          <div className="number-hero-breakdown-label">Online</div>
        </div>
        <div className="number-hero-breakdown-item">
          <div className={`number-hero-breakdown-value ${hideAmounts ? 'text-text-tertiary' : 'text-danger'}`}>
            {mask(balance.owedFormatted)}
          </div>
          <div className="number-hero-breakdown-label">Owed</div>
        </div>
      </div>
    </div>
  )
}
