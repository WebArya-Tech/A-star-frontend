import React, { useState, useEffect } from 'react';
import { Star, Trash2, Check, X, AlertCircle, Eye, Plus, Video, Music, FileText, Image as ImageIcon, Upload, Send, Save, Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getAllTestimonials,
  approveTestimonial,
  rejectTestimonial,
  deleteTestimonial,
  setPrimaryTestimonial,
  submitTestimonial,
  updateTestimonial,
  createTestimonialAdmin,
  exportTestimonialsToCSV
} from '../../api/api/testimonialApi.js';
import { getPublicTeachers } from '../../api/api/teacherApi';
import { uploadToCloudinary } from '../../utils/cloudinaryUpload';

export default function TestimonialManagement() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);
  const [viewModal, setViewModal] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [teachers, setTeachers] = useState([]);
  
  const [formData, setFormData] = useState({
    text: '',
    mediaUrl: ''
  });
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, [selectedStatus]);

  const fetchTeachers = async () => {
    try {
      const data = await getPublicTeachers();
      setTeachers(data?.content || (Array.isArray(data) ? data : []));
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const data = await getAllTestimonials();
      const testimonialList = data?.content || (Array.isArray(data) ? data : []);
      setTestimonials(testimonialList);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error('Failed to load testimonials');
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const maxSize = isImage ? 5 * 1024 * 1024 : 50 * 1024 * 1024;
    
    if (file.size > maxSize) {
      toast.error(`File size too large. Max ${isImage ? '5MB' : '50MB'} allowed.`);
      return;
    }

    setMediaFile(file);
    // When media is selected, type will be set to URL during upload/submit
    setFormData(prev => ({ ...prev, type: 'URL' }));

    const reader = new FileReader();
    reader.onloadend = () => setMediaPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.text && !mediaFile) {
      toast.error('Please provide at least text or media');
      return;
    }

    setActionLoading('submitting');
    try {
      let finalMediaUrl = formData.mediaUrl;

      if (mediaFile) {
        setUploading(true);
        const uploadedUrl = await uploadToCloudinary(mediaFile);
        finalMediaUrl = uploadedUrl;
        setUploading(false);
      }

      const payload = {
        text: formData.text,
        mediaUrl: finalMediaUrl
      };

      if (editingId) {
        await updateTestimonial(editingId, payload);
        toast.success('Testimonial updated successfully');
      } else {
        await createTestimonialAdmin(payload);
        toast.success('Testimonial added successfully');
      }

      setIsAdding(false);
      setEditingId(null);
      resetForm();
      fetchTestimonials();
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error?.message || 'Failed to save testimonial');
    } finally {
      setActionLoading(null);
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      text: '',
      mediaUrl: ''
    });
    setMediaFile(null);
    setMediaPreview(null);
  };

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await approveTestimonial(id);
      setTestimonials((prev) =>
        prev.map((t) => (t.id === id || t._id === id) ? { ...t, status: 'APPROVED' } : t)
      );
      toast.success('Testimonial approved');
    } catch (error) {
      console.error('Error approving testimonial:', error);
      toast.error('Failed to approve testimonial');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(id);
    try {
      await rejectTestimonial(id);
      setTestimonials((prev) =>
        prev.map((t) => (t.id === id || t._id === id) ? { ...t, status: 'REJECTED' } : t)
      );
      toast.success('Testimonial rejected');
    } catch (error) {
      console.error('Error rejecting testimonial:', error);
      toast.error('Failed to reject testimonial');
    } finally {
      setActionLoading(null);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await exportTestimonialsToCSV();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `testimonials-export-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Export started');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export testimonials');
    }
  };

  const handleSetPrimary = async (id) => {
    setActionLoading(id);
    try {
      await setPrimaryTestimonial(id);
      // In many systems, setting one primary unsets others, 
      // but let's just toggle or set the current one based on typical backend behavior
      setTestimonials((prev) =>
        prev.map((t) => (t.id === id || t._id === id) ? { ...t, primary: true } : { ...t, primary: false })
      );
      toast.success('Testimonial set as primary');
    } catch (error) {
      console.error('Error setting primary testimonial:', error);
      toast.error('Failed to set primary testimonial');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = (t) => {
    const id = t.id || t._id;
    setEditingId(id);
    setFormData({
      text: t.text || t.message || t.quote || t.content || '',
      mediaUrl: t.mediaUrl || t.videoUrl || t.image || ''
    });
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    setActionLoading(id);
    try {
      await deleteTestimonial(id);
      setTestimonials((prev) => prev.filter((t) => (t.id !== id && t._id !== id)));
      toast.success('Testimonial deleted');
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast.error('Failed to delete testimonial');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredTestimonials =
    selectedStatus === 'all'
      ? testimonials
      : testimonials.filter((t) => t.status === selectedStatus);

  const statusBadge = (status) => {
    const s = (status || 'PENDING').toUpperCase();
    const map = {
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${map[s] || map.PENDING}`}>
        {s}
      </span>
    );
  };

  const typeIcon = (type) => {
    switch (type) {
      case 'video': return <Video size={14} className="text-blue-600" />;
      case 'audio': return <Music size={14} className="text-purple-600" />;
      case 'image': return <ImageIcon size={14} className="text-green-600" />;
      default: return <FileText size={14} className="text-gray-600" />;
    }
  };

  const stats = [
    { label: 'Total', count: testimonials.length, color: 'bg-blue-900 text-white' },
    { label: 'Pending', count: testimonials.filter(t => (t.status || '').toUpperCase() === 'PENDING').length, color: 'bg-yellow-100 text-yellow-800' },
    { label: 'Approved', count: testimonials.filter(t => (t.status || '').toUpperCase() === 'APPROVED').length, color: 'bg-green-100 text-green-800' },
    { label: 'Rejected', count: testimonials.filter(t => (t.status || '').toUpperCase() === 'REJECTED').length, color: 'bg-red-100 text-red-800' },
  ];

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="bg-white border-b-2 border-blue-900 rounded-xl p-6 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-blue-900">Testimonial Management</h1>
          <p className="text-gray-500 text-sm mt-1">Review, approve, and manage student testimonials</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-3 border-2 border-blue-900 text-blue-900 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-sm"
          >
            <Upload size={20} className="rotate-180" /> Export CSV
          </button>
          {!isAdding && (
            <button 
              onClick={() => { setEditingId(null); resetForm(); setIsAdding(true); }}
              className="flex items-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20"
            >
              <Plus size={20} /> Add Testimonial
            </button>
          )}
        </div>
      </div>

      {/* Add/Edit Testimonial In-line Form */}
      {isAdding && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800 text-blue-900">
              {editingId ? 'Edit Testimonial' : 'Add New Testimonial'}
            </h2>
            <button onClick={() => { setIsAdding(false); setEditingId(null); resetForm(); }} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Testimonial Text</label>
                <textarea 
                  name="text" 
                  rows="5" 
                  required
                  value={formData.text} 
                  onChange={handleInputChange} 
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none resize-none" 
                  placeholder="Enter the student's review text here..."
                ></textarea>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Media Upload (Image/Video/Audio)</label>
                  <div className="flex items-center gap-4">
                    {mediaPreview ? (
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-900 shadow-sm">
                        <img src={mediaPreview} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button" 
                          onClick={() => { setMediaFile(null); setMediaPreview(null); }}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 shadow-md"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-lg bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                        <Upload size={24} />
                      </div>
                    )}
                    <label className="flex-1 cursor-pointer">
                      <div className="flex flex-col items-center justify-center gap-1 px-4 py-4 bg-blue-50 border-2 border-dashed border-blue-200 rounded-xl hover:bg-blue-100 transition-all group">
                        <ImageIcon size={20} className="text-blue-600 group-hover:scale-110 transition-transform" />
                        <span className="text-xs text-blue-700 font-bold uppercase tracking-tight">
                          {uploading ? 'Uploading...' : 'Choose Media File'}
                        </span>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*,video/*,audio/*"
                        onChange={handleMediaChange}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Or Paste Media URL</label>
                  <input 
                    name="mediaUrl"
                    type="url"
                    value={formData.mediaUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                    placeholder="https://example.com/video.mp4"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button 
                type="button" 
                onClick={() => { setIsAdding(false); setEditingId(null); resetForm(); }} 
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={actionLoading === 'submitting' || uploading}
                className="px-8 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition shadow-md flex items-center gap-2 disabled:opacity-70"
              >
                {actionLoading === 'submitting' ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Save size={18} />
                )}
                {editingId ? 'Update Testimonial' : 'Create Testimonial'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-xl p-4 text-center font-semibold ${s.color}`}>
            <div className="text-2xl font-bold">{s.count}</div>
            <div className="text-xs mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3 flex-wrap mb-6">
        {['all', 'pending', 'approved', 'rejected'].map((s) => (
          <button
            key={s}
            onClick={() => setSelectedStatus(s)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${selectedStatus === s
              ? 'bg-blue-900 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading testimonials...</p>
        </div>
      ) : filteredTestimonials.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <AlertCircle className="mx-auto mb-3 text-gray-400" size={40} />
          <p className="text-gray-600">
            No {selectedStatus !== 'all' ? selectedStatus : ''} testimonials found
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-900 text-white text-left">
                <th className="px-4 py-3 font-semibold">#</th>
                <th className="px-4 py-3 font-semibold">Content Preview</th>
                <th className="px-4 py-3 font-semibold">Media</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTestimonials.map((t, idx) => {
                const id = t.id || t._id;
                const mediaUrl = t.mediaUrl || t.content || t.videoUrl || t.image;
                const isMedia = !!mediaUrl && mediaUrl.startsWith('http');
                
                return (
                  <tr key={id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                    <td className="px-4 py-3 text-gray-800 font-medium max-w-[300px]">
                      <span className="line-clamp-2">{t.text || t.message || t.quote || t.content}</span>
                    </td>
                    <td className="px-4 py-3">
                      {isMedia ? (
                        <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-2 py-1 rounded-lg w-fit">
                          <ImageIcon size={14} />
                          <span className="text-[10px] font-bold uppercase">Linked Media</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs italic">Text Only</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        {statusBadge(t.status)}
                        {t.primary && (
                          <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter w-fit">
                            Primary
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        <button
                          onClick={() => setViewModal(t)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors text-xs font-medium"
                          title="View details"
                        >
                          <Eye size={13} /> View
                        </button>
                        {(!t.status || t.status.toUpperCase() === 'PENDING') && (
                          <>
                            <button
                              onClick={() => handleApprove(id)}
                              disabled={actionLoading === id}
                              className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 text-xs font-medium"
                            >
                              <Check size={13} /> Approve
                            </button>
                            <button
                              onClick={() => handleReject(id)}
                              disabled={actionLoading === id}
                              className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 text-xs font-medium"
                            >
                              <X size={13} /> Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleSetPrimary(id)}
                          disabled={actionLoading === id}
                          className="flex items-center gap-1 px-3 py-1.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50 text-xs font-medium"
                        >
                          <Star size={13} /> {t.primary ? 'Featured' : 'Set Primary'}
                        </button>
                        <button
                          onClick={() => handleEdit(t)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-xs font-medium"
                          title="Edit details"
                        >
                          <Edit size={13} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(id)}
                          disabled={actionLoading === id}
                          className="flex items-center gap-1 px-3 py-1.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 text-xs font-medium"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* View Message Modal */}
      {viewModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setViewModal(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-blue-900">{viewModal.name}</h3>
                <p className="text-sm text-gray-500">{viewModal.role}</p>
              </div>
              <button
                onClick={() => setViewModal(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            <div className="flex gap-0.5 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < viewModal.rating ? 'fill-[#eab308] text-[#eab308]' : 'text-gray-300'}
                />
              ))}
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">{viewModal.message || viewModal.content}</p>

            {viewModal.type === 'video' && (
              <div className="rounded-xl overflow-hidden bg-black aspect-video mb-4">
                <iframe 
                  src={viewModal.videoUrl || viewModal.content} 
                  className="w-full h-full" 
                  allowFullScreen
                ></iframe>
              </div>
            )}

            {viewModal.type === 'image' && (
              <div className="rounded-xl overflow-hidden bg-gray-100 border border-gray-200 mb-4">
                <img 
                  src={viewModal.image || viewModal.content} 
                  className="w-full h-auto max-h-[400px] object-contain mx-auto" 
                  alt="Testimonial Preview"
                />
              </div>
            )}

            {viewModal.type === 'audio' && (
              <div className="bg-purple-50 p-4 rounded-xl mb-4">
                <audio src={viewModal.audioUrl || viewModal.content} controls className="w-full" />
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                onClick={() => setViewModal(null)}
                className="px-6 py-2 bg-blue-900 text-white rounded-lg font-bold hover:bg-blue-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
