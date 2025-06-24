import Image from 'next/image'

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  xs: 'h-6',
  sm: 'h-8',
  md: 'h-12',
  lg: 'h-16',
  xl: 'h-24'
}

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/logo-1.jpg"
        alt="Francilia Films"
        width={200}
        height={80}
        className={`${sizeClasses[size]} w-auto object-contain`}
        priority
      />
    </div>
  )
}