import { Film } from 'lucide-react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export default function Logo({ size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  }

  const iconSizes = {
    sm: 24,
    md: 28,
    lg: 32,
    xl: 40
  }

  return (
    <div className="flex items-center gap-3">
      <div 
        className="rounded-full p-2 flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #a38725, #d4af37)' }}
      >
        <Film size={iconSizes[size]} className="text-white" />
      </div>
      <div className={`font-bold ${sizeClasses[size]} tracking-wide`}>
        <span 
          style={{ 
            background: 'linear-gradient(135deg, #a38725, #d4af37)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          FRANCILIA
        </span>
        <span className="text-white ml-2">FILMS</span>
      </div>
    </div>
  )
}