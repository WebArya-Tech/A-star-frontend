import React, { useState, useEffect } from 'react'
import Pagination from '../ui/Pagination'

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
  const itemsPerPage = 100

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
    <div className=" sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
        <div className="bg-white  border-gray-100 rounded-xl p-2 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-blue-900">Student Management</h2>
        <p className="text-gray-500 text-xs sm:text-sm mt-1">Manage all registered students</p>
      </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-white font-bold shadow-md hover:opacity-90 transition-all w-full md:w-auto bg-blue-900 text-sm sm:text-base"
        >
          + Add New Student
        </button>
      </div>
      {true ? (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            <div className="bg-white rounded-xl shadow-md p-2 sm:p-3 border-l-4 border-blue-900">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-600 mb-1">Total Students</h3>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-900">{students.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-2 sm:p-3 border-l-4 border-blue-900">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-600 mb-1">Active Students</h3>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-green-700">
                {students.filter(s => s.status === 'active').length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-2 sm:p-3 border-l-4 border-blue-900">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-600 mb-1">Inactive Students</h3>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-600">
                {students.filter(s => s.status === 'inactive').length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-2 sm:p-3 border-l-4 border-blue-900">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-600 mb-1">Pending</h3>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-700">{students.filter(s => s.status === 'pending').length}</p>
            </div>
          </div>
          {/* Search and Filter */}
          <div className="bg-white rounded-xl shadow-md p-2 sm:p-3 md:p-2 ">
            <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
              <input
                type="text"
                placeholder="Search by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border-2 border-gray-100 focus:outline-none text-sm"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border-2 border-gray-100 focus:outline-none text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
          {/* Students Table */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden -mx-2 sm:mx-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-160">
                <thead>
                  <tr className="border-b-2 border-gray-100" style={{ backgroundColor: '#fefce8' }}>
                    <th className="text-left py-3 sm:py-4 px-3 sm:px-6 font-bold text-blue-900 text-xs sm:text-sm">Student ID</th>
                    <th className="text-left py-3 sm:py-4 px-3 sm:px-6 font-bold text-blue-900 text-xs sm:text-sm">Name</th>
                    <th className="text-left py-3 sm:py-4 px-3 sm:px-6 font-bold text-blue-900 text-xs sm:text-sm">Email</th>
                    <th className="text-left py-3 sm:py-4 px-3 sm:px-6 font-bold text-blue-900 text-xs sm:text-sm">Phone</th>
                    <th className="text-left py-3 sm:py-4 px-3 sm:px-6 font-bold text-blue-900 text-xs sm:text-sm">Status</th>
                    <th className="text-left py-3 sm:py-4 px-3 sm:px-6 font-bold text-blue-900 text-xs sm:text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStudents.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-6 sm:py-8 text-gray-600 text-sm">No students found</td>
                    </tr>
                  ) : (
                    paginatedStudents.map((student) => (
                      <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 sm:py-4 px-3 sm:px-6 font-mono text-xs sm:text-sm">{student.id}</td>
                        <td className="py-3 sm:py-4 px-3 sm:px-6 font-semibold text-xs sm:text-sm">{student.name}</td>
                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm">{student.email}</td>
                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm">{student.phone}</td>
                        <td className="py-3 sm:py-4 px-3 sm:px-6">
                          <select
                            value={student.status || 'active'}
                            onChange={(e) => handleStatusUpdate(student.id, e.target.value)}
                            className="px-2 py-1 rounded text-xs sm:text-sm border border-gray-100"
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
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredStudents.length}
              itemsPerPage={itemsPerPage}
              alwaysShow={true}
            />
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