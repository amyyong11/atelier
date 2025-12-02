import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Layout({ children }) {
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen font-sans">
      <nav className="sticky top-0 z-50 bg-[#FAFAF9]/80 backdrop-blur-md border-b border-stone-100">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-lg font-serif">
              A
            </div>
            <div className="leading-tight">
              <p className="font-semibold text-sm tracking-[0.16em] uppercase text-stone-900">
                Atelier
              </p>
              <p className="text-[11px] uppercase tracking-[0.18em] text-stone-400">
                Digital Wardrobe
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-10 text-sm">
            <NavLink to="/" active={isActive('/')}>Dashboard</NavLink>
            <NavLink to="/closet" active={isActive('/closet')}>The Closet</NavLink>
            <NavLink to="/lookbook" active={isActive('/lookbook')}>Lookbook</NavLink>
          </div>

          <Link
            to="/studio"
            className="hidden md:inline-flex items-center gap-2 px-5 h-11 rounded-full bg-black text-white text-sm font-medium shadow-lg shadow-black/20 hover:bg-stone-900 transition-colors"
          >
            <span className="text-lg leading-none">+</span>
            Create Look
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {children}
      </main>
    </div>
  )
}

function NavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      className={`relative pb-1 text-sm transition-colors ${
        active ? 'text-stone-900' : 'text-stone-500 hover:text-stone-900'
      }`}
    >
      {children}
      {active && (
        <motion.div
          layoutId="nav-underline"
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-stone-900 rounded-full"
        />
      )}
    </Link>
  )
}
