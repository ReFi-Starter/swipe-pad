import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Info } from 'lucide-react'
import { ProjectImage } from '@/components/project-image'
import type { CardHeaderProps } from '@/components/types'

export function CardHeader({ project, onOpenNotes }: CardHeaderProps) {
  return (
    <div className="relative aspect-[4/3.2] w-full">
      <ProjectImage
        src={project.imageUrl}
        alt={project.title}
        projectId={project.id}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
      
      {/* Category Badge */}
      <Badge 
        variant="secondary" 
        className="absolute top-4 left-4 text-xs px-2 py-1 bg-black/40 backdrop-blur-sm"
      >
        {project.category}
      </Badge>
      
      {/* Trust Tag & Notes */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <Badge 
          variant={project.trustStatus === 'verified' ? 'default' : 'destructive'}
          className="px-2 py-1 text-xs backdrop-blur-sm"
        >
          {project.trustStatus === 'verified' ? '✅ Trusted' : '⚠️ Warning'}
        </Badge>
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
      
      {/* Title */}
      <h3 className="absolute bottom-4 left-4 right-4 text-xl font-semibold text-white line-clamp-2">
        {project.title}
      </h3>
    </div>
  )
} 