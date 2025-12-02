import React, { useEffect, useState } from 'react'

const ITEMS_KEY = 'atelier_wardrobe_items'
const OUTFITS_KEY = 'atelier_outfits'

const vibes = ['casual', 'formal', 'work', 'party', 'cozy', 'sporty']

const slotConfig = [
  { key: 'top', label: 'Top / Dress' },
  { key: 'bottom', label: 'Bottom' },
  { key: 'outerwear', label: 'Outerwear' },
  { key: 'shoes', label: 'Shoes' },
  { key: 'bag', label: 'Bag' },
  { key: 'accessory', label: 'Accessory' },
]

// same category set as Closet (no tights)
const studioCategories = [
  { id: 'all', label: 'All' },
  { id: 'top', label: 'Tops' },
  { id: 'bottom', label: 'Bottoms' },
  { id: 'one_piece', label: 'Dresses' },
  { id: 'outerwear', label: 'Outerwear' },
  { id: 'shoes', label: 'Shoes' },
  { id: 'bag', label: 'Bags' },
  { id: 'accessory', label: 'Acc.' },
]

export default function Studio() {
  const [items, setItems] = useState([])
  const [name, setName] = useState('')
  const [vibe, setVibe] = useState('casual')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [slots, setSlots] = useState({
    top: null,
    bottom: null,
    outerwear: null,
    shoes: null,
    bag: null,
    accessory: null,
  })

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(ITEMS_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch (e) {
      console.warn('Failed to load items', e)
    }
  }, [])

  const selectedIds = Object.values(slots).filter(Boolean)

  const filteredItems = items.filter((item) => {
    if (categoryFilter === 'all') return true
    return item.category === categoryFilter
  })

  const assignItemToSlot = (item) => {
    let targetSlot = 'accessory'
    if (item.category === 'one_piece') {
      targetSlot = 'top'
    } else if (
      ['top', 'bottom', 'outerwear', 'shoes', 'bag', 'accessory'].includes(
        item.category
      )
    ) {
      targetSlot = item.category
    }

    setSlots((prev) => {
      const next = { ...prev }
      if (item.category === 'one_piece') {
        next.top = item.id
        next.bottom = null
      } else {
        next[targetSlot] = item.id
      }
      return next
    })
  }

  const toggleItem = (item) => {
    const isSelected = selectedIds.includes(item.id)
    if (isSelected) {
      setSlots((prev) => {
        const next = { ...prev }
        Object.keys(next).forEach((key) => {
          if (next[key] === item.id) next[key] = null
        })
        return next
      })
    } else {
      assignItemToSlot(item)
    }
  }

  const handleClearSlot = (key) => {
    setSlots((prev) => ({ ...prev, [key]: null }))
  }

  const handleReset = () => {
    setName('')
    setVibe('casual')
    setSlots({
      top: null,
      bottom: null,
      outerwear: null,
      shoes: null,
      bag: null,
      accessory: null,
    })
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
      slots,
      createdAt: new Date().toISOString(),
    }

    try {
      const raw = window.localStorage.getItem(OUTFITS_KEY)
      const existing = raw ? JSON.parse(raw) : []
      const next = [outfit, ...existing]
      window.localStorage.setItem(OUTFITS_KEY, JSON.stringify(next))
      alert('Outfit saved to Lookbook!')
      handleReset()
    } catch (e) {
      console.warn('Failed to save outfit', e)
    }
  }

  const getItemById = (id) => items.find((it) => it.id === id)

  // overlays helper: show selected item on top of mannequin
  const renderOverlay = (item, extraClasses) => {
    if (!item || !item.imageData) return null
    return (
      <div
        className={
          'absolute rounded-2xl overflow-hidden shadow-md shadow-stone-300 bg-white ' +
          extraClasses
        }
      >
        <img
          src={item.imageData}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
    )
  }

  const topItem = slots.top ? getItemById(slots.top) : null
  const bottomItem = slots.bottom ? getItemById(slots.bottom) : null
  const outerwearItem = slots.outerwear ? getItemById(slots.outerwear) : null
  const shoesItem = slots.shoes ? getItemById(slots.shoes) : null
  const bagItem = slots.bag ? getItemById(slots.bag) : null
  const accessoryItem = slots.accessory ? getItemById(slots.accessory) : null

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-stone-900 mb-2">Design Studio</h1>
        <p className="text-stone-500">
          Visualize your look on the model and fine-tune every detail before
          saving it to your Lookbook.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-stone-400">
          Your closet is empty. Add pieces in{' '}
          <span className="font-medium">The Closet</span> first.
        </p>
      ) : (
        <div className="grid lg:grid-cols-[1.2fr_0.9fr] gap-8 items-start">
          {/* Left: Canvas + categorized closet strip */}
          <div className="space-y-6">
            {/* Canvas with mannequin + overlays */}
            <div className="relative rounded-[3rem] bg-[#F5F5F4] overflow-hidden min-h-[420px] flex items-center justify-center">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-40 right-0 w-[420px] h-[420px] rounded-full bg-rose-100 opacity-40 blur-3xl" />
              </div>
              <div className="relative flex flex-col items-center justify-center gap-6">
                <div className="relative w-32 h-72 flex items-center justify-center">
                  {/* mannequin */}
                  <div className="w-24 h-64 bg-gradient-to-b from-stone-100 to-stone-200 rounded-full relative overflow-hidden">
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-stone-100 border border-stone-200" />
                    <div className="absolute inset-x-6 top-14 bottom-10 bg-stone-50/70 rounded-full" />
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-4 w-0.5 h-10 bg-stone-300" />
                  </div>

                  {/* overlays */}
                  {renderOverlay(
                    topItem || outerwearItem,
                    'top-10 left-1/2 -translate-x-1/2 w-20 h-20'
                  )}
                  {renderOverlay(
                    bottomItem,
                    'top-32 left-1/2 -translate-x-1/2 w-20 h-20'
                  )}
                  {renderOverlay(
                    shoesItem,
                    'bottom-2 left-1/2 -translate-x-1/2 w-16 h-16'
                  )}
                  {renderOverlay(
                    bagItem,
                    'top-32 -right-4 w-16 h-16'
                  )}
                  {renderOverlay(
                    accessoryItem,
                    'top-4 right-4 w-14 h-14'
                  )}
                </div>

                <p className="text-xs tracking-[0.2em] uppercase text-stone-400">
                  Tap pieces below to style
                </p>
              </div>
            </div>

            {/* Category pills + closet grid */}
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {studioCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`px-4 py-1.5 rounded-full text-xs md:text-sm border transition-colors ${
                      categoryFilter === cat.id
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <h2 className="text-xs font-medium text-stone-700 uppercase tracking-wide">
                Closet pieces
              </h2>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-4 max-h-72 overflow-y-auto pr-1 selection:bg-rose-100">
                {filteredItems.map((item) => {
                  const active = selectedIds.includes(item.id)
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleItem(item)}
                      className={`text-left bg-white rounded-3xl border p-1.5 transition-all ${
                        active
                          ? 'border-stone-900 shadow-md shadow-stone-200'
                          : 'border-stone-100 hover:border-stone-300'
                      }`}
                    >
                      <div className="aspect-[3/4] rounded-2xl bg-stone-100 overflow-hidden mb-1 flex items-center justify-center">
                        {item.imageData ? (
                          <img
                            src={item.imageData}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[10px] text-stone-400">
                            No image
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-medium truncate">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-stone-400 capitalize">
                        {item.category.replace('_', ' ')}
                      </p>
                    </button>
                  )
                })}
                {filteredItems.length === 0 && (
                  <div className="col-span-3 md:col-span-4 text-xs text-stone-400 py-4">
                    No pieces in this category yet.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: outfit details + slots */}
          <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-xl shadow-stone-100 px-6 py-7 space-y-5">
            <h2 className="font-serif text-2xl mb-2">Outfit Details</h2>
            <div className="space-y-2">
              <label className="text-xs font-medium text-stone-700">Name</label>
              <input
                className="w-full h-11 rounded-xl border border-stone-200 px-3 text-sm bg-stone-50"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rainy Day Office"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-stone-700">Vibe</label>
              <select
                className="w-full h-11 rounded-xl border border-stone-200 px-3 text-sm bg-stone-50"
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

            <div className="pt-3 space-y-3">
              <h3 className="text-xs font-medium text-stone-700 uppercase tracking-wide">
                Outfit slots
              </h3>
              <div className="space-y-2">
                {slotConfig.map((slot) => {
                  const itemId = slots[slot.key]
                  const item = itemId ? getItemById(itemId) : null
                  return (
                    <div
                      key={slot.key}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-stone-100 bg-stone-50 px-3 py-2"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-stone-100 overflow-hidden flex items-center justify-center">
                          {item ? (
                            item.imageData ? (
                              <img
                                src={item.imageData}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-[10px] text-stone-400">
                                No image
                              </span>
                            )
                          ) : (
                            <span className="text-[10px] text-stone-400">
                              Empty
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-stone-800">
                            {slot.label}
                          </p>
                          <p className="text-[11px] text-stone-500">
                            {item
                              ? item.name
                              : 'Select a piece below to assign'}
                          </p>
                        </div>
                      </div>
                      {item && (
                        <button
                          type="button"
                          onClick={() => handleClearSlot(slot.key)}
                          className="text-[11px] text-stone-400 hover:text-red-500 px-2 py-1 rounded-lg hover:bg-red-50"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="pt-3 space-y-2">
              <button
                onClick={handleSave}
                className="w-full h-11 rounded-full bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors"
              >
                Save to Lookbook
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="mx-auto flex items-center justify-center gap-2 text-xs text-stone-500 hover:text-stone-800 mt-1"
              >
                <span className="text-lg leading-none">↺</span>
                Reset Canvas
              </button>
              <p className="mt-1 text-[11px] text-stone-400 text-center">
                {selectedIds.length} piece(s) selected
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
