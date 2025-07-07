import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export default function Logo({ size = 'md', className }: LogoProps) {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-6xl'
  }

  return (
    <div className={cn('font-bold tracking-tight', sizeClasses[size], className)}>
      <span style={{ color: '#a38725' }}>Francilia</span>
      <span className="text-white ml-2">Films</span>
    </div>
  )
}