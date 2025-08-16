import { useEffect, useMemo, useState } from 'react'
import { Plus, Save, X, Edit3, Trash2, Search, Sun, Moon } from 'lucide-react'

const API = 'http://localhost:3000'

export default function App() {
  const [characters, setCharacters] = useState([])
  const [form, setForm] = useState({ name: '', realName: '', universe: '' })
  const [editingId, setEditingId] = useState(null)
  const [query, setQuery] = useState('')
  const [darkMode, setDarkMode] = useState(false)

  const fetchCharacters = async () => {
    const res = await fetch(`${API}/characters`)
    setCharacters(await res.json())
  }

  useEffect(() => { fetchCharacters() }, [])

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return characters.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.realName.toLowerCase().includes(q) ||
      c.universe.toLowerCase().includes(q)
    )
  }, [characters, query])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const addCharacter = async () => {
    if (!form.name || !form.realName || !form.universe) return
    await fetch(`${API}/characters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setForm({ name: '', realName: '', universe: '' })
    fetchCharacters()
  }

  const startEdit = (c) => {
    setEditingId(c.id)
    setForm({ name: c.name, realName: c.realName, universe: c.universe })
  }

  const saveEdit = async () => {
    await fetch(`${API}/characters/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setEditingId(null)
    setForm({ name: '', realName: '', universe: '' })
    fetchCharacters()
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm({ name: '', realName: '', universe: '' })
  }

  const deleteCharacter = async (id) => {
    if (!window.confirm("🚨 Voulez-vous vraiment supprimer ce personnage ?")) return
    await fetch(`${API}/characters/${id}`, { method: 'DELETE' })
    fetchCharacters()
  }

  return (
    <div className="min-h-screen p-6 max-w-5xl mx-auto 
      bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-900 dark:to-gray-800 
      text-gray-900 dark:text-gray-100 transition-colors duration-500">

      {/* Formulaire */}
      <div className="mb-8 p-6 rounded-3xl 
        bg-gray-100 dark:bg-gray-900 
        shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff] 
        dark:shadow-[8px_8px_16px_#111111,-8px_-8px_16px_#222222] 
        flex flex-col md:flex-row gap-4 items-center">
        
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name"
          className="border-none rounded-2xl p-3 w-full shadow-inner dark:bg-gray-800 focus:outline-none" />
        <input name="realName" value={form.realName} onChange={handleChange} placeholder="Real Name"
          className="border-none rounded-2xl p-3 w-full shadow-inner dark:bg-gray-800 focus:outline-none" />
        <input name="universe" value={form.universe} onChange={handleChange} placeholder="Universe"
          className="border-none rounded-2xl p-3 w-full shadow-inner dark:bg-gray-800 focus:outline-none" />
        
        {editingId ? (
          <div className="flex gap-2">
            <button onClick={saveEdit} className="px-5 py-3 rounded-2xl bg-emerald-500 text-white shadow-lg hover:scale-105 transition flex items-center gap-2">
              <Save size={18}/> Save
            </button>
            <button onClick={cancelEdit} className="px-5 py-3 rounded-2xl bg-gray-400 text-white shadow-lg hover:scale-105 transition flex items-center gap-2">
              <X size={18}/> Cancel
            </button>
          </div>
        ) : (
          <button onClick={addCharacter} className="px-5 py-3 rounded-2xl bg-blue-500 text-white shadow-lg hover:scale-105 transition flex items-center gap-2">
            <Plus size={18}/> Add
          </button>
        )}
      </div>

      {/* Recherche */}
      <div className="mb-6 flex items-center gap-2 p-3 rounded-2xl shadow-inner dark:bg-gray-800">
        <Search size={18}/>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="w-full bg-transparent focus:outline-none"
        />
      </div>

      {/* Liste */}
      <ul className="bg-gray-100 dark:bg-gray-900 rounded-3xl 
        shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff] 
        dark:shadow-[8px_8px_16px_#111111,-8px_-8px_16px_#222222] divide-y divide-gray-300 dark:divide-gray-700">
        
        {filtered.map((c) => (
          <li key={c.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
            <div className="text-lg font-semibold">
              {c.name} <span className="text-gray-500">({c.realName})</span> – <span className="text-blue-500">{c.universe}</span>
            </div>
            <div className="flex gap-2 mt-3 md:mt-0">
              <button onClick={() => startEdit(c)} className="px-4 py-2 rounded-xl bg-amber-400 shadow hover:scale-105 transition flex items-center gap-1">
                <Edit3 size={16}/> Edit
              </button>
              <button onClick={() => deleteCharacter(c.id)} className="px-4 py-2 rounded-xl bg-red-500 text-white shadow hover:scale-105 transition flex items-center gap-1">
                <Trash2 size={16}/> Delete
              </button>
            </div>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="p-6 text-center text-gray-500">No characters found</li>
        )}
      </ul>
    </div>
  )
}
