'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import StatsChart from '@/components/StatsChart'

export default function DashboardPage() {
  const [leadsCount, setLeadsCount] = useState(0)
  const [convertedCount, setConvertedCount] = useState(0)
  const [lostCount, setLostCount] = useState(0)
  const [overdueTasksCount, setOverdueTasksCount] = useState(0)

  useEffect(() => {
    const loadStats = async () => {
      const today = new Date().toISOString().split('T')[0]

      const { count: leads } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })

      const { count: converted } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'converted')

      const { count: lost } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'lost')

      const { count: overdueTasks } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .lt('due_date', today)
        .neq('status', 'done')

      setLeadsCount(leads || 0)
      setConvertedCount(converted || 0)
      setLostCount(lost || 0)
      setOverdueTasksCount(overdueTasks || 0)
    }

    loadStats()
  }, [])

  return (
    <div className="min-h-screen p-6">
      <h1 className="mb-6 text-3xl font-bold">Dashboard analytique</h1>

      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border p-6">
          <h2 className="text-lg font-semibold">Nombre de leads</h2>
          <p className="mt-2 text-3xl">{leadsCount}</p>
        </div>

        <div className="rounded-2xl border p-6">
          <h2 className="text-lg font-semibold">Leads convertis</h2>
          <p className="mt-2 text-3xl">{convertedCount}</p>
        </div>

        <div className="rounded-2xl border p-6">
          <h2 className="text-lg font-semibold">Leads perdus</h2>
          <p className="mt-2 text-3xl">{lostCount}</p>
        </div>

        <div className="rounded-2xl border p-6">
          <h2 className="text-lg font-semibold">Tâches en retard</h2>
          <p className="mt-2 text-3xl">{overdueTasksCount}</p>
        </div>
      </div>

      <StatsChart
        leadsCount={leadsCount}
        convertedCount={convertedCount}
        lostCount={lostCount}
        overdueTasksCount={overdueTasksCount}
      />
    </div>
  )
}