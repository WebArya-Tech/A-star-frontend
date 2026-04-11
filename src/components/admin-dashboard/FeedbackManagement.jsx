import React, { useState, useEffect } from 'react';

const SAMPLE_FEEDBACK = [
  { id: 1, studentName: 'Rahul Sharma', course: 'Mathematics', rating: 5, message: 'Excellent teaching methodology! Concepts are very clear.', response: null, date: '2026-02-18' },
  { id: 2, studentName: 'Priya Mehta', course: 'Physics', rating: 4, message: 'Good content but need more practice examples.', response: 'Thank you for your valuable feedback. We will add more examples!', date: '2026-02-15' },
]

const loadFeedback = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('icfy_feedback') || 'null')
    return saved && saved.length > 0 ? saved : SAMPLE_FEEDBACK
  } catch { return SAMPLE_FEEDBACK }
}

export default function FeedbackManagement() {
  const [feedbacks, setFeedbacks] = useState(loadFeedback);
  const [showReplyForm, setShowReplyForm] = useState(null);
  const [reply, setReply] = useState('');

  // Reload from localStorage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('icfy_feedback') || 'null')
    if (saved && saved.length > 0) setFeedbacks(saved)
  }, [])

  const saveFeedback = (updated) => {
    setFeedbacks(updated)
    localStorage.setItem('icfy_feedback', JSON.stringify(updated))
  }

  const handleReply = (id) => {
    if (!reply.trim()) return;
    saveFeedback(feedbacks.map(f => f.id === id ? { ...f, response: reply } : f))
    setReply('');
    setShowReplyForm(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this feedback?')) return;
    saveFeedback(feedbacks.filter(f => f.id !== id))
  };

  const renderStars = (rating) => '⭐'.repeat(rating);

  return (
    <div className="space-y-6">
      <div className="bg-white border-b-2 border-blue-900 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-blue-900">Feedback & Reviews Management</h2>
        <p className="text-gray-500 text-sm mt-1">View and respond to student feedback</p>
      </div>
      <div className="bg-white rounded-xl shadow-md p-4 md:p-8">
        {feedbacks.length === 0 ? (
          <div className="text-gray-600 text-center py-8">No feedback found.</div>
        ) : (
          <div className="space-y-4">
            {feedbacks.map((f) => (
              <div key={f.id} className="border rounded-lg p-4 hover:shadow-md transition">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">{f.studentName}</h3>
                      <span className="text-sm">{renderStars(f.rating)}</span>
                    </div>
                    <p className="text-gray-500 text-sm">{f.course}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 rounded bg-blue-900 text-white text-sm"
                      onClick={() => setShowReplyForm(showReplyForm === f.id ? null : f.id)}
                    >Reply</button>
                    <button
                      className="px-3 py-1 rounded bg-red-600 text-white text-sm"
                      onClick={() => handleDelete(f.id)}
                    >Delete</button>
                  </div>
                </div>
                <p className="text-gray-700 mb-3">{f.message}</p>
                {f.response && (
                  <div className="bg-blue-50 p-3 rounded mb-3">
                    <p className="text-sm font-semibold text-blue-900">Admin Response:</p>
                    <p className="text-gray-700 mt-1">{f.response}</p>
                  </div>
                )}
                {showReplyForm === f.id && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleReply(f.id);
                    }}
                    className="mt-3 space-y-2"
                  >
                    <textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Write your response..."
                      className="w-full px-4 py-2 border rounded"
                      required
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="px-4 py-2 rounded bg-blue-900 text-white font-bold"
                      >
                        Submit
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 rounded bg-gray-300 text-gray-800 font-bold"
                        onClick={() => { setShowReplyForm(null); setReply(''); }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
