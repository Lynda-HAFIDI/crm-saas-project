'use client'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

type StatsChartProps = {
  leadsCount: number
  convertedCount: number
  lostCount: number
  overdueTasksCount: number
}

export default function StatsChart({
  leadsCount,
  convertedCount,
  lostCount,
  overdueTasksCount,
}: StatsChartProps) {
const barData = {
  labels: ['Leads', 'Convertis', 'Perdus', 'Tâches en retard'],
  datasets: [
    {
      label: 'Statistiques CRM',
      data: [leadsCount, convertedCount, lostCount, overdueTasksCount],
      backgroundColor: [
        '#3b82f6', // bleu
        '#22c55e', // vert
        '#ef4444', // rouge
        '#f59e0b', // orange
      ],
    },
  ],
}

const doughnutData = {
  labels: ['Convertis', 'Perdus', 'Autres leads'],
  datasets: [
    {
      data: [
        convertedCount,
        lostCount,
        Math.max(leadsCount - convertedCount - lostCount, 0),
      ],
      backgroundColor: [
        '#22c55e',
        '#ef4444',
        '#3b82f6',
      ],
    },
  ],
}

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border p-4">
        <h2 className="mb-4 text-xl font-semibold">Vue générale</h2>
        <Bar data={barData} />
      </div>

      <div className="rounded-2xl border p-4">
        <h2 className="mb-4 text-xl font-semibold">Répartition des leads</h2>
        <Doughnut data={doughnutData} />
      </div>
    </div>
  )
}