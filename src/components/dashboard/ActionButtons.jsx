import { Plus, Minus } from 'lucide-react'
import Button from '../common/Button'

export default function ActionButtons({ onIncome, onExpense }) {
  return (
    <div className="flex gap-3">
      <Button
        variant="primary"
        size="lg"
        icon={Plus}
        className="flex-1"
        onClick={onIncome}
      >
        Income
      </Button>
      <Button
        variant="secondary"
        size="lg"
        icon={Minus}
        className="flex-1"
        onClick={onExpense}
      >
        Expense
      </Button>
    </div>
  )
}
