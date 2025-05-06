import { RefObject, useEffect, useRef } from 'react'

type ElementType = HTMLElement | Window | Document

interface EventMap {
    HTMLElement: HTMLElementEventMap
    Window: WindowEventMap
    Document: DocumentEventMap
}

type GetEventMap<T extends ElementType> = T extends HTMLElement
    ? EventMap['HTMLElement']
    : T extends Window
      ? EventMap['Window']
      : T extends Document
        ? EventMap['Document']
        : never

export function useEventListener<T extends ElementType, K extends keyof GetEventMap<T>>(
    eventName: K,
    handler: (event: GetEventMap<T>[K]) => void,
    element?: RefObject<T | null>,
    options?: boolean | AddEventListenerOptions,
) {
    const savedHandler = useRef(handler)

    useEffect(() => {
        savedHandler.current = handler
    }, [handler])

    useEffect(() => {
        const targetElement: T | Window = element?.current ?? window

        if (!targetElement?.addEventListener) return

        const eventListener = (event: GetEventMap<T>[K]) => savedHandler.current(event)

        targetElement.addEventListener(eventName as string, eventListener as EventListener, options)

        return () => {
            targetElement.removeEventListener(eventName as string, eventListener as EventListener, options)
        }
    }, [eventName, element, options])
}
