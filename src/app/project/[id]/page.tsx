"use client";

import { useParams } from "next/navigation";
import { ProjectDetails } from "@/components/project-details";
import { ConnectButton } from "@/components/connect-button";

export default function ProjectPage() {
  const params = useParams();
  const projectId = BigInt(params.id as string);
  
  return (
    <main className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Project Details</h1>
          <p className="text-gray-500">
            View and support this project
          </p>
        </div>
        <ConnectButton />
      </div>
      
      <ProjectDetails projectId={projectId} />
    </main>
  );
} 