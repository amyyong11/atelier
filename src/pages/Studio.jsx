import React, { useEffect, useState } from 'react'

const ITEMS_KEY = 'atelier_wardrobe_items'
const OUTFITS_KEY = 'atelier_outfits'

const vibes = ['casual', 'formal', 'work', 'party', 'cozy', 'sporty']

export default function Studio() {
  const [items, setItems] = useState([])
  const [name, setName] = useState('')
  const [vibe, setVibe] = useState('casual')
  const [selectedIds, setSelectedIds] = useState([])

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(ITEMS_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch (e) {
      console.warn('Failed to load items', e)
    }
  }, [])

  const toggleItem = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const handleSave = () => {
    if (!name.trim()) {
      alert('Please name your outfit')
      return
    }
    if (selectedIds.length === 0) {
      alert('Select at least one piece for this look')
      return
    }

    const outfit = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      name: name.trim(),
      vibe,
      itemIds: selectedIds,
      createdAt: new Date().toISOString(),
    }

    try {
      const raw = window.localStorage.getItem(OUTFITS_KEY)
      const existing = raw ? JSON.parse(raw) : []
      const next = [outfit, ...existing]
      window.localStorage.setItem(OUTFITS_KEY, JSON.stringify(next))
      alert('Outfit saved to Lookbook!')
      setName('')
      setSelectedIds([])
    } catch (e) {
      console.warn('Failed to save outfit', e)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-stone-900 mb-2">Design Studio</h1>
        <p className="text-stone-500">
          Pick pieces from your closet and save the look to your Lookbook.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-stone-400">
          Your closet is empty. Add pieces in <span className="font-medium">The Closet</span> first.
        </p>
      ) : (
        <>
          <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
            <div className="space-y-4">
              <h2 className="font-medium text-stone-800 text-sm uppercase tracking-wide">
                Closet pieces
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {items.map((item) => {
                  const active = selectedIds.includes(item.id)
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleItem(item.id)}
                      className={`text-left bg-white rounded-3xl border p-2 transition-all ${
                        active
                          ? 'border-stone-900 shadow-md shadow-stone-200'
                          : 'border-stone-100 hover:border-stone-300'
                      }`}
                    >
                      <div className="aspect-[3/4] rounded-2xl bg-stone-100 overflow-hidden mb-2 flex items-center justify-center">
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
                      <p className="text-xs font-medium truncate">{item.name}</p>
                      <p className="text-[11px] text-stone-400 capitalize">
                        {item.category.replace('_', ' ')}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-5 space-y-4">
              <h2 className="font-serif text-xl mb-2">Outfit Details</h2>
              <div className="space-y-2">
                <label className="text-xs font-medium text-stone-700">Name</label>
                <input
                  className="w-full h-10 rounded-lg border border-stone-200 px-3 text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rainy Day Office"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-stone-700">Vibe</label>
                <select
                  className="w-full h-10 rounded-lg border border-stone-200 px-3 text-sm bg-white"
                  value={vibe}
                  onChange={(e) => setVibe(e.target.value)}
                >
                  {vibes.map((v) => (
                    <option key={v} value={v}>
                      {v[0].toUpperCase() + v.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="pt-2">
                <button
                  onClick={handleSave}
                  className="w-full h-11 rounded-xl bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors"
                >
                  Save to Lookbook
                </button>
                <p className="mt-2 text-[11px] text-stone-400">
                  {selectedIds.length} piece(s) selected
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
