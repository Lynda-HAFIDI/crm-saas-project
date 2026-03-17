'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([])
  const [contacts, setContacts] = useState<any[]>([])
  const [contactId, setContactId] = useState('')
  const [value, setValue] = useState('')

  const loadLeads = async () => {
    const { data, error } = await supabase.from('leads').select('*')

    if (error) {
      console.log(error)
      return
    }

    setLeads(data || [])
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
    loadLeads()
    loadContacts()
  }, [])

  const createLead = async () => {
    if (!contactId) {
      alert('Choisis un contact')
      return
    }

    const { error } = await supabase.from('leads').insert({
      contact_id: contactId,
      value: Number(value),
      status: 'new',
    })

    if (error) {
      alert(error.message)
      return
    }

    setContactId('')
    setValue('')
    loadLeads()
  }

  const changeStatus = async (id: string, status: string) => {
    const lead = leads.find((l) => l.id === id)

    const { error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', id)

    if (error) {
      alert(error.message)
      return
    }

    if (status === 'converted' && lead?.contact_id) {
      const { data: contact, error: contactError } = await supabase
        .from('contacts')
        .select('*')
        .eq('id', lead.contact_id)
        .single()

      if (!contactError && contact?.email) {
        const subject = 'Votre lead a été converti'
        const content = `Bonjour ${contact.first_name}, votre dossier a bien été converti. Nous vous contacterons très bientôt.`

        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            toEmail: contact.email,
            toName: `${contact.first_name} ${contact.last_name}`,
            subject,
            content,
          }),
        })

        const result = await response.json()

        if (!response.ok) {
          alert(result.error || "Erreur lors de l'envoi de l'email")
        } else {
          await supabase.from('emails').insert({
            contact_id: contact.id,
            subject,
            content,
            sent_at: new Date().toISOString(),
            status: 'sent',
          })
        }
      }
    }

    loadLeads()
  }

  const deleteLead = async (id: string) => {
    const { error } = await supabase.from('leads').delete().eq('id', id)

    if (error) {
      alert(error.message)
      return
    }

    loadLeads()
  }

  const getContactName = (contactId: string) => {
    const contact = contacts.find((c) => c.id === contactId)
    return contact ? `${contact.first_name} ${contact.last_name}` : 'Contact inconnu'
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Leads</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        <select
          className="border p-2 rounded"
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
          placeholder="Valeur"
          className="border p-2 rounded"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <button
          onClick={createLead}
          className="border px-4 py-2 rounded"
        >
          Créer lead
        </button>
      </div>

      <div className="space-y-3">
        {leads.map((lead) => (
          <div
            key={lead.id}
            className="border p-4 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{getContactName(lead.contact_id)}</p>
              <p className="text-sm text-gray-400">
                {lead.value} € — {lead.status}
              </p>
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => changeStatus(lead.id, 'in_progress')}
                className="border px-3 py-1 rounded"
              >
                In progress
              </button>

              <button
                onClick={() => changeStatus(lead.id, 'converted')}
                className="border px-3 py-1 rounded"
              >
                Converted
              </button>

              <button
                onClick={() => changeStatus(lead.id, 'lost')}
                className="border px-3 py-1 rounded"
              >
                Lost
              </button>

              <button
                onClick={() => deleteLead(lead.id)}
                className="text-red-400"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}