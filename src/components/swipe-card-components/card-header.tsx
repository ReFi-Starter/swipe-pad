import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Info, BadgeCheck } from 'lucide-react'
import { ProjectImage } from '@/components/project-image'
import type { CardHeaderProps } from '@/components/types'

export function CardHeader({ project, onOpenNotes }: CardHeaderProps) {
  return (
    <div className="relative aspect-[4/3] w-full">
      <ProjectImage
        src={project.imageUrl}
        alt={project.title}
        projectId={project.id}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
      
      {/* Category Badge */}
      <Badge 
        variant="secondary" 
        className="absolute top-4 left-4 text-xs px-2 py-1 bg-black/40 backdrop-blur-sm"
      >
        {project.category}
      </Badge>
      
      {/* Notes Button */}
      <div className="absolute top-4 right-4">
        {project.notesCount && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 bg-black/40 backdrop-blur-sm text-white hover:bg-black/60"
            onClick={(e) => {
              e.stopPropagation()
              onOpenNotes()
            }}
          >
            <Info className="h-4 w-4" />
            <span className="ml-1 text-xs">{project.notesCount}</span>
          </Button>
        )}
      </div>
      
      {/* Title with Verification Badge */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex items-center gap-1.5">
          <h3 className="text-xl font-semibold text-white line-clamp-2">
            {project.title}
          </h3>
          {project.trustStatus === 'verified' && (
            <BadgeCheck 
              className="shrink-0 w-5 h-5 text-white fill-[#1d9bf0] drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)]" 
              strokeWidth={2.5}
            />
          )}
        </div>
      </div>
    </div>
  )
} 