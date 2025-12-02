import React, { useEffect, useState } from 'react'
import { Search, Upload, Pencil } from 'lucide-react'

const STORAGE_KEY = 'atelier_wardrobe_items'

const categories = [
  { id: 'all', label: 'All' },
  { id: 'top', label: 'Tops' },
  { id: 'bottom', label: 'Bottoms' },
  { id: 'one_piece', label: 'Dresses' },
  { id: 'outerwear', label: 'Outerwear' },
  { id: 'shoes', label: 'Shoes' },
  { id: 'bag', label: 'Bags' },
  { id: 'accessory', label: 'Acc.' },
]

export default function Closet() {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [name, setName] = useState('')
  const [category, setCategory] = useState('top')
  const [imageData, setImageData] = useState(null)
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch (e) {
      console.warn('Failed to load wardrobe items', e)
    }
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch (e) {
      console.warn('Failed to save wardrobe items', e)
    }
  }, [items])

  const filteredItems = items.filter((item) => {
    const matchesCategory = filter === 'all' || item.category === filter
    const term = search.toLowerCase()
    const matchesSearch =
      !term || item.name.toLowerCase().includes(term)
    return matchesCategory && matchesSearch
  })

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setImageData(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const resetForm = () => {
    setName('')
    setCategory('top')
    setImageData(null)
    setEditingId(null)
  }

  const openAddModal = () => {
    resetForm()
    setIsModalOpen(true)
  }

  const openEditModal = (item) => {
    setEditingId(item.id)
    setName(item.name)
    setCategory(item.category)
    setImageData(item.imageData || null)
    setIsModalOpen(true)
  }

  const handleSubmitItem = (e) => {
    e.preventDefault()
    if (!name.trim()) return

    if (editingId) {
      setItems((prev) =>
        prev.map((it) =>
          it.id === editingId
            ? { ...it, name: name.trim(), category, imageData }
            : it
        )
      )
    } else {
      const newItem = {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        name: name.trim(),
        category,
        imageData,
        createdAt: new Date().toISOString(),
      }
      setItems((prev) => [newItem, ...prev])
    }

    resetForm()
    setIsModalOpen(false)
  }

  const getCategoryLabel = (id) => {
    const found = categories.find((c) => c.id === id)
    return found ? found.label.toUpperCase() : id.toUpperCase()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl text-stone-900 mb-2">The Closet</h1>
          <p className="text-stone-500">Manage your personal collection</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 h-11 rounded-full bg-black text-white text-sm font-medium shadow-lg shadow-black/20 hover:bg-stone-900 transition-colors"
        >
          <Upload className="w-4 h-4" />
          Add Piece
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-24 bg-[#FAFAF9]/95 backdrop-blur-sm py-2">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
          <input
            placeholder="Search items..."
            className="w-full h-11 pl-9 pr-3 rounded-full border border-stone-200 bg-white text-sm outline-none focus:ring-2 focus:ring-stone-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full md:w-auto overflow-x-auto no-scrollbar">
          <div className="inline-flex bg-white border border-stone-100 rounded-full p-1 h-10 shadow-sm">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-4 py-1.5 rounded-full text-xs md:text-sm transition-colors ${
                  filter === cat.id
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-16 text-center text-stone-400 text-sm">
          Your closet is empty. Click <span className="font-medium">Add Piece</span> to upload your first item.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-[2rem] p-3 border border-stone-100 shadow-sm relative group"
            >
              <button
                type="button"
                onClick={() => openEditModal(item)}
                className="absolute top-2 right-2 inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/90 border border-stone-200 text-stone-500 hover:bg-stone-50 hover:text-stone-800 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Pencil className="w-3 h-3" />
              </button>
              <div className="aspect-[3/4] rounded-[1.5rem] bg-stone-100 overflow-hidden mb-3 flex items-center justify-center">
                {item.imageData ? (
                  <img
                    src={item.imageData}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-stone-400">No image</span>
                )}
              </div>
              <div className="space-y-1">
                <span className="inline-flex px-3 py-1 rounded-full bg-stone-900 text-white text-[10px] tracking-[0.16em] uppercase">
                  {getCategoryLabel(item.category)}
                </span>
                <p className="text-sm font-medium text-stone-900 truncate">{item.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl">
            <h2 className="font-serif text-xl mb-4">
              {editingId ? 'Edit Piece' : 'Add Piece'}
            </h2>
            <form className="space-y-4" onSubmit={handleSubmitItem}>
              <div className="space-y-1">
                <label className="text-xs font-medium text-stone-700">Name</label>
                <input
                  className="w-full h-10 rounded-lg border border-stone-200 px-3 text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Pink knit sweater"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-stone-700">Category</label>
                <select
                  className="w-full h-10 rounded-lg border border-stone-200 px-3 text-sm bg-white"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories
                    .filter((c) => c.id !== 'all')
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-stone-700">
                  Photo (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-xs"
                />
                {imageData && (
                  <div className="mt-2">
                    <img
                      src={imageData}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded-xl border border-stone-200"
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    resetForm()
                  }}
                  className="px-4 h-9 rounded-lg text-sm text-stone-500 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 h-9 rounded-lg text-sm bg-stone-900 text-white hover:bg-stone-800"
                >
                  {editingId ? 'Save changes' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
