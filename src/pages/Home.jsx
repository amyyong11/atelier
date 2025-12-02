import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex items-center justify-center">
      <section className="relative rounded-[3rem] overflow-hidden bg-[#F5F5F4] min-h-[420px] w-full flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-rose-100 rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white/50 to-transparent" />
        </div>

        <div className="relative z-10 px-6 py-16 w-full flex justify-center">
          <div className="max-w-xl text-center space-y-8">
            <div>
              <span className="inline-flex items-center px-4 py-1 rounded-full border border-stone-200 bg-white/80 text-[11px] tracking-[0.18em] uppercase text-stone-500">
                Digital Wardrobe
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="font-serif text-5xl md:text-6xl text-stone-900 leading-tight">
                Curate your
                <br />
                <span className="italic text-stone-700">perfect style.</span>
              </h1>
              <p className="text-stone-500 text-base md:text-lg max-w-md mx-auto">
                Organize your closet, design stunning outfits, and visualize
                your look before you wear it.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/studio"
                className="inline-flex items-center gap-2 px-6 h-11 rounded-full bg-stone-900 text-white text-sm font-medium shadow-lg shadow-stone-900/20 hover:bg-stone-800 transition-colors"
              >
                Start Creating
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/closet"
                className="inline-flex items-center gap-2 px-6 h-11 rounded-full bg-white text-stone-900 text-sm font-medium border border-stone-200 hover:bg-stone-50 transition-colors"
              >
                View Closet
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
