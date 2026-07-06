// src/api/cards.js — card CRUD helpers using the Axios instance
import api from '@/api'

/**
 * Save (or update) the current card design.
 * If `cardId` is provided, it PUTs to that card; otherwise it POSTs a new one.
 */
export async function saveCard({ cardId, name, profileDetails, selectedTemplate, frontJSON, backJSON }) {
  const payload = {
    name: name || profileDetails?.name || 'Untitled Card',
    title: profileDetails?.title,
    company: profileDetails?.company,
    email: profileDetails?.email,
    phone: profileDetails?.phone,
    address: profileDetails?.address,
    templateId: selectedTemplate,
    canvasJson: { front: frontJSON, back: backJSON },
  }

  if (cardId) {
    const { data } = await api.put(`/cards/${cardId}`, payload)
    return data
  } else {
    const { data } = await api.post('/cards', payload)
    return data
  }
}

/** Fetch all cards belonging to the authenticated user. */
export async function fetchMyCards() {
  const { data } = await api.get('/cards')
  return data
}

/** Delete a card by ID. */
export async function deleteCard(id) {
  await api.delete(`/cards/${id}`)
}
