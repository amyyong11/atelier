import React, { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'

const ITEMS_KEY = 'atelier_wardrobe_items'
const OUTFITS_KEY = 'atelier_outfits'

export default function Lookbook() {
  const [outfits, setOutfits] = useState([])
  const [items, setItems] = useState([])

  useEffect(() => {
    try {
      const rawItems = window.localStorage.getItem(ITEMS_KEY)
      const rawOutfits = window.localStorage.getItem(OUTFITS_KEY)
      if (rawItems) setItems(JSON.parse(rawItems))
      if (rawOutfits) setOutfits(JSON.parse(rawOutfits))
    } catch (e) {
      console.warn('Failed to load from localStorage', e)
    }
  }, [])

  const getItemsForOutfit = (outfit) =>
    outfit.itemIds
      .map((id) => items.find((it) => it.id === id))
      .filter(Boolean)

  const handleDelete = (id) => {
    const next = outfits.filter((o) => o.id !== id)
    setOutfits(next)
    try {
      window.localStorage.setItem(OUTFITS_KEY, JSON.stringify(next))
    } catch (e) {
      console.warn('Failed to save outfits', e)
    }
  }

  const formatDate = (iso) => {
    try {
      const d = new Date(iso)
      return d.toISOString().slice(0, 10)
    } catch {
      return ''
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-4xl text-stone-900 mb-2">Lookbook</h1>
        <p className="text-stone-500">Curate and revisit your favorite outfits.</p>
      </div>

      {outfits.length === 0 ? (
        <div className="py-16 text-stone-400 text-sm">
          No outfits yet. Use <span className="font-medium">Create Look</span> to design and save your first outfit.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {outfits.map((outfit) => {
            const outfitItems = getItemsForOutfit(outfit)
            const displayItems = outfitItems.slice(0, 3)
            return (
              <div
                key={outfit.id}
                className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm flex flex-col overflow-hidden"
              >
                {/* Top: item images */}
                <div className="grid grid-cols-3 gap-3 p-5 pb-4">
                  {displayItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className={`rounded-[1.5rem] bg-stone-100 overflow-hidden ${
                        idx === 0 ? 'col-span-1' : ''
                      }`}
                    >
                      {item.imageData ? (
                        <img
                          src={item.imageData}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[11px] text-stone-400">
                          No image
                        </div>
                      )}
                    </div>
                  ))}
                  {displayItems.length === 0 && (
                    <div className="col-span-3 h-32 rounded-3xl bg-stone-100 flex items-center justify-center text-xs text-stone-400">
                      No items selected for this outfit
                    </div>
                  )}
                </div>

                {/* Bottom: details */}
                <div className="border-t border-stone-100 px-6 py-4 space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-serif text-xl text-stone-900 lowercase first-letter:capitalize">
                        {outfit.name}
                      </p>
                      <p className="text-xs text-stone-400">
                        {formatDate(outfit.createdAt)}
                      </p>
                    </div>
                    <span className="inline-flex px-3 py-1 rounded-full bg-stone-100 text-[11px] text-stone-700">
                      {outfit.vibe ? outfit.vibe[0].toUpperCase() + outfit.vibe.slice(1) : 'Casual'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[12px] text-stone-500">
                    <span>
                      {outfitItems.length} {outfitItems.length === 1 ? 'Item' : 'Items'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(outfit.id)}
                      className="inline-flex items-center gap-1 text-stone-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
