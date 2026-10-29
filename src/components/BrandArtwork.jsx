import { useState } from 'react'
import { brandImage } from '../data/brands'

const initialsFor = (name) => name
  .replace(/[^\p{L}\p{N}\s-]/gu, '')
  .split(/[\s-]+/)
  .filter(Boolean)
  .slice(0, 2)
  .map((word) => word[0])
  .join('')
  .toUpperCase()

/** Shows a venture image, with a designed wordmark-style fallback if its source file is missing. */
export default function BrandArtwork({ b, alt = '', className = '', imgClass = '' }) {
  const [bad, setBad] = useState(false)
  const initials = initialsFor(b.name)

  return (
    <div className={`relative overflow-hidden bg-[#f2f3ef] ${className}`}>
      {bad ? (
        <div aria-hidden="true" className="absolute inset-0 grid place-items-center overflow-hidden bg-[radial-gradient(circle_at_85%_15%,rgba(164,190,45,.22),transparent_36%),linear-gradient(145deg,#f5f4eb,#e7eadc)] text-[#1b3028]">
          <span className="absolute -right-3 -top-8 select-none text-[clamp(4rem,14vw,9rem)] font-black leading-none tracking-[-.1em] text-[#173a2b]/[.06]">
            {initials}
          </span>
          <span className="absolute left-[12%] top-[12%] size-[clamp(1.5rem,5vw,3rem)] rounded-full border border-[#173a2b]/15" />
          <span className="relative mx-3 max-w-[90%] text-center text-[clamp(.62rem,1.7vw,1.05rem)] font-semibold leading-tight tracking-[-.025em]">
            {b.name}
          </span>
        </div>
      ) : (
        <img
          src={brandImage(b.file)}
          alt={alt}
          loading="lazy"
          decoding="async"
          draggable={false}
          onError={() => setBad(true)}
          className={`absolute inset-0 size-full object-cover ${imgClass}`}
        />
      )}
    </div>
  )
}
