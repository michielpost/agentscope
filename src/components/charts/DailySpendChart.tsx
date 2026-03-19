'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { dailySpendData } from '@/lib/mock-data'

export function DailySpendChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={dailySpendData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis
          dataKey="day"
          tick={{ fill: '#6b7280', fontSize: 12 }}
          axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#6b7280', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => `$${v}`}
        />
        <Tooltip
          contentStyle={{
            background: '#12121c',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            color: '#fff',
          }}
          formatter={(value) => [`$${Number(value).toFixed(2)}`, undefined]}
        />
        <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12 }} />
        <Bar dataKey="uniswap" name="Uniswap" fill="#ec4899" radius={[3, 3, 0, 0]} />
        <Bar dataKey="bankr" name="Bankr" fill="#3b82f6" radius={[3, 3, 0, 0]} />
        <Bar dataKey="olas" name="Olas" fill="#6366f1" radius={[3, 3, 0, 0]} />
        <Bar dataKey="other" name="Other" fill="#374151" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
