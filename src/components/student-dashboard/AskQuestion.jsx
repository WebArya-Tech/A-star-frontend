import React, { useState } from 'react'
import Pagination from '../ui/Pagination'

export default function AskQuestion() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 100
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [expandedQuestions, setExpandedQuestions] = useState({})
  const [questionForm, setQuestionForm] = useState({
    subject: '',
    category: 'academic',
    question: ''
  })

  const [questions, setQuestions] = useState([
    {
      id: 1,
      subject: 'Calculus Integration Problem',
      category: 'Mathematics',
      question: 'How do I solve integration by parts for ∫x²e^x dx?',
      answer: 'To solve ∫x²e^x dx using integration by parts, apply the formula twice. First, let u = x² and dv = e^x dx. This gives du = 2x dx and v = e^x. Following the integration by parts formula ∫u dv = uv - ∫v du, you get...',
      status: 'answered',
      askedOn: '2 days ago',
      answeredBy: 'AI Tutor',
      reviewedBy: 'Prof. Smith'
    },
    {
      id: 2,
      subject: 'Chemical Bonding Confusion',
      category: 'Chemistry',
      question: 'What is the difference between ionic and covalent bonds?',
      answer: 'Ionic bonds form between metals and non-metals through electron transfer, while covalent bonds form between non-metals through electron sharing...',
      status: 'answered',
      askedOn: '3 days ago',
      answeredBy: 'AI Tutor',
      reviewedBy: 'Dr. Johnson'
    },
    {
      id: 3,
      subject: 'Newton\'s Laws Application',
      category: 'Physics',
      question: 'How do I apply Newton\'s second law to an inclined plane problem?',
      answer: null,
      status: 'pending',
      askedOn: '1 hour ago',
      answeredBy: null,
      reviewedBy: null
    }
  ])

  const handleSubmit = (e) => {
    e.preventDefault()
    const newQuestion = {
      id: questions.length + 1,
      subject: questionForm.subject,
      category: questionForm.category,
      question: questionForm.question,
      answer: null,
      status: 'pending',
      askedOn: 'Just now',
      answeredBy: null,
      reviewedBy: null
    }
    setQuestions([newQuestion, ...questions])
    setQuestionForm({ subject: '', category: 'academic', question: '' })
    setIsModalOpen(false)
    alert('Question submitted successfully! You will be notified when it\'s answered.')
  }

  const toggleQuestion = (id) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const getStatusColor = (status) => {
    return status === 'answered' ? '#28a745' : '#ffc107'
  }

  // Pagination
  const totalPages = Math.ceil(questions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedQuestions = questions.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border-b-2 border-blue-900 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-blue-900">Ask a Question</h2>
        <p className="text-gray-500 text-sm mt-1">Get AI-powered answers reviewed by expert tutors</p>
      </div>

      {/* Post Question Button */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border-l-4" style={{ borderLeftColor: '#1e3a8a' }}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#1e3a8a' }}>
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Have a Question?</h3>
              <p className="text-gray-500 text-xs sm:text-sm">Get expert help from our tutors</p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg text-white font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
            style={{ backgroundColor: '#1e3a8a' }}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Post Question
          </button>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md sm:max-w-lg max-h-[85vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-3 sm:p-4 flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-bold" style={{ color: '#1e3a8a' }}>Post Your Question</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-3 sm:p-4">
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Subject/Topic</label>
                  <input
                    type="text"
                    value={questionForm.subject}
                    onChange={(e) => setQuestionForm({ ...questionForm, subject: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:border-blue-600 text-sm"
                    style={{ borderColor: '#1e3a8a' }}
                    placeholder="e.g., Quadratic Equations"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                  <select
                    value={questionForm.category}
                    onChange={(e) => setQuestionForm({ ...questionForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:border-blue-600 text-sm"
                    style={{ borderColor: '#1e3a8a' }}
                  >
                    <option value="academic">Academic</option>
                    <option value="homework">Homework Help</option>
                    <option value="concept">Concept Clarification</option>
                    <option value="exam">Exam Preparation</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Your Question</label>
                  <textarea
                    value={questionForm.question}
                    onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:border-blue-600 text-sm resize-none"
                    style={{ borderColor: '#1e3a8a' }}
                    rows="3"
                    placeholder="Describe your question..."
                    required
                  ></textarea>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 rounded-lg text-white font-semibold text-sm shadow-md hover:opacity-90 transition-all"
                    style={{ backgroundColor: '#1e3a8a' }}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* My Questions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-2xl font-bold mb-6" style={{ color: '#1e3a8a' }}>My Questions</h3>
        <div className="space-y-4">
          {paginatedQuestions.map((q) => (
            <div
              key={q.id}
              className="rounded-lg border-2 overflow-hidden transition-all duration-300"
              style={{
                backgroundColor: '#ffffff',
                borderColor: getStatusColor(q.status) + '20' // 20% opacity for border
              }}
            >
              {/* Question Header - Always Visible */}
              <div 
                className="p-4 sm:p-5 cursor-pointer flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors"
                onClick={() => toggleQuestion(q.id)}
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h4 className="font-bold text-base sm:text-lg text-gray-800">{q.subject}</h4>
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold text-white uppercase"
                      style={{ backgroundColor: getStatusColor(q.status) }}
                    >
                      {q.status}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-amber-100 text-amber-700 uppercase">
                      {q.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Asked {q.askedOn}</span>
                  </div>
                </div>
                <div 
                  className={`mt-1 transition-transform duration-300 ${expandedQuestions[q.id] ? 'rotate-180' : ''}`}
                  style={{ color: getStatusColor(q.status) }}
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Question Detail & Answer - Visible when expanded */}
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedQuestions[q.id] ? 'max-h-[1000px] border-t' : 'max-h-0'}`}
                style={{ borderColor: getStatusColor(q.status) + '20' }}
              >
                <div className="p-4 sm:p-5 space-y-4 bg-gray-50/50">
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Question:</p>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed bg-white p-3 rounded-lg border border-gray-100">
                      {q.question}
                    </p>
                  </div>

                  {q.answer ? (
                    <div className="space-y-3">
                      <p className="text-xs sm:text-sm font-bold text-blue-900 uppercase tracking-wider">Answer:</p>
                      <div className="bg-white p-4 rounded-lg border-l-4 shadow-sm" style={{ borderLeftColor: getStatusColor(q.status) }}>
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">{q.answer}</p>
                        <div className="flex flex-wrap gap-4 pt-3 border-t border-gray-100 text-[10px] sm:text-xs text-gray-500 italic">
                          <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                            Answered by: {q.answeredBy}
                          </span>
                          {q.reviewedBy && (
                            <span className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                              Reviewed by: {q.reviewedBy}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg flex items-center gap-3">
                      <span className="text-xl">⏳</span>
                      <p className="text-xs sm:text-sm text-amber-700 font-medium">
                        Our tutors are currently reviewing your question. You'll be notified soon!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={questions.length}
        itemsPerPage={itemsPerPage}
        alwaysShow={true}
      />
    </div>
  )
}
