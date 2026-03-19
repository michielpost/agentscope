import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string
  subtitle?: string
  icon: LucideIcon
  trend?: { value: string; up: boolean }
  color?: string
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'text-blue-400',
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="mt-1 text-2xl font-bold text-white">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
          {trend && (
            <p className={cn("mt-1 text-xs", trend.up ? "text-emerald-400" : "text-red-400")}>
              {trend.up ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        <div className={cn("rounded-lg bg-white/5 p-2", color)}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  )
}
