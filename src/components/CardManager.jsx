// src/components/CardManager.jsx
import React, { useEffect, useState } from 'react';
import api from '@/api';

export default function CardManager() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: '', title: '', company: '', email: '', phone: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const res = await api.get('/cards');
      setCards(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      // update
      try {
        await api.put(`/cards/${editingId}`, form);
        setEditingId(null);
        setForm({ name: '', title: '', company: '', email: '', phone: '' });
        fetchCards();
      } catch (err) {
        setError(err.message);
      }
    } else {
      // create
      try {
        await api.post('/cards', form);
        setForm({ name: '', title: '', company: '', email: '', phone: '' });
        fetchCards();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const startEdit = (card) => {
    setEditingId(card.id);
    setForm({
      name: card.name || '',
      title: card.title || '',
      company: card.company || '',
      email: card.email || '',
      phone: card.phone || '',
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this card?')) return;
    try {
      await api.delete(`/cards/${id}`);
      fetchCards();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Business Cards</h2>
      {error && <p className="text-red-600 mb-2">Error: {error}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6 bg-white p-4 rounded">
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border p-2" required />
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} className="border p-2" />
        <input name="company" placeholder="Company" value={form.company} onChange={handleChange} className="border p-2" />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border p-2" type="email" />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="border p-2" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {editingId ? 'Update Card' : 'Add Card'}
        </button>
      </form>
      {loading ? (
        <p>Loading cards…</p>
      ) : (
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Title</th>
              <th className="p-2 text-left">Company</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Phone</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cards.map((card) => (
              <tr key={card.id} className="border-b">
                <td className="p-2">{card.name}</td>
                <td className="p-2">{card.title}</td>
                <td className="p-2">{card.company}</td>
                <td className="p-2">{card.email}</td>
                <td className="p-2">{card.phone}</td>
                <td className="p-2 space-x-2">
                  <button onClick={() => startEdit(card)} className="text-indigo-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(card.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
