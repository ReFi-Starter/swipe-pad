"use client"

import { useState, useEffect, forwardRef, ForwardedRef, useRef } from "react"
import TinderCard from "react-tinder-card"
import Image from "next/image"
import { VerifiedBadge } from "./verified-badge"
import { Button } from "./ui/button"

interface SwipeCardProps {
  id: string
  title: string
  description: string
  imageUrl: string
  donationAmount: number
  creator?: {
    name: string
    verified?: boolean
  }
  onSwipe?: (direction: "left" | "right") => void
  mode?: "swipe" | "list"
  cardIndex?: number // Posición en la baraja (0 = carta actual, 1 = siguiente, etc.)
  isRevealing?: boolean // Para animar la carta cuando se convierte en la principal
}

type TinderCardRef = {
  swipe: (dir: "left" | "right") => Promise<void>
  restoreCard: () => Promise<void>
}

// Usar forwardRef para permitir pasar referencias desde el componente padre
export const SwipeCard = forwardRef(function SwipeCard(
  {
    id,
    title,
    description,
    imageUrl,
    donationAmount,
    creator,
    onSwipe,
    mode = "swipe",
    cardIndex = 0,
    isRevealing = false
  }: SwipeCardProps,
  ref: ForwardedRef<TinderCardRef>
) {
  const [position, setPosition] = useState(0) // 0: center, -1: left, 1: right
  const wrapperRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const lastTouchX = useRef(0) // Para reducir la sensibilidad
  const lastUpdateTime = useRef(0) // Para throttlear las actualizaciones
  const moveThreshold = 5 // Umbral para evitar micro-movimientos (aumentado)
  const updateInterval = 16 // ~60fps

  // Determinar la clase CSS según la posición en la baraja
  const getCardClass = () => {
    if (mode === "list") return "static transform-none";
    if (cardIndex === 0) return "";
    if (cardIndex === 1) return "next-card";
    if (cardIndex === 2) return "next-next-card";
    return "hidden";
  };

  // Manejar animación al swipear
  const handleSwipe = (direction: string) => {
    if (direction === "left") {
      setPosition(-1)
      
      // Aplicar clase de movimiento manualmente
      if (wrapperRef.current) {
        wrapperRef.current.classList.remove('moving-right')
        wrapperRef.current.classList.add('moving-left')
        wrapperRef.current.classList.add('swipe-left')
      }

      // Dar tiempo para que la animación sea visible antes de ejecutar el callback
      setTimeout(() => {
        onSwipe?.("left")
      }, 100)
    } else if (direction === "right") {
      setPosition(1)
      
      // Aplicar clase de movimiento manualmente
      if (wrapperRef.current) {
        wrapperRef.current.classList.remove('moving-left')
        wrapperRef.current.classList.add('moving-right')
        wrapperRef.current.classList.add('swipe-right')
      }

      // Dar tiempo para que la animación sea visible antes de ejecutar el callback
      setTimeout(() => {
        onSwipe?.("right")
      }, 100)
    }
  }

  // Reset cuando cambie el ID para re-renderizar tarjeta
  useEffect(() => {
    setPosition(0)
    isDragging.current = false
    lastTouchX.current = 0
    
    // Limpiar clases y variables CSS
    if (wrapperRef.current) {
      wrapperRef.current.classList.remove('moving-left', 'moving-right', 'swipe-left', 'swipe-right')
      wrapperRef.current.style.removeProperty('--x');
    }
  }, [id])

  // Efecto de revelación cuando una carta pasa de segunda a primera
  useEffect(() => {
    if (isRevealing && wrapperRef.current && cardIndex === 0) {
      wrapperRef.current.classList.add('card-reveal');
      const timer = setTimeout(() => {
        if (wrapperRef.current) {
          wrapperRef.current.classList.remove('card-reveal');
        }
      }, 450); // Ajustado al tiempo de la animación en CSS
      return () => clearTimeout(timer);
    }
  }, [isRevealing, cardIndex]);

  // Función throttleada para actualizar la posición de la carta
  // Esto reduce el número de actualizaciones y hace el movimiento más suave
  const updateCardPosition = (x: number) => {
    const now = Date.now();
    
    // Throttling: actualizar max ~60fps para evitar jitter
    if (now - lastUpdateTime.current < updateInterval) return;
    lastUpdateTime.current = now;
    
    if (wrapperRef.current) {
      // Aplicar un factor de sensibilidad reducido para movimientos más suaves
      const sensitivity = 0.4; // Reducido aún más
      
      // Ignorar pequeños movimientos (reduce el temblor)
      const delta = x - lastTouchX.current;
      if (Math.abs(delta) < moveThreshold) return;
      
      // Suavizado de movimiento: movimiento exponencial para reducir micro-movimientos
      const dampedX = x * sensitivity;
      const adjustedX = Math.sign(dampedX) * Math.pow(Math.abs(dampedX), 0.8);
      
      lastTouchX.current = x;
      
      wrapperRef.current.style.setProperty('--x', adjustedX.toString());
      
      // Determinar la dirección del arrastre y aplicar la clase correcta
      if (adjustedX > 20) {
        wrapperRef.current.classList.remove('moving-left');
        wrapperRef.current.classList.add('moving-right');
      } else if (adjustedX < -20) {
        wrapperRef.current.classList.remove('moving-right');
        wrapperRef.current.classList.add('moving-left');
      } else if (Math.abs(adjustedX) < 5) {
        wrapperRef.current.classList.remove('moving-right', 'moving-left');
      }
    }
  }

  // Feedback haptico y visual al completar swipe
  const startSwipeFeedback = (direction: "left" | "right") => {
    const feedbackElement = document.querySelector(`.action-button.${direction === "right" ? "like" : "skip"}`);
    if (feedbackElement) {
      feedbackElement.classList.add('pulse');
      feedbackElement.classList.add('action-button-action');
      
      setTimeout(() => {
        feedbackElement.classList.remove('pulse');
        feedbackElement.classList.remove('action-button-action');
      }, 600);
    }
  }

  // No renderizar cartas más allá de la segunda de respaldo
  if (cardIndex > 2) return null;

  // Modo lista para navegación no-swipe
  if (mode === "list") {
    return (
      <div className="project-card static transform-none cursor-pointer hover:scale-[0.98] transition-transform">
        <div className="project-card-image">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 340px) 90vw, 340px"
            priority={cardIndex === 0}
            unoptimized // Para asegurar que las imágenes remotas carguen
          />
        </div>
        <div className="project-card-content">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold line-clamp-1">{title}</h3>
            {creator?.verified && <VerifiedBadge isVerified={true} />}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{description}</p>
          <div className="mt-auto pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Goal: ${donationAmount}</span>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Modo swipe con TinderCard
  return (
    <TinderCard
      ref={cardIndex === 0 ? ref : undefined}
      className={`project-card-wrapper ${getCardClass()}`}
      onSwipe={(direction) => {
        if (cardIndex === 0) {
          handleSwipe(direction);
          startSwipeFeedback(direction as "left" | "right");
        }
      }}
      onCardLeftScreen={() => {
        // Limpiar clases cuando la tarjeta sale de pantalla
        if (wrapperRef.current) {
          wrapperRef.current.classList.remove('moving-left', 'moving-right', 'swipe-left', 'swipe-right')
          wrapperRef.current.style.removeProperty('--x');
        }
      }}
      swipeRequirementType="position"
      swipeThreshold={75} // Reducido para hacer el swipe más fácil
      preventSwipe={["up", "down"]}
      flickOnSwipe={cardIndex === 0}
    >
      <div 
        ref={wrapperRef} 
        className={`project-card ${position < 0 ? 'swipe-left' : position > 0 ? 'swipe-right' : ''}`}
        onTouchStart={cardIndex === 0 ? () => { isDragging.current = true } : undefined}
        onMouseDown={cardIndex === 0 ? () => { isDragging.current = true } : undefined}
        onTouchMove={cardIndex === 0 ? (e) => {
          if (!isDragging.current) return;
          
          // Calcular el desplazamiento desde el centro
          const touch = e.touches[0];
          const card = e.currentTarget.getBoundingClientRect();
          const centerX = card.left + card.width / 2;
          const offsetX = touch.clientX - centerX;
          updateCardPosition(offsetX);
        } : undefined}
        onMouseMove={cardIndex === 0 ? (e) => {
          // Sólo actualizar si se está arrastrando (por ejemplo, mousedown)
          if (e.buttons === 1 && isDragging.current) {
            const card = e.currentTarget.getBoundingClientRect();
            const centerX = card.left + card.width / 2;
            const offsetX = e.clientX - centerX;
            updateCardPosition(offsetX);
          }
        } : undefined}
        onTouchEnd={cardIndex === 0 ? () => { 
          isDragging.current = false;
          lastTouchX.current = 0;
          
          // Reset suave al soltar
          if (wrapperRef.current) {
            const currentX = parseFloat(wrapperRef.current.style.getPropertyValue('--x') || '0');
            
            // Si se movió lo suficiente en una dirección, mantener la clase de movimiento
            // para feedback visual, pero eliminar lentamente el valor de --x
            if (Math.abs(currentX) < 50) {
              wrapperRef.current.classList.remove('moving-left', 'moving-right');
              wrapperRef.current.style.removeProperty('--x');
            }
          }
        } : undefined}
        onMouseUp={cardIndex === 0 ? () => { 
          isDragging.current = false;
          lastTouchX.current = 0;
          
          // Reset suave al soltar
          if (wrapperRef.current) {
            const currentX = parseFloat(wrapperRef.current.style.getPropertyValue('--x') || '0');
            
            // Si se movió lo suficiente en una dirección, mantener la clase de movimiento
            // para feedback visual, pero eliminar lentamente el valor de --x
            if (Math.abs(currentX) < 50) {
              wrapperRef.current.classList.remove('moving-left', 'moving-right');
              wrapperRef.current.style.removeProperty('--x');
            }
          }
        } : undefined}
        onMouseLeave={cardIndex === 0 ? () => {
          if (isDragging.current) {
            isDragging.current = false;
            lastTouchX.current = 0;
            
            // Reset al salir
            if (wrapperRef.current) {
              wrapperRef.current.classList.remove('moving-left', 'moving-right');
              wrapperRef.current.style.removeProperty('--x');
            }
          }
        } : undefined}
      >
        <div className="project-card-image">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 340px) 90vw, 340px"
            priority={cardIndex < 2} // Solo priorizar las dos primeras cartas
            unoptimized // Para asegurar que las imágenes remotas carguen
          />
        </div>
        <div className="project-card-content">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold line-clamp-1">{title}</h3>
            {creator?.verified && <VerifiedBadge isVerified={true} />}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{description}</p>
          <div className="mt-auto pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-semibold">Goal: ${donationAmount}</span>
              <Button variant="outline" size="sm">Details</Button>
            </div>
          </div>
        </div>
      </div>
    </TinderCard>
  )
})

// Exportar métodos para uso externo
export const swipeLeft = (cardRef: React.RefObject<TinderCardRef | null>) => {
  cardRef.current?.swipe('left')
}

export const swipeRight = (cardRef: React.RefObject<TinderCardRef | null>) => {
  cardRef.current?.swipe('right')
} 