interface AnalyticsCardProps {
  title: string
  value: number | string
  icon: string
  description?: string
  trend?: 'up' | 'down' | 'neutral'
}

export function AnalyticsCard({ title, value, icon, description, trend }: AnalyticsCardProps) {
  const trendColors = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-500',
    neutral: 'text-stone-400',
  }

  return (
    <div className="rounded-xl border border-stone-100 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        {trend && (
          <span className={`text-xs font-medium ${trendColors[trend]}`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '—'}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-stone-900 dark:text-stone-100 font-bengali">
        {typeof value === 'number' ? value.toLocaleString('bn-BD') : value}
      </div>
      <div className="mt-1 text-sm font-medium text-stone-600 dark:text-stone-400 font-bengali">
        {title}
      </div>
      {description && (
        <div className="mt-1 text-xs text-stone-400 font-bengali">{description}</div>
      )}
    </div>
  )
}
