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
import { bankrUsage } from '@/lib/mock-data'

// Aggregate usage by date and model for the chart
const chartData = (() => {
  const byDate: Record<string, Record<string, number>> = {}
  for (const entry of bankrUsage) {
    if (!byDate[entry.date]) byDate[entry.date] = {}
    byDate[entry.date][entry.model] = (byDate[entry.date][entry.model] ?? 0) + entry.costUsd
  }
  return Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, models]) => ({
      date: date.slice(5), // "MM-DD"
      'gpt-4o': +(models['gpt-4o'] ?? 0).toFixed(3),
      'claude-3-5-sonnet': +(models['claude-3-5-sonnet'] ?? 0).toFixed(3),
      'gpt-4o-mini': +(models['gpt-4o-mini'] ?? 0).toFixed(3),
    }))
})()

export function BankrUsageChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis
          dataKey="date"
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
          formatter={(value) => [`$${Number(value).toFixed(3)}`, undefined]}
        />
        <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12 }} />
        <Bar dataKey="gpt-4o" name="GPT-4o" fill="#3b82f6" radius={[3, 3, 0, 0]} />
        <Bar dataKey="claude-3-5-sonnet" name="Claude 3.5 Sonnet" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
        <Bar dataKey="gpt-4o-mini" name="GPT-4o Mini" fill="#06b6d4" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
