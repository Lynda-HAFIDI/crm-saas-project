'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([])
  const [name, setName] = useState('')
  const [industry, setIndustry] = useState('')
  const [website, setWebsite] = useState('')

  const loadCompanies = async () => {
    const { data, error } = await supabase.from('companies').select('*')

    if (error) {
      console.log(error)
      return
    }

    setCompanies(data || [])
  }

  useEffect(() => {
    loadCompanies()
  }, [])

  const createCompany = async () => {
    const { error } = await supabase.from('companies').insert({
      name,
      industry,
      website,
    })

    if (error) {
      alert(error.message)
      return
    }

    setName('')
    setIndustry('')
    setWebsite('')
    loadCompanies()
  }

  const deleteCompany = async (id: string) => {
    const { error } = await supabase.from('companies').delete().eq('id', id)

    if (error) {
      alert(error.message)
      return
    }

    loadCompanies()
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Entreprises</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        <input
          placeholder="Nom"
          className="border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Industrie"
          className="border p-2 rounded"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
        />

        <input
          placeholder="Website"
          className="border p-2 rounded"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />

        <button
          onClick={createCompany}
          className="border px-4 py-2 rounded"
        >
          Ajouter entreprise
        </button>
      </div>

      <div className="space-y-2">
        {companies.map((company) => (
          <div
            key={company.id}
            className="border p-3 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{company.name}</p>
              <p className="text-sm text-gray-400">
                {company.industry} — {company.website}
              </p>
            </div>

            <button
              onClick={() => deleteCompany(company.id)}
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