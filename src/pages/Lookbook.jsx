import React, { useEffect, useState } from 'react'

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-4xl text-stone-900 mb-2">Lookbook</h1>
        <p className="text-stone-500">Browse the outfits you&apos;ve saved</p>
      </div>

      {outfits.length === 0 ? (
        <div className="py-16 text-stone-400 text-sm">
          No outfits yet. Use <span className="font-medium">Create Look</span> to design and save your first outfit.
        </div>
      ) : (
        <div className="space-y-4">
          {outfits.map((outfit) => {
            const outfitItems = getItemsForOutfit(outfit)
            return (
              <div
                key={outfit.id}
                className="bg-white rounded-3xl border border-stone-100 shadow-sm p-5 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-stone-900">{outfit.name}</p>
                    <p className="text-xs text-stone-400 capitalize">
                      {outfit.vibe} • {outfitItems.length} pieces
                    </p>
                  </div>
                  <p className="text-[11px] text-stone-400">
                    {new Date(outfit.createdAt).toLocaleString()}
                  </p>
                </div>
                {outfitItems.length > 0 && (
                  <div className="flex gap-3 overflow-x-auto no-scrollbar">
                    {outfitItems.map((item) => (
                      <div
                        key={item.id}
                        className="min-w-[120px] bg-stone-50 rounded-2xl p-2 flex flex-col gap-2"
                      >
                        <div className="aspect-[3/4] rounded-2xl bg-stone-100 overflow-hidden flex items-center justify-center">
                          {item.imageData ? (
                            <img
                              src={item.imageData}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[11px] text-stone-400">
                              No image
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-medium truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-stone-400 capitalize">
                          {item.category.replace('_', ' ')}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
