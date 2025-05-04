"use client"

import { useState, createRef } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SwipeCard, swipeLeft, swipeRight } from "@/components/swipe-card"
import { Button } from "@/components/ui/button"
import { ThumbsDown, ThumbsUp } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

// Definir el tipo para la referencia TinderCard
type TinderCardRef = {
  swipe: (dir: "left" | "right") => Promise<void>
  restoreCard: () => Promise<void>
}

// Datos de ejemplo para los proyectos con imágenes locales
const mockProjects = [
  {
    id: "1",
    title: "Eco-friendly Water Purifier",
    description: "A sustainable solution for clean drinking water in developing regions, using locally sourced materials and solar power.",
    imageUrl: "/images/projects/eco-water.jpg", // Imagen local
    donationAmount: 2500,
    creator: { name: "EcoSolutions", verified: true }
  },
  {
    id: "2",
    title: "Community Garden Initiative",
    description: "Transform unused urban spaces into productive community gardens that provide fresh produce and educational opportunities.",
    imageUrl: "/images/projects/community-garden.jpg", // Imagen local
    donationAmount: 1800,
    creator: { name: "Green Urban", verified: true }
  },
  {
    id: "3",
    title: "Solar Lamps for Education",
    description: "Provide solar-powered lamps to students in areas without reliable electricity, allowing them to study after dark.",
    imageUrl: "/images/projects/solar-lamps.jpg", // Imagen local
    donationAmount: 3200,
    creator: { name: "Bright Future", verified: false }
  },
  {
    id: "4",
    title: "Ocean Plastic Recycling",
    description: "Innovative technology to collect and recycle ocean plastic into useful products, cleaning our seas and providing sustainable materials.",
    imageUrl: "/images/projects/ocean-plastic.jpg", // Imagen local
    donationAmount: 5000,
    creator: { name: "OceanClean", verified: true }
  },
  {
    id: "5",
    title: "Accessible Healthcare App",
    description: "A mobile application connecting remote communities with healthcare professionals through telemedicine and AI diagnostics.",
    imageUrl: "/images/projects/healthcare-app.jpg", // Imagen local
    donationAmount: 4200,
    creator: { name: "HealthBridge", verified: true }
  },
];

// Fallback para imágenes en caso de que no existan los archivos locales
const fallbackImages = [
  "/placeholder.jpg",
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 800 400'%3E%3Cdefs%3E%3ClinearGradient id='a' x1='0' x2='0' y1='0' y2='1'%3E%3Cstop offset='0' stop-color='%2378D67A'/%3E%3Cstop offset='1' stop-color='%233EB489'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23a)' width='800' height='400'/%3E%3C/svg%3E"
];

// Función para intentar usar una imagen local, o caer en un fallback si no existe
const getImageUrl = (index: number) => {
  // Devolver una imagen de fallback basada en el índice del proyecto
  return fallbackImages[index % fallbackImages.length];
};

export default function HomePage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [revealingCardIndex, setRevealingCardIndex] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState("swipe")
  
  // Crear todas las refs necesarias al inicio - usando createRef para asegurar
  // que cada tarjeta tenga su propia referencia independiente
  const cardRefs = mockProjects.map(() => createRef<TinderCardRef>());
  
  // Procesar las imágenes para asegurarnos de que funcionen
  const processedProjects = mockProjects.map((project, index) => ({
    ...project,
    imageUrl: getImageUrl(index)
  }));
  
  // Función para manejar el swipe
  const handleSwipe = (direction: "left" | "right") => {
    // Loguear la acción (like o skip)
    console.log(`${direction === "right" ? "Liked" : "Skipped"} project: ${processedProjects[currentIndex].title}`);
    
    // Actualizar el índice y marcar la siguiente carta como revelándose
    if (currentIndex < processedProjects.length - 1) {
      setRevealingCardIndex(currentIndex + 1);
      
      // Dar tiempo para que la animación de salida termine antes de mostrar la siguiente
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        
        // Resetear el estado de revelación después de un breve periodo
        setTimeout(() => {
          setRevealingCardIndex(null);
        }, 450); // Ajustado al tiempo de la animación
      }, 550); // Aumentado para permitir que la animación de swipe termine
    } else {
      // Si era la última carta, simplemente actualizar el índice
      setTimeout(() => {
        setCurrentIndex(processedProjects.length);
      }, 550); // Retrasado para permitir que se vea la animación
    }
  };
  
  // Manejar acciones de botones
  const handleLikeClick = () => {
    if (cardRefs[currentIndex]?.current) {
      swipeRight(cardRefs[currentIndex]);
    }
  };
  
  const handleSkipClick = () => {
    if (cardRefs[currentIndex]?.current) {
      swipeLeft(cardRefs[currentIndex]);
    }
  };
  
  // Reiniciar la baraja
  const handleResetDeck = () => {
    setCurrentIndex(0);
  };

  return (
    <main>
      {/* Header */}
      <div className="nav-container flex items-center justify-between">
        <h1 className="text-lg font-bold">SwipePad</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            Balance: {formatCurrency(25)}
          </span>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="nav-container pb-2 border-t-0">
        <Tabs defaultValue="swipe" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="swipe">Swipe</TabsTrigger>
            <TabsTrigger value="discover">Discover</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Category Filter */}
      <div className="filter-container overflow-x-auto no-scrollbar border-t-0">
        <div className="flex px-4 space-x-2 category-filter">
          <button className="active">All</button>
          <button>Environment</button>
          <button>Education</button>
          <button>Health</button>
          <button>Technology</button>
          <button>Community</button>
        </div>
      </div>
      
      {/* Card Stack Area */}
      <div className="card-stack-container">
        {activeTab === "swipe" ? (
          <>
            {/* Mostrar mensaje si no hay más cartas */}
            {currentIndex >= processedProjects.length ? (
              <div className="flex flex-col items-center justify-center h-full">
                <h3 className="text-xl font-semibold mb-4">No more projects</h3>
                <p className="text-muted-foreground mb-6 text-center">
                  You&apos;ve viewed all available projects in this category
                </p>
                <Button onClick={handleResetDeck}>Reset Deck</Button>
              </div>
            ) : (
              <>
                <div className="card-swipe-container">
                  <div className="card-stack">
                    {/* Renderizar hasta 3 cartas como máximo (la actual y las dos siguientes) */}
                    {processedProjects.slice(currentIndex, currentIndex + 3).map((project, index) => (
                      <SwipeCard
                        key={project.id}
                        ref={cardRefs[currentIndex + index]}
                        {...project}
                        onSwipe={index === 0 ? handleSwipe : undefined}
                        cardIndex={index}
                        isRevealing={revealingCardIndex === currentIndex + index}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="action-buttons">
                  <div 
                    className="action-button skip"
                    onClick={handleSkipClick}
                  >
                    <ThumbsDown size={22} />
                  </div>
                  <div 
                    className="action-button like"
                    onClick={handleLikeClick}
                  >
                    <ThumbsUp size={22} />
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 w-full overflow-y-auto">
            {processedProjects.map(project => (
              <SwipeCard 
                key={project.id} 
                {...project} 
                mode="list" 
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <div className="bottom-nav-item active">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span>Home</span>
        </div>
        <div className="bottom-nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <span>Search</span>
        </div>
        <div className="bottom-nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span>Profile</span>
        </div>
        <div className="bottom-nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          <span>Donations</span>
        </div>
      </div>
    </main>
  )
}
