'use client'

import Image from 'next/image'

export function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative w-12 h-12">
        <Image
          src="/icons/backpack.svg"
          alt="Backpack Logo"
          width={48}
          height={48}
          className="text-current"
        />
      </div>
      <span 
        className="text-3xl font-semibold tracking-wide font-fredoka"
        style={{ color: '#00BFFF' }}
      >
        Backpack
      </span>
    </div>
  )
}
