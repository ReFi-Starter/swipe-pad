import { Project } from "./data"
import bCards from "@/data/b_cards.json"
import eCards from "@/data/e_cards.json"
import kCards from "@/data/k_cards.json"

// Helper to normalize JSON data to Project interface
// Helper to normalize JSON data to Project interface
const normalizeProject = (data: any, defaultCategory: string): Project => {
    // Determine fields based on available keys
    const name = data["Name"] || data["Project Name"] || data["project_name"] || "Untitled Project";
    const description = data["Description"] || "No description available.";
    const imageUrl = data["Profile Image URL"] || data["Image url"] || data["project_image"] || "/placeholder.jpg";

    // Socials and Links
    const website = data["Website"] || data["project_url"] || data["website"];
    const twitter = data["Twitter"] || data["twitter"];
    const github = data["GitHub"] || data["github"];
    const farcaster = data["Farcaster"] || data["farcaster"];
    const linkedin = data["LinkedIn"] || data["linkedin"];

    // Wallet
    const wallet = data["Wallet Address"] || data["Wallet"] || data["wallet_address"];

    return {
        id: name + "-" + Math.random().toString(36).substr(2, 9), // Ensure unique ID
        name: name,
        description: description,
        category: data["Category"] || defaultCategory,
        imageUrl: imageUrl,
        website: website,
        twitter: twitter,
        github: github,
        farcaster: farcaster,
        linkedin: linkedin,
        walletAddress: wallet,
        // Default values for fields not in JSON
        fundingGoal: 10000,
        fundingCurrent: Math.floor(Math.random() * 5000),
        likes: 0,
        comments: 0,
        boostAmount: 0, // Default boost amount
    }
}

// Load and normalize all projects
const loadProjects = (): Project[] => {
    const bProjects = (bCards as any[]).map((p) => normalizeProject(p, "Builders"))
    const eProjects = (eCards as any[]).map((p) => normalizeProject(p, "Eco Projects"))
    const kProjects = (kCards as any[]).map((p) => normalizeProject(p, "DApps"))

    return [...bProjects, ...eProjects, ...kProjects]
}

const allProjects = loadProjects()

// Fisher-Yates Shuffle
const shuffleArray = <T>(array: T[]): T[] => {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
}

export const getProjects = (category?: string): Project[] => {
    let projects = category && category !== "See All"
        ? allProjects.filter((p) => p.category === category)
        : allProjects

    // Shuffle projects
    projects = shuffleArray(projects)

    // Sort by boost amount (descending)
    // Stable sort to keep shuffled order for same boost amount
    projects.sort((a, b) => (b.boostAmount || 0) - (a.boostAmount || 0))

    return projects
}

// Mock function to boost a project
export const boostProject = (projectId: string, amount: number) => {
    const project = allProjects.find(p => p.id === projectId)
    if (project) {
        project.boostAmount = (project.boostAmount || 0) + amount
    }
}

export const getProjectById = (projectId: string): Project | undefined => {
    return allProjects.find(p => p.id === projectId)
}
