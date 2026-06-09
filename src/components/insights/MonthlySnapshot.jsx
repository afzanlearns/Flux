import Card from '../common/Card'
import { getMonthLabel } from '../../utils/dateHelpers'
import { formatAmount } from '../../utils/currencyFormatter'

export default function MonthlySnapshot({ income, expenses, net, monthlySubTotal, annualSubTotal, comparison, date }) {
  return (
    <Card className="animate-fadeIn">
      <h3 className="text-sm font-medium text-text-secondary mb-4">
        {getMonthLabel(date)}
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-primary">Income</span>
          <div className="text-right">
            <span className="font-mono font-semibold text-success">{formatAmount(income)}</span>
            {comparison.incomeChange !== 0 && (
              <span className={`text-[10px] ml-2 font-medium ${comparison.incomeChange > 0 ? 'text-success' : 'text-danger'}`}>
                {comparison.incomeChange > 0 ? '+' : ''}{comparison.incomeChange}%
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-text-primary">Expenses</span>
          <div className="text-right">
            <span className="font-mono font-semibold text-warning">{formatAmount(expenses)}</span>
            {comparison.expenseChange !== 0 && (
              <span className={`text-[10px] ml-2 font-medium ${comparison.expenseChange > 0 ? 'text-danger' : 'text-success'}`}>
                {comparison.expenseChange > 0 ? '+' : ''}{comparison.expenseChange}%
              </span>
            )}
          </div>
        </div>

        <div className="pt-3 border-t border-border flex items-center justify-between">
          <span className="text-sm font-medium text-text-primary">Net</span>
          <span className={`font-mono font-semibold text-lg ${net >= 0 ? 'text-success' : 'text-danger'}`}>
            {net >= 0 ? '+' : ''}{formatAmount(net)}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border">
        <div className="text-xs text-text-tertiary mb-1 font-medium">Subscriptions</div>
        <div className="font-mono text-sm font-semibold text-text-primary">{monthlySubTotal}/mo</div>
        <div className="text-xs text-text-tertiary mt-0.5">{annualSubTotal}/year</div>
      </div>
    </Card>
  )
}
