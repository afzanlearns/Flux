import { Settings, Wallet } from 'lucide-react'

const Header = ({ onSettingsClick }) => {
  return (
    <header className="flex items-center justify-between py-4 px-1">
      <div className="flex items-center gap-2.5">
        <div className="icon-wrap icon-wrap-accent" style={{ width: 32, height: 32, borderRadius: 8 }}>
          <Wallet size={16} strokeWidth={1.5} />
        </div>
        <div>
          <span className="text-base font-semibold tracking-tight text-text-primary">Flux</span>
          <span className="text-[10px] text-text-tertiary block leading-none mt-0.5 font-medium tracking-wider uppercase">Your money, clearly</span>
        </div>
      </div>
      <button
        onClick={onSettingsClick}
        className="btn-icon"
        aria-label="Settings"
      >
        <Settings size={18} />
      </button>
    </header>
  )
}

export default Header
