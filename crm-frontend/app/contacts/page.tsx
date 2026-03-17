'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
export default function ContactsPage() {

  const [contacts, setContacts] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const loadContacts = async () => {
    const { data } = await supabase.from('contacts').select('*')
    setContacts(data || [])
  }

  useEffect(() => {
    loadContacts()
  }, [])

  const createContact = async () => {
  const { data, error } = await supabase.from('contacts').insert({
    first_name: firstName,
    last_name: lastName,
    company_id: 'c08d704d-e267-4cc0-bf35-5f4f473f276e'
  })

  console.log('INSERT DATA:', data)
  console.log('INSERT ERROR:', error)

  if (error) {
    alert(error.message)
    return
  }

  setFirstName('')
  setLastName('')
  loadContacts()
}

  const deleteContact = async (id: string) => {
    await supabase.from('contacts').delete().eq('id', id)
    loadContacts()
  }

  const filtered = contacts.filter((c) =>
    `${c.first_name} ${c.last_name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">Contacts</h1>

      {/* Recherche */}
      <input
        placeholder="Rechercher contact"
        className="border p-2 rounded mb-4 w-full max-w-md"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Création */}
      <div className="flex gap-2 mb-6">

        <input
          placeholder="Prénom"
          className="border p-2 rounded"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <input
          placeholder="Nom"
          className="border p-2 rounded"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <button
          onClick={createContact}
          className="border px-4 py-2 rounded"
        >
          Ajouter
        </button>

      </div>

      {/* Liste */}
      <div className="space-y-2">

        {filtered.map((c) => (
          <div
            key={c.id}
            className="border p-3 rounded flex justify-between"
          >
            <span>
              {c.first_name} {c.last_name}
            </span>

            <button
              onClick={() => deleteContact(c.id)}
              className="text-red-400"
            >
              Supprimer
            </button>

          </div>
        ))}

      </div>

    </div>
  )
}