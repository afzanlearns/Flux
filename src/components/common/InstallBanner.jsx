import { useState } from 'react'
import { X, Download } from 'lucide-react'
import { useInstallPrompt } from '../../hooks/useInstallPrompt'
import useUIStore from '../../store/uiStore'

export default function InstallBanner() {
  const { prompt, installApp, isInstalled } = useInstallPrompt()
  const dismissAllCards = useUIStore((s) => s.dismissAllCards)
  const [dismissed, setDismissed] = useState(false)

  if (!prompt || isInstalled || dismissed || dismissAllCards) return null

  return (
    <div className="install-banner">
      <div className="install-banner-content">
        <div className="flex-shrink-0 opacity-90" style={{ display: 'flex', alignItems: 'center' }}>
          <Download size={20} />
        </div>

        <div className="install-banner-text">
          <h4>Install Flux on your device</h4>
          <p>Access your finances offline, anytime.</p>
        </div>

        <div className="install-banner-actions">
          <button className="btn-install" onClick={installApp}>
            Install
          </button>
          <button
            className="btn-dismiss"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
