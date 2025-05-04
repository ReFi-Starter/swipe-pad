"use client"

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Search, User, ShoppingBag, Pointer } from 'lucide-react'

interface NavItem {
  path: string
  label: string
  icon: React.ReactNode
}

export function BottomNav() {
  const pathname = usePathname()
  
  // Función para determinar si un item está activo, comparando con la ruta actual
  const isItemActive = (itemPath: string) => {
    // La página principal (/) debe estar activa cuando estamos en la página principal o en /home
    if (itemPath === '/' && (pathname === '/' || pathname === '/home')) {
      return true;
    }
    
    // Para otras páginas, verificar si la ruta comienza con el path del item
    return pathname.startsWith(itemPath) && itemPath !== '/';
  }
  
  const navItems: NavItem[] = [
    {
      path: '/',
      label: 'Swipe',
      icon: <Pointer size={24} />
    },
    {
      path: '/search',
      label: 'Search',
      icon: <Search size={24} />
    },
    {
      path: '/profile',
      label: 'Profile',
      icon: <User size={24} />
    },
    {
      path: '/donations',
      label: 'Donations',
      icon: <ShoppingBag size={24} />
    }
  ]
  
  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const active = isItemActive(item.path)
        
        return (
          <Link 
            href={item.path} 
            key={item.path}
            className={`bottom-nav-item ${active ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
