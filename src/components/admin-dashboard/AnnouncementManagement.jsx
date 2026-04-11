
import React, { useState, useEffect } from 'react';

const DEFAULT_ANNOUNCEMENTS = [
  { id: 1, title: 'Welcome to A Star Classes!', message: 'We are glad to have you on board. Explore your dashboard to access courses, homework and more.', category: 'general', priority: 'medium', createdAt: '2026-02-20' },
  { id: 2, title: 'Fee Payment Reminder', message: 'Last date for Term 2 fee payment is Feb 28, 2026. Please clear dues before the deadline.', category: 'payment', priority: 'high', createdAt: '2026-02-18' },
]

const loadAnnouncements = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('icfy_announcements') || 'null')
    return saved && saved.length > 0 ? saved : DEFAULT_ANNOUNCEMENTS
  } catch { return DEFAULT_ANNOUNCEMENTS }
}

export default function AnnouncementManagement() {
  const [announcements, setAnnouncements] = useState(loadAnnouncements);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', category: 'general', priority: 'medium' });
  const [editId, setEditId] = useState(null);

  // Save to localStorage so student dashboard Announcements.jsx can read them
  useEffect(() => { localStorage.setItem('icfy_announcements', JSON.stringify(announcements)) }, [announcements])

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      setAnnouncements(announcements.map(a => a.id === editId ? { ...form, id: editId, createdAt: a.createdAt } : a));
    } else {
      setAnnouncements([...announcements, { ...form, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] }]);
    }
    setForm({ title: '', message: '', category: 'general', priority: 'medium' });
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (a) => {
    setForm({ title: a.title, message: a.message, category: a.category || 'general', priority: a.priority || 'medium' });
    setEditId(a.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    setAnnouncements(announcements.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border-b-2 border-blue-900 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-blue-900">Announcement Management</h2>
        <p className="text-gray-500 text-sm mt-1">Create and publish announcements</p>
      </div>
      <div className="bg-white rounded-xl shadow-md p-6">
        <button
          className="mb-4 px-4 py-2 rounded bg-blue-900 text-white font-bold"
          onClick={() => {
            setShowForm(!showForm);
            setForm({ title: '', message: '' });
            setEditId(null);
          }}
        >
          {showForm ? 'Cancel' : 'Add Announcement'}
        </button>
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <input
              name="title"
              value={form.title}
              onChange={handleInputChange}
              placeholder="Title"
              className="w-full px-4 py-2 border rounded"
              required
            />
            <textarea
              name="message"
              value={form.message}
              onChange={handleInputChange}
              placeholder="Message"
              className="w-full px-4 py-2 border rounded"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-900 text-white font-bold"
            >
              {editId ? 'Update' : 'Create'}
            </button>
          </form>
        )}
        {announcements.length === 0 ? (
          <div className="text-gray-600 text-center py-8">No announcements found.</div>
        ) : (
          <ul className="divide-y">
            {announcements.map((a) => (
              <li key={a.id} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <div className="font-bold text-lg">{a.title}</div>
                  <div className="text-gray-700">{a.message}</div>
                  <div className="text-xs text-gray-400">{a.createdAt ? new Date(a.createdAt).toLocaleString() : ''}</div>
                </div>
                <div className="flex gap-2 mt-2 md:mt-0">
                  <button
                    className="px-3 py-1 rounded bg-blue-900 text-white"
                    onClick={() => handleEdit(a)}
                  >Edit</button>
                  <button
                    className="px-3 py-1 rounded bg-red-600 text-white"
                    onClick={() => handleDelete(a.id)}
                  >Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
