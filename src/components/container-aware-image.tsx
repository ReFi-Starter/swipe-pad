'use client'

import { useEffect, useRef } from 'react'
import NextImage from 'next/image'

interface ImageCandidate {
  width: number
  height: number
  src: string
}

interface ContainerAwareImageProps {
  candidates: ImageCandidate[]
  alt: string
  className?: string
  observeContainer?: string
  tolerance?: number
  placeholderColor?: string
}

export function ContainerAwareImage({
  candidates,
  alt,
  className = '',
  observeContainer,
  tolerance = 30,
  placeholderColor
}: ContainerAwareImageProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const lastSrcRef = useRef<string>('')
  const lastAspectRatioRef = useRef<number | null>(null)
  const hasLoadedOnceRef = useRef(false)

  useEffect(() => {
    if (!imgRef.current || !containerRef.current || !candidates.length) return

    const img = imgRef.current
    const container = containerRef.current
    const observedContainer = observeContainer 
      ? container.closest(observeContainer) || container.parentElement
      : container.parentElement

    if (!observedContainer) return

    let active = false

    const processResize = (entry?: ResizeObserverEntry) => {
      if (!active || !candidates.length) return

      let containerWidth: number
      let containerHeight: number

      if (entry?.contentBoxSize) {
        const size = Array.isArray(entry.contentBoxSize)
          ? entry.contentBoxSize[0]
          : entry.contentBoxSize
        containerWidth = size.inlineSize
        containerHeight = size.blockSize
      } else if (entry?.contentRect) {
        containerWidth = entry.contentRect.width
        containerHeight = entry.contentRect.height
      } else {
        containerWidth = (observedContainer as HTMLElement).offsetWidth
        containerHeight = (observedContainer as HTMLElement).offsetHeight
      }

      const containerAspectRatio = containerWidth / containerHeight
      const containerArea = containerWidth * containerHeight

      let bestCandidate: ImageCandidate | null = null
      let bestScore = Infinity

      for (let i = candidates.length - 1; i >= 0; i--) {
        const candidate = candidates[i]
        const { width, height, src } = candidate

        if (!width || !height || !src) continue
        if (width + tolerance < containerWidth || height + tolerance < containerHeight) continue

        const aspectRatio = width / height
        const aspectRatioDelta = Math.abs(aspectRatio - containerAspectRatio)
        const areaDelta = Math.abs(width * height - containerArea) / containerArea
        const score = aspectRatioDelta * 2 + areaDelta

        if (score < bestScore) {
          bestScore = score
          bestCandidate = candidate
        }
      }

      if (!bestCandidate && candidates.length) {
        bestCandidate = candidates[0]
      }

      if (bestCandidate?.src) {
        updateImageSource(bestCandidate)
      }
    }

    const updateImageSource = (candidate: ImageCandidate) => {
      const newSrc = candidate.src
      if (!newSrc || newSrc === lastSrcRef.current) return

      const newAspectRatio = candidate.width / candidate.height
      const aspectRatioChanged = Math.abs(newAspectRatio - (lastAspectRatioRef.current || 0)) > 0.01

      if (aspectRatioChanged) {
        img.classList.remove('cai-loaded')
        img.classList.add('cai-loading')
        container.classList.add('cai-img-switching')
      }

      const preloadImg = new Image()
      preloadImg.src = newSrc

      preloadImg.onload = () => {
        if (!preloadImg.naturalWidth || !preloadImg.naturalHeight) return

        if (img.src !== preloadImg.src) {
          img.src = preloadImg.src
        }

        lastSrcRef.current = newSrc
        lastAspectRatioRef.current = newAspectRatio

        if (aspectRatioChanged) {
          img.classList.remove('cai-loading')
          img.classList.add('cai-loaded')
          container.classList.remove('cai-img-switching')
        }

        const placeholder = container.querySelector('.cai-placeholder')
        if (!hasLoadedOnceRef.current && placeholder) {
          requestAnimationFrame(() => {
            ;(placeholder as HTMLElement).style.opacity = '0'

            let done = false
            const removeAfterFade = () => {
              if (done) return
              done = true
              placeholder.removeEventListener('transitionend', removeAfterFade)
              placeholder.remove()
            }

            placeholder.addEventListener('transitionend', removeAfterFade)
            setTimeout(removeAfterFade, 500)
          })

          hasLoadedOnceRef.current = true
        }
      }
    }

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries.length) return
      requestAnimationFrame(() => processResize(entries[0]))
    })

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          active = true
          requestAnimationFrame(() => processResize())
          intersectionObserver.disconnect()
        }
      },
      { rootMargin: '200px', threshold: 0.01 }
    )

    resizeObserver.observe(observedContainer)
    intersectionObserver.observe(container)

    if (img.complete) {
      img.classList.add('cai-loaded')
    }

    return () => {
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
    }
  }, [candidates, observeContainer, tolerance])

  return (
    <div ref={containerRef} className="container-aware-img">
      <NextImage
        ref={imgRef}
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3C/svg%3E"
        alt={alt}
        className={className}
        width={candidates[0].width}
        height={candidates[0].height}
      />
      <div 
        className="cai-placeholder"
        style={placeholderColor ? { background: placeholderColor } : undefined}
      />
    </div>
  )
} 