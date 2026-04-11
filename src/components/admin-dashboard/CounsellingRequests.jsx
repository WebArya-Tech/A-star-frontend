import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const SAMPLE_COUNSELLING = [
  { id: 'COUN001', name: 'Anika Verma', email: 'anika@example.com', phone: '+91 98765 43213', topic: 'Career Guidance', message: 'Need help choosing between engineering and medical counselling', status: 'pending', requestedOn: '2026-02-20' },
  { id: 'COUN002', name: 'Vikram Singh', email: 'vikram@example.com', phone: '+91 98765 43214', topic: 'Course Selection', message: 'Want guidance on SAT and GRE preparation path', status: 'in-progress', requestedOn: '2026-02-19' },
]

const loadCounselling = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('icfy_counselling_requests') || 'null')
    return saved && saved.length > 0 ? saved : SAMPLE_COUNSELLING
  } catch { return SAMPLE_COUNSELLING }
}

export default function CounsellingRequests() {
  const [requests, setRequests] = useState(loadCounselling)
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Reload from localStorage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('icfy_counselling_requests') || 'null')
    if (saved && saved.length > 0) setRequests(saved)
  }, [])

  const handleStatusUpdate = (id, status) => {
    const updated = requests.map(r => r.id === id ? { ...r, status } : r)
    setRequests(updated)
    localStorage.setItem('icfy_counselling_requests', JSON.stringify(updated))
  };

  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRequests = requests.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-blue-900">💼 Free Counselling Requests</h2>
        <p className="text-gray-600 mt-2">Manage counselling requests from students</p>
      </div>

      {requests.length > 0 ? (
        <>
          <div className="flex flex-wrap gap-2 mb-6">
            {['all', 'pending', 'in-progress', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => { setFilterStatus(status); setCurrentPage(1); }}
                className={`px-4 py-2 rounded ${ 
                  filterStatus === status
                    ? 'bg-blue-900 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4" style={{ borderLeftColor: '#ffc107' }}>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Pending</h3>
              <p className="text-4xl font-bold" style={{ color: '#ffc107' }}>
                {requests.filter(r => r.status === 'pending').length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4" style={{ borderLeftColor: '#1e3a8a' }}>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">In Progress</h3>
              <p className="text-4xl font-bold text-blue-900">
                {requests.filter(r => r.status === 'in-progress').length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4" style={{ borderLeftColor: '#28a745' }}>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Completed</h3>
              <p className="text-4xl font-bold" style={{ color: '#28a745' }}>
                {requests.filter(r => r.status === 'completed').length}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {paginatedRequests.length === 0 ? (
              <div className="text-center py-8 text-gray-600">No counselling requests found.</div>
            ) : (
              paginatedRequests.map((request) => (
                <div key={request.id} className="bg-white rounded-xl shadow-md p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-blue-900">{request.name}</h3>
                      <p className="text-sm text-gray-600">Topic: {request.topic}</p>
                    </div>
                    <select
                      value={request.status}
                      onChange={(e) => handleStatusUpdate(request.id, e.target.value)}
                      className="px-3 py-1 rounded border"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">📧 Email</p>
                      <p className="font-semibold">{request.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">📞 Phone</p>
                      <p className="font-semibold">{request.phone}</p>
                    </div>
                  </div>

                  <div className="mb-4 p-3 rounded-lg bg-gray-50">
                    <p className="text-sm text-gray-600 mb-1">Message:</p>
                    <p className="text-gray-700">{request.message}</p>
                  </div>

                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={() => toast.success('Assigning counsellor...')}
                      className="px-6 py-2 rounded-lg text-white font-semibold hover:opacity-90 bg-blue-900"
                    >
                      Assign Counsellor
                    </button>
                    <button
                      onClick={() => window.location.href = `mailto:${request.email}`}
                      className="px-6 py-2 rounded-lg font-semibold border-2"
                      style={{ borderColor: '#1e3a8a', color: '#1e3a8a' }}
                    >
                      Contact
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded ${ 
                    currentPage === i + 1
                      ? 'bg-blue-900 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8 text-gray-600">No counselling requests found.</div>
      )}
    </div>
  )
}
