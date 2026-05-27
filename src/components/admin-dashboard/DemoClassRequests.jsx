import React, { useState, useEffect, useCallback } from 'react';
import Pagination from '../ui/Pagination';
import { demoApi } from '../../api/demoApi';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  PENDING: { bg: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
  APPROVED: { bg: 'bg-green-100 text-green-800', label: 'Approved' },
  CANCELLED: { bg: 'bg-red-100 text-red-800', label: 'Cancelled' }
};

export default function DemoClassRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });
  const [viewRequest, setViewRequest] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    try {
      const response = await demoApi.getAdminSchedules({
        status: filterStatus === 'all' ? undefined : filterStatus,
        page: pagination.page,
        size: pagination.size
      });
      setRequests(response.content || []);
      setPagination(prev => ({
        ...prev,
        totalElements: response.totalElements || 0,
        totalPages: response.totalPages || 0
      }));
    } catch (error) {
      console.error('Failed to load demo requests:', error);
      toast.error('Failed to load demo requests');
    } finally {
      setLoading(false);
    }
  }, [filterStatus, pagination.page, pagination.size]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleApprove = async (id) => {
    setActionLoading(true);
    try {
      await demoApi.approveAdminSchedule(id);
      toast.success('Demo request approved');
      loadRequests();
      if (viewRequest?.id === id) {
        setViewRequest(prev => prev ? { ...prev, status: 'APPROVED' } : null);
      }
    } catch (error) {
      toast.error('Failed to approve request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }
    setActionLoading(true);
    try {
      await demoApi.cancelAdminSchedule(id, cancelReason);
      toast.success('Demo request cancelled');
      setShowCancelForm(false);
      setCancelReason('');
      loadRequests();
      if (viewRequest?.id === id) {
        setViewRequest(prev => prev ? { ...prev, status: 'CANCELLED', cancelReason } : null);
      }
    } catch (error) {
      toast.error('Failed to cancel request');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString;
  };

  const stats = [
    { label: 'Pending', value: requests.filter(r => r.status === 'PENDING').length, color: '#f59e0b', bg: '#fff8e1' },
    { label: 'Approved', value: requests.filter(r => r.status === 'APPROVED').length, color: '#16a34a', bg: '#dcfce7' },
    { label: 'Cancelled', value: requests.filter(r => r.status === 'CANCELLED').length, color: '#dc2626', bg: '#fee2e2' },
    { label: 'Total', value: pagination.totalElements, color: '#1e3a8a', bg: '#eff6ff' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border-b-2 border-blue-900 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-blue-900">Demo Class Requests</h2>
        <p className="text-gray-500 text-sm mt-1">Manage demo class schedule requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="rounded-xl shadow-md p-5 border-l-4" style={{ backgroundColor: s.bg, borderLeftColor: s.color }}>
            <p className="text-xs font-semibold text-gray-500 mb-1">{s.label}</p>
            <p className="text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 flex flex-wrap gap-2">
        {['all', 'PENDING', 'APPROVED', 'CANCELLED'].map(status => (
          <button key={status} onClick={() => { setFilterStatus(status); setPagination(prev => ({ ...prev, page: 0 })); }}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all border-2 border-blue-900 ${
              filterStatus === status ? 'bg-blue-900 text-white' : 'bg-transparent text-gray-700 hover:bg-blue-50'
            }`}>
            {status === 'all' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-blue-900">
              <tr>
                {['Student', 'Parent', 'Email', 'Phone', 'Grade/Board', 'Date & Time', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-white font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" className="text-center py-12 text-gray-400">Loading requests...</td></tr>
              ) : requests.length === 0 ? (
                <tr><td colSpan="8" className="text-center py-12 text-gray-400">No requests found.</td></tr>
              ) : requests.map((r, idx) => (
                <tr key={r.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 font-semibold text-blue-900">{r.studentName}</td>
                  <td className="px-4 py-3 text-gray-600">{r.parentName}</td>
                  <td className="px-4 py-3 text-gray-600">{r.emailId}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{r.mobileNumber}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {r.grade?.name || 'N/A'} / {r.board?.name || 'N/A'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                    {formatDate(r.preferredDate)}{r.preferredTime ? ` | ${r.preferredTime}` : ''}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap ${STATUS_CONFIG[r.status]?.bg}`}>
                      {STATUS_CONFIG[r.status]?.label || r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button onClick={() => setViewRequest(r)}
                        disabled={actionLoading}
                        className="px-2.5 py-1 rounded text-white text-xs font-semibold whitespace-nowrap bg-blue-900 hover:bg-blue-800 disabled:opacity-50 transition">
                        View
                      </button>
                      {r.status === 'PENDING' && (
                        <>
                          <button onClick={() => handleApprove(r.id)}
                            disabled={actionLoading}
                            className="px-2.5 py-1 rounded text-white text-xs font-semibold whitespace-nowrap bg-green-600 hover:bg-green-700 disabled:opacity-50 transition">
                            Approve
                          </button>
                          <button onClick={() => { setViewRequest(r); setShowCancelForm(true); }}
                            disabled={actionLoading}
                            className="px-2.5 py-1 rounded text-white text-xs font-semibold whitespace-nowrap bg-red-600 hover:bg-red-700 disabled:opacity-50 transition">
                            Decline
                          </button>
                        </>
                      )}
                      {r.status === 'APPROVED' && (
                        <button onClick={() => { setViewRequest(r); setShowCancelForm(true); }}
                          disabled={actionLoading}
                          className="px-2.5 py-1 rounded text-white text-xs font-semibold whitespace-nowrap bg-red-600 hover:bg-red-700 disabled:opacity-50 transition">
                          Cancel
                        </button>
                      )}
                      {r.status === 'CANCELLED' && (
                        <button onClick={() => setViewRequest(r)}
                          className="px-2 py-1 rounded text-blue-900 text-xs font-semibold whitespace-nowrap bg-blue-50 hover:bg-blue-100 transition">
                          View Reason
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="p-4">
            <Pagination
              currentPage={pagination.page + 1}
              totalPages={pagination.totalPages}
              onPageChange={(page) => setPagination(prev => ({ ...prev, page: page - 1 }))}
              totalItems={pagination.totalElements}
              itemsPerPage={pagination.size}
              alwaysShow={true}
            />
          </div>
        )}
      </div>

      {/* View Detail Modal */}
      {viewRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => { setViewRequest(null); setShowCancelForm(false); setCancelReason(''); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 rounded-t-2xl bg-blue-900">
              <div>
                <h3 className="text-xl font-bold text-white">{viewRequest.studentName}</h3>
                <p className="text-white/70 text-sm">Requested {formatDate(viewRequest.createdAt)}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${STATUS_CONFIG[viewRequest.status]?.bg}`}>
                {STATUS_CONFIG[viewRequest.status]?.label || viewRequest.status}
              </span>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1 font-semibold">Parent Name</p>
                  <p className="font-semibold text-sm text-gray-800">{viewRequest.parentName || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1 font-semibold">Email</p>
                  <p className="font-semibold text-sm text-gray-800">{viewRequest.emailId}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1 font-semibold">Phone</p>
                  <p className="font-semibold text-sm text-gray-800">{viewRequest.mobileNumber}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1 font-semibold">Grade</p>
                  <p className="font-semibold text-sm text-gray-800">{viewRequest.grade?.name || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1 font-semibold">Board</p>
                  <p className="font-semibold text-sm text-gray-800">{viewRequest.board?.name || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1 font-semibold">Preferred Date & Time</p>
                  <p className="font-semibold text-sm text-gray-800">{formatDate(viewRequest.preferredDate)} at {formatTime(viewRequest.preferredTime)}</p>
                </div>
              </div>

              {viewRequest.cancelReason && (
                <div className="bg-red-50 rounded-lg p-4">
                  <p className="text-xs text-red-600 mb-1 font-semibold">Cancellation Reason</p>
                  <p className="text-gray-700 text-sm">{viewRequest.cancelReason}</p>
                </div>
              )}

              {/* Action buttons */}
              {viewRequest.status === 'PENDING' && !showCancelForm && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => handleApprove(viewRequest.id)}
                    disabled={actionLoading}
                    className="flex-1 py-2 rounded-lg text-white font-semibold text-sm bg-green-600 hover:bg-green-700 disabled:opacity-50 transition"
                  >
                    {actionLoading ? 'Processing...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => setShowCancelForm(true)}
                    disabled={actionLoading}
                    className="flex-1 py-2 rounded-lg text-white font-semibold text-sm bg-red-600 hover:bg-red-700 disabled:opacity-50 transition"
                  >
                    Decline
                  </button>
                </div>
              )}

              {showCancelForm && (
                <div className="bg-red-50 rounded-lg p-4 space-y-3">
                  <p className="text-sm font-semibold text-red-700">Reason for cancellation:</p>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500/20"
                    rows={3}
                    placeholder="Enter reason..."
                    autoFocus
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleCancel(viewRequest.id)}
                      disabled={actionLoading}
                      className="flex-1 py-2 rounded-lg text-white font-semibold text-sm bg-red-600 hover:bg-red-700 disabled:opacity-50 transition"
                    >
                      {actionLoading ? 'Processing...' : 'Confirm Cancellation'}
                    </button>
                    <button
                      onClick={() => { setShowCancelForm(false); setCancelReason(''); }}
                      className="px-4 py-2 rounded-lg text-gray-500 font-semibold text-sm border"
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t flex">
              <button onClick={() => { setViewRequest(null); setShowCancelForm(false); setCancelReason(''); }}
                className="flex-1 py-2 rounded-lg text-gray-500 font-semibold text-sm border">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
