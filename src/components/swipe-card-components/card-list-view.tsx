import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Info } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { CardHeader } from './card-header'
import type { Project } from '@/components/types'

interface CardListViewProps {
  project: Project
  onShowDetails?: () => void
  onOpenNotes: () => void
  className?: string
}

export function CardListView({
  project,
  onShowDetails,
  onOpenNotes,
  className = ""
}: CardListViewProps) {
  return (
    <Card 
      className={`w-full overflow-hidden shadow-sm border ${className}`}
      onClick={onShowDetails}
    >
      <div className="relative aspect-[4/3.2] w-full">
        <CardHeader 
          project={project}
          onOpenNotes={onOpenNotes}
        />
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-semibold line-clamp-1">{project.title}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>by {project.creator.name}</span>
            </div>
          </div>
          <Badge variant="outline" className="ml-2 shrink-0">
            {formatCurrency(project.donationAmount)}
          </Badge>
        </div>
        
        <p className="text-sm mb-3 text-muted-foreground line-clamp-2">
          {project.description}
        </p>
        
        <Button size="sm" variant="default" className="w-full h-8">
          <Info className="h-4 w-4 mr-1" />
          <span className="text-xs">View Details</span>
        </Button>
      </div>
    </Card>
  )
} 