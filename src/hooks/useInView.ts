import { useEffect, useRef, useState } from 'react'

export function useInView<T extends HTMLElement>(rootMargin = '0px 0px -40px 0px') {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin, threshold: 0.1 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [rootMargin])

  return { ref, inView }
}