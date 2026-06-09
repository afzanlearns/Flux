import { useState } from 'react'
import { Sparkles, X } from 'lucide-react'
import Card from '../common/Card'

export default function MilestoneCelebration({ milestones, onCelebrate }) {
  const [dismissed, setDismissed] = useState(new Set())

  const active = milestones.filter(m => !m.celebrated && !dismissed.has(m.id))

  if (active.length === 0) return null

  return (
    <>
      {active.slice(0, 2).map((milestone) => (
        <Card key={milestone.id} className="border-success/30 bg-success-subtle animate-slideUp">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
              <Sparkles size={20} className="text-success" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-semibold text-success">Milestone reached!</h4>
                  <p className="text-sm mt-0.5 text-text-primary">
                    {milestone.type === 'debt_paid'
                      ? `You paid off ₹${milestone.amount?.toLocaleString('en-IN') || 'a debt'}!`
                      : 'Great progress!'}
                  </p>
                  {milestone.note && (
                    <p className="text-xs text-text-tertiary mt-1 italic">
                      "{milestone.note}"
                    </p>
                  )}
                </div>
                <button
                  onClick={() => { onCelebrate(milestone.id); setDismissed(prev => new Set([...prev, milestone.id])) }}
                  className="p-1 rounded hover:bg-success/10 transition-colors cursor-pointer"
                >
                  <X size={14} className="text-success" />
                </button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </>
  )
}
