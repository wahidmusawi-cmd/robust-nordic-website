"use client"

// Scroll-triggered effects built on IntersectionObserver — no external
// libraries. The hidden initial state is gated behind `html.js` (set by an
// inline script in the layout), so content stays visible without JavaScript.
// prefers-reduced-motion is honored in globals.css and in CountUp below.

import { useEffect, useRef, useState } from "react"
import { useLocale } from "next-intl"
import { cn } from "@/lib/utils"

/**
 * Fades + slides its children in when they enter the viewport (once).
 * Stagger siblings with `delay` (ms).
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn("reveal", visible && "is-visible", className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}

/**
 * Counts a number up from zero when it scrolls into view. Server-renders the
 * final value, so SEO/no-JS always see the real number.
 */
export function CountUp({
  value,
  suffix = "",
  prefix = "",
  duration = 1400,
  className,
}: {
  value: number
  suffix?: string
  prefix?: string
  duration?: number
  className?: string
}) {
  const locale = useLocale()
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    const el = ref.current
    if (!el || value <= 0) return
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return // keep the final value
    }

    let raf = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const startedAt = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - startedAt) / duration)
          const eased = 1 - Math.pow(1 - t, 3)
          setDisplay(Math.round(value * eased))
          if (t < 1) raf = requestAnimationFrame(tick)
        }
        setDisplay(0)
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.5 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [value, duration])

  const formatted = new Intl.NumberFormat(locale).format(display)
  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  )
}
