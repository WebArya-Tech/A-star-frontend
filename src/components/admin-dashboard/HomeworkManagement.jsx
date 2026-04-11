import React, { useState, useEffect } from 'react';

const DEFAULT_HOMEWORK = [
  { id: 1, title: 'Calculus Assignment 1', subject: 'Mathematics', dueDate: '2026-03-10', marks: 25, description: 'Solve all integration problems from chapter 5. Show all working steps.' },
  { id: 2, title: 'Physics Project', subject: 'Physics', dueDate: '2026-03-15', marks: 30, description: 'Create a detailed project on simple machines with diagrams.' },
  { id: 3, title: 'Organic Chemistry Worksheet', subject: 'Chemistry', dueDate: '2026-03-20', marks: 20, description: 'Complete reaction mechanism worksheet for Chapter 5.' },
]

const loadHomework = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('icfy_homework') || 'null')
    return saved && saved.length > 0 ? saved : DEFAULT_HOMEWORK
  } catch { return DEFAULT_HOMEWORK }
}

export default function HomeworkManagement() {
  const [homework, setHomework] = useState(loadHomework);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', subject: '', dueDate: '', marks: 10, description: '' });
  const [editId, setEditId] = useState(null);

  // Save to localStorage so student Homework.jsx can read them
  useEffect(() => { localStorage.setItem('icfy_homework', JSON.stringify(homework)) }, [homework])

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      setHomework(homework.map(h => h.id === editId ? { ...form, id: editId } : h));
    } else {
      setHomework([...homework, { ...form, id: Date.now(), assignedDate: new Date().toLocaleDateString('en-IN') }]);
    }
    setForm({ title: '', subject: '', dueDate: '', marks: 10, description: '' });
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (h) => {
    setForm({ title: h.title, subject: h.subject, dueDate: h.dueDate, marks: h.marks || 10, description: h.description });
    setEditId(h.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this homework?')) return;
    setHomework(homework.filter(h => h.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border-b-2 border-blue-900 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-blue-900">Homework Management</h2>
        <p className="text-gray-500 text-sm mt-1">Create and review homework assignments</p>
      </div>
      <div className="bg-white rounded-xl shadow-md p-4 md:p-8">
        <button
          className="mb-4 px-4 py-2 rounded bg-blue-900 text-white font-bold"
          onClick={() => {
            setShowForm(!showForm);
            setForm({ title: '', subject: '', dueDate: '', description: '' });
            setEditId(null);
          }}
        >
          {showForm ? 'Cancel' : 'Add Homework'}
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
            <input
              name="subject"
              value={form.subject}
              onChange={handleInputChange}
              placeholder="Subject"
              className="w-full px-4 py-2 border rounded"
              required
            />
            <input
              name="dueDate"
              type="date"
              value={form.dueDate}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
            <textarea
              name="description"
              value={form.description}
              onChange={handleInputChange}
              placeholder="Description"
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
        {homework.length === 0 ? (
          <div className="text-gray-600 text-center py-8">No homework found.</div>
        ) : (
          <div className="space-y-4">
            {homework.map((h) => (
              <div key={h.id} className="border rounded-lg p-4 hover:shadow-md transition">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{h.title}</h3>
                    <p className="text-gray-600">Subject: {h.subject}</p>
                    <p className="text-gray-600">Due: {h.dueDate}</p>
                    <p className="text-gray-700 mt-2">{h.description}</p>
                  </div>
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <button
                      className="px-3 py-1 rounded bg-blue-900 text-white text-sm"
                      onClick={() => handleEdit(h)}
                    >Edit</button>
                    <button
                      className="px-3 py-1 rounded bg-red-600 text-white text-sm"
                      onClick={() => handleDelete(h.id)}
                    >Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
