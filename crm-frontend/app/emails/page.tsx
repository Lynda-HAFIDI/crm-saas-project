'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function EmailsPage() {
  const [emails, setEmails] = useState<any[]>([])
  const [contacts, setContacts] = useState<any[]>([])
  const [contactId, setContactId] = useState('')
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const loadEmails = async () => {
    const { data, error } = await supabase
      .from('emails')
      .select('*')
      .order('sent_at', { ascending: false })

    if (error) {
      console.log(error)
      return
    }

    setEmails(data || [])
  }

  const loadContacts = async () => {
    const { data, error } = await supabase.from('contacts').select('*')

    if (error) {
      console.log(error)
      return
    }

    setContacts(data || [])
  }

  useEffect(() => {
    loadEmails()
    loadContacts()
  }, [])

  const sendEmail = async () => {
    if (!contactId || !subject.trim() || !content.trim()) {
      alert('Choisis un contact, un sujet et un contenu')
      return
    }

    const selectedContact = contacts.find((c) => c.id === contactId)

    if (!selectedContact) {
      alert('Contact introuvable')
      return
    }

    if (!selectedContact.email) {
      alert('Ce contact n’a pas d’adresse email')
      return
    }

    setLoading(true)

    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        toEmail: selectedContact.email,
        toName: `${selectedContact.first_name} ${selectedContact.last_name}`,
        subject,
        content,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      setLoading(false)
      alert(result.error || "Erreur lors de l'envoi de l'email")
      return
    }

    const { error } = await supabase.from('emails').insert({
      contact_id: contactId,
      subject,
      content,
      sent_at: new Date().toISOString(),
      status: 'sent',
    })

    setLoading(false)

    if (error) {
      alert(error.message)
      return
    }

    setContactId('')
    setSubject('')
    setContent('')
    loadEmails()

    alert('Email envoyé avec succès')
  }

  const getContactName = (id: string) => {
    const contact = contacts.find((c) => c.id === id)
    return contact ? `${contact.first_name} ${contact.last_name}` : 'Contact inconnu'
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Emails</h1>

      <div className="border rounded-xl p-4 mb-6 space-y-3 max-w-2xl">
        <select
          className="border p-2 rounded w-full"
          value={contactId}
          onChange={(e) => setContactId(e.target.value)}
        >
          <option value="">Choisir un contact</option>
          {contacts.map((contact) => (
            <option key={contact.id} value={contact.id}>
              {contact.first_name} {contact.last_name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Sujet"
          className="border p-2 rounded w-full"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <textarea
          placeholder="Contenu"
          className="border p-2 rounded w-full"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          onClick={sendEmail}
          disabled={loading}
          className="border px-4 py-2 rounded"
        >
          {loading ? 'Envoi...' : 'Envoyer email'}
        </button>
      </div>

      <div className="space-y-3">
        {emails.map((email) => (
          <div key={email.id} className="border rounded-xl p-4">
            <p className="font-semibold">{email.subject}</p>
            <p className="text-sm text-gray-400">
              Contact : {getContactName(email.contact_id)}
            </p>
            <p className="text-sm text-gray-400">
              Statut : {email.status}
            </p>
            <p className="text-sm text-gray-400">
              Envoyé le : {email.sent_at || 'Non envoyé'}
            </p>
            <p className="mt-2">{email.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}