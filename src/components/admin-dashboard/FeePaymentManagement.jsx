import React, { useState, useEffect } from 'react';

const SAMPLE_PAYMENTS = [
  { id: 'ICFY001', fullName: 'Rahul Sharma', courseName: 'UG Mathematics', feeAmount: '5000', status: 'paid', paymentDate: '2026-02-18', phone: '+91 98765 43210', email: 'rahul@example.com', razorpayPaymentId: 'rzp_demo_001' },
  { id: 'ICFY002', fullName: 'Priya Mehta', courseName: 'UG Physics', feeAmount: '5000', status: 'pending', paymentDate: '2026-02-15', phone: '+91 98765 43211', email: 'priya@example.com', razorpayPaymentId: '' },
  { id: 'ICFY003', fullName: 'Amit Kumar', courseName: 'GRE Preparation', feeAmount: '8000', status: 'paid', paymentDate: '2026-02-10', phone: '+91 98765 43212', email: 'amit@example.com', razorpayPaymentId: 'rzp_demo_003' },
]

const loadPayments = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('feePayments') || 'null')
    return saved && saved.length > 0 ? saved : SAMPLE_PAYMENTS
  } catch { return SAMPLE_PAYMENTS }
}

export default function FeePaymentManagement() {
  const [payments, setPayments] = useState(loadPayments);
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');

  // Reload from localStorage when component mounts (picks up new payments from frontend)
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('feePayments') || 'null')
    if (saved && saved.length > 0) setPayments(saved)
  }, [])

  // Save status updates back to localStorage
  const handleStatusUpdate = (id, status) => {
    const updated = payments.map(p => p.id === id ? { ...p, status } : p)
    setPayments(updated)
    localStorage.setItem('feePayments', JSON.stringify(updated))
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this payment record?')) return
    const updated = payments.filter(p => p.id !== id)
    setPayments(updated)
    localStorage.setItem('feePayments', JSON.stringify(updated))
  }

  const filtered = payments.filter(p => {
    // Normalize Razorpay's 'Success' as 'paid' for filtering
    const normalizedStatus = (p.status === 'Success') ? 'paid' : p.status
    const matchStatus = filterStatus === 'all' || normalizedStatus === filterStatus
    const matchSearch = !search ||
      (p.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.courseName || '').toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const getTotalAmount = () => payments.reduce((sum, p) => sum + Number(p.feeAmount || p.amount || 0), 0)
  const getPaidAmount = () => payments.filter(p => p.status === 'paid' || p.status === 'Success').reduce((sum, p) => sum + Number(p.feeAmount || p.amount || 0), 0)
  const getPendingAmount = () => payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + Number(p.feeAmount || p.amount || 0), 0)

  return (
    <div className="space-y-6">
      <div className="bg-white border-b-2 border-blue-900 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-blue-900"> Fee Payment Management</h2>
        <p className="text-gray-500 text-sm mt-1">Track and manage student fee payments (auto-synced from frontend)</p>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Records', value: payments.length, color: '#1e3a8a', bg: '#eff6ff' },
          { label: 'Total Amount', value: `₹${getTotalAmount().toLocaleString()}`, color: '#1e3a8a', bg: '#eff6ff' },
          { label: 'Paid', value: `₹${getPaidAmount().toLocaleString()}`, color: '#28a745', bg: '#f0fff4' },
          { label: 'Pending', value: `₹${getPendingAmount().toLocaleString()}`, color: '#dc3545', bg: '#fff5f5' },
        ].map(s => (
          <div key={s.label} className="rounded-xl shadow-md p-5 border-l-4" style={{ backgroundColor: s.bg, borderLeftColor: s.color }}>
            <p className="text-xs font-semibold text-gray-600 mb-1">{s.label}</p>
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder="Search student, email, course..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border-2 rounded-lg focus:outline-none"
          style={{ borderColor: '#1e3a8a' }}
        />
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'paid', 'failed'].map(status => (
            <button key={status} onClick={() => setFilterStatus(status)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold ${filterStatus === status ? 'text-white' : 'text-gray-600 bg-gray-100'}`}
              style={filterStatus === status ? { backgroundColor: '#1e3a8a' } : {}}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>
      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-blue-900">
              <tr>
                {['Receipt ID', 'Student Name', 'Email', 'Course', 'Amount', 'Payment Date', 'Transaction ID', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-white text-sm font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="9" className="text-center py-10 text-gray-500">No payment records found.</td></tr>
              ) : filtered.map((p, idx) => (
                <tr key={p.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{p.id}</td>
                  <td className="px-4 py-3 font-semibold text-blue-900">{p.fullName || p.studentName || '-'}</td>
                  <td className="px-4 py-3 text-sm">{p.email || '-'}</td>
                  <td className="px-4 py-3 text-sm">{p.courseName || p.course || '-'}</td>
                  <td className="px-4 py-3 font-bold">₹{Number(p.feeAmount || p.amount || 0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm">{p.paymentDate ? new Date(p.paymentDate).toLocaleDateString('en-IN') : (p.date || '-')}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.razorpayPaymentId || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      (p.status === 'paid' || p.status === 'Success') ? 'bg-green-100 text-green-800' :
                      p.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <select value={p.status} onChange={e => handleStatusUpdate(p.id, e.target.value)}
                        className="px-2 py-1 border rounded text-xs" style={{ borderColor: '#1e3a8a' }}>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                      </select>
                      <button onClick={() => handleDelete(p.id)}
                        className="px-2 py-1 rounded text-white text-xs" style={{ backgroundColor: '#dc3545' }}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
