import { useEffect, useMemo, useRef, useState } from 'react'
import { MotionConfig, motion } from 'framer-motion'

const AXIS = { top: ['y', -1], bottom: ['y', 1], left: ['x', -1], right: ['x', 1] }
const EASE = [0.33, 1, 0.68, 1]

export default function BlurText({
  text = '',
  as = 'p',
  id,
  className = '',
  effect = 'blur',
  animateBy = 'words',
  direction = 'top',
  staggerFrom = 'start',
  trigger = 'view',
  delay = 120,
  startDelay = 0,
  stepDuration = 0.55,
  blur = 9,
  distance = 32,
  color = 'currentColor',
  fromColor,
  threshold = 0.15,
  rootMargin = '0px',
  onAnimationComplete,
}) {
  const ref = useRef(null)
  const [shown, setShown] = useState(() => trigger === 'load' || (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches))
  const MotionTag = motion[as] || motion.span
  const [axis, sign] = AXIS[direction] || AXIS.top
  const words = useMemo(() => text.trim().split(/\s+/).filter(Boolean), [text])
  const pieces = useMemo(() => words.map((word, i) => `${word}${i < words.length - 1 ? '\u00a0' : ''}`), [words])
  const ranks = useMemo(() => {
    if (staggerFrom === 'end') return pieces.map((_, i) => pieces.length - i - 1)
    if (staggerFrom === 'center') {
      const mid = (pieces.length - 1) / 2
      return pieces.map((_, i) => Math.abs(i - mid))
    }
    return pieces.map((_, i) => i)
  }, [pieces, staggerFrom])
  const maxRank = ranks.length ? Math.max(...ranks) : 0

  useEffect(() => {
    if (trigger !== 'view' || shown || !ref.current) return undefined
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true)
      return undefined
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShown(true)
        observer.disconnect()
      }
    }, { threshold, rootMargin })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [trigger, shown, threshold, rootMargin])

  useEffect(() => {
    if (!shown || !onAnimationComplete) return undefined
    const timer = window.setTimeout(onAnimationComplete, startDelay + (stepDuration * 1000) + maxRank * delay)
    return () => window.clearTimeout(timer)
  }, [shown, onAnimationComplete, startDelay, stepDuration, maxRank, delay])

  const hidden = effect === 'zoom'
    ? { opacity: 0, filter: `blur(${blur}px)`, scale: 1.3, [axis]: sign * distance * 0.35 }
    : effect === 'tilt'
      ? { opacity: 0, filter: `blur(${blur}px)`, rotateX: direction === 'top' ? -45 : 45, [axis]: sign * distance * 0.5 }
      : effect === 'focus'
        ? { opacity: 0.25, filter: `blur(${blur * 1.4}px)`, scale: 1.08 }
        : { opacity: 0, filter: `blur(${blur}px)`, [axis]: sign * distance }

  return (
    <MotionConfig reducedMotion="user">
      <MotionTag
        ref={ref}
        id={id}
        className={`m-0 flex flex-wrap ${className}`}
        style={{ color }}
        aria-label={text}
      >
        <span className="sr-only">{text}</span>
        {pieces.map((piece, i) => (
          <motion.span
            key={`${piece}-${i}`}
            aria-hidden="true"
            className="inline-block will-change-[transform,filter,opacity]"
            initial={{ ...hidden, ...(fromColor ? { color: fromColor } : {}) }}
            animate={shown ? { opacity: 1, filter: 'blur(0px)', x: 0, y: 0, scale: 1, rotateX: 0, ...(fromColor ? { color } : {}) } : hidden}
            transition={{
              duration: stepDuration,
              delay: (startDelay + ranks[i] * delay) / 1000,
              ease: EASE,
            }}
          >
            {piece}
          </motion.span>
        ))}
      </MotionTag>
    </MotionConfig>
  )
}
