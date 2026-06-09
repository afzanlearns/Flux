import { Lightbulb, BarChart3, TrendingUp, RefreshCw } from 'lucide-react'
import Card from '../common/Card'
import useUIStore from '../../store/uiStore'

const insightIcons = {
  chart: BarChart3,
  trend: TrendingUp,
  refresh: RefreshCw
}

export default function PatternInsights({ patterns }) {
  const hideAmounts = useUIStore((s) => s.hideAmounts)

  if (!patterns) return null

  const insights = []

  if (patterns.peakDay && patterns.peakAmount > 0) {
    insights.push({
      icon: insightIcons.chart,
      color: 'text-accent',
      bg: 'icon-wrap-accent',
      text: `Most of your spending happens on ${patterns.peakDay}s`,
      detail: `Peak day spending was ${hideAmounts ? '—' : `₹${patterns.peakAmount.toLocaleString('en-IN')}`}`
    })
  }

  insights.push({
    icon: insightIcons.trend,
    color: 'text-warning',
    bg: 'icon-wrap-warning',
    text: `${patterns.weekendPercent}% of spending is on weekends (Fri-Sun)`,
    detail: `${patterns.weekdayPercent}% on weekdays`
  })

  insights.push({
    icon: insightIcons.refresh,
    color: 'text-accent',
    bg: 'icon-wrap-accent',
    text: `${patterns.predictablePercent}% predictable spending`,
    detail: `${patterns.discretionaryPercent}% discretionary`
  })

  if (insights.length === 0) return null

  return (
    <Card className="animate-fadeIn">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb size={16} className="text-warning" />
        <h3 className="text-sm font-medium text-text-secondary">Patterns</h3>
      </div>

      <div className="space-y-4">
        {insights.map((insight, i) => {
          const Icon = insight.icon
          return (
            <div key={i} className="flex items-start gap-3">
              <div className={`icon-wrap-sm ${insight.bg}`}>
                <Icon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary">{insight.text}</p>
                <p className="text-xs text-text-tertiary mt-0.5">{insight.detail}</p>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
