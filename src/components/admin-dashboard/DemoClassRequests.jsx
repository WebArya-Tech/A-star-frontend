import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Search, Filter, Eye, Calendar, Phone, Mail, User, BookOpen, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';
import { demoApi } from '../../api/demoApi';

const STATUS_CONFIG = {
  PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
  SCHEDULED: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
  APPROVED: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Approved' },
  CONFIRMED: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Approved' },
  CANCELLED: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Cancelled' }
};

export default function DemoClassRequests() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    loadSchedules();
  }, [filterStatus, pagination.page]);

  const loadSchedules = async () => {
    setLoading(true);
    try {
      const response = await demoApi.getAdminSchedules({
        status: filterStatus === 'all' ? undefined : filterStatus,
        page: pagination.page,
        size: pagination.size
      });
      
      const content = response.content || [];
      setSchedules(content);
      setPagination(prev => ({
        ...prev,
        totalElements: response.totalElements || content.length,
        totalPages: response.totalPages || 1
      }));
    } catch (error) {
      console.error('Failed to load schedules:', error);
      toast.error('Failed to load schedules');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, action) => {
    try {
      let updatedSchedule;
      if (action === 'approve') {
        updatedSchedule = await demoApi.approveAdminSchedule(id);
        toast.success('Demo schedule approved successfully');
      } else {
        if (!cancelReason.trim()) {
          toast.error('Please provide a reason for cancellation');
          return;
        }
        updatedSchedule = await demoApi.cancelAdminSchedule(id, cancelReason);
        toast.success('Demo schedule cancelled');
        setShowCancelModal(false);
        setCancelReason('');
      }

      await loadSchedules();
      if (selectedSchedule?.id === id) {
        setSelectedSchedule(updatedSchedule || null);
      }
    } catch (error) {
      console.error('Failed to update schedule:', error);
      toast.error('Failed to update schedule status');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '-';
    try {
      return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      return timeString;
    }
  };

  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = !searchTerm ||
      schedule.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (schedule.emailId && schedule.emailId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (schedule.mobileNumber && schedule.mobileNumber.includes(searchTerm));

    return matchesSearch;
  });

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-white border-b-2 border-blue-900 rounded-xl p-6 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-900 flex items-center gap-3">
            <Calendar className="w-8 h-8" />
            Demo Schedules
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage and track demo class requests</p>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
            <span className="ml-3 text-gray-600">Loading schedules...</span>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Filters and Search */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search locally..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setPagination(prev => ({ ...prev, page: 0 }));
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              <div className="text-sm text-gray-500">
                Total {pagination.totalElements} schedules
              </div>
            </div>
          </div>

          {/* Schedules List */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {filteredSchedules.length === 0 ? (
              <div className="p-8 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No demo schedules found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSchedules.map((schedule) => (
                      <tr key={schedule.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{schedule.studentName}</div>
                            <div className="text-sm text-gray-500">{schedule.parentName}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              {schedule.grade?.name || schedule.gradeId} - {schedule.board?.name || schedule.boardId}
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <Phone className="w-4 h-4" />
                              {schedule.mobileNumber}
                            </div>
                            {schedule.emailId && (
                              <div className="flex items-center gap-1 mt-1">
                                <Mail className="w-4 h-4" />
                                {schedule.emailId}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div>{formatDate(schedule.preferredDate)}</div>
                            <div className="text-gray-500">{schedule.preferredTime}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${STATUS_CONFIG[schedule.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                            {STATUS_CONFIG[schedule.status]?.label || schedule.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedSchedule(schedule)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {(schedule.status === 'PENDING' || schedule.status === 'SCHEDULED') && (
                              <>
                                <button
                                  onClick={() => handleStatusUpdate(schedule.id, 'approve')}
                                  className="text-green-600 hover:text-green-900 p-1 rounded"
                                  title="Approve"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedSchedule(schedule);
                                    setShowCancelModal(true);
                                  }}
                                  className="text-red-600 hover:text-red-900 p-1 rounded"
                                  title="Cancel"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.max(0, prev.page - 1) }))}
                    disabled={pagination.page === 0}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages - 1, prev.page + 1) }))}
                    disabled={pagination.page >= pagination.totalPages - 1}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{pagination.page * pagination.size + 1}</span> to <span className="font-medium">{Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)}</span> of{' '}
                      <span className="font-medium">{pagination.totalElements}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => setPagination(prev => ({ ...prev, page: Math.max(0, prev.page - 1) }))}
                        disabled={pagination.page === 0}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        ‹
                      </button>
                      {Array.from({ length: pagination.totalPages }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => setPagination(prev => ({ ...prev, page: i }))}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${i === pagination.page
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages - 1, prev.page + 1) }))}
                        disabled={pagination.page >= pagination.totalPages - 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        ›
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal for viewing schedule details or cancelling */}
      {(selectedSchedule || showCancelModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0" onClick={() => { setSelectedSchedule(null); setShowCancelModal(false); setCancelReason(''); }} />
          <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full mx-auto max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6 sticky top-0 bg-white pb-2 border-b">
                <h2 className="text-xl font-bold text-gray-900">{showCancelModal ? 'Cancel Schedule' : 'Schedule Details'}</h2>
                <button
                  onClick={() => { setSelectedSchedule(null); setShowCancelModal(false); setCancelReason(''); }}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {showCancelModal && selectedSchedule ? (
                <div className="space-y-4">
                  <p className="text-gray-600">Please provide a reason for cancelling <strong>{selectedSchedule.studentName}'s</strong> demo schedule.</p>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Enter cancellation reason..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none min-h-[100px]"
                  />
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => { setShowCancelModal(false); setCancelReason(''); }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                    >
                      Go Back
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedSchedule.id, 'cancel')}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-semibold"
                    >
                      Confirm Cancellation
                    </button>
                  </div>
                </div>
              ) : selectedSchedule ? (
                <div className="space-y-6">
                  {/* Student Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Student Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <p><span className="font-medium">Name:</span> {selectedSchedule.studentName}</p>
                      <p><span className="font-medium">Parent:</span> {selectedSchedule.parentName}</p>
                      <p><span className="font-medium">Email:</span> {selectedSchedule.emailId || 'Not provided'}</p>
                      <p><span className="font-medium">Phone:</span> {selectedSchedule.mobileNumber}</p>
                    </div>
                  </div>

                  {/* Class Details */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Class Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <p><span className="font-medium">Grade:</span> {selectedSchedule.grade?.name || selectedSchedule.gradeId}</p>
                      <p><span className="font-medium">Board:</span> {selectedSchedule.board?.name || selectedSchedule.boardId}</p>
                      <p><span className="font-medium">Preferred Date:</span> {formatDate(selectedSchedule.preferredDate)}</p>
                      <p><span className="font-medium">Preferred Time:</span> {selectedSchedule.preferredTime}</p>
                    </div>
                  </div>

                  {/* Status and Schedule Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Status & Schedule
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Status:</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${STATUS_CONFIG[selectedSchedule.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                          {STATUS_CONFIG[selectedSchedule.status]?.label || selectedSchedule.status}
                        </span>
                      </div>
                      <p><span className="font-medium">Created:</span> {formatDate(selectedSchedule.createdAt)}</p>
                      <p><span className="font-medium">Last Updated:</span> {formatDate(selectedSchedule.updatedAt)}</p>
                      {selectedSchedule.status === 'CANCELLED' && selectedSchedule.cancelReason && (
                        <div className="mt-2 p-3 bg-red-50 border border-red-100 rounded-lg">
                          <p className="text-xs text-red-600 font-bold uppercase mb-1">Cancellation Reason</p>
                          <p className="text-gray-700">{selectedSchedule.cancelReason}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Update Status */}
                  {(selectedSchedule.status === 'PENDING' || selectedSchedule.status === 'SCHEDULED') && (
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                      <h3 className="text-sm font-semibold text-yellow-800 mb-3">Update Status</h3>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleStatusUpdate(selectedSchedule.id, 'approve')}
                          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => setShowCancelModal(true)}
                          className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No schedule selected</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}