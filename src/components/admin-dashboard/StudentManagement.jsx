import React, { useState, useEffect } from 'react'

const SAMPLE_STUDENTS = [
  { id: 'STU001', name: 'Rahul Sharma', email: 'rahul@example.com', phone: '+91 98765 43210', status: 'active', enrollmentDate: '2026-01-10' },
  { id: 'STU002', name: 'Priya Mehta', email: 'priya@example.com', phone: '+91 98765 43211', status: 'active', enrollmentDate: '2026-01-15' },
  { id: 'STU003', name: 'Amit Kumar', email: 'amit@example.com', phone: '+91 98765 43212', status: 'inactive', enrollmentDate: '2026-01-20' },
]

const loadStudents = () => {
  try {
    // Check if admin has manually managed students
    const adminStudents = JSON.parse(localStorage.getItem('icfy_admin_students') || 'null')
    if (adminStudents && adminStudents.length > 0) return adminStudents
    // Map icfy_users (registered via signup) to student format
    const registered = JSON.parse(localStorage.getItem('icfy_users') || '[]')
    const mapped = registered
      .filter(u => u.role !== 'admin')
      .map(u => ({
        id: u.studentId || u.id,
        name: u.fullName || u.name || '',
        email: u.email || '',
        phone: u.phone || '',
        status: u.status || 'active',
        enrollmentDate: u.enrollmentDate || new Date().toISOString().split('T')[0],
      }))
    return mapped.length > 0 ? mapped : SAMPLE_STUDENTS
  } catch { return SAMPLE_STUDENTS }
}

export default function StudentManagement() {
  const [students, setStudents] = useState(loadStudents);
  
  // Persist to localStorage whenever students changes
  useEffect(() => {
    localStorage.setItem('icfy_admin_students', JSON.stringify(students))
  }, [students])
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         String(student.id).includes(searchTerm)
    const matchesFilter = filterStatus === 'all' || student.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage)

  const handleAddStudent = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const newStudent = {
      id: `STU${Date.now()}`,
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      status: 'active',
      enrollmentDate: new Date().toISOString().split('T')[0],
    }
    setStudents(prev => [...prev, newStudent])
    // Also register in icfy_users so student can log in
    const users = JSON.parse(localStorage.getItem('icfy_users') || '[]')
    users.push({
      fullName: newStudent.name, email: newStudent.email,
      phone: newStudent.phone, studentId: newStudent.id, id: newStudent.id,
      password: formData.get('password') || '123456',
      role: 'student', enrollmentDate: newStudent.enrollmentDate, status: 'active'
    })
    localStorage.setItem('icfy_users', JSON.stringify(users))
    setShowAddModal(false)
    alert('Student added successfully!')
  };

  const handleDeleteStudent = (id) => {
    if (!window.confirm('Delete this student?')) return;
    setStudents(students.filter(s => s.id !== id))
    alert('Student deleted successfully!');
  };

  const handleStatusUpdate = (id, newStatus) => {
    setStudents(students.map(s => s.id === id ? { ...s, status: newStatus } : s))
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="bg-white border-b-2 border-blue-900 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-blue-900">Student Management</h2>
        <p className="text-gray-500 text-sm mt-1">Manage all registered students</p>
      </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 rounded-lg text-white font-bold shadow-md hover:opacity-90 transition-all w-full md:w-auto bg-blue-900"
        >
          + Add New Student
        </button>
      </div>
      {true ? (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4" style={{ borderLeftColor: '#1e3a8a' }}>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Students</h3>
              <p className="text-4xl font-bold text-blue-900">{students.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4" style={{ borderLeftColor: '#28a745' }}>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Active Students</h3>
              <p className="text-4xl font-bold" style={{ color: '#28a745' }}>
                {students.filter(s => s.status === 'active').length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4" style={{ borderLeftColor: '#ffc107' }}>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Inactive Students</h3>
              <p className="text-4xl font-bold" style={{ color: '#ffc107' }}>
                {students.filter(s => s.status === 'inactive').length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4" style={{ borderLeftColor: '#eab308' }}>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Pending</h3>
              <p className="text-4xl font-bold" style={{ color: '#eab308' }}>{students.filter(s => s.status === 'pending').length}</p>
            </div>
          </div>
          {/* Search and Filter */}
          <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Search by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg border-2 focus:outline-none"
                style={{ borderColor: '#1e3a8a' }}
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 rounded-lg border-2 focus:outline-none"
                style={{ borderColor: '#1e3a8a' }}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
          {/* Students Table */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2" style={{ borderColor: '#1e3a8a', backgroundColor: '#fefce8' }}>
                    <th className="text-left py-4 px-6 font-bold text-blue-900">Student ID</th>
                    <th className="text-left py-4 px-6 font-bold text-blue-900">Name</th>
                    <th className="text-left py-4 px-6 font-bold text-blue-900">Email</th>
                    <th className="text-left py-4 px-6 font-bold text-blue-900">Phone</th>
                    <th className="text-left py-4 px-6 font-bold text-blue-900">Status</th>
                    <th className="text-left py-4 px-6 font-bold text-blue-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStudents.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-gray-600">No students found</td>
                    </tr>
                  ) : (
                    paginatedStudents.map((student) => (
                      <tr key={student.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-6 font-mono text-sm">{student.id}</td>
                        <td className="py-4 px-6 font-semibold">{student.name}</td>
                        <td className="py-4 px-6">{student.email}</td>
                        <td className="py-4 px-6">{student.phone}</td>
                        <td className="py-4 px-6">
                          <select
                            value={student.status || 'active'}
                            onChange={(e) => handleStatusUpdate(student.id, e.target.value)}
                            className="px-2 py-1 rounded text-sm border"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="pending">Pending</option>
                          </select>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2 flex-wrap">
                            <button
                              className="px-3 py-1 rounded-lg text-xs font-semibold text-white hover:opacity-90 bg-blue-900"
                            >
                              View
                            </button>
                            <button
                              className="px-3 py-1 rounded-lg text-xs font-semibold text-white hover:opacity-90"
                              style={{ backgroundColor: '#dc3545' }}
                              onClick={() => handleDeleteStudent(student.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 p-6 flex-wrap">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50"
                  style={{ 
                    backgroundColor: currentPage === 1 ? '#e0e0e0' : '#1e3a8a',
                    color: currentPage === 1 ? '#666' : 'white'
                  }}
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className="px-4 py-2 rounded-lg font-semibold transition-all"
                    style={{
                      backgroundColor: currentPage === index + 1 ? '#1e3a8a' : 'white',
                      color: currentPage === index + 1 ? 'white' : '#1e3a8a',
                      border: '2px solid #1e3a8a'
                    }}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50"
                  style={{ 
                    backgroundColor: currentPage === totalPages ? '#e0e0e0' : '#1e3a8a',
                    color: currentPage === totalPages ? '#666' : 'white'
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-gray-600">No students found.</div>
      )}
      {/* Add Student Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-6 text-blue-900">Add New Student</h2>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none"
                    style={{ borderColor: '#1e3a8a' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none"
                    style={{ borderColor: '#1e3a8a' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none"
                    style={{ borderColor: '#1e3a8a' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none"
                    style={{ borderColor: '#1e3a8a' }}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 rounded-lg font-bold border-2 transition-all"
                  style={{ borderColor: '#dc3545', color: '#dc3545' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-lg text-white font-bold shadow-md hover:opacity-90 transition-all bg-blue-900"
                >
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}