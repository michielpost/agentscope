'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  ArrowLeftRight,
  Globe,
  Shield,
  Brain,
  Palette,
  Heart,
  Cpu,
  Bot,
  Fingerprint,
  Activity,
} from 'lucide-react'

const navItems = [
  {
    href: '/agent-identity',
    label: 'Agent Identity',
    icon: Fingerprint,
    color: 'text-amber-400',
    activeColor: 'text-amber-300',
    borderColor: 'border-amber-500',
  },
  {
    href: '/activity',
    label: 'Activity',
    icon: Activity,
    color: 'text-gray-300',
    activeColor: 'text-white',
    borderColor: 'border-white',
  },
  {
    href: '/overview',
    label: 'Overview',
    icon: LayoutDashboard,
    color: 'text-gray-400',
    activeColor: 'text-white',
    borderColor: 'border-white',
  },
  {
    href: '/uniswap',
    label: 'Uniswap',
    icon: ArrowLeftRight,
    color: 'text-pink-400',
    activeColor: 'text-pink-300',
    borderColor: 'border-pink-500',
  },
  {
    href: '/celo',
    label: 'Celo',
    icon: Globe,
    color: 'text-green-400',
    activeColor: 'text-green-300',
    borderColor: 'border-green-500',
  },
  {
    href: '/metamask',
    label: 'MetaMask',
    icon: Shield,
    color: 'text-orange-400',
    activeColor: 'text-orange-300',
    borderColor: 'border-orange-500',
  },
  {
    href: '/bankr',
    label: 'Bankr',
    icon: Brain,
    color: 'text-blue-400',
    activeColor: 'text-blue-300',
    borderColor: 'border-blue-500',
  },
  {
    href: '/superrare',
    label: 'SuperRare',
    icon: Palette,
    color: 'text-violet-400',
    activeColor: 'text-violet-300',
    borderColor: 'border-violet-500',
  },
  {
    href: '/octant',
    label: 'Octant',
    icon: Heart,
    color: 'text-teal-400',
    activeColor: 'text-teal-300',
    borderColor: 'border-teal-500',
  },
  {
    href: '/olas',
    label: 'Olas',
    icon: Cpu,
    color: 'text-indigo-400',
    activeColor: 'text-indigo-300',
    borderColor: 'border-indigo-500',
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-white/10 bg-[#08080e]">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
          <Bot size={18} />
        </div>
        <span className="text-lg font-bold text-white">AgentScope</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                'border-l-2',
                isActive
                  ? cn(
                      'bg-white/8 border-current',
                      item.activeColor
                    )
                  : cn(
                      'border-transparent text-gray-400 hover:bg-white/5 hover:text-gray-200',
                      'hover:' + item.color
                    )
              )}
            >
              <Icon
                size={18}
                className={isActive ? item.activeColor : item.color}
              />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/10">
        <p className="text-xs text-gray-600">Powered by GitHub Copilot</p>
      </div>
    </aside>
  )
}
