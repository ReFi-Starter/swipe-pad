"use client"

import { useState, useEffect } from 'react'
import Image, { ImageProps } from 'next/image'
import { getConsistentPlaceholder } from '@/lib/generate-placeholder'

interface ProjectImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string
  alt: string
  projectId: string
  fallbackClassName?: string
}

export function ProjectImage({
  src,
  alt,
  projectId,
  fallbackClassName,
  className,
  onError,
  ...props
}: ProjectImageProps) {
  const [error, setError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [placeholderSrc, setPlaceholderSrc] = useState<string | null>(null)
  
  // Generar el placeholder inmediatamente al montar el componente
  useEffect(() => {
    const placeholder = getConsistentPlaceholder(projectId);
    setPlaceholderSrc(placeholder);
  }, [projectId]);
  
  // Manejar error de carga de imagen
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setError(true)
    if (onError) {
      onError(e)
    }
  }

  // Manejar cuando la imagen carga correctamente
  const handleImageLoaded = () => {
    setIsLoaded(true);
  }
  
  // Filtrar propiedades específicas de Image que no deben pasarse al div
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { width, height, loader, placeholder, blurDataURL, fill, ...safeProps } = props;
  
  // Si hay error o estamos en estado de carga y tenemos el placeholder
  if ((error || !isLoaded) && placeholderSrc) {
    return (
      <div className="absolute inset-0 w-full h-full">
        {/* Placeholder/Fallback con gradiente - position absolute para no interrumpir el layout */}
        <div 
          className={`absolute inset-0 w-full h-full bg-cover transition-opacity duration-300 ease-in-out ${error ? 'opacity-100' : (isLoaded ? 'opacity-0' : 'opacity-100')} ${fallbackClassName || ''}`}
          style={{ backgroundImage: `url(${placeholderSrc})` }}
          aria-hidden="true"
        />
        
        {/* Imagen real (si no hay error) - siempre presente para mantener espacio */}
        <Image
          src={error ? placeholderSrc : src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ease-in-out ${isLoaded && !error ? 'opacity-100' : 'opacity-0'} ${className || ''}`}
          onError={handleError}
          onLoad={handleImageLoaded}
          fill={true}
          {...safeProps}
        />
      </div>
    )
  }
  
  // Caso base: solo mostrar la imagen
  return (
    <Image
      src={src}
      alt={alt}
      className={`${className || ''} object-cover`}
      onError={handleError}
      onLoad={handleImageLoaded}
      {...props}
    />
  )
} 