'use client'

import { Link } from '@/components/link'
import cn from 'clsx'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/', label: 'home' },
  { href: '/r3f', label: 'stuff' },
  { href: '/storyblok', label: 'about me' },
  { href: '/hubspot', label: 'contact' },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-safe left-safe z-2 flex flex-col uppercase font-mono">
      <div className="inline-flex">
        <h1>Menu</h1>
        <span>{pathname}</span>
      </div>

      <ul className="pl-[24px]">
        {LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={cn(
                'link',
                'relative',
                pathname === link.href &&
                  "before:content-['■'] before:absolute before:left-[-16px]"
              )}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
