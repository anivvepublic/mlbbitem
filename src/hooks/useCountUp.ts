import { useEffect, useState } from 'react'

// Bir sayiyi 0'dan hedefe yumusakca saydirir (eased).
// 'start' true olunca baslar -> scroll reveal ile birlesince canli durur.
export function useCountUp(target: number, duration = 1200, start = false): number {
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!start) return
    let raf = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(target * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, start])

  return val
}