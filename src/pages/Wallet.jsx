import Header from '../components/common/Header'
import WalletBalance from '../components/wallet/WalletBalance'

export default function Wallet({ onNavigate }) {
  return (
    <div className="pb-28">
      <Header onSettingsClick={() => onNavigate('settings')} />
      <div className="animate-fadeIn">
        <WalletBalance />
      </div>
    </div>
  )
}
