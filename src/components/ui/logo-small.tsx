import { cn } from '@/lib/utils'

interface LogoSmallProps {
  className?: string
}

export function LogoSmall({ className }: LogoSmallProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z"
          fill="#22CC88"
        />
        <path
          d="M15 8H9C8.45 8 8 8.45 8 9V15C8 15.55 8.45 16 9 16H15C15.55 16 16 15.55 16 15V9C16 8.45 15.55 8 15 8ZM14 14H10V10H14V14Z"
          fill="#22CC88"
        />
      </svg>
      <span className="text-[#22CC88] text-lg font-medium lowercase">swipepad</span>
    </div>
  )
} 