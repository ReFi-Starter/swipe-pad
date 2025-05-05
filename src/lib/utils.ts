import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Improved project data with reliable placeholder images
export const projects = [
  {
    id: 1,
    title: "Clean Water Initiative",
    category: "SocFi",
    description: "Providing clean water access to communities in need through sustainable infrastructure projects.",
    image: "/placeholder.svg?key=zadjz",
    fundingGoal: 5000,
    currentFunding: 3200,
    websiteUrl: "https://cleanwaterinitiative.org",
    sponsorBoosted: true,
    communityTags: [
      { id: 1, text: "✅ Verified", color: "green", count: 24 },
      { id: 2, text: "👍 Recommended", color: "green", count: 18 },
    ],
    communityNotes: [
      {
        id: 1,
        author: "Sarah K.",
        reputation: 125,
        text: "I've personally visited this project. They're doing great work providing clean water to rural communities.",
        tags: ["✅ Verified"],
        upvotes: 32,
      },
      {
        id: 2,
        author: "Michael T.",
        reputation: 108,
        text: "This organization has a proven track record. Financial reports are transparent and available on their website.",
        tags: ["👍 Recommended"],
        upvotes: 24,
      },
    ],
  },
  {
    id: 2,
    title: "Coding for Kids",
    category: "Education",
    description: "Teaching programming skills to underprivileged children to prepare them for the digital future.",
    image: "/placeholder.svg?key=rq9rq",
    fundingGoal: 3000,
    currentFunding: 1800,
    websiteUrl: "https://codingforkids.org",
    sponsorBoosted: false,
    communityTags: [
      { id: 1, text: "✅ Verified", color: "green", count: 15 },
      { id: 2, text: "🔍 Needs Review", color: "orange", count: 3 },
    ],
    communityNotes: [
      {
        id: 1,
        author: "Jessica L.",
        reputation: 93,
        text: "Great initiative but they need to provide more details about how the funds are being used.",
        tags: ["🔍 Needs Review"],
        upvotes: 12,
      },
      {
        id: 2,
        author: "David R.",
        reputation: 75,
        text: "I've volunteered with this organization. They're legitimate and doing important work.",
        tags: ["✅ Verified"],
        upvotes: 18,
      },
    ],
  },
  {
    id: 3,
    title: "Wildlife Preservation",
    category: "Animal Rescue",
    description: "Protecting endangered species and their habitats through conservation efforts and education.",
    image: "/interconnected-conservation.png",
    fundingGoal: 7500,
    currentFunding: 4100,
    websiteUrl: "https://wildlifepreservation.org",
    sponsorBoosted: true,
    communityTags: [{ id: 1, text: "✅ Verified", color: "green", count: 28 }],
    communityNotes: [
      {
        id: 1,
        author: "Emma W.",
        reputation: 63,
        text: "This organization has been featured in National Geographic for their conservation work.",
        tags: ["✅ Verified"],
        upvotes: 22,
      },
    ],
  },
  {
    id: 4,
    title: "Suspicious Charity Fund",
    category: "SocFi",
    description: "Claiming to help communities in need with various social initiatives and programs.",
    image: "/shadowed-hand-collection.png",
    fundingGoal: 10000,
    currentFunding: 2200,
    websiteUrl: "https://suspiciouscharity.com",
    sponsorBoosted: false,
    communityTags: [
      { id: 1, text: "⚠️ Fake", color: "red", count: 42 },
      { id: 2, text: "🚫 Spam", color: "red", count: 35 },
    ],
    communityNotes: [
      {
        id: 1,
        author: "James H.",
        reputation: 58,
        text: "No verifiable information about this organization. Website was created just 2 weeks ago.",
        tags: ["⚠️ Fake"],
        upvotes: 38,
      },
      {
        id: 2,
        author: "Alex",
        reputation: 82,
        text: "Multiple reports of this being a scam. No transparency about fund usage.",
        tags: ["🚫 Spam"],
        upvotes: 45,
      },
    ],
  },
  {
    id: 5,
    title: "Open Source Development",
    category: "Open Source",
    description: "Supporting critical open source projects that power the internet and modern technology.",
    image: "/collaborative-code.png",
    fundingGoal: 10000,
    currentFunding: 6200,
    websiteUrl: "https://opensourcefund.dev",
    sponsorBoosted: true,
    communityTags: [
      { id: 1, text: "✅ Verified", color: "green", count: 31 },
      { id: 2, text: "👍 Recommended", color: "green", count: 27 },
    ],
    communityNotes: [
      {
        id: 1,
        author: "Sarah K.",
        reputation: 125,
        text: "This fund directly supports developers working on critical infrastructure projects.",
        tags: ["✅ Verified"],
        upvotes: 29,
      },
    ],
  },
  {
    id: 6,
    title: "Unverified Education Fund",
    category: "Education",
    description: "Providing educational resources to students in developing countries.",
    image: "/placeholder.svg?height=400&width=600&query=education%20developing%20countries",
    fundingGoal: 5000,
    currentFunding: 1500,
    websiteUrl: "https://educationfund.org",
    sponsorBoosted: false,
    communityTags: [{ id: 1, text: "🔍 Unverified", color: "orange", count: 12 }],
    communityNotes: [
      {
        id: 1,
        author: "Michael T.",
        reputation: 108,
        text: "New organization with limited track record. Goals seem legitimate but need more verification.",
        tags: ["🔍 Unverified"],
        upvotes: 15,
      },
    ],
  },
]

export const categories = ["All", "Environment", "Community", "Energy", "Healthcare"]

export const leaderboardData = [
  {
    id: 1,
    name: "Sarah K.",
    avatar: "/placeholder.svg?height=100&width=100&query=woman%20profile%201",
    amount: 12.5,
    points: 125,
    tags: 42,
    reputation: 167,
    isCurrentUser: false,
    streak: 12,
  },
  {
    id: 2,
    name: "Michael T.",
    avatar: "/placeholder.svg?height=100&width=100&query=man%20profile%201",
    amount: 10.75,
    points: 108,
    tags: 36,
    reputation: 144,
    isCurrentUser: false,
    streak: 8,
  },
  {
    id: 3,
    name: "Jessica L.",
    avatar: "/placeholder.svg?height=100&width=100&query=woman%20profile%202",
    amount: 9.25,
    points: 93,
    tags: 28,
    reputation: 121,
    isCurrentUser: false,
    streak: 5,
  },
  {
    id: 4,
    name: "Alex",
    avatar: "/placeholder.svg?height=100&width=100&query=person%20profile",
    amount: 8.15,
    points: 82,
    tags: 31,
    reputation: 113,
    isCurrentUser: true,
    streak: 7,
  },
  {
    id: 5,
    name: "David R.",
    avatar: "/placeholder.svg?height=100&width=100&query=man%20profile%202",
    amount: 7.5,
    points: 75,
    tags: 22,
    reputation: 97,
    isCurrentUser: false,
    streak: 3,
  },
  {
    id: 6,
    name: "Emma W.",
    avatar: "/placeholder.svg?height=100&width=100&query=woman%20profile%203",
    amount: 6.25,
    points: 63,
    tags: 19,
    reputation: 82,
    isCurrentUser: false,
    streak: 4,
  },
  {
    id: 7,
    name: "James H.",
    avatar: "/placeholder.svg?height=100&width=100&query=man%20profile%203",
    amount: 5.75,
    points: 58,
    tags: 15,
    reputation: 73,
    isCurrentUser: false,
    streak: 2,
  },
]

export const friendsData = [
  {
    id: 1,
    name: "Sarah K.",
    avatar: "/placeholder.svg?height=100&width=100&query=woman%20profile%201",
    points: 125,
    maxPoints: 200,
    donations: 12.5,
    isFollowing: true,
    streak: 12,
  },
  {
    id: 2,
    name: "Michael T.",
    avatar: "/placeholder.svg?height=100&width=100&query=man%20profile%201",
    points: 108,
    maxPoints: 200,
    donations: 10.75,
    isFollowing: true,
    streak: 8,
  },
  {
    id: 3,
    name: "Jessica L.",
    avatar: "/placeholder.svg?height=100&width=100&query=woman%20profile%202",
    points: 93,
    maxPoints: 200,
    donations: 9.25,
    isFollowing: false,
    streak: 5,
  },
  {
    id: 5,
    name: "David R.",
    avatar: "/placeholder.svg?height=100&width=100&query=man%20profile%202",
    points: 75,
    maxPoints: 200,
    donations: 7.5,
    isFollowing: false,
    streak: 3,
  },
]

export const achievements = [
  {
    id: 1,
    icon: "🚀",
    title: "First Donation",
    description: "Made your first micro-donation",
    unlocked: true,
  },
  {
    id: 2,
    icon: "🔥",
    title: "Streak Master",
    description: "Donated for 7 days in a row",
    unlocked: true,
  },
  {
    id: 3,
    icon: "💰",
    title: "Big Spender",
    description: "Donated a total of $10",
    unlocked: false,
  },
  {
    id: 4,
    icon: "🌍",
    title: "Global Impact",
    description: "Donated to projects in 5 different categories",
    unlocked: false,
  },
  {
    id: 5,
    icon: "👑",
    title: "Leaderboard Champion",
    description: "Reached the top 3 on the leaderboard",
    unlocked: false,
  },
  {
    id: 6,
    icon: "🔍",
    title: "Community Guardian",
    description: "Submit 10 verified tags on projects",
    unlocked: true,
  },
  {
    id: 7,
    icon: "⭐",
    title: "Trusted Tagger",
    description: "Have 50 of your tags confirmed by others",
    unlocked: false,
  },
]

export const swipeAmounts = [
  { value: 0.01, label: "¢1" },
  { value: 0.1, label: "¢10" },
  { value: 0.5, label: "¢50" },
  { value: 1, label: "$1" },
]

export function getTagColor(tag: string): string {
  if (tag.includes("Fake") || tag.includes("Spam")) {
    return "bg-red-100 text-red-700"
  } else if (tag.includes("Unverified") || tag.includes("Needs Review")) {
    return "bg-orange-100 text-orange-700"
  } else if (tag.includes("Verified") || tag.includes("Recommended")) {
    return "bg-green-100 text-green-700"
  }
  return "bg-blue-100 text-blue-700"
}

// Define the Project interface for proper typing
interface CommunityTag {
  id: number;
  text: string;
  color: string;
  count: number;
}

interface CommunityNote {
  id: number;
  author: string;
  reputation: number;
  text: string;
  tags: string[];
  upvotes: number;
}

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  fundingGoal: number;
  currentFunding: number;
  websiteUrl: string;
  sponsorBoosted: boolean;
  communityTags?: CommunityTag[];
  communityNotes?: CommunityNote[];
}

export function getTrustLevel(project: Project): { level: "high" | "medium" | "low"; className: string } {
  // Count positive and negative tags
  const positiveTags =
    project.communityTags?.filter((tag: CommunityTag) => tag.text.includes("Verified") || tag.text.includes("Recommended")) || []

  const negativeTags =
    project.communityTags?.filter((tag: CommunityTag) => tag.text.includes("Fake") || tag.text.includes("Spam")) || []

  const positiveCount = positiveTags.reduce((sum: number, tag: CommunityTag) => sum + tag.count, 0)
  const negativeCount = negativeTags.reduce((sum: number, tag: CommunityTag) => sum + tag.count, 0)

  if (negativeCount > 5) {
    return { level: "low", className: "opacity-70 border-red-300" }
  } else if (positiveCount > 10) {
    return { level: "high", className: "border-green-300" }
  } else {
    return { level: "medium", className: "" }
  }
}

export function simulateHapticFeedback() {
  // In a real app, this would trigger device vibration
  if (window.navigator && window.navigator.vibrate) {
    window.navigator.vibrate(50)
  }
  console.log("Haptic feedback triggered")
}

export function formatStreak(streak: number): string {
  return streak > 0 ? `${streak} day${streak > 1 ? "s" : ""}` : "Start a streak!"
}

export function getStreakEmoji(streak: number): string {
  if (streak >= 30) return "🔥🔥🔥"
  if (streak >= 14) return "🔥🔥"
  if (streak >= 7) return "🔥"
  if (streak >= 3) return "✨"
  if (streak >= 1) return "👍"
  return "🤞"
}

export function getUserStats() {
  return {
    streak: 7,
    totalDonated: 8.15,
    projectsSupported: 12,
    categoriesSupported: 3,
    reputation: 113,
    level: "Supporter",
    nextLevel: {
      name: "Champion",
      pointsNeeded: 150,
      currentPoints: 113,
    },
  }
}

// Tipos para la configuración de usuario
export interface UserSettings {
  currency: string
  language: string
  region: string
}

// Monedas soportadas
export const supportedCurrencies = [
  { value: "USD", label: "US Dollar ($)", symbol: "$" },
  { value: "EUR", label: "Euro (€)", symbol: "€" },
  { value: "GBP", label: "British Pound (£)", symbol: "£" },
  { value: "cUSD", label: "Celo Dollar (cUSD)", symbol: "cUSD" },
  { value: "cEUR", label: "Celo Euro (cEUR)", symbol: "cEUR" },
  { value: "USDC", label: "USD Coin (USDC)", symbol: "USDC" },
  { value: "CENTS", label: "Cents (¢)", symbol: "¢" },
]

// Idiomas soportados
export const supportedLanguages = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
]

// Función para detectar la región del usuario
export function detectUserRegion(): string {
  try {
    const userLocale = navigator.language
    return userLocale.split("-")[1] || userLocale
  } catch (error) {
    console.error("Error detecting user region:", error)
    return "US"
  }
}

// Función para formatear moneda según la configuración del usuario
export function formatCurrency(amount: number, currency = "USD"): string {
  // Evitar NaN
  if (isNaN(amount)) return "0"

  // Formatear según la moneda
  switch (currency) {
    case "EUR":
      return `€${(amount).toFixed(2)}`
    case "GBP":
      return `£${(amount).toFixed(2)}`
    case "cUSD": // Celo Dollar stablecoin
      return `cUSD ${(amount).toFixed(2)}`
    case "cEUR": // Celo Euro stablecoin
      return `cEUR ${(amount).toFixed(2)}`
    case "USDC":
      return `USDC ${(amount).toFixed(2)}`
    case "USDT":
      return `USDT ${(amount).toFixed(2)}`
    case "CENTS":
      return `¢${(amount * 100).toFixed(0)}`
    default:
      return `$${(amount).toFixed(2)}`
  }
}

// Obtener configuración del usuario (en una app real, esto vendría de una base de datos o localStorage)
export function getUserSettings(): UserSettings {
  // Intentar obtener de localStorage
  try {
    const savedSettings = localStorage.getItem("userSettings")
    if (savedSettings) {
      return JSON.parse(savedSettings)
    }
  } catch (error) {
    console.error("Error getting user settings:", error)
  }

  // Configuración por defecto
  return {
    currency: "CENTS",
    language: navigator.language.split("-")[0] || "en",
    region: detectUserRegion(),
  }
}

// Guardar configuración del usuario
export function saveUserSettings(settings: UserSettings): void {
  try {
    localStorage.setItem("userSettings", JSON.stringify(settings))
  } catch (error) {
    console.error("Error saving user settings:", error)
  }
}

// Función para obtener un mensaje de combo según el número
export function getComboMessage(combo: number): string {
  if (combo >= 10) return "¡LEGENDARIO!"
  if (combo >= 8) return "¡INCREÍBLE!"
  if (combo >= 6) return "¡FANTÁSTICO!"
  if (combo >= 5) return "¡EXCELENTE!"
  if (combo >= 3) return "¡BUEN COMBO!"
  return ""
}
