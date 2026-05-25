import React, { useState } from 'react'
import Pagination from '../ui/Pagination'

export default function FeePayment() {
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedFee, setSelectedFee] = useState(null)
  const [feePage, setFeePage] = useState(1)
  const [historyPage, setHistoryPage] = useState(1)
  const itemsPerPage = 100

  const feeStructure = [
    {
      id: 1,
      course: 'Mathematics Advanced',
      amount: 15000,
      dueDate: 'Feb 28, 2026',
      status: 'pending',
      term: 'Term 2'
    },
    {
      id: 2,
      course: 'Physics Fundamentals',
      amount: 12000,
      dueDate: 'Feb 28, 2026',
      status: 'pending',
      term: 'Term 2'
    },
    {
      id: 3,
      course: 'Chemistry Basics',
      amount: 10000,
      dueDate: 'Jan 15, 2026',
      status: 'paid',
      term: 'Term 1',
      paidOn: 'Jan 10, 2026'
    },
    {
      id: 4,
      course: 'Computer Science',
      amount: 18000,
      dueDate: 'Jan 15, 2026',
      status: 'paid',
      term: 'Term 1',
      paidOn: 'Jan 12, 2026'
    }
  ]

  const paymentHistory = [
    {
      id: 'PAY-2026-001',
      course: 'Chemistry Basics',
      amount: 10000,
      date: 'Jan 10, 2026',
      method: 'Credit Card',
      status: 'success'
    },
    {
      id: 'PAY-2026-002',
      course: 'Computer Science',
      amount: 18000,
      date: 'Jan 12, 2026',
      method: 'UPI',
      status: 'success'
    },
    {
      id: 'PAY-2025-015',
      course: 'Mathematics Advanced',
      amount: 15000,
      date: 'Dec 15, 2025',
      method: 'Bank Transfer',
      status: 'success'
    }
  ]

  const pendingAmount = feeStructure.filter(f => f.status === 'pending').reduce((acc, f) => acc + f.amount, 0)
  const paidAmount = feeStructure.filter(f => f.status === 'paid').reduce((acc, f) => acc + f.amount, 0)

  // Pagination for Fee Structure
  const feeTotalPages = Math.ceil(feeStructure.length / itemsPerPage)
  const feeStartIndex = (feePage - 1) * itemsPerPage
  const paginatedFeeStructure = feeStructure.slice(feeStartIndex, feeStartIndex + itemsPerPage)

  // Pagination for Payment History
  const historyTotalPages = Math.ceil(paymentHistory.length / itemsPerPage)
  const historyStartIndex = (historyPage - 1) * itemsPerPage
  const paginatedPaymentHistory = paymentHistory.slice(historyStartIndex, historyStartIndex + itemsPerPage)

  const handlePayNow = (fee) => {
    setSelectedFee(fee)
    setShowPaymentModal(true)
  }

  const handlePaymentSubmit = (e) => {
    e.preventDefault()
    alert('Payment processed successfully!')
    setShowPaymentModal(false)
    setSelectedFee(null)
  }

  const handleDownload = (payment) => {
    alert(`Downloading receipt for ${payment.id} — ${payment.course}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold" style={{ color: '#196d83' }}>Fee Payment</h2>
        <p className="text-gray-600 mt-2">Manage your course fees and payment history</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4" style={{ borderLeftColor: '#dc3545' }}>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Pending Payment</h3>
          <p className="text-3xl font-bold" style={{ color: '#dc3545' }}>₹{pendingAmount.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4" style={{ borderLeftColor: '#28a745' }}>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Paid This Term</h3>
          <p className="text-3xl font-bold" style={{ color: '#28a745' }}>₹{paidAmount.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4" style={{ borderLeftColor: '#1e3a8a' }}>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Courses</h3>
          <p className="text-3xl font-bold" style={{ color: '#1e3a8a' }}>{feeStructure.length}</p>
        </div>
      </div>

      {/* Current Fee Structure */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-2xl font-bold mb-6" style={{ color: '#1e3a8a' }}>Current Fee Structure</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2" style={{ borderColor: '#1e3a8a' }}>
                <th className="text-left py-3 px-4 font-bold" style={{ color: '#1e3a8a' }}>Course</th>
                <th className="text-left py-3 px-4 font-bold" style={{ color: '#1e3a8a' }}>Term</th>
                <th className="text-left py-3 px-4 font-bold" style={{ color: '#1e3a8a' }}>Amount</th>
                <th className="text-left py-3 px-4 font-bold" style={{ color: '#1e3a8a' }}>Due Date</th>
                <th className="text-left py-3 px-4 font-bold" style={{ color: '#1e3a8a' }}>Paid On</th>
                <th className="text-left py-3 px-4 font-bold" style={{ color: '#1e3a8a' }}>Status</th>
                <th className="text-left py-3 px-4 font-bold" style={{ color: '#1e3a8a' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedFeeStructure.map((fee) => (
                <tr key={fee.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-semibold">{fee.course}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: '#1e3a8a' }}>
                      {fee.term}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold" style={{ color: '#1e3a8a' }}>₹{fee.amount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm">{fee.dueDate}</td>
                  <td className="py-3 px-4 text-sm">{fee.paidOn || '—'}</td>
                  <td className="py-3 px-4">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: fee.status === 'paid' ? '#28a745' : '#dc3545' }}
                    >
                      {fee.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {fee.status === 'pending' ? (
                      <button
                        onClick={() => handlePayNow(fee)}
                        className="px-4 py-2 rounded-lg text-white text-sm font-bold hover:bg-blue-800 transition-all"
                        style={{ backgroundColor: '#1e3a8a' }}
                      >
                        Pay Now
                      </button>
                    ) : (
                      <span className="text-sm font-semibold" style={{ color: '#28a745' }}>Paid ✓</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={feePage}
          totalPages={feeTotalPages}
          onPageChange={setFeePage}
          totalItems={feeStructure.length}
          itemsPerPage={itemsPerPage}
          alwaysShow={true}
        />
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-2xl font-bold mb-6" style={{ color: '#1e3a8a' }}>Payment History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2" style={{ borderColor: '#1e3a8a' }}>
                <th className="text-left py-3 px-4 font-bold" style={{ color: '#1e3a8a' }}>Transaction ID</th>
                <th className="text-left py-3 px-4 font-bold" style={{ color: '#1e3a8a' }}>Course</th>
                <th className="text-left py-3 px-4 font-bold" style={{ color: '#1e3a8a' }}>Amount</th>
                <th className="text-left py-3 px-4 font-bold" style={{ color: '#1e3a8a' }}>Date</th>
                <th className="text-left py-3 px-4 font-bold" style={{ color: '#1e3a8a' }}>Method</th>
                <th className="text-left py-3 px-4 font-bold" style={{ color: '#1e3a8a' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPaymentHistory.map((payment) => (
                <tr key={payment.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-sm">{payment.id}</td>
                  <td className="py-3 px-4">{payment.course}</td>
                  <td className="py-3 px-4 font-bold" style={{ color: '#28a745' }}>₹{payment.amount.toLocaleString()}</td>
                  <td className="py-3 px-4">{payment.date}</td>
                  <td className="py-3 px-4">{payment.method}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDownload(payment)}
                      className="px-4 py-2 rounded-lg text-sm font-semibold border-2 bg-white transition-all hover:bg-blue-50"
                      style={{ borderColor: '#1e3a8a', color: '#1e3a8a' }}
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={historyPage}
          totalPages={historyTotalPages}
          onPageChange={setHistoryPage}
          totalItems={paymentHistory.length}
          itemsPerPage={itemsPerPage}
          alwaysShow={true}
        />
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedFee && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowPaymentModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#1e3a8a' }}>Payment Details</h2>
            
            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#eff6ff' }}>
              <h3 className="font-bold text-lg mb-2">{selectedFee.course}</h3>
              <p className="text-3xl font-bold" style={{ color: '#1e3a8a' }}>₹{selectedFee.amount.toLocaleString()}</p>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
                <select
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-blue-900"
                  style={{ borderColor: '#1e3a8a' }}
                  required
                >
                  <option value="">Select payment method</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="upi">UPI</option>
                  <option value="netbanking">Net Banking</option>
                  <option value="wallet">Wallet</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 py-3 rounded-lg font-bold border-2 transition-all bg-white hover:bg-gray-50"
                  style={{ borderColor: '#6b7280', color: '#374151' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-lg text-white font-bold shadow-md hover:bg-blue-800 transition-all"
                  style={{ backgroundColor: '#1e3a8a' }}
                >
                  Proceed to Pay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
