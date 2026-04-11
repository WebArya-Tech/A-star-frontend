import React, { useState, useEffect } from 'react';

const DEFAULT_COURSES = [
  { id: 1, name: 'UG Mathematics', description: 'Comprehensive coverage for B.Sc and B.Tech students', instructor: 'Ms. Neha Aggarwal', duration: '6 months', price: 15000, category: 'Mathematics' },
  { id: 2, name: 'UG Physics', description: 'Advanced physics concepts with real-world applications', instructor: 'A Star Classes Faculty', duration: '6 months', price: 12000, category: 'Physics' },
  { id: 3, name: 'GRE Preparation', description: 'Complete GRE verbal and quantitative prep', instructor: 'Mr. Rajan', duration: '3 months', price: 18000, category: 'International' },
  { id: 4, name: 'GMAT Preparation', description: 'Comprehensive GMAT coaching for MBA aspirants', instructor: 'Ms. Shruti', duration: '3 months', price: 20000, category: 'International' },
]

const loadCourses = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('icfy_courses') || 'null')
    return saved && saved.length > 0 ? saved : DEFAULT_COURSES
  } catch { return DEFAULT_COURSES }
}

export default function CourseManagement() {
  const [courses, setCourses] = useState(loadCourses);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', instructor: '', duration: '', price: 0, category: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => { localStorage.setItem('icfy_courses', JSON.stringify(courses)) }, [courses])

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      setCourses(courses.map(c => c.id === editId ? { ...form, id: editId } : c));
    } else {
      setCourses([...courses, { ...form, id: Date.now() }]);
    }
    setForm({ name: '', description: '', instructor: '', duration: '', price: 0, category: '' });
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (c) => {
    setForm({ name: c.name, description: c.description, instructor: c.instructor, duration: c.duration, price: c.price, category: c.category });
    setEditId(c.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this course?')) return;
    setCourses(courses.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border-b-2 border-blue-900 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-blue-900">Course Management</h2>
        <p className="text-gray-500 text-sm mt-1">Create and manage courses</p>
      </div>
      <div className="bg-white rounded-xl shadow-md p-4 md:p-8">
        <button
          className="mb-4 px-4 py-2 rounded bg-blue-900 text-white font-bold"
          onClick={() => {
            setShowForm(!showForm);
            setForm({ name: '', description: '', instructor: '', duration: '', price: 0, category: '' });
            setEditId(null);
          }}
        >
          {showForm ? 'Cancel' : 'Add Course'}
        </button>
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              value={form.name}
              onChange={handleInputChange}
              placeholder="Course Name"
              className="w-full px-4 py-2 border rounded"
              required
            />
            <input
              name="category"
              value={form.category}
              onChange={handleInputChange}
              placeholder="Category"
              className="w-full px-4 py-2 border rounded"
              required
            />
            <input
              name="instructor"
              value={form.instructor}
              onChange={handleInputChange}
              placeholder="Instructor"
              className="w-full px-4 py-2 border rounded"
              required
            />
            <input
              name="duration"
              value={form.duration}
              onChange={handleInputChange}
              placeholder="Duration (e.g. 30 days)"
              className="w-full px-4 py-2 border rounded"
              required
            />
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleInputChange}
              placeholder="Price"
              className="w-full px-4 py-2 border rounded"
              min={0}
              required
            />
            <textarea
              name="description"
              value={form.description}
              onChange={handleInputChange}
              placeholder="Description"
              className="col-span-full px-4 py-2 border rounded"
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
        {courses.length === 0 ? (
          <div className="text-gray-600 text-center py-8">No courses found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((c) => (
              <div key={c.id} className="border rounded-lg p-4 hover:shadow-lg transition">
                <h3 className="font-bold text-lg mb-2">{c.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{c.description}</p>
                <div className="space-y-1 text-sm mb-4">
                  <p><span className="font-semibold">Instructor:</span> {c.instructor}</p>
                  <p><span className="font-semibold">Duration:</span> {c.duration}</p>
                  <p><span className="font-semibold">Price:</span> ₹{c.price}</p>
                  <p><span className="font-semibold">Category:</span> {c.category}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="flex-1 px-3 py-1 rounded bg-blue-900 text-white text-sm"
                    onClick={() => handleEdit(c)}
                  >Edit</button>
                  <button
                    className="flex-1 px-3 py-1 rounded bg-red-600 text-white text-sm"
                    onClick={() => handleDelete(c.id)}
                  >Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
