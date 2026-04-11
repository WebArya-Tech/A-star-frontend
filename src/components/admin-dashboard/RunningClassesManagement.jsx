
import React, { useState, useEffect } from 'react';
import { runningClassesApi } from '../../api/runningClassesApi';
import toast from 'react-hot-toast';

const DEFAULT_CLASSES = [
  { id: 1, subject: 'UG Mathematics', level: 'Undergraduate', instructor: 'Ms. Neha Aggarwal', schedule: 'Mon, Wed, Fri - 6:00 PM IST', students: '12-15', description: 'Comprehensive mathematics coverage for B.Sc and B.Tech students', image: '', status: 'Active', enrolledStudents: [] },
  { id: 2, subject: 'UG Physics', level: 'Undergraduate', instructor: 'A Star Classes Faculty', schedule: 'Tue, Thu - 5:30 PM IST', students: '10-12', description: 'Advanced physics concepts with real-world applications', image: '', status: 'Active', enrolledStudents: [] },
  { id: 3, subject: 'UG Chemistry', level: 'Undergraduate', instructor: 'Dr. Priya', schedule: 'Mon, Wed - 4:00 PM IST', students: '8-10', description: 'Organic, inorganic and physical chemistry', image: '', status: 'Active', enrolledStudents: [] },
  { id: 4, subject: 'GRE Preparation', level: 'Professional', instructor: 'Mr. Rajan', schedule: 'Sat, Sun - 10:00 AM IST', students: '5-8', description: 'Complete GRE verbal and quantitative prep', image: '', status: 'Active', enrolledStudents: [] },
];

const EMPTY_FORM = {
  subject: '',
  level: 'Undergraduate',
  instructor: '',
  schedule: '',
  students: '0-0',
  description: '',
  image: '',
  status: 'Active',
};

export default function RunningClassesManagement() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [enrollmentRequests, setEnrollmentRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);

  // Fetch classes from backend; fall back to defaults if unavailable
  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await runningClassesApi.getAll();
      const data = res.data?.data || res.data || [];
      setClasses(Array.isArray(data) && data.length > 0 ? data : DEFAULT_CLASSES);
      // Keep localStorage in sync for other pages
      localStorage.setItem('icfy_running_classes', JSON.stringify(
        Array.isArray(data) && data.length > 0 ? data : DEFAULT_CLASSES
      ));
    } catch {
      // API unavailable — load from localStorage or use defaults
      try {
        const saved = JSON.parse(localStorage.getItem('icfy_running_classes') || 'null');
        setClasses(saved && saved.length > 0 ? saved : DEFAULT_CLASSES);
      } catch {
        setClasses(DEFAULT_CLASSES);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClasses(); }, []);

  // Load enrollment requests from localStorage
  useEffect(() => {
    const enrollments = JSON.parse(localStorage.getItem('runningClassEnrollments') || '[]');
    setEnrollmentRequests(enrollments);
  }, []);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await runningClassesApi.update(editId, form);
        toast.success('Class updated successfully');
      } else {
        await runningClassesApi.create(form);
        toast.success('Class created successfully');
      }
      await fetchClasses();
    } catch {
      // API failed — update locally and persist to localStorage
      if (editId) {
        const updated = classes.map(c =>
          c.id === editId ? { ...form, id: editId, enrolledStudents: c.enrolledStudents || [] } : c
        );
        setClasses(updated);
        localStorage.setItem('icfy_running_classes', JSON.stringify(updated));
        toast.success('Class updated (offline mode)');
      } else {
        const newClass = { ...form, id: Date.now(), enrolledStudents: [] };
        const updated = [...classes, newClass];
        setClasses(updated);
        localStorage.setItem('icfy_running_classes', JSON.stringify(updated));
        toast.success('Class created (offline mode)');
      }
    } finally {
      setSaving(false);
    }
    setForm(EMPTY_FORM);
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (c) => {
    setForm({
      subject: c.subject,
      level: c.level,
      instructor: c.instructor,
      schedule: c.schedule,
      students: c.students,
      description: c.description,
      image: c.image || '',
      status: c.status,
    });
    setEditId(c.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this class?')) return;
    try {
      await runningClassesApi.delete(id);
      toast.success('Class deleted successfully');
      await fetchClasses();
    } catch {
      const updated = classes.filter(c => c.id !== id);
      setClasses(updated);
      localStorage.setItem('icfy_running_classes', JSON.stringify(updated));
      toast.success('Class deleted (offline mode)');
    }
  };

  const handleApproveEnrollment = (enrollmentId) => {
    const updated = enrollmentRequests.map(req =>
      req.id === enrollmentId ? { ...req, status: 'Approved' } : req
    );
    setEnrollmentRequests(updated);
    localStorage.setItem('runningClassEnrollments', JSON.stringify(updated));
    toast.success('Enrollment approved');
  };

  const handleRejectEnrollment = (enrollmentId) => {
    const updated = enrollmentRequests.map(req =>
      req.id === enrollmentId ? { ...req, status: 'Rejected' } : req
    );
    setEnrollmentRequests(updated);
    localStorage.setItem('runningClassEnrollments', JSON.stringify(updated));
    toast.success('Enrollment rejected');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border-b-2 border-blue-900 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-blue-900">Running Classes Management</h2>
        <p className="text-gray-500 text-sm mt-1">Manage currently running classes, schedules, and student enrollments</p>
      </div>
      <div className="bg-white rounded-xl shadow-md p-4 md:p-8">
        <button
          className="mb-4 px-4 py-2 rounded font-bold text-white bg-blue-900 disabled:opacity-60"
          disabled={saving}
          onClick={() => {
            setShowForm(!showForm);
            setForm(EMPTY_FORM);
            setEditId(null);
          }}
        >
          {showForm ? 'Cancel' : '+ Add Running Class'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="subject"
              value={form.subject}
              onChange={handleInputChange}
              placeholder="Subject (e.g., UG Mathematics)"
              className="w-full px-4 py-2 border rounded"
              required
            />
            <select
              name="level"
              value={form.level}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
              required
            >
              <option value="Undergraduate">Undergraduate</option>
              <option value="Post-Graduate">Post-Graduate</option>
              <option value="Professional">Professional</option>
            </select>
            <input
              name="instructor"
              value={form.instructor}
              onChange={handleInputChange}
              placeholder="Instructor Name"
              className="w-full px-4 py-2 border rounded"
              required
            />
            <input
              name="schedule"
              value={form.schedule}
              onChange={handleInputChange}
              placeholder="Schedule (e.g., Mon, Wed, Fri - 6:00 PM IST)"
              className="w-full px-4 py-2 border rounded"
              required
            />
            <input
              name="students"
              value={form.students}
              onChange={handleInputChange}
              placeholder="Capacity (e.g., 12-15)"
              className="w-full px-4 py-2 border rounded"
              required
            />
            <select
              name="status"
              value={form.status}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Completed">Completed</option>
            </select>
            <textarea
              name="description"
              value={form.description}
              onChange={handleInputChange}
              placeholder="Class Description"
              className="w-full col-span-full px-4 py-2 border rounded"
              rows="3"
              required
            />
            <button
              type="submit"
              disabled={saving}
              className="col-span-full px-4 py-2 rounded text-white font-bold bg-blue-900 disabled:opacity-60"
            >
              {saving ? 'Saving...' : editId ? 'Update Class' : 'Create Class'}
            </button>
          </form>
        )}

        {loading ? (
          <div className="text-center py-10 text-blue-900 font-semibold">Loading classes...</div>
        ) : classes.length === 0 ? (
          <div className="text-gray-600 text-center py-8">No running classes found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Subject</th>
                  <th className="px-4 py-3 text-left font-semibold">Level</th>
                  <th className="px-4 py-3 text-left font-semibold">Instructor</th>
                  <th className="px-4 py-3 text-left font-semibold">Schedule</th>
                  <th className="px-4 py-3 text-left font-semibold">Capacity</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{c.subject}</td>
                    <td className="px-4 py-3">{c.level}</td>
                    <td className="px-4 py-3">{c.instructor}</td>
                    <td className="px-4 py-3 text-sm">{c.schedule}</td>
                    <td className="px-4 py-3">{c.students}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-1 rounded text-sm font-semibold text-white ${c.status === 'Active' ? 'bg-blue-900' : c.status === 'Inactive' ? 'bg-gray-500' : 'bg-green-600'
                          }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          className="px-3 py-1.5 rounded text-white font-bold text-sm bg-blue-900 hover:bg-blue-800 transition-colors flex-1 min-w-[60px]"
                          onClick={() => handleEdit(c)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-3 py-1.5 rounded bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-colors flex-1 min-w-[60px]"
                          onClick={() => handleDelete(c.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Enrollment Requests */}
      {enrollmentRequests.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-4 md:p-8">
          <h3 className="text-xl font-bold text-blue-900 mb-4">Enrollment Requests ({enrollmentRequests.length})</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Name</th>
                  <th className="px-4 py-3 text-left font-semibold">Email</th>
                  <th className="px-4 py-3 text-left font-semibold">Class</th>
                  <th className="px-4 py-3 text-left font-semibold">Date</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {enrollmentRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{req.fullName}</td>
                    <td className="px-4 py-3">{req.email}</td>
                    <td className="px-4 py-3">{req.classSubject}</td>
                    <td className="px-4 py-3 text-sm">{new Date(req.enrollmentDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold text-white ${req.status === 'Approved' ? 'bg-green-600' : req.status === 'Rejected' ? 'bg-red-600' : 'bg-yellow-500'
                        }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      {req.status === 'Pending' && (
                        <>
                          <button
                            className="px-3 py-1 rounded text-white font-bold text-sm bg-green-600"
                            onClick={() => handleApproveEnrollment(req.id)}
                          >
                            Approve
                          </button>
                          <button
                            className="px-3 py-1 rounded bg-red-600 text-white font-bold text-sm"
                            onClick={() => handleRejectEnrollment(req.id)}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}