'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function DashboardPage() {
  const [leadsCount, setLeadsCount] = useState(0)
  const [clientsCount, setClientsCount] = useState(0)
  const [tasksPendingCount, setTasksPendingCount] = useState(0)

  useEffect(() => {
    const loadStats = async () => {
      const { count: leads } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })

      const { count: clients } = await supabase
        .from('companies')
        .select('*', { count: 'exact', head: true })

      const { count: tasks } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .neq('status', 'done')

      setLeadsCount(leads || 0)
      setClientsCount(clients || 0)
      setTasksPendingCount(tasks || 0)
    }

    loadStats()
  }, [])

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard CRM</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border p-6">
          <h2 className="text-xl font-semibold">Nombre de leads</h2>
          <p className="mt-2 text-3xl">{leadsCount}</p>
        </div>

        <div className="rounded-2xl border p-6">
          <h2 className="text-xl font-semibold">Nombre de clients</h2>
          <p className="mt-2 text-3xl">{clientsCount}</p>
        </div>

        <div className="rounded-2xl border p-6">
          <h2 className="text-xl font-semibold">Tâches en attente</h2>
          <p className="mt-2 text-3xl">{tasksPendingCount}</p>
        </div>
      </div>
    </div>
  )
}