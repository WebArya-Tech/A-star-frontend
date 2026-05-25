import React, { useState, useEffect } from 'react'
// import { homeworkApi } from '../../api/homeworkApi' // API file not created - using mock data
import { useAuth } from '../../context/AuthContext'
import Pagination from '../ui/Pagination'

export default function MyAssignments() {
  const { user } = useAuth()
  const [filter, setFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submittingId, setSubmittingId] = useState(null)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const itemsPerPage = 100

  useEffect(() => {
    fetchAssignments()
  }, [])

  const fetchAssignments = async () => {
    try {
      setLoading(true)
      setError(null)

      // Check localStorage for previously submitted assignments
      try {
        const saved = localStorage.getItem('icfy_student_assignments')
        if (saved) {
          const parsed = JSON.parse(saved)
          if (parsed && parsed.length > 0) {
            setAssignments(parsed)
            setLoading(false)
            return
          }
        }
      } catch (_) {}

      // Fallback to mock data
      setAssignments([
          {
            id: 1,
            title: 'Calculus Problem Set 3',
            course: 'Mathematics - Calculus',
            courseIcon: '📐',
            dueDate: 'Jan 25, 2026',
            daysLeft: 6,
            status: 'pending',
            priority: 'high',
            description: 'Solve problems 1-15 from Chapter 5: Integration',
            points: 100,
            attachments: 2
          },
          {
            id: 2,
            title: 'Physics Lab Report',
            course: 'Physics - Mechanics',
            courseIcon: '⚡',
            dueDate: 'Jan 23, 2026',
            daysLeft: 4,
            status: 'pending',
            priority: 'high',
            description: 'Submit lab report on Projectile Motion experiment',
            points: 50,
            attachments: 1
          },
          {
            id: 3,
            title: 'Chemistry Quiz 2',
            course: 'Organic Chemistry',
            courseIcon: '🧪',
            dueDate: 'Jan 28, 2026',
            daysLeft: 9,
            status: 'pending',
            priority: 'medium',
            description: 'Online quiz covering chapters 3-5',
            points: 30,
            attachments: 0
          },
          {
            id: 4,
            title: 'Data Structures Assignment 1',
            course: 'Computer Science',
            courseIcon: '💻',
            dueDate: 'Feb 1, 2026',
            daysLeft: 13,
            status: 'pending',
            priority: 'medium',
            description: 'Implement Binary Search Tree in Java',
            points: 100,
            attachments: 3
          },
          {
            id: 5,
            title: 'Linear Algebra Assignment',
            course: 'Mathematics - Calculus',
            courseIcon: '📐',
            dueDate: 'Submitted on Jan 15',
            daysLeft: null,
            status: 'submitted',
            priority: null,
            description: 'Matrix operations and transformations',
            points: 100,
            grade: 92,
            attachments: 2
          }
        ])
    } catch (err) {
      console.error('Error fetching assignments:', err)
      setError('Failed to load assignments')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitAssignment = async (assignmentId) => {
    try {
      setSubmittingId(assignmentId)

      // Validate: a file must be selected
      if (!selectedAssignment?.files || selectedAssignment.files.length === 0) {
        setError('Please select a file to upload before submitting.')
        return
      }

      // Update assignment status locally
      const submittedDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      const updatedAssignments = assignments.map(a =>
        a.id === assignmentId
          ? { ...a, status: 'submitted', daysLeft: null, priority: null, dueDate: `Submitted on ${submittedDate}` }
          : a
      )
      setAssignments(updatedAssignments)
      localStorage.setItem('icfy_student_assignments', JSON.stringify(updatedAssignments))
      setShowSubmitModal(false)
      setSelectedAssignment(null)
      setError(null)
    } catch (err) {
      console.error('Error submitting assignment:', err)
      setError('Failed to submit assignment. Please try again.')
    } finally {
      setSubmittingId(null)
    }
  }

  const handleViewDetails = (assignment) => {
    setSelectedAssignment(assignment)
    setShowSubmitModal(true)
  }

  const handleViewOnly = (assignment) => {
    setSelectedAssignment(assignment)
    setShowViewModal(true)
  }

  const filteredAssignments = filter === 'all'
    ? assignments
    : assignments.filter(assignment => assignment.status === filter)

  const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedAssignments = filteredAssignments.slice(startIndex, startIndex + itemsPerPage)

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#dc3545'
      case 'submitted':
        return '#28a745'
      default:
        return '#f59e0b'
    }
  }

  const getPriorityBadge = (priority) => {
    if (!priority) return null
    return (
      <span
        className="px-3 py-1 rounded-full text-xs font-bold text-white"
        style={{ backgroundColor: priority === 'high' ? '#dc3545' : '#f59e0b' }}
      >
        {priority === 'high' ? '⚠️ High Priority' : '📌 Medium'}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: '#1e3a8a', borderTopColor: '#f59e0b' }}></div>
          <p className="mt-4 text-lg font-semibold" style={{ color: '#1e3a8a' }}>Loading assignments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold" style={{ color: '#1e3a8a' }}>📝 My Assignments</h2>
          <p className="text-gray-600 mt-2">Manage your assignments and submissions</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-md border-l-4" style={{ borderLeftColor: '#dc3545' }}>
          <h3 className="text-2xl font-bold" style={{ color: '#dc3545' }}>
            {assignments.filter(a => a.status === 'pending').length}
          </h3>
          <p className="text-gray-600 text-sm">Pending</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border-l-4" style={{ borderLeftColor: '#28a745' }}>
          <h3 className="text-2xl font-bold" style={{ color: '#28a745' }}>
            {assignments.filter(a => a.status === 'submitted').length}
          </h3>
          <p className="text-gray-600 text-sm">Submitted</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border-l-4" style={{ borderLeftColor: '#1e3a8a' }}>
          <h3 className="text-2xl font-bold" style={{ color: '#1e3a8a' }}>
            {assignments.length}
          </h3>
          <p className="text-gray-600 text-sm">Total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 bg-white p-4 rounded-xl shadow-md">
        <button
          onClick={() => { setFilter('all'); setCurrentPage(1) }}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            filter === 'all' ? 'text-white shadow-md' : 'text-gray-700 hover:bg-gray-50'
          }`}
          style={{ backgroundColor: filter === 'all' ? '#1e3a8a' : 'transparent' }}
        >
          All
        </button>
        <button
          onClick={() => { setFilter('pending'); setCurrentPage(1) }}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            filter === 'pending' ? 'text-white shadow-md' : 'text-gray-700 hover:bg-gray-50'
          }`}
          style={{ backgroundColor: filter === 'pending' ? '#dc3545' : 'transparent' }}
        >
          Pending
        </button>
        <button
          onClick={() => { setFilter('submitted'); setCurrentPage(1) }}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            filter === 'submitted' ? 'text-white shadow-md' : 'text-gray-700 hover:bg-gray-50'
          }`}
          style={{ backgroundColor: filter === 'submitted' ? '#28a745' : 'transparent' }}
        >
          Submitted
        </button>
      </div>

      {/* Assignments Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2" style={{ borderBottomColor: '#1e3a8a' }}>
                <th className="text-left px-5 py-3 font-bold" style={{ color: '#1e3a8a' }}>Assignment</th>
                <th className="text-left px-5 py-3 font-bold" style={{ color: '#1e3a8a' }}>Course</th>
                <th className="text-left px-5 py-3 font-bold" style={{ color: '#1e3a8a' }}>Due Date</th>
                <th className="text-left px-5 py-3 font-bold" style={{ color: '#1e3a8a' }}>Points</th>
                <th className="text-left px-5 py-3 font-bold" style={{ color: '#1e3a8a' }}>Priority</th>
                <th className="text-left px-5 py-3 font-bold" style={{ color: '#1e3a8a' }}>Status</th>
                <th className="text-left px-5 py-3 font-bold" style={{ color: '#1e3a8a' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAssignments.map((assignment) => (
                <tr key={assignment.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{assignment.courseIcon}</span>
                      <div>
                        <p className="font-semibold text-gray-800">{assignment.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 max-w-[180px] truncate">{assignment.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-700">{assignment.course}</td>
                  <td className="px-5 py-4">
                    <p className="text-gray-700">{assignment.dueDate}</p>
                    {assignment.daysLeft && (
                      <p className="text-xs mt-0.5" style={{ color: assignment.daysLeft <= 5 ? '#dc3545' : '#28a745' }}>
                        {assignment.daysLeft} days left
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-4 font-bold" style={{ color: '#f59e0b' }}>
                    {assignment.grade !== undefined ? `${assignment.grade}/${assignment.points}` : assignment.points}
                  </td>
                  <td className="px-5 py-4">
                    {assignment.priority ? (
                      <span
                        className="px-2 py-1 rounded-full text-xs font-bold text-white whitespace-nowrap"
                        style={{ backgroundColor: assignment.priority === 'high' ? '#dc3545' : '#f59e0b' }}
                      >
                        {assignment.priority === 'high' ? 'High' : 'Medium'}
                      </span>
                    ) : <span className="text-gray-400 text-xs">—</span>}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="px-2 py-1 rounded-full text-xs font-bold text-white whitespace-nowrap"
                      style={{ backgroundColor: getStatusColor(assignment.status) }}
                    >
                      {assignment.status === 'submitted' ? '✓ Submitted' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      {assignment.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleViewDetails(assignment)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold border-2 hover:bg-[#196d83] hover:text-white transition-all whitespace-nowrap"
                            style={{ borderColor: '#1e3a8a', color: '#1e3a8a', backgroundColor: 'white' }}
                          >
                            Submit
                          </button>
                          <button
                            onClick={() => handleViewOnly(assignment)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold border-2 hover:bg-gray-100 transition-all whitespace-nowrap"
                            style={{ borderColor: '#1e3a8a', color: '#1e3a8a', backgroundColor: 'white' }}
                          >
                            View
                          </button>
                        </>
                      )}
                      {assignment.status === 'submitted' && (
                        <button
                          onClick={() => handleViewOnly(assignment)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold border-2 hover:bg-gray-100 transition-all whitespace-nowrap"
                          style={{ borderColor: '#28a745', color: '#28a745', backgroundColor: 'white' }}
                        >
                          View
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredAssignments.length}
        itemsPerPage={itemsPerPage}
        alwaysShow={true}
      />

      {/* Submit Modal */}
      {showSubmitModal && selectedAssignment && (
        <div className="fixed inset-0  flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4" style={{ color: '#1e3a8a' }}>
              Submit: {selectedAssignment.title}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Upload Files
                </label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => {
                    setSelectedAssignment({ ...selectedAssignment, files: e.target.files })
                  }}
                  className="block w-full border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Comments (Optional)
                </label>
                <textarea
                  className="block w-full border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
                  rows="3"
                  placeholder="Add any comments..."
                ></textarea>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 px-4 py-2 rounded-lg font-semibold border-2 transition-all hover:bg-gray-50"
                style={{ borderColor: '#1e3a8a', color: '#1e3a8a', backgroundColor: 'white' }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmitAssignment(selectedAssignment.id)}
                disabled={submittingId === selectedAssignment.id}
                className="flex-1 px-4 py-2 rounded-lg font-semibold border-2 transition-all hover:opacity-90 disabled:opacity-50"
                style={{ borderColor: '#1e3a8a', backgroundColor: '#1e3a8a', color: 'white' }}
              >
                {submittingId === selectedAssignment.id ? '⏳ Submitting...' : '✓ Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showViewModal && selectedAssignment && (
        <div className="fixed inset-0  flex items-center justify-center z-50 p-4" onClick={() => setShowViewModal(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold" style={{ color: '#1e3a8a' }}>Assignment Details</h3>
              <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl" style={{ backgroundColor: '#fef9f0' }}>
                {selectedAssignment.courseIcon}
              </div>
              <div>
                <h4 className="font-bold text-base" style={{ color: '#1e3a8a' }}>{selectedAssignment.title}</h4>
                <p className="text-xs text-gray-500">📚 {selectedAssignment.course}</p>
              </div>
            </div>
            <div className="h-px bg-gray-100 mb-4" />
            <p className="text-sm text-gray-700 mb-4">{selectedAssignment.description}</p>
            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#fef9f0' }}>
                <p className="text-xs text-gray-500 mb-1">Due Date</p>
                <p className="font-bold text-gray-800">{selectedAssignment.dueDate}</p>
                {selectedAssignment.daysLeft && (
                  <p className="text-xs mt-1" style={{ color: selectedAssignment.daysLeft <= 5 ? '#dc3545' : '#28a745' }}>
                    {selectedAssignment.daysLeft} days left
                  </p>
                )}
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#fef9f0' }}>
                <p className="text-xs text-gray-500 mb-1">Points</p>
                <p className="font-bold text-gray-800">{selectedAssignment.points}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#fef9f0' }}>
                <p className="text-xs text-gray-500 mb-1">Attachments</p>
                <p className="font-bold text-gray-800">📎 {selectedAssignment.attachments}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: selectedAssignment.status === 'submitted' ? '#e8f5e9' : '#fef9f0' }}>
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <p className="font-bold" style={{ color: selectedAssignment.status === 'submitted' ? '#28a745' : '#dc3545' }}>
                  {selectedAssignment.status === 'submitted' ? '✓ Submitted' : 'Pending'}
                </p>
              </div>
              {selectedAssignment.grade !== undefined && (
                <div className="col-span-2 p-3 rounded-lg" style={{ backgroundColor: '#e8f5e9' }}>
                  <p className="text-xs text-gray-500 mb-1">Grade</p>
                  <p className="font-bold" style={{ color: '#28a745' }}>
                    {selectedAssignment.grade}/{selectedAssignment.points} ({Math.round((selectedAssignment.grade / selectedAssignment.points) * 100)}%)
                  </p>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setShowViewModal(false)}
                className="flex-1 py-2 rounded-lg font-semibold border-2 transition-all hover:bg-gray-50"
                style={{ borderColor: '#1e3a8a', color: '#1e3a8a', backgroundColor: 'white' }}
              >
                Close
              </button>
              {selectedAssignment.status === 'pending' && (
                <button
                  onClick={() => { setShowViewModal(false); handleViewDetails(selectedAssignment) }}
                  className="flex-1 py-2 rounded-lg font-semibold border-2 transition-all hover:opacity-90"
                  style={{ borderColor: '#1e3a8a', backgroundColor: '#1e3a8a', color: 'white' }}
                >
                  📤 Submit
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
