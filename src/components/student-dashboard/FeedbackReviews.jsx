import React, { useState } from 'react'
import Pagination from '../ui/Pagination'

export default function FeedbackReviews() {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [myReviewsPage, setMyReviewsPage] = useState(1)
  const [allReviewsPage, setAllReviewsPage] = useState(1)
  const itemsPerPage = 100
  const [feedbackForm, setFeedbackForm] = useState({
    course: '',
    rating: 5,
    category: 'course',
    feedback: ''
  })

  const myReviews = [
    {
      id: 1,
      course: 'Mathematics Advanced',
      rating: 5,
      feedback: 'Excellent teaching methodology! The concepts are explained very clearly.',
      date: 'Jan 15, 2026',
      category: 'Course Quality',
      response: 'Thank you for your feedback! We\'re glad you\'re enjoying the course.'
    },
    {
      id: 2,
      course: 'Physics Fundamentals',
      rating: 4,
      feedback: 'Good course content but would appreciate more practice problems.',
      date: 'Jan 10, 2026',
      category: 'Course Content',
      response: null
    }
  ]

  const allReviews = [
    {
      id: 1,
      student: 'Rahul S.',
      course: 'Chemistry Basics',
      rating: 5,
      feedback: 'Outstanding tutor! Very patient and explains everything in detail.',
      date: '2 days ago'
    },
    {
      id: 2,
      student: 'Priya M.',
      course: 'Computer Science',
      rating: 5,
      feedback: 'Best online learning platform. Highly recommended!',
      date: '3 days ago'
    },
    {
      id: 3,
      student: 'Amit K.',
      course: 'Mathematics Advanced',
      rating: 4,
      feedback: 'Great teaching style and the practice materials are very helpful.',
      date: '5 days ago'
    },
    {
      id: 4,
      student: 'Sneha P.',
      course: 'Physics Fundamentals',
      rating: 5,
      feedback: 'The live classes are interactive and engaging. Love it!',
      date: '1 week ago'
    }
  ]

  const handleSubmitFeedback = (e) => {
    e.preventDefault()
    alert('Thank you for your feedback! We value your input.')
    setShowFeedbackForm(false)
    setFeedbackForm({ course: '', rating: 5, category: 'course', feedback: '' })
  }

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className="text-2xl"
            style={{ color: star <= rating ? '#f59e0b' : '#e0e0e0' }}
          >
            ★
          </span>
        ))}
      </div>
    )
  }

  const averageRating = (allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length).toFixed(1)

  // Pagination for My Reviews
  const myReviewsTotalPages = Math.ceil(myReviews.length / itemsPerPage)
  const myReviewsStartIndex = (myReviewsPage - 1) * itemsPerPage
  const paginatedMyReviews = myReviews.slice(myReviewsStartIndex, myReviewsStartIndex + itemsPerPage)

  // Pagination for All Reviews
  const allReviewsTotalPages = Math.ceil(allReviews.length / itemsPerPage)
  const allReviewsStartIndex = (allReviewsPage - 1) * itemsPerPage
  const paginatedAllReviews = allReviews.slice(allReviewsStartIndex, allReviewsStartIndex + itemsPerPage)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold" style={{ color: '#1e3a8a' }}>Feedback & Reviews</h2>
          <p className="text-gray-600 mt-2">Share your experience and read reviews from other students</p>
        </div>
        <button
          onClick={() => setShowFeedbackForm(true)}
          className="px-6 py-3 rounded-lg text-white font-bold shadow-md hover:opacity-90 transition-all"
          style={{ backgroundColor: '#1e3a8a' }}
        >
          Write Review
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4" style={{ borderLeftColor: '#f59e0b' }}>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Average Rating</h3>
          <div className="flex items-center gap-3">
            <p className="text-4xl font-bold" style={{ color: '#f59e0b' }}>{averageRating}</p>
            <span className="text-3xl" style={{ color: '#f59e0b' }}>★</span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4" style={{ borderLeftColor: '#1e3a8a' }}>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Reviews</h3>
          <p className="text-4xl font-bold" style={{ color: '#1e3a8a' }}>{allReviews.length + myReviews.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4" style={{ borderLeftColor: '#28a745' }}>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">My Reviews</h3>
          <p className="text-4xl font-bold" style={{ color: '#28a745' }}>{myReviews.length}</p>
        </div>
      </div>

      {/* My Reviews Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 pt-5 pb-2 flex items-center justify-between">
          <h3 className="text-xl font-bold" style={{ color: '#1e3a8a' }}>My Reviews</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2" style={{ borderBottomColor: '#1e3a8a' }}>
                <th className="text-left px-5 py-3 font-bold" style={{ color: '#1e3a8a' }}>Course</th>
                <th className="text-left px-5 py-3 font-bold" style={{ color: '#1e3a8a' }}>Rating</th>
                <th className="text-left px-5 py-3 font-bold" style={{ color: '#1e3a8a' }}>Category</th>
                <th className="text-left px-5 py-3 font-bold" style={{ color: '#1e3a8a' }}>Date</th>
                <th className="text-left px-5 py-3 font-bold" style={{ color: '#1e3a8a' }}>Feedback</th>
                <th className="text-left px-5 py-3 font-bold" style={{ color: '#1e3a8a' }}>Response</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMyReviews.map((review) => (
                <tr key={review.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 font-semibold text-gray-800">{review.course}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <span key={s} style={{ color: s <= review.rating ? '#f59e0b' : '#e0e0e0' }}>★</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: '#1e3a8a' }}>{review.category}</span>
                  </td>
                  <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{review.date}</td>
                  <td className="px-5 py-4 text-gray-700 max-w-50">
                    <p className="line-clamp-2">{review.feedback}</p>
                  </td>
                  <td className="px-5 py-4">
                    {review.response ? (
                      <p className="text-xs text-gray-600 max-w-40 line-clamp-2" style={{ color: '#1e3a8a' }}>{review.response}</p>
                    ) : <span className="text-gray-400 text-xs">No response yet</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination
        currentPage={myReviewsPage}
        totalPages={myReviewsTotalPages}
        onPageChange={setMyReviewsPage}
        totalItems={myReviews.length}
        itemsPerPage={itemsPerPage}
        alwaysShow={true}
      />

      {/* All Reviews Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 pt-5 pb-2">
          <h3 className="text-xl font-bold" style={{ color: '#1e3a8a' }}>Student Reviews</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2" style={{ borderBottomColor: '#1e3a8a' }}>
                <th className="text-left px-5 py-3 font-bold" style={{ color: '#1e3a8a' }}>Student</th>
                <th className="text-left px-5 py-3 font-bold" style={{ color: '#1e3a8a' }}>Course</th>
                <th className="text-left px-5 py-3 font-bold" style={{ color: '#1e3a8a' }}>Rating</th>
                <th className="text-left px-5 py-3 font-bold" style={{ color: '#1e3a8a' }}>Date</th>
                <th className="text-left px-5 py-3 font-bold" style={{ color: '#1e3a8a' }}>Feedback</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAllReviews.map((review) => (
                <tr key={review.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0" style={{ backgroundColor: '#1e3a8a' }}>
                        {review.student.charAt(0)}
                      </div>
                      <p className="font-semibold text-gray-800 whitespace-nowrap">{review.student}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-700">{review.course}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <span key={s} style={{ color: s <= review.rating ? '#f59e0b' : '#e0e0e0' }}>★</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{review.date}</td>
                  <td className="px-5 py-4 text-gray-700 max-w-60">
                    <p className="line-clamp-2">{review.feedback}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination
        currentPage={allReviewsPage}
        totalPages={allReviewsTotalPages}
        onPageChange={setAllReviewsPage}
        totalItems={allReviews.length}
        itemsPerPage={itemsPerPage}
        alwaysShow={true}
      />

      {/* Feedback Form Modal */}
      {showFeedbackForm && (
        <div
          className="fixed inset-0  flex items-center justify-center z-50"
          onClick={() => setShowFeedbackForm(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#1e3a8a' }}>Write Your Review</h2>
            
            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Course</label>
                  <select
                    value={feedbackForm.course}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, course: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none"
                    style={{ borderColor: '#1e3a8a' }}
                    required
                  >
                    <option value="">Select course</option>
                    <option value="Mathematics Advanced">Mathematics Advanced</option>
                    <option value="Physics Fundamentals">Physics Fundamentals</option>
                    <option value="Chemistry Basics">Chemistry Basics</option>
                    <option value="Computer Science">Computer Science</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select
                    value={feedbackForm.category}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none"
                    style={{ borderColor: '#1e3a8a' }}
                  >
                    <option value="course">Course Quality</option>
                    <option value="teaching">Teaching</option>
                    <option value="content">Course Content</option>
                    <option value="platform">Platform</option>
                    <option value="support">Support</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackForm({ ...feedbackForm, rating: star })}
                      className="text-4xl transition-all"
                      style={{ color: star <= feedbackForm.rating ? '#f59e0b' : '#e0e0e0' }}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Feedback</label>
                <textarea
                  value={feedbackForm.feedback}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, feedback: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none"
                  style={{ borderColor: '#1e3a8a' }}
                  rows="5"
                  placeholder="Share your experience..."
                  required
                ></textarea>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowFeedbackForm(false)}
                  className="flex-1 py-3 rounded-lg font-bold border-2 transition-all"
                  style={{ borderColor: '#dc3545', color: '#dc3545' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-lg text-white font-bold shadow-md hover:opacity-90 transition-all"
                  style={{ backgroundColor: '#1e3a8a' }}
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
