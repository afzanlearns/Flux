import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import Card from '../common/Card'
import { formatAmount } from '../../utils/currencyFormatter'

const COLORS = ['#BE185D', '#DB2777', '#10B981', '#F59E0B', '#EF4444', '#831843']

export default function SpendingChart({ categories }) {
  if (!categories || categories.length === 0) {
    return (
      <Card>
        <div className="text-center py-6 text-sm text-text-tertiary">
          No expense data this month
        </div>
      </Card>
    )
  }

  const data = categories.map(c => ({
    name: c.category,
    value: c.amount,
    percentage: c.percentage,
    formatted: formatAmount(c.amount)
  }))

  return (
    <Card>
      <h3 className="text-sm font-medium text-text-secondary mb-4">
        Where your money went
      </h3>

      <div className="flex items-center gap-4">
        <div className="w-32 h-32 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={28}
                outerRadius={48}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [data.find(d => d.name === name)?.formatted || `₹${value.toLocaleString('en-IN')}`, name]}
                contentStyle={{
                  background: 'var(--color-surface, #1E293B)',
                  border: '1px solid var(--color-border, #334155)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: 'var(--color-text-primary, #F1F5F9)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-1.5">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full ring-1 ring-black/5"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-text-primary">{item.name}</span>
              </div>
              <div className="text-right">
                <div className="font-medium text-text-primary">{item.percentage}%</div>
                <div className="text-text-tertiary">{item.formatted}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
