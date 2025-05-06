import { CheckCircle } from "lucide-react"
import { ContainerAwareImage } from "./container-aware-image"

interface ProjectCardProps {
  project: {
    id: string
    title: string
    description: string
    imageUrl: string
    address: `0x${string}`
    verified?: boolean
    categories: string[]
    goal: number
    raised: number
  }
  className?: string
}

export function ProjectCard({ project, className = "" }: ProjectCardProps) {
  // Generate image candidates based on the original imageUrl
  const imageCandidates = [
    {
      width: 300,
      height: 225,
      src: project.imageUrl.replace(/\.(jpg|png|webp)/, "-300x225.$1")
    },
    {
      width: 600,
      height: 450,
      src: project.imageUrl.replace(/\.(jpg|png|webp)/, "-600x450.$1")
    },
    {
      width: 900,
      height: 675,
      src: project.imageUrl.replace(/\.(jpg|png|webp)/, "-900x675.$1")
    },
    // Fallback to original image
    {
      width: 1200,
      height: 900,
      src: project.imageUrl
    }
  ]

  // We might need progress later, keep the calculation for now
  // const progress = (project.raised / project.goal) * 100

  return (
    <div className={`project-card ${className}`}>
      <div className="project-card-image">
        <ContainerAwareImage
          candidates={imageCandidates}
          alt={project.title}
          observeContainer=".project-card-image"
          placeholderColor="#e0e0e0"
        />
        
        {project.verified && (
          <div className="project-card-badge-container">
            <span className="trusted-badge">
              <CheckCircle /> Trusted
            </span>
          </div>
        )}

        <div className="project-card-overlay">
          <h2 className="project-card-overlay-title line-clamp-2">{project.title}</h2>
          <p className="project-card-overlay-category">
            {project.categories.length > 0 ? project.categories[0] : 'Project'}
          </p>
        </div>
      </div>
    </div>
  )
} 