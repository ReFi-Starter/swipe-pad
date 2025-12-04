import { getProjectById } from "@/lib/card-manager"
import { Metadata } from "next"
import { notFound } from "next/navigation"

type Props = {
    params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const project = getProjectById(params.id)

    if (!project) {
        return {
            title: "Project Not Found",
        }
    }

    return {
        title: `${project.name} on SwipePad`,
        description: project.description,
        openGraph: {
            title: `${project.name} on SwipePad`,
            description: project.description,
            images: [project.imageUrl || "/placeholder.svg"],
        },
        other: {
            "fc:frame": "vNext",
            "fc:frame:image": project.imageUrl || "https://swipepad.xyz/placeholder.svg",
            "fc:frame:button:1": "View on SwipePad",
            "fc:frame:button:1:action": "link",
            "fc:frame:button:1:target": `https://swipepad.xyz/project/${project.id}`,
        },
    }
}

export default function ProjectPage({ params }: Props) {
    const project = getProjectById(params.id)

    if (!project) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center justify-center">
            <div className="max-w-md w-full bg-gray-900 rounded-2xl overflow-hidden shadow-xl border border-gray-800">
                <div className="h-64 bg-black flex items-center justify-center">
                    <img
                        src={project.imageUrl || "/placeholder.svg"}
                        alt={project.name}
                        className="w-full h-full object-contain"
                    />
                </div>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-[#FFD600] bg-[#FFD600]/10 px-2 py-1 rounded-full">
                            {project.category}
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold mb-2">{project.name}</h1>
                    <p className="text-gray-400 mb-6">{project.description}</p>

                    <a
                        href="/"
                        className="block w-full py-3 bg-[#FFD600] text-black font-bold text-center rounded-xl hover:bg-[#E5C000] transition-colors"
                    >
                        Open in SwipePad
                    </a>
                </div>
            </div>
        </div>
    )
}
