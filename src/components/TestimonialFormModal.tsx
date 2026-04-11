import React, { useState, useEffect } from 'react';
import { X, Star, Upload, Video, Camera, Send, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { getPublicTeachers } from '../api/api/teacherApi';
import { submitTestimonial } from '../api/api/testimonialApi';
import { uploadToCloudinary } from '../utils/cloudinaryUpload';

const TestimonialFormModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    teacherId: '',
    reviewerName: '',
    role: 'Student', // Student or Parent
    rating: 5,
    content: '', // This will hold the review text or media URL
    type: 'text', // text, video, or audio (based on what's submitted)
  });
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchTeachers();
    }
  }, [isOpen]);

  const fetchTeachers = async () => {
    try {
      const data = await getPublicTeachers();
      setTeachers(data?.content || (Array.isArray(data) ? data : []));
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (max 50MB for videos, 5MB for images)
    const isImage = file.type.startsWith('image/');
    const maxSize = isImage ? 5 * 1024 * 1024 : 50 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error(`File size too large. Max ${isImage ? '5MB' : '50MB'} allowed.`);
      return;
    }

    setMediaFile(file);
    let type = 'text';
    if (file.type.startsWith('video/')) type = 'video';
    else if (file.type.startsWith('audio/')) type = 'audio';
    else if (file.type.startsWith('image/')) type = 'image';

    setFormData(prev => ({ ...prev, type }));

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => setMediaPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.teacherId || !formData.reviewerName || !formData.content) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      let finalContent = formData.content;

      // 1. If media exists, upload to Cloudinary first
      if (mediaFile) {
        setUploading(true);
        toast.loading('Uploading media...', { id: 'upload-toast' });
        const mediaUrl = await uploadToCloudinary(mediaFile);
        finalContent = mediaUrl; // For media testimonials, content is the URL
        toast.success('Media uploaded!', { id: 'upload-toast' });
        setUploading(false);
      }

      // 2. Submit to backend
      await submitTestimonial({
        ...formData,
        content: finalContent
      });

      toast.success('Testimonial submitted successfully! It will be visible after admin approval.');
      onClose();
      resetForm();
    } catch (error: any) {
      console.error('Submission error:', error);
      toast.error(error.message || 'Failed to submit testimonial');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      teacherId: '',
      reviewerName: '',
      role: 'Student',
      rating: 5,
      content: '',
      type: 'text',
    });
    setMediaFile(null);
    setMediaPreview(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-6 flex justify-between items-center shrink-0">
          <div>
            {/* Share Your Success Story */}
            <h3 className="text-xl font-bold text-white">Share Your Success Story</h3>
            <p className="text-blue-200 text-xs mt-1">Tell us about your journey with A Star Classes</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Reviewer Name */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                Your Full Name *
              </label>
              <input
                type="text"
                name="reviewerName"
                value={formData.reviewerName}
                onChange={handleInputChange}
                placeholder="e.g. Jane Doe"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            {/* Teacher Selection */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                Select Teacher *
              </label>
              <select
                name="teacherId"
                value={formData.teacherId}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all"
                required
              >
                <option value="">Select a teacher...</option>
                {teachers.map(teacher => (
                  <option key={teacher.id || teacher._id} value={teacher.id || teacher._id}>
                    {teacher.fullName || teacher.name} {teacher.subject ? `(${teacher.subject})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Role */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                I am a... *
              </label>
              <div className="flex gap-4">
                {['Student', 'Parent'].map(role => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role }))}
                    className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all ${formData.role === role
                      ? 'bg-blue-900 border-blue-900 text-white'
                      : 'border-gray-100 text-gray-500 hover:border-blue-200'
                      }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                Rating *
              </label>
              <div className="flex gap-2 p-2 bg-gray-50 rounded-xl justify-center">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                    className="p-1 hover:scale-125 transition-transform"
                  >
                    <Star
                      size={28}
                      className={star <= formData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Testimonial Content / Text */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              Your Review *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={4}
              placeholder="Write your success story or paste a video link..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all resize-none"
              required
            />
          </div>

          {/* Media Upload Section */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              Upload Image, Video or Audio (Optional)
            </label>

            {!mediaPreview ? (
              <div
                className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-blue-900 hover:bg-blue-50/50 transition-all cursor-pointer group"
                onClick={() => document.getElementById('media-upload').click()}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-white transition-colors">
                    <Upload size={32} className="text-gray-400 group-hover:text-blue-900" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-700">Click to upload media</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, MP4, MOV, or MP3</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden bg-gray-900 aspect-video group">
                {formData.type === 'video' ? (
                  <video src={mediaPreview} className="w-full h-full object-contain" controls />
                ) : formData.type === 'image' ? (
                  <img src={mediaPreview} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-900 text-white p-8">
                    <p className="font-bold">Audio File Selected</p>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => { setMediaFile(null); setMediaPreview(null); }}
                  className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                >
                  <X size={18} />
                </button>
              </div>
            )}
            <input
              id="media-upload"
              type="file"
              accept="image/*,video/*,audio/*"
              onChange={handleMediaChange}
              className="hidden"
            />
          </div>

          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl text-blue-800 text-xs leading-relaxed">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <p>
              By submitting, you agree to allow A Star Classes to display your review publicly.
              Our admins will review your testimonial before it goes live.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || uploading}
            className={`w-full py-4 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white font-black text-lg shadow-xl shadow-blue-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:scale-100`}
          >
            {loading ? (
              <>
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </>
            ) : (
              <>
                <Send size={22} />
                Submit Testimonial
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TestimonialFormModal;
