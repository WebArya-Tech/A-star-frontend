
import React, { useState, useEffect } from 'react';
import { 
  getAllClassesAdmin, 
  createClassAdmin, 
  updateClassAdmin, 
  deleteClassAdmin,
  getAllEnrollmentsAdmin,
  confirmEnrollmentAdmin,
  rejectEnrollmentAdmin,
  deleteEnrollmentAdmin
} from '../../api/api/runningClassesApi';
import toast from 'react-hot-toast';
import Pagination from '../ui/Pagination';
import { Eye, BookOpen, Edit, Trash2, Check, X, Users } from 'lucide-react';

const DEFAULT_CLASSES = [
  { 
    id: '664300000000000000000001', 
    title: 'Advanced Calculus 101', 
    category: 'UNDERGRADUATE', 
    instructorName: 'Prof. Alan Math', 
    schedule: 'Mon, Wed, Fri - 6:00 PM IST', 
    maxCapacity: 20,
    enrolledCount: 2,
    availableSeats: 18,
    description: 'A comprehensive course on multivariable calculus.',
    startDate: '2026-05-23T19:01:48.557',
    endDate: '2026-08-13T19:01:48.557',
    feeInfo: '₹5,000 / month',
    status: 'ACTIVE',
    approvedEnrollments: [],
    allEnrollments: []
  },
];

const EMPTY_FORM = {
  title: '',
  category: 'UNDERGRADUATE',
  instructorName: '',
  schedule: '',
  maxCapacity: 20,
  enrolledCount: 0,
  description: '',
  startDate: '',
  endDate: '',
  feeInfo: '',
  status: 'ACTIVE',
  batchSize: '',
  instructorBio: '',
  additionalInfo: '',
  approvedEnrollments: [],
  allEnrollments: [],
};

export default function RunningClassesManagement() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [enrollmentRequests, setEnrollmentRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [enrollmentPage, setEnrollmentPage] = useState(1);
  const [selectedClassForDetails, setSelectedClassForDetails] = useState(null);
  const [showClassDetailsModal, setShowClassDetailsModal] = useState(false);
  const [selectedEnrollmentClass, setSelectedEnrollmentClass] = useState('all');
  const itemsPerPage = 100;

  const totalPages = Math.ceil(classes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClasses = classes.slice(startIndex, startIndex + itemsPerPage);

  const getClassEnrollmentCount = (classItem) => {
    return classItem.enrolledCount || 0;
  };

  const filteredEnrollmentRequests = selectedEnrollmentClass === 'all'
    ? enrollmentRequests
    : enrollmentRequests.filter((req) => req.classSubject === selectedEnrollmentClass);

  const enrollmentTotalPages = Math.ceil(filteredEnrollmentRequests.length / itemsPerPage);
  const enrollmentStartIndex = (enrollmentPage - 1) * itemsPerPage;
  const paginatedEnrollments = filteredEnrollmentRequests.slice(enrollmentStartIndex, enrollmentStartIndex + itemsPerPage);

  // Fetch classes from backend
  const fetchClasses = async () => {
    try {
      setLoading(true);
      const data = await getAllClassesAdmin({
        page: currentPage - 1,
        size: itemsPerPage
      });
      
      const classList = data.content || (Array.isArray(data) ? data : []);
      setClasses(classList.length > 0 ? classList : DEFAULT_CLASSES);
    } catch (error) {
      console.error('Failed to fetch classes:', error);
      toast.error('Failed to load classes from server');
      setClasses(DEFAULT_CLASSES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClasses(); }, [currentPage]);

  // Load enrollment requests from backend
  const fetchEnrollments = async () => {
    try {
      const data = await getAllEnrollmentsAdmin({
        page: enrollmentPage - 1,
        size: itemsPerPage
      });
      const enrollmentList = data.content || (Array.isArray(data) ? data : []);
      setEnrollmentRequests(enrollmentList);
    } catch (error) {
      console.error('Failed to fetch enrollments:', error);
      setEnrollmentRequests([]);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, [enrollmentPage]);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('icfy_token');
    if (!token) {
      toast.error('You must be logged in as an admin to perform this action.');
      return;
    }

    setSaving(true);
    
    // Create payload with only the fields expected by the backend
    const payload = {
      title: form.title || '',
      description: form.description || '',
      category: form.category || 'UNDERGRADUATE',
      schedule: form.schedule || '',
      batchSize: form.batchSize || '',
      instructorName: form.instructorName || '',
      instructorBio: form.instructorBio || '',
      feeInfo: form.feeInfo || '',
      startDate: form.startDate ? `${form.startDate}T00:00:00` : null,
      endDate: form.endDate ? `${form.endDate}T00:00:00` : null,
      additionalInfo: form.additionalInfo || '',
      status: form.status || 'ACTIVE',
      maxCapacity: Number(form.maxCapacity || 20)
    };

    try {
      if (editId) {
        await updateClassAdmin(editId, payload);
        toast.success('Class updated successfully');
      } else {
        await createClassAdmin(payload);
        toast.success('Class created successfully');
      }
      await fetchClasses();
      setForm(EMPTY_FORM);
      setEditId(null);
      setShowForm(false);
    } catch (error) {
      console.error('Save error:', error);
      const errorMsg = error.message || (error.status === 403 ? 'Access denied. You may not have admin permissions.' : 'Failed to save class.');
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (c) => {
    setForm({
      title: c.title,
      category: c.category,
      instructorName: c.instructorName,
      schedule: c.schedule,
      maxCapacity: Number(c.maxCapacity || 20),
      enrolledCount: Number(c.enrolledCount || 0),
      description: c.description,
      startDate: c.startDate ? c.startDate.split('T')[0] : '',
      endDate: c.endDate ? c.endDate.split('T')[0] : '',
      feeInfo: c.feeInfo || '',
      batchSize: c.batchSize || '',
      instructorBio: c.instructorBio || '',
      additionalInfo: c.additionalInfo || '',
      status: c.status,
      approvedEnrollments: c.approvedEnrollments || [],
      allEnrollments: c.allEnrollments || [],
    });
    setEditId(c.id);
    setShowForm(true);
    setShowClassDetailsModal(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this class?')) return;
    try {
      await deleteClassAdmin(id);
      toast.success('Class deleted successfully');
      await fetchClasses();
    } catch (error) {
      toast.error(error.message || 'Failed to delete class');
    }
    setShowClassDetailsModal(false);
    setSelectedClassForDetails(null);
  };

  const handleConfirmEnrollment = async (id) => {
    try {
      await confirmEnrollmentAdmin(id);
      toast.success('Enrollment confirmed');
      fetchEnrollments();
      fetchClasses();
    } catch (error) {
      toast.error(error.message || 'Failed to confirm enrollment');
    }
  };

  const handleRejectEnrollment = async (id) => {
    const reason = window.prompt('Enter reason for rejection:');
    if (reason === null) return;
    try {
      await rejectEnrollmentAdmin(id, reason);
      toast.success('Enrollment rejected');
      fetchEnrollments();
    } catch (error) {
      toast.error(error.message || 'Failed to reject enrollment');
    }
  };

  const handleDeleteEnrollment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enrollment?')) return;
    try {
      await deleteEnrollmentAdmin(id);
      toast.success('Enrollment deleted');
      fetchEnrollments();
    } catch (error) {
      toast.error(error.message || 'Failed to delete enrollment');
    }
  };

  return (
    <div className="space-y-6 max-w-full">
      <div className="bg-white border-b-2 border-blue-900 rounded-xl p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold text-blue-900">Running Classes Management</h2>
        <p className="text-gray-500 text-xs md:text-sm mt-1">Manage currently running classes, schedules, and student enrollments</p>
      </div>
      <div className="bg-white rounded-xl shadow-md p-3 md:p-6 overflow-hidden">
        <button
          className="mb-6 px-4 py-2 rounded font-bold text-white bg-blue-900 hover:bg-blue-800 transition-colors disabled:opacity-60 text-sm md:text-base"
          disabled={saving}
          onClick={() => {
            setShowForm(!showForm);
            setForm(EMPTY_FORM);
            setEditId(null);
          }}
        >
          {showForm ? 'Cancel' : '+ Add Running Class'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50 p-4 md:p-6 rounded-lg border border-blue-100">
            <div className="md:col-span-2">
              <h3 className="text-lg font-bold text-blue-900 mb-2">{editId ? 'Edit Class' : 'Add New Running Class'}</h3>
            </div>
            
            {/* Basic Information */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Class Title *</label>
              <input
                name="title"
                value={form.title}
                onChange={handleInputChange}
                placeholder="e.g., Advanced Calculus 101"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Category *</label>
              <select
                name="category"
                value={form.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                <option value="UNDERGRADUATE">Undergraduate</option>
                <option value="POST_GRADUATE">Post-Graduate</option>
                <option value="PROFESSIONAL">Professional</option>
              </select>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Instructor Name *</label>
              <input
                name="instructorName"
                value={form.instructorName}
                onChange={handleInputChange}
                placeholder="Instructor Name"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Fee Information</label>
              <input
                name="feeInfo"
                value={form.feeInfo}
                onChange={handleInputChange}
                placeholder="e.g., ₹5,000 / month"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Dates & Duration */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">End Date</label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-700">Schedule *</label>
              <input
                name="schedule"
                value={form.schedule}
                onChange={handleInputChange}
                placeholder="e.g., Mon, Wed, Fri - 6:00 PM IST"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            {/* Capacity & Enrollment */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Max Capacity *</label>
              <input
                type="number"
                name="maxCapacity"
                value={form.maxCapacity}
                onChange={handleInputChange}
                placeholder="20"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                min="1"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 italic">Current Enrollment (Auto)</label>
              <input
                type="text"
                value={form.enrolledCount}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
                disabled
              />
            </div>

            {/* Topics & Prerequisites */}
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-700">Batch Size Info</label>
              <input
                name="batchSize"
                value={form.batchSize}
                onChange={handleInputChange}
                placeholder="e.g., 12-15 students"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-700">Instructor Bio</label>
              <input
                name="instructorBio"
                value={form.instructorBio}
                onChange={handleInputChange}
                placeholder="Brief bio of the instructor"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-700">Additional Info</label>
              <textarea
                name="additionalInfo"
                value={form.additionalInfo}
                onChange={handleInputChange}
                placeholder="Any additional information about the class"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                rows="2"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-700">Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleInputChange}
                placeholder="Class Description"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                rows="3"
                required
              />
            </div>

            {/* Status */}
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-700">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="md:col-span-2 mt-4 px-6 py-3 rounded text-white font-bold bg-blue-900 hover:bg-blue-800 transition-colors disabled:opacity-60 shadow-lg"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </span>
              ) : editId ? 'Update Class' : 'Create Class'}
            </button>
          </form>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-blue-900">
            <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-semibold">Loading classes...</p>
          </div>
        ) : classes.length === 0 ? (
          <div className="text-gray-500 text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            No running classes found. Click "+ Add Running Class" to get started.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="w-full min-w-[800px] divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Instructor</th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Schedule</th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Enrollment</th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fee</th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedClasses.map((c) => {
                  const enrolled = c.enrolledCount || 0;
                  const capacity = c.maxCapacity || 20;
                  const enrollmentPercent = (enrolled / capacity) * 100;
                  
                  return (
                    <tr key={c.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-4 py-4">
                        <div className="text-sm font-bold text-gray-900">{c.title}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">{c.id}</div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-[10px] font-bold border border-blue-100 uppercase">
                          {c.category?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 font-medium">{c.instructorName}</td>
                      <td className="px-4 py-4 text-[11px] text-gray-500 leading-tight max-w-[150px]">{c.schedule}</td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex justify-between items-center text-[10px] font-bold">
                            <span className={enrollmentPercent > 90 ? 'text-red-600' : 'text-gray-600'}>{enrolled}/{capacity}</span>
                            <span className="text-gray-400">{Math.round(enrollmentPercent)}%</span>
                          </div>
                          <div className="w-24 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                enrollmentPercent > 80 ? 'bg-red-500' : 
                                enrollmentPercent > 50 ? 'bg-yellow-500' : 
                                'bg-green-500'
                              }`}
                              style={{width: `${Math.min(enrollmentPercent, 100)}%`}}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm font-bold text-gray-700">{c.feeInfo || '-'}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex px-2 py-1 rounded text-[10px] font-bold text-white shadow-sm ${
                            c.status === 'ACTIVE' ? 'bg-green-600' : 
                            c.status === 'INACTIVE' ? 'bg-gray-400' : 
                            c.status === 'COMPLETED' ? 'bg-blue-600' : 
                            'bg-red-500'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          className="p-2 rounded-full text-blue-600 hover:bg-blue-100 transition-colors"
                          onClick={() => {
                            setSelectedClassForDetails(c);
                            setShowClassDetailsModal(true);
                          }}
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="mt-6 border-t pt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={classes.length}
            itemsPerPage={itemsPerPage}
            alwaysShow={true}
          />
        </div>
      </div>

      {/* Enrollment Requests Section */}
      {enrollmentRequests.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-blue-900 flex items-center gap-2">
                <Users className="text-blue-600" size={20} />
                Enrollment Requests ({filteredEnrollmentRequests.length})
              </h3>
              <p className="text-xs text-gray-500 mt-1">Review and manage student enrollment applications</p>
            </div>
            <div className="w-full lg:w-72">
              <select
                value={selectedEnrollmentClass}
                onChange={(e) => {
                  setSelectedEnrollmentClass(e.target.value);
                  setEnrollmentPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
              >
                <option value="all">All Running Classes ({enrollmentRequests.length})</option>
                {classes.map((classItem) => {
                  const totalRequests = enrollmentRequests.filter((req) => req.classSubject === classItem.title).length;
                  const studentCount = getClassEnrollmentCount(classItem);

                  return (
                    <option key={classItem.id} value={classItem.title}>
                      {classItem.title} ({studentCount} students, {totalRequests} reqs)
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full min-w-[1000px] divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Student Info</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact Details</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Academic Info</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Class & Batch</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Submission</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedEnrollments.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="text-sm font-bold text-blue-900">{req.studentName || req.fullName}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">Parent: {req.parentName || 'N/A'}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-[11px] text-gray-600 flex items-center gap-1.5">
                        <span className="font-bold">📧</span> {req.email}
                      </div>
                      <div className="text-[11px] text-gray-600 mt-1 flex items-center gap-1.5">
                        <span className="font-bold">📱</span> {req.mobileNumber || req.phone}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-[11px] font-bold text-gray-800">{req.gradeOrClass || 'N/A'}</div>
                      <div className="text-[10px] text-gray-500 italic mt-0.5 max-w-[150px] truncate">{req.schoolOrCollege || 'N/A'}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-[11px] font-bold text-gray-800">{req.classSubject}</div>
                      {req.preferredBatch && (
                        <div className="mt-1">
                          <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100 font-bold">
                            {req.preferredBatch}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[10px] text-gray-500">
                      {new Date(req.submittedAt || req.enrollmentDate || Date.now()).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        req.status === 'Approved' || req.status === 'CONFIRMED' ? 'bg-green-50 text-green-700 border-green-200' : 
                        req.status === 'Rejected' || req.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' : 
                        'bg-yellow-50 text-yellow-700 border-yellow-200'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        {(req.status === 'PENDING' || req.status === 'pending') ? (
                          <>
                            <button
                              className="px-2.5 py-1 rounded bg-green-600 text-white text-[10px] font-bold hover:bg-green-700 transition-colors shadow-sm"
                              onClick={() => handleConfirmEnrollment(req.id)}
                            >
                              Approve
                            </button>
                            <button
                              className="px-2.5 py-1 rounded bg-red-600 text-white text-[10px] font-bold hover:bg-red-700 transition-colors shadow-sm"
                              onClick={() => handleRejectEnrollment(req.id)}
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <button
                            className="p-1.5 rounded-full text-red-500 hover:bg-red-50 transition-colors"
                            onClick={() => handleDeleteEnrollment(req.id)}
                            title="Delete Record"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 border-t pt-4">
            <Pagination
              currentPage={enrollmentPage}
              totalPages={enrollmentTotalPages}
              onPageChange={setEnrollmentPage}
              totalItems={filteredEnrollmentRequests.length}
              itemsPerPage={itemsPerPage}
              alwaysShow={true}
            />
          </div>
        </div>
      )}
      
      {/* Class Details Modal */}
      {showClassDetailsModal && selectedClassForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-linear-to-r from-blue-900 to-blue-800 text-white p-6 rounded-t-xl">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">{selectedClassForDetails.title}</h2>
                  <p className="text-blue-100 mt-1">{selectedClassForDetails.category} | {selectedClassForDetails.status}</p>
                </div>
                <button
                  onClick={() => setShowClassDetailsModal(false)}
                  className="text-white hover:text-blue-200 text-3xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen size={20} className="text-blue-600" />
                  Class Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Title</p>
                    <p className="font-semibold">{selectedClassForDetails.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="font-semibold">{selectedClassForDetails.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Instructor</p>
                    <p className="font-semibold">{selectedClassForDetails.instructorName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Schedule</p>
                    <p className="font-semibold">{selectedClassForDetails.schedule}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Enrollment</p>
                    <p className="font-semibold">
                      {getClassEnrollmentCount(selectedClassForDetails)} / {selectedClassForDetails.maxCapacity || 20}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fee Info</p>
                    <p className="font-semibold">{selectedClassForDetails.feeInfo || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-semibold">{selectedClassForDetails.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Start Date</p>
                    <p className="font-semibold">{selectedClassForDetails.startDate || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">End Date</p>
                    <p className="font-semibold">{selectedClassForDetails.endDate || 'N/A'}</p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Batch Size</p>
                    <p className="font-semibold">{selectedClassForDetails.batchSize || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Instructor Bio</p>
                    <p className="font-semibold">{selectedClassForDetails.instructorBio || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Description</p>
                    <p className="font-semibold">{selectedClassForDetails.description || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Additional Info</p>
                    <p className="font-semibold">{selectedClassForDetails.additionalInfo || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleEdit(selectedClassForDetails)}
                  className="flex-1 px-4 py-2 rounded font-bold text-white bg-blue-600 hover:bg-blue-700 inline-flex items-center justify-center gap-2"
                >
                  <Edit size={16} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(selectedClassForDetails.id)}
                  className="flex-1 px-4 py-2 rounded font-bold text-white bg-red-600 hover:bg-red-700 inline-flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} /> Delete
                </button>
                <button
                  onClick={() => setShowClassDetailsModal(false)}
                  className="flex-1 px-4 py-2 rounded font-bold text-white bg-gray-600 hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
