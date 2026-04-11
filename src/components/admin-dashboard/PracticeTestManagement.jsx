import React, { useState, useEffect } from 'react';

const DEFAULT_TESTS = [
  { id: 1, name: 'Calculus Test 1', subject: 'Mathematics', duration: 60, questions: 30, difficulty: 'Medium' },
  { id: 2, name: 'Physics Mechanics', subject: 'Physics', duration: 90, questions: 45, difficulty: 'Hard' },
  { id: 3, name: 'GRE Verbal Practice', subject: 'GRE', duration: 30, questions: 20, difficulty: 'Hard' },
]

const loadTests = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('icfy_practice_tests') || 'null')
    return saved && saved.length > 0 ? saved : DEFAULT_TESTS
  } catch { return DEFAULT_TESTS }
}

export default function PracticeTestManagement() {
  const [tests, setTests] = useState(loadTests);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', subject: '', duration: 0, questions: 0, difficulty: 'Medium' });
  const [editId, setEditId] = useState(null);

  useEffect(() => { localStorage.setItem('icfy_practice_tests', JSON.stringify(tests)) }, [tests])

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      setTests(tests.map(t => t.id === editId ? { ...form, id: editId } : t));
    } else {
      setTests([...tests, { ...form, id: Date.now() }]);
    }
    setForm({ name: '', subject: '', duration: 0, questions: 0, difficulty: 'Medium' });
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (t) => {
    setForm({ name: t.name, subject: t.subject, duration: t.duration, questions: t.questions, difficulty: t.difficulty || 'Medium' });
    setEditId(t.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this test?')) return;
    setTests(tests.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border-b-2 border-blue-900 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-blue-900">Practice Test Management</h2>
        <p className="text-gray-500 text-sm mt-1">Create and manage practice tests</p>
      </div>
      <div className="bg-white rounded-xl shadow-md p-4 md:p-8">
        <button
          className="mb-4 px-4 py-2 rounded bg-blue-900 text-white font-bold"
          onClick={() => {
            setShowForm(!showForm);
            setForm({ name: '', subject: '', duration: 0, questions: 0 });
            setEditId(null);
          }}
        >
          {showForm ? 'Cancel' : 'Add Practice Test'}
        </button>
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              value={form.name}
              onChange={handleInputChange}
              placeholder="Test Name"
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
              name="duration"
              type="number"
              value={form.duration}
              onChange={handleInputChange}
              placeholder="Duration (minutes)"
              className="w-full px-4 py-2 border rounded"
              min={0}
              required
            />
            <input
              name="questions"
              type="number"
              value={form.questions}
              onChange={handleInputChange}
              placeholder="No. of Questions"
              className="w-full px-4 py-2 border rounded"
              min={0}
              required
            />
            <button
              type="submit"
              className="col-span-full px-4 py-2 rounded bg-blue-900 text-white font-bold"
            >
              {editId ? 'Update' : 'Create'}
            </button>
          </form>
        )}
        {tests.length === 0 ? (
          <div className="text-gray-600 text-center py-8">No practice tests found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Test Name</th>
                  <th className="px-4 py-2 text-left">Subject</th>
                  <th className="px-4 py-2 text-left">Duration</th>
                  <th className="px-4 py-2 text-left">Questions</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tests.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{t.name}</td>
                    <td className="px-4 py-2">{t.subject}</td>
                    <td className="px-4 py-2">{t.duration} min</td>
                    <td className="px-4 py-2">{t.questions}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        className="px-3 py-1 rounded bg-blue-900 text-white text-sm"
                        onClick={() => handleEdit(t)}
                      >Edit</button>
                      <button
                        className="px-3 py-1 rounded bg-red-600 text-white text-sm"
                        onClick={() => handleDelete(t.id)}
                      >Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
