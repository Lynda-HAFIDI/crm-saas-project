'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const supabase = createClient()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    const user = data.user

    if (user) {
      await supabase.from('users').insert({
        id: user.id,
        email: user.email,
        role: 'user',
      })
    }

    setMessage("Compte créé avec succès. Vérifie ton email si une confirmation est demandée.")
    setLoading(false)
    router.push('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={handleSignup} className="w-full max-w-md space-y-4 rounded-2xl border p-6">
        <h1 className="text-2xl font-bold">Inscription</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border p-3"
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border p-3"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg border p-3 font-medium"
        >
          {loading ? 'Création...' : "S'inscrire"}
        </button>

        {message && <p className="text-sm">{message}</p>}
      </form>
    </div>
  )
}