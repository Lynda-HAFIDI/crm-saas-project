'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/contacts', label: 'Contacts' },
  { href: '/companies', label: 'Entreprises' },
  { href: '/leads', label: 'Leads' },
  { href: '/pipeline', label: 'Pipeline' },
  { href: '/tasks', label: 'Tâches' },
  { href: '/emails', label: 'Emails' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-white/20 p-4">
      <div className="flex flex-wrap gap-3">
        {links.map((link) => {
          const isActive = pathname === link.href

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-4 py-2 border ${
                isActive ? 'bg-white text-black' : 'text-white'
              }`}
            >
              {link.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}