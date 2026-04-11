import React, { useState } from 'react'

export default function QuestionManagement() {
  const [questions, setQuestions] = useState([
    { id: 1, student: 'Rahul Sharma', subject: 'Calculus Integration', category: 'Mathematics', question: 'How to solve integration by parts?', aiAnswer: 'Apply the formula twice...', tutorAnswer: null, status: 'ai-answered', needsReview: true },
    { id: 2, student: 'Priya Mehta', subject: 'Chemical Bonding', category: 'Chemistry', question: 'Difference between ionic and covalent bonds?', aiAnswer: 'Ionic bonds form between...', tutorAnswer: 'Let me explain...', status: 'tutor-reviewed', needsReview: false },
  ])
  const [filterStatus, setFilterStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const handleAddAnswer = (id) => {
    const answer = prompt('Enter tutor answer:')
    if (!answer) return
    setQuestions(questions.map(q => q.id === id ? { ...q, tutorAnswer: answer, status: 'tutor-reviewed' } : q))
  }

  const handleMarkReviewed = (id) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, needsReview: false } : q))
  }

  const filteredQuestions = filterStatus === 'all'
    ? questions
    : filterStatus === 'needs-review'
    ? questions.filter(q => q.needsReview)
    : questions.filter(q => q.status === filterStatus)

  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedQuestions = filteredQuestions.slice(startIndex, startIndex + itemsPerPage)



  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#dc3545'
      case 'ai-answered':
        return '#ffc107'
      case 'tutor-reviewed':
        return '#28a745'
      default:
        return '#1e3a8a'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-blue-900">❓ Q&A Management</h2>
        <p className="text-gray-600 mt-2">Review AI answers and provide tutor responses</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4" style={{ borderLeftColor: '#dc3545' }}>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Pending</h3>
          <p className="text-4xl font-bold" style={{ color: '#dc3545' }}>
            {questions.filter(q => q.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4" style={{ borderLeftColor: '#ffc107' }}>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">AI Answered</h3>
          <p className="text-4xl font-bold" style={{ color: '#ffc107' }}>
            {questions.filter(q => q.status === 'ai-answered').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4" style={{ borderLeftColor: '#28a745' }}>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Tutor Reviewed</h3>
          <p className="text-4xl font-bold" style={{ color: '#28a745' }}>
            {questions.filter(q => q.status === 'tutor-reviewed').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4" style={{ borderLeftColor: '#1e3a8a' }}>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Needs Review</h3>
          <p className="text-4xl font-bold text-blue-900">
            {questions.filter(q => q.needsReview).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 flex flex-wrap gap-3">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all border-2 border-blue-900 ${
            filterStatus === 'all' ? 'bg-blue-900 text-white shadow-md' : 'bg-transparent text-gray-700 hover:bg-blue-50'
          }`}
        >
          All Questions
        </button>
        <button
          onClick={() => setFilterStatus('needs-review')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all border-2 border-red-600 ${
            filterStatus === 'needs-review' ? 'bg-red-600 text-white shadow-md' : 'bg-transparent text-gray-700 hover:bg-red-50'
          }`}
        >
          Needs Review
        </button>
        <button
          onClick={() => setFilterStatus('pending')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all border-2 border-yellow-500 ${
            filterStatus === 'pending' ? 'bg-yellow-500 text-white shadow-md' : 'bg-transparent text-gray-700 hover:bg-yellow-50'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilterStatus('ai-answered')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all border-2 border-green-600 ${
            filterStatus === 'ai-answered' ? 'bg-green-600 text-white shadow-md' : 'bg-transparent text-gray-700 hover:bg-green-50'
          }`}
        >
          AI Answered
        </button>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {paginatedQuestions.map((q) => (
          <div
            key={q.id}
            className="bg-white rounded-xl shadow-md p-6 border-l-4"
            style={{ borderLeftColor: getStatusColor(q.status) }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h3 className="text-xl font-bold text-blue-900">{q.subject}</h3>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: getStatusColor(q.status) }}
                  >
                    {q.status.toUpperCase().replace('-', ' ')}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: '#eab308', color: 'white' }}>
                    {q.category}
                  </span>
                  {q.needsReview && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500 text-white">
                      REVIEW NEEDED
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  👨‍🎓 {q.student} • 📅 {q.askedOn}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <p className="font-semibold text-gray-700 mb-2">Question:</p>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{q.question}</p>
            </div>

            {q.aiAnswer && (
              <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: '#fefce8' }}>
                <p className="font-semibold mb-2 text-blue-900">🤖 AI Generated Answer:</p>
                <p className="text-gray-700">{q.aiAnswer}</p>
              </div>
            )}

            {q.tutorAnswer && (
              <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: '#e8f5f0' }}>
                <p className="font-semibold mb-2" style={{ color: '#28a745' }}>
                  👨‍🏫 Tutor Review by {q.reviewedBy}:
                </p>
                <p className="text-gray-700">{q.tutorAnswer}</p>
              </div>
            )}

            <div className="flex gap-3 mt-4">
              {q.needsReview && (
                <>
                  <button
                    className="px-6 py-2 rounded-lg text-white font-semibold hover:opacity-90 transition-all"
                    style={{ backgroundColor: '#28a745' }}
                  >
                    Approve AI Answer
                  </button>
                  <button
                    className="px-6 py-2 rounded-lg text-white font-semibold hover:opacity-90 transition-all bg-blue-900"
                  >
                    Add Tutor Review
                  </button>
                </>
              )}
              <button
                className="px-6 py-2 rounded-lg font-semibold transition-all border-2"
                style={{ borderColor: '#1e3a8a', color: '#1e3a8a' }}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
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
  )
}
