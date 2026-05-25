import React, { useState, useEffect } from 'react'
import Pagination from '../ui/Pagination'

const STATIC_HOMEWORK = [
  { id: 1, subject: 'Mathematics', title: 'Calculus Problem Set 5', description: 'Solve problems 1-15 from Chapter 8. Focus on integration techniques.', dueDate: 'Mar 10, 2026', status: 'pending', marks: 25, assignedDate: 'Feb 28, 2026' },
  { id: 2, subject: 'Physics', title: 'Thermodynamics Assignment', description: 'Write a report on the First Law of Thermodynamics with examples.', dueDate: 'Mar 15, 2026', status: 'pending', marks: 30, assignedDate: 'Mar 01, 2026' },
  { id: 3, subject: 'Chemistry', title: 'Organic Chemistry Worksheet', description: 'Complete the reaction mechanism worksheet for Chapter 5.', dueDate: 'Mar 20, 2026', status: 'pending', marks: 20, assignedDate: 'Mar 05, 2026' },
]

const loadHomework = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('icfy_homework') || 'null')
    if (saved && saved.length > 0) {
      return saved.map(h => ({
        ...h,
        status: h.status || 'pending',
        marks: h.marks || 10,
        assignedDate: h.assignedDate || 'Not assigned',
      }))
    }
  } catch {}
  return STATIC_HOMEWORK
}

export default function Homework() {
  const [filter, setFilter] = useState('all')
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedHomework, setSelectedHomework] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [homework, setHomework] = useState(loadHomework)
  const itemsPerPage = 100

  // Reload when admin updates homework
  useEffect(() => {
    setHomework(loadHomework())
  }, [])

  const filteredHomework = filter === 'all' ? homework : homework.filter(h => h.status === filter)
  const totalPages = Math.ceil(filteredHomework.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedHomework = filteredHomework.slice(startIndex, endIndex)

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#ffc107'
      case 'overdue':
        return '#dc3545'
      case 'submitted':
        return '#28a745'
      default:
        return '#1e3a8a'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending'
      case 'overdue':
        return 'Overdue'
      case 'submitted':
        return 'Submitted'
      default:
        return status
    }
  }

  const handleSubmit = (hw) => {
    setSelectedHomework(hw)
    setShowSubmitModal(true)
  }

  const handleSubmitHomework = (e) => {
    e.preventDefault()
    const submittedDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    const updatedHomework = homework.map(h =>
      h.id === selectedHomework.id
        ? { ...h, status: 'submitted', submittedDate, submittedFile: selectedFile ? selectedFile.name : '' }
        : h
    )
    setHomework(updatedHomework)
    localStorage.setItem('icfy_homework', JSON.stringify(updatedHomework))
    setSelectedFile(null)
    setShowSubmitModal(false)
    setSelectedHomework(null)
  }

  const pendingCount = homework.filter(h => h.status === 'pending').length
  const overdueCount = homework.filter(h => h.status === 'overdue').length
  const submittedCount = homework.filter(h => h.status === 'submitted').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold" style={{ color: '#1e3a8a' }}>Homework</h2>
        <p className="text-gray-600 mt-2">Track and submit your homework assignments</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4" style={{ borderLeftColor: '#ffc107' }}>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Pending</h3>
          <p className="text-4xl font-bold" style={{ color: '#ffc107' }}>{pendingCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4" style={{ borderLeftColor: '#dc3545' }}>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Overdue</h3>
          <p className="text-4xl font-bold" style={{ color: '#dc3545' }}>{overdueCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4" style={{ borderLeftColor: '#28a745' }}>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Submitted</h3>
          <p className="text-4xl font-bold" style={{ color: '#28a745' }}>{submittedCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4" style={{ borderLeftColor: '#1e3a8a' }}>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Total</h3>
          <p className="text-4xl font-bold" style={{ color: '#1e3a8a' }}>{homework.length}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
              filter === 'all' ? 'text-white shadow-md' : 'text-gray-700 hover:bg-gray-50'
            }`}
            style={{ backgroundColor: filter === 'all' ? '#1e3a8a' : 'transparent' }}
          >
            All ({homework.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
              filter === 'pending' ? 'text-white shadow-md' : 'text-gray-700 hover:bg-gray-50'
            }`}
            style={{ backgroundColor: filter === 'pending' ? '#ffc107' : 'transparent' }}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('overdue')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
              filter === 'overdue' ? 'text-white shadow-md' : 'text-gray-700 hover:bg-gray-50'
            }`}
            style={{ backgroundColor: filter === 'overdue' ? '#dc3545' : 'transparent' }}
          >
            Overdue ({overdueCount})
          </button>
          <button
            onClick={() => setFilter('submitted')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
              filter === 'submitted' ? 'text-white shadow-md' : 'text-gray-700 hover:bg-gray-50'
            }`}
            style={{ backgroundColor: filter === 'submitted' ? '#28a745' : 'transparent' }}
          >
            Submitted
          </button>
        </div>
      </div>

      {/* Homework Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2" style={{ borderBottomColor: '#1e3a8a' }}>
                <th className="text-left px-5 py-3 font-bold" style={{ color: '#1e3a8a' }}>Title</th>
                <th className="text-left px-5 py-3 font-bold" style={{ color: '#1e3a8a' }}>Subject</th>
                <th className="text-left px-5 py-3 font-bold" style={{ color: '#1e3a8a' }}>Assigned</th>
                <th className="text-left px-5 py-3 font-bold" style={{ color: '#1e3a8a' }}>Due Date</th>
                <th className="text-left px-5 py-3 font-bold" style={{ color: '#1e3a8a' }}>Marks</th>
                <th className="text-left px-5 py-3 font-bold" style={{ color: '#1e3a8a' }}>Status</th>
                <th className="text-left px-5 py-3 font-bold" style={{ color: '#1e3a8a' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedHomework.map((hw, idx) => (
                <tr
                  key={hw.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-800">{hw.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 max-w-[180px] truncate">{hw.description}</p>
                  </td>
                  <td className="px-5 py-4 font-medium text-gray-700">{hw.subject}</td>
                  <td className="px-5 py-4 text-gray-600">{hw.assignedDate}</td>
                  <td className="px-5 py-4 text-gray-600">{hw.dueDate}</td>
                  <td className="px-5 py-4 font-bold" style={{ color: '#f59e0b' }}>
                    {hw.grade != null ? `${hw.grade}/${hw.marks}` : hw.marks}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold text-white whitespace-nowrap"
                      style={{ backgroundColor: getStatusColor(hw.status) }}
                    >
                      {getStatusText(hw.status)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setSelectedHomework(hw); setShowDetailsModal(true) }}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all hover:bg-gray-50 whitespace-nowrap"
                        style={{ borderColor: '#f59e0b', color: '#f59e0b', backgroundColor: 'white' }}
                      >
                        View
                      </button>
                      {(hw.status === 'pending' || hw.status === 'overdue') && (
                        <button
                          onClick={() => handleSubmit(hw)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all hover:bg-blue-800 hover:text-white whitespace-nowrap"
                          style={{ borderColor: '#1e3a8a', color: '#1e3a8a', backgroundColor: 'white' }}
                        >
                          Submit
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
        totalItems={filteredHomework.length}
        itemsPerPage={100}
        alwaysShow={true}
      />

      {/* View Details Modal */}
      {showDetailsModal && selectedHomework && (
        <div
          className="fixed inset-0  flex items-center justify-center z-50"
          onClick={() => setShowDetailsModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: '#1e3a8a' }}>Homework Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-2xl text-gray-400 hover:text-gray-600 transition"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#1e3a8a' }}>{selectedHomework.title}</h3>
                <p className="text-gray-700 mb-3">{selectedHomework.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: '#fef9f0' }}>
                  <p className="text-xs text-gray-600 font-semibold">Subject</p>
                  <p className="text-lg font-bold" style={{ color: '#1e3a8a' }}>{selectedHomework.subject}</p>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: '#fef9f0' }}>
                  <p className="text-xs text-gray-600 font-semibold">Marks</p>
                  <p className="text-lg font-bold" style={{ color: '#f59e0b' }}>{selectedHomework.marks} Marks</p>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: '#fef9f0' }}>
                  <p className="text-xs text-gray-600 font-semibold">Assigned Date</p>
                  <p className="text-lg font-bold" style={{ color: '#1e3a8a' }}>{selectedHomework.assignedDate}</p>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: '#fef9f0' }}>
                  <p className="text-xs text-gray-600 font-semibold">Due Date</p>
                  <p className="text-lg font-bold" style={{ color: '#dc3545' }}>{selectedHomework.dueDate}</p>
                </div>
              </div>
              
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#e8f5f0' }}>
                <p className="text-sm font-semibold mb-1" style={{ color: '#1e3a8a' }}>Status</p>
                <span
                  className="px-3 py-1 rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: getStatusColor(selectedHomework.status) }}
                >
                  {getStatusText(selectedHomework.status)}
                </span>
              </div>
              
              {selectedHomework.submittedDate && (
                <div className="p-4 rounded-lg" style={{ backgroundColor: '#d4edda' }}>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Submitted Date</p>
                  <p className="text-lg font-bold" style={{ color: '#28a745' }}>{selectedHomework.submittedDate}</p>
                </div>
              )}
              
              {selectedHomework.grade !== null && selectedHomework.grade !== undefined && (
                <div className="p-4 rounded-lg" style={{ backgroundColor: '#d4edda' }}>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Grade</p>
                  <p className="text-lg font-bold" style={{ color: '#28a745' }}>{selectedHomework.grade}/{selectedHomework.marks}</p>
                </div>
              )}
              
              {selectedHomework.feedback && (
                <div className="p-4 rounded-lg" style={{ backgroundColor: '#e8f4f8' }}>
                  <p className="text-sm font-semibold mb-2" style={{ color: '#1e3a8a' }}>Teacher's Feedback</p>
                  <p className="text-sm text-gray-700">{selectedHomework.feedback}</p>
                </div>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="flex-1 py-3 rounded-lg font-bold border-2 transition-all hover:bg-gray-50"
                style={{ borderColor: '#1e3a8a', color: '#1e3a8a', backgroundColor: 'white' }}
              >
                Close
              </button>
              {(selectedHomework.status === 'pending' || selectedHomework.status === 'overdue') && (
                <button
                  onClick={() => {
                    setShowDetailsModal(false)
                    handleSubmit(selectedHomework)
                  }}
                  className="flex-1 py-3 rounded-lg font-bold border-2 transition-all hover:bg-blue-800 hover:text-white"
                  style={{ borderColor: '#1e3a8a', color: '#1e3a8a', backgroundColor: 'white' }}
                >
                  Submit Homework
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Submit Homework Modal */}
      {showSubmitModal && selectedHomework && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowSubmitModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-1">Submit Homework</h2>
              <p className="text-gray-500 text-sm mb-4">{selectedHomework.title}</p>

              <form onSubmit={handleSubmitHomework} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>
                  <input
                    type="file"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-gray-400 text-sm"
                    required
                    onChange={(e) => setSelectedFile(e.target.files[0] || null)}
                  />
                  {selectedFile && (
                    <p className="text-xs mt-1 text-green-600">Selected: {selectedFile.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Comments (Optional)</label>
                  <textarea
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-gray-400 text-sm resize-none"
                    rows="3"
                    placeholder="Add any comments..."
                  ></textarea>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setShowSubmitModal(false); setSelectedFile(null); }}
                    className="flex-1 py-2 rounded-lg font-medium text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-lg font-medium text-sm bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
