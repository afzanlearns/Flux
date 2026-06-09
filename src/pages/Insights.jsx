import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Header from '../components/common/Header'
import MonthlySnapshot from '../components/insights/MonthlySnapshot'
import SpendingChart from '../components/insights/SpendingChart'
import PatternInsights from '../components/insights/PatternInsights'
import { useInsightsData } from '../hooks/useCalculations'
import { formatMonthYear } from '../utils/dateHelpers'

export default function Insights({ onNavigate }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const data = useInsightsData(currentDate)

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    const next = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    if (next <= new Date()) setCurrentDate(next)
  }

  const isCurrent = currentDate.getMonth() === new Date().getMonth() &&
    currentDate.getFullYear() === new Date().getFullYear()

  return (
    <div className="pb-28">
      <Header onSettingsClick={() => onNavigate('settings')} />

      <div className="animate-fadeIn space-y-5">
        <div className="flex items-center justify-center gap-4">
          <button onClick={prevMonth} className="btn-icon">
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-medium min-w-[140px] text-center text-text-primary">
            {formatMonthYear(currentDate)}
          </span>
          <button
            onClick={nextMonth}
            disabled={isCurrent}
            className="btn-icon disabled:opacity-30"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <MonthlySnapshot
          income={data.income}
          expenses={data.expenses}
          net={data.net}
          monthlySubTotal={data.monthlySubTotal}
          annualSubTotal={data.annualSubTotal}
          comparison={data.comparison}
          date={currentDate}
        />

        <SpendingChart categories={data.categories} />

        <PatternInsights patterns={data.patterns} />
      </div>
    </div>
  )
}
