'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  const loadTasks = async () => {
    const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false })

    if (error) {
      console.log(error)
      return
    }

    setTasks(data || [])
  }

  useEffect(() => {
    loadTasks()
  }, [])

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setDueDate('')
    setEditingId(null)
  }

  const saveTask = async () => {
    if (!title.trim()) {
      alert('Le titre est obligatoire')
      return
    }

    if (editingId) {
      const { error } = await supabase
        .from('tasks')
        .update({
          title,
          description,
          due_date: dueDate || null,
        })
        .eq('id', editingId)

      if (error) {
        alert(error.message)
        return
      }
    } else {
      const { error } = await supabase.from('tasks').insert({
        title,
        description,
        due_date: dueDate || null,
        status: 'todo',
      })

      if (error) {
        alert(error.message)
        return
      }
    }

    resetForm()
    loadTasks()
  }

  const editTask = (task: any) => {
    setEditingId(task.id)
    setTitle(task.title || '')
    setDescription(task.description || '')
    setDueDate(task.due_date || '')
  }

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id)

    if (error) {
      alert(error.message)
      return
    }

    loadTasks()
  }

  const changeStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('tasks').update({ status }).eq('id', id)

    if (error) {
      alert(error.message)
      return
    }

    loadTasks()
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Tâches</h1>

      <div className="border rounded-xl p-4 mb-6 space-y-3 max-w-2xl">
        <input
          type="text"
          placeholder="Titre"
          className="border p-2 rounded w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Description"
          className="border p-2 rounded w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="date"
          className="border p-2 rounded"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <div className="flex gap-2">
          <button onClick={saveTask} className="border px-4 py-2 rounded">
            {editingId ? 'Modifier tâche' : 'Créer tâche'}
          </button>

          {editingId && (
            <button onClick={resetForm} className="border px-4 py-2 rounded">
              Annuler
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="border rounded-xl p-4 flex justify-between gap-4">
            <div>
              <p className="font-semibold">{task.title}</p>
              <p className="text-sm text-gray-400">{task.description || 'Pas de description'}</p>
              <p className="text-sm mt-1">Échéance : {task.due_date || 'Non définie'}</p>
              <p className="text-sm">Statut : {task.status}</p>
            </div>

            <div className="flex flex-wrap gap-2 h-fit">
              <button onClick={() => editTask(task)} className="border px-3 py-1 rounded">
                Modifier
              </button>

              <button onClick={() => changeStatus(task.id, 'in_progress')} className="border px-3 py-1 rounded">
                In progress
              </button>

              <button onClick={() => changeStatus(task.id, 'done')} className="border px-3 py-1 rounded">
                Done
              </button>

              <button onClick={() => deleteTask(task.id)} className="text-red-400 px-3 py-1">
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}