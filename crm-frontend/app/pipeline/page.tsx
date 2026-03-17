'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function PipelinePage() {

  const [leads, setLeads] = useState<any[]>([])

  const loadLeads = async () => {
    const { data, error } = await supabase.from('leads').select('*')

    if (error) {
      console.log(error)
      return
    }

    setLeads(data || [])
  }

  useEffect(() => {
    loadLeads()
  }, [])

  const columns = {
    new: leads.filter((l) => l.status === 'new'),
    in_progress: leads.filter((l) => l.status === 'in_progress'),
    converted: leads.filter((l) => l.status === 'converted'),
    lost: leads.filter((l) => l.status === 'lost'),
  }

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">Pipeline</h1>

      <div className="grid md:grid-cols-4 gap-4">

        <PipelineColumn title="New" leads={columns.new} />

        <PipelineColumn title="In progress" leads={columns.in_progress} />

        <PipelineColumn title="Converted" leads={columns.converted} />

        <PipelineColumn title="Lost" leads={columns.lost} />

      </div>

    </div>
  )
}

function PipelineColumn({ title, leads }: any) {
  return (
    <div className="border rounded-xl p-4">

      <h2 className="font-bold mb-4">{title}</h2>

      <div className="space-y-3">

        {leads.map((lead: any) => (
          <div key={lead.id} className="border rounded-lg p-3">

            <p className="font-semibold">{lead.title}</p>

            <p className="text-sm text-gray-400">
              {lead.value} €
            </p>

          </div>
        ))}

      </div>

    </div>
  )
}