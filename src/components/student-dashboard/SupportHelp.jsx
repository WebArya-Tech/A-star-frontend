import React, { useState } from 'react'
import Pagination from '../ui/Pagination'

export default function SupportHelp() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [ticketsPage, setTicketsPage] = useState(1)
  const [faqsPage, setFaqsPage] = useState(1)
  const [showTicketModal, setShowTicketModal] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [showNewTicketModal, setShowNewTicketModal] = useState(false)
  const [newTicketForm, setNewTicketForm] = useState({ subject: '', category: 'technical', description: '' })
  const itemsPerPage = 100

  const faqs = [
    {
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'To reset your password, click on "Forgot Password" on the login page. You\'ll receive an email with instructions to reset your password.'
    },
    {
      category: 'courses',
      question: 'How do I enroll in a new course?',
      answer: 'You can enroll in a new course by navigating to the "My Courses" section and clicking on the "+ Enroll New Course" button. Browse available courses and select the one you want to enroll in.'
    },
    {
      category: 'assignments',
      question: 'How do I submit an assignment?',
      answer: 'Go to the "Assignments" section, click on the assignment you want to submit, and click the "Submit Assignment" button. You can then upload your files and add any comments before final submission.'
    },
    {
      category: 'technical',
      question: 'What should I do if I can\'t join a live class?',
      answer: 'If you\'re having trouble joining a live class, first check your internet connection. If the issue persists, try refreshing your browser or using a different browser. Contact technical support if the problem continues.'
    },
    {
      category: 'payments',
      question: 'How can I view my payment history?',
      answer: 'Your payment history is available in the "Profile" section under "Payment History". You can also download invoices for your records.'
    },
    {
      category: 'account',
      question: 'How do I update my profile information?',
      answer: 'Go to the "Profile" section and click on "Edit Profile". Update your information and click "Save Changes" to apply the updates.'
    }
  ]

  const tickets = [
    {
      id: 'TK-2024-001',
      subject: 'Cannot access Chemistry course materials',
      category: 'technical',
      status: 'open',
      priority: 'high',
      date: 'Jan 19, 2026',
      lastUpdate: '2 hours ago'
    },
    {
      id: 'TK-2024-002',
      subject: 'Assignment submission failed',
      category: 'technical',
      status: 'in-progress',
      priority: 'high',
      date: 'Jan 18, 2026',
      lastUpdate: '1 day ago'
    },
    {
      id: 'TK-2024-003',
      subject: 'Question about course schedule',
      category: 'courses',
      status: 'resolved',
      priority: 'low',
      date: 'Jan 15, 2026',
      lastUpdate: '4 days ago'
    }
  ]

  const filteredFaqs = selectedCategory === 'all'
    ? faqs
    : faqs.filter(faq => faq.category === selectedCategory)

  // Pagination for Tickets
  const ticketsTotalPages = Math.ceil(tickets.length / itemsPerPage)
  const ticketsStartIndex = (ticketsPage - 1) * itemsPerPage
  const paginatedTickets = tickets.slice(ticketsStartIndex, ticketsStartIndex + itemsPerPage)

  // Pagination for FAQs
  const faqsTotalPages = Math.ceil(filteredFaqs.length / itemsPerPage)
  const faqsStartIndex = (faqsPage - 1) * itemsPerPage
  const paginatedFaqs = filteredFaqs.slice(faqsStartIndex, faqsStartIndex + itemsPerPage)

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return '#dc3545'
      case 'in-progress': return '#ffc107'
      case 'resolved': return '#28a745'
      default: return '#1e3a8a'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#dc3545'
      case 'medium': return '#ffc107'
      case 'low': return '#28a745'
      default: return '#1e3a8a'
    }
  }

  const handleNewTicketSubmit = (e) => {
    e.preventDefault()
    alert('Ticket submitted! Our support team will respond within 24 hours.')
    setShowNewTicketModal(false)
    setNewTicketForm({ subject: '', category: 'technical', description: '' })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold" style={{ color: '#1e3a8a' }}>💬 Support & Help</h2>
        <p className="text-gray-600 mt-2">Get help and support for your queries</p>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4" style={{ borderLeftColor: '#1e3a8a' }}>
          <h3 className="text-xl font-bold mb-2" style={{ color: '#1e3a8a' }}>Call Us</h3>
          <a href="tel:+917795010900" className="text-gray-700 mb-3 block hover:text-blue-900 hover:underline transition-colors">+91 779 501 0900</a>
          <p className="text-sm text-gray-600">Mon - Sat, 9 AM - 6 PM IST</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4" style={{ borderLeftColor: '#f59e0b' }}>
          <h3 className="text-xl font-bold mb-2" style={{ color: '#f59e0b' }}>Email Us</h3>
          <a href="mailto:ithinklearn@ixpoe.com" className="text-gray-700 mb-3 block hover:text-amber-600 hover:underline transition-colors">ithinklearn@ixpoe.com</a>
          <p className="text-sm text-gray-600">We'll respond within 24 hours</p>
        </div>
      </div>

     

      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-2xl font-bold mb-6" style={{ color: '#1e3a8a' }}>❓ Frequently Asked Questions</h3>
        
        {/* FAQ Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              selectedCategory === 'all' ? 'text-white shadow-md' : 'text-gray-700 hover:bg-gray-50'
            }`}
            style={{ backgroundColor: selectedCategory === 'all' ? '#1e3a8a' : 'transparent', border: '2px solid #1e3a8a' }}
          >
            All
          </button>
          <button
            onClick={() => setSelectedCategory('account')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              selectedCategory === 'account' ? 'text-white shadow-md' : 'text-gray-700 hover:bg-gray-50'
            }`}
            style={{ backgroundColor: selectedCategory === 'account' ? '#f59e0b' : 'transparent', border: '2px solid #f59e0b' }}
          >
            Account
          </button>
          <button
            onClick={() => setSelectedCategory('courses')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              selectedCategory === 'courses' ? 'text-white shadow-md' : 'text-gray-700 hover:bg-gray-50'
            }`}
            style={{ backgroundColor: selectedCategory === 'courses' ? '#28a745' : 'transparent', border: '2px solid #28a745' }}
          >
            Courses
          </button>
          <button
            onClick={() => setSelectedCategory('assignments')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              selectedCategory === 'assignments' ? 'text-white shadow-md' : 'text-gray-700 hover:bg-gray-50'
            }`}
            style={{ backgroundColor: selectedCategory === 'assignments' ? '#ffc107' : 'transparent', border: '2px solid #ffc107' }}
          >
            Assignments
          </button>
          <button
            onClick={() => setSelectedCategory('technical')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              selectedCategory === 'technical' ? 'text-white shadow-md' : 'text-gray-700 hover:bg-gray-50'
            }`}
            style={{ backgroundColor: selectedCategory === 'technical' ? '#dc3545' : 'transparent', border: '2px solid #dc3545' }}
          >
            Technical
          </button>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {paginatedFaqs.map((faq, index) => (
            <details
              key={index}
              className="p-4 rounded-lg cursor-pointer hover:shadow-md transition-all"
              style={{ backgroundColor: '#fef9f0' }}
            >
              <summary className="font-bold text-gray-800 cursor-pointer">
                {faq.question}
              </summary>
              <p className="mt-3 text-gray-700 leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>

        <Pagination
          currentPage={faqsPage}
          totalPages={faqsTotalPages}
          onPageChange={setFaqsPage}
          totalItems={filteredFaqs.length}
          itemsPerPage={itemsPerPage}
          alwaysShow={true}
        />
      </div>

      {/* Ticket Detail Modal */}
      {showTicketModal && selectedTicket && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowTicketModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: '#1e3a8a' }}>Ticket Details</h2>
              <button onClick={() => setShowTicketModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none">&times;</button>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-sm font-semibold text-gray-600">Ticket ID</span>
                <span className="font-mono text-sm">{selectedTicket.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-semibold text-gray-600">Subject</span>
                <span className="text-sm font-semibold">{selectedTicket.subject}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-semibold text-gray-600">Category</span>
                <span className="text-sm capitalize">{selectedTicket.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-semibold text-gray-600">Date</span>
                <span className="text-sm">{selectedTicket.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-semibold text-gray-600">Last Update</span>
                <span className="text-sm">{selectedTicket.lastUpdate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-600">Priority</span>
                <span className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: getPriorityColor(selectedTicket.priority) }}>{selectedTicket.priority.toUpperCase()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-600">Status</span>
                <span className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: getStatusColor(selectedTicket.status) }}>{selectedTicket.status.toUpperCase()}</span>
              </div>
            </div>
            <button
              onClick={() => setShowTicketModal(false)}
              className="w-full py-3 rounded-lg font-bold text-white hover:opacity-90 transition-all"
              style={{ backgroundColor: '#1e3a8a' }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowNewTicketModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: '#1e3a8a' }}>Submit New Ticket</h2>
              <button onClick={() => setShowNewTicketModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none">&times;</button>
            </div>
            <form onSubmit={handleNewTicketSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  value={newTicketForm.subject}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none"
                  style={{ borderColor: '#1e3a8a' }}
                  placeholder="Briefly describe your issue"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  value={newTicketForm.category}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none"
                  style={{ borderColor: '#1e3a8a' }}
                >
                  <option value="technical">Technical</option>
                  <option value="account">Account</option>
                  <option value="courses">Courses</option>
                  <option value="payments">Payments</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={newTicketForm.description}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none"
                  style={{ borderColor: '#1e3a8a' }}
                  rows="4"
                  placeholder="Describe your issue in detail..."
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="flex-1 py-3 rounded-lg font-bold border-2 bg-white transition-all hover:opacity-80"
                  style={{ borderColor: '#dc3545', color: '#dc3545' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-lg text-white font-bold hover:opacity-90 transition-all"
                  style={{ backgroundColor: '#1e3a8a' }}
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
