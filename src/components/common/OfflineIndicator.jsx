import { useOfflineStatus } from '../../hooks/useOfflineStatus'
import { WifiOff } from 'lucide-react'

export default function OfflineIndicator() {
  const isOffline = useOfflineStatus()

  if (!isOffline) return null

  return (
    <div className="z-50 flex items-center justify-center gap-2 bg-warning-subtle text-warning px-4 py-2 text-xs font-medium border-b border-warning/20">
      <WifiOff size={14} />
      You're offline. Changes will sync when connected.
    </div>
  )
}
