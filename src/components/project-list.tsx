"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { useDonationPool } from "@/hooks/useDonationPool";
import { useWallet } from "@/hooks/useWallet";
import Image from "next/image";
// Type for formatted projects for UI
interface ProjectUI {
  id: string;
  title: string;
  description: string;
  raised: string;
  goal: string;
  imageUrl: string;
  progress: number;
}

interface ProjectListProps {
  limit?: number;
}

export function ProjectList({ limit }: ProjectListProps) {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<ProjectUI[]>([]);
  const [mounted, setMounted] = useState(false);
  
  const { address } = useWallet();
  const { useProjectsCreatedBy, mounted: hookMounted } = useDonationPool();
  
  // Ensure the component is mounted (client)
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Get the IDs of the created projects
  const { 
    data: projectIds, 
    isLoading: isLoadingProjects,
    isError: isErrorProjects
  } = useProjectsCreatedBy(address);
  
  // Load details of the projects
  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!mounted || !hookMounted) return;
      
      if (!projectIds || projectIds.length === 0) {
        // If there are no projects or we are loading, use example data
        const mockProjects = [
          { id: "1", title: "Example Project 1", description: "This is a placeholder for a donation project.", raised: "0.5", goal: "5", imageUrl: "", progress: 10 },
          { id: "2", title: "Example Project 2", description: "This is a placeholder for a donation project.", raised: "1.2", goal: "3", imageUrl: "", progress: 40 },
          { id: "3", title: "Example Project 3", description: "This is a placeholder for a donation project.", raised: "4.8", goal: "5", imageUrl: "", progress: 96 },
        ];
        setProjects(mockProjects);
        setLoading(false);
        return;
      }
      
      // TODO: Implement the real loading of the projects when we have blockchain connection
      // This function would be where we would load the details of each project
      // using the useProjectDetails hook for each ID
      
      setLoading(false);
    };
    
    if (!isLoadingProjects && mounted && hookMounted) {
      fetchProjectDetails();
    }
  }, [projectIds, isLoadingProjects, mounted, hookMounted]);
  
  // Render a loading state or placeholder during SSR
  if (!mounted || !hookMounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((id) => (
          <div 
            key={id}
            className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
          >
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6">
              <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded mb-4 w-full"></div>
              <div className="flex justify-between mb-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
              <div className="h-2 bg-gray-200 rounded-full w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (loading || isLoadingProjects) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((id) => (
          <div 
            key={id}
            className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
          >
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6">
              <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded mb-4 w-full"></div>
              <div className="flex justify-between mb-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
              <div className="h-2 bg-gray-200 rounded-full w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (isErrorProjects) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">Error loading projects. Please try again later.</p>
      </div>
    );
  }
  
  // If there are no projects, show message
  if (projects.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">No projects found. Create your first project!</p>
        <Link href="/create" className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Create Project
        </Link>
      </div>
    );
  }
  
  // Apply limit if specified
  const displayedProjects = limit ? projects.slice(0, limit) : projects;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayedProjects.map((project) => (
        <Link href={`/project/${project.id}`} key={project.id} className="block">
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {project.imageUrl ? (
              <Image 
                src={project.imageUrl} 
                alt={project.title} 
                className="h-48 w-full object-cover"
                width={1920}
                height={1080}
              />
            ) : (
              <div className="h-48 bg-gray-200"></div>
            )}
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{project.title}</h3>
              <p className="text-gray-500 mb-4">
                {project.description}
              </p>
              <div className="flex justify-between text-sm mb-2">
                <span>{project.raised} CELO raised</span>
                <span>Goal: {project.goal} CELO</span>
              </div>
              <Progress value={project.progress} className="h-2 w-full" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 