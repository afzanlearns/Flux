import { useState, useRef, useEffect } from 'react'
import { Eye, EyeOff, Wallet } from 'lucide-react'

export default function TrueBalance({ balance }) {
  const [hidden, setHidden] = useState(false)
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

  const mask = (num) => hidden ? '—' : num

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
          onClick={() => setHidden(!hidden)}
          className="btn-icon"
        >
          {hidden ? <EyeOff size={16} /> : <Eye size={16} />}
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
          <div className={`number-hero-breakdown-value ${hidden ? 'text-text-tertiary' : ''}`}>
            {mask(balance.cashFormatted)}
          </div>
          <div className="number-hero-breakdown-label">Cash</div>
        </div>
        <div className="number-hero-breakdown-item">
          <div className={`number-hero-breakdown-value ${hidden ? 'text-text-tertiary' : ''}`}>
            {mask(balance.onlineFormatted)}
          </div>
          <div className="number-hero-breakdown-label">Online</div>
        </div>
        <div className="number-hero-breakdown-item">
          <div className={`number-hero-breakdown-value ${hidden ? 'text-text-tertiary' : 'text-danger'}`}>
            {mask(balance.owedFormatted)}
          </div>
          <div className="number-hero-breakdown-label">Owed</div>
        </div>
      </div>
    </div>
  )
}
