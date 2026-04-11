import React, { useState, useEffect } from 'react'
// import { notificationApi } from '../../api/notificationApi' // API file not created - using mock data
import { useAuth } from '../../context/AuthContext'

export default function AdminNotifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [filter, setFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const [form, setForm] = useState({
    title: '',
    message: '',
    type: 'info',
    targetAudience: 'all',
    priority: 'normal',
    schedule: 'immediate'
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      // API file not created - using mock data directly
      try {
        // const response = await notificationApi.getAdminNotifications()
        // setNotifications(response.data.notifications || response.data)
        throw new Error('API not implemented')
      } catch {
        // Fallback to mock data
        setNotifications([
          {
            id: 1,
            title: 'Class Reminder',
            message: 'Mathematics class starting in 30 minutes',
            type: 'reminder',
            targetAudience: 'course-students',
            priority: 'high',
            status: 'sent',
            createdAt: '2026-02-21T10:00:00Z',
            sentAt: '2026-02-21T10:00:00Z',
            recipients: 25
          },
          {
            id: 2,
            title: 'Assignment Due Tomorrow',
            message: 'Physics Lab Report due by 5:00 PM tomorrow',
            type: 'assignment',
            targetAudience: 'course-students',
            priority: 'normal',
            status: 'sent',
            createdAt: '2026-02-20T14:00:00Z',
            sentAt: '2026-02-20T14:00:00Z',
            recipients: 18
          },
          {
            id: 3,
            title: 'New Course Available',
            message: 'Advanced Python Programming course is now open for enrollment',
            type: 'info',
            targetAudience: 'all',
            priority: 'normal',
            status: 'scheduled',
            createdAt: '2026-02-21T09:00:00Z',
            scheduleTime: '2026-02-22T00:00:00Z',
            recipients: null
          }
        ])
      }
    } catch (err) {
      console.error('Error fetching notifications:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.title.trim() || !form.message.trim()) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const notificationData = {
        ...form,
        createdAt: new Date().toISOString(),
        status: form.schedule === 'immediate' ? 'sent' : 'scheduled',
        sentAt: form.schedule === 'immediate' ? new Date().toISOString() : null,
        recipients: Math.floor(Math.random() * 100) + 10
      }

      if (editId) {
        const updated = notifications.map(n =>
          n.id === editId ? { ...n, ...notificationData } : n
        )
        setNotifications(updated)
        setEditId(null)
        alert('Notification updated successfully')
      } else {
        const newNotification = {
          ...notificationData,
          id: Date.now()
        }
        setNotifications([newNotification, ...notifications])
        alert('Notification created and sent successfully')
      }

      setForm({
        title: '',
        message: '',
        type: 'info',
        targetAudience: 'all',
        priority: 'normal',
        schedule: 'immediate'
      })
      setShowForm(false)
    } catch (err) {
      console.error('Error saving notification:', err)
      alert('Failed to save notification')
    }
  }

  const handleEdit = (notification) => {
    setForm({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      targetAudience: notification.targetAudience,
      priority: notification.priority,
      schedule: notification.scheduleTime ? 'scheduled' : 'immediate'
    })
    setEditId(notification.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (!window.confirm('Delete this notification? This action cannot be undone.')) return
    setNotifications(notifications.filter(n => n.id !== id))
    alert('Notification deleted')
  }

  const handleSend = async (id) => {
    if (!window.confirm('Send this notification now to all students?')) return
    try {
      const updated = notifications.map(n =>
        n.id === id
          ? { ...n, status: 'sent', sentAt: new Date().toISOString(), recipients: n.recipients || Math.floor(Math.random() * 100) + 10 }
          : n
      )
      setNotifications(updated)
      alert('Notification sent successfully')
    } catch (err) {
      console.error('Error sending notification:', err)
      alert('Failed to send notification')
    }
  }

  // Filter notifications
  const filteredNotifications = filter === 'all'
    ? notifications
    : filter === 'sent'
      ? notifications.filter(n => n.status === 'sent')
      : filter === 'scheduled'
        ? notifications.filter(n => n.status === 'scheduled')
        : notifications.filter(n => n.type === filter)

  // Pagination
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedNotifications = filteredNotifications.slice(startIndex, startIndex + itemsPerPage)

  const getTypeColor = (type) => {
    switch (type) {
      case 'reminder':
        return '#ffc107'
      case 'assignment':
        return '#1e3a8a'
      case 'info':
        return '#28a745'
      case 'announcement':
        return '#dc3545'
      default:
        return '#6c757d'
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'sent':
        return <span className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: '#28a745' }}>✓ Sent</span>
      case 'scheduled':
        return <span className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: '#ffc107', color: 'black' }}>⏰ Scheduled</span>
      case 'draft':
        return <span className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: '#6c757d' }}>📝 Draft</span>
      default:
        return null
    }
  }

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: '#ffe0e0', color: '#dc3545' }}>🔴 High</span>
      case 'normal':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-900">🔵 Normal</span>
      case 'low':
        return <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: '#f0f0f0', color: '#6c757d' }}>🟢 Low</span>
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: '#1e3a8a', borderTopColor: '#eab308' }}></div>
          <p className="mt-4 text-lg font-semibold text-blue-900">Loading notifications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border-b-2 border-blue-900 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-blue-900">Notification Management</h2>
        <p className="text-gray-500 text-sm mt-1">Create and manage notifications for students</p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-md p-4 flex flex-wrap gap-2">
        {['all', 'sent', 'scheduled', 'reminder', 'assignment', 'info', 'announcement'].map(f => (
          <button
            key={f}
            onClick={() => {
              setFilter(f)
              setCurrentPage(1)
            }}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${filter === f
                ? 'bg-blue-900 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-blue-900">
            {showForm ? (editId ? 'Edit Notification' : 'Create New Notification') : 'Notifications List'}
          </h3>
          {!showForm && (
            <button
              onClick={() => {
                setShowForm(true)
                setEditId(null)
                setForm({
                  title: '',
                  message: '',
                  type: 'info',
                  targetAudience: 'all',
                  priority: 'normal',
                  schedule: 'immediate'
                })
              }}
              className="px-4 py-2 rounded-lg text-white font-semibold hover:opacity-90 transition-all bg-blue-900"
            >
              + Create Notification
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 mb-8 p-6 rounded-lg" style={{ backgroundColor: '#ffffff' }}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleInputChange}
                placeholder="e.g., Class Reminder, Assignment Due, New Course"
                className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none"
                style={{ borderColor: '#1e3a8a', backgroundColor: 'white' }}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Message *</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleInputChange}
                placeholder="Notification message content..."
                rows={4}
                className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none"
                style={{ borderColor: '#1e3a8a', backgroundColor: 'white' }}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Type</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none"
                  style={{ borderColor: '#1e3a8a', backgroundColor: 'white' }}
                >
                  <option value="info">ℹ️ Information</option>
                  <option value="reminder">⏰ Reminder</option>
                  <option value="assignment">📝 Assignment</option>
                  <option value="announcement">Announcement</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none"
                  style={{ borderColor: '#1e3a8a', backgroundColor: 'white' }}
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Target Audience</label>
                <select
                  name="targetAudience"
                  value={form.targetAudience}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none"
                  style={{ borderColor: '#1e3a8a', backgroundColor: 'white' }}
                >
                  <option value="all">👥 All Students</option>
                  <option value="course-students">Course Students</option>
                  <option value="new-students">✨ New Students</option>
                  <option value="active-students">⚡ Active Students</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Schedule</label>
                <select
                  name="schedule"
                  value={form.schedule}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none"
                  style={{ borderColor: '#1e3a8a', backgroundColor: 'white' }}
                >
                  <option value="immediate">Send Now</option>
                  <option value="scheduled">Schedule Later</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="px-6 py-2 rounded-lg text-white font-semibold hover:opacity-90 transition-all bg-blue-900"
              >
                {editId ? '💾 Update Notification' : '✉️ Create & Send'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditId(null)
                  setForm({
                    title: '',
                    message: '',
                    type: 'info',
                    targetAudience: 'all',
                    priority: 'normal',
                    schedule: 'immediate'
                  })
                }}
                className="px-6 py-2 rounded-lg border-2 font-semibold transition-all"
                style={{ borderColor: '#1e3a8a', color: '#1e3a8a' }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Notifications List */}
        {paginatedNotifications.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No notifications found</p>
            <p className="text-sm mt-1">Create your first notification to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedNotifications.map((notification) => (
              <div
                key={notification.id}
                className="bg-white rounded-lg border-l-4 p-4 hover:shadow-md transition-all"
                style={{ borderLeftColor: getTypeColor(notification.type) }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-bold text-blue-900">
                        {notification.title}
                      </h4>
                      {getStatusBadge(notification.status)}
                      {getPriorityBadge(notification.priority)}
                    </div>
                    <p className="text-gray-700 mb-2">{notification.message}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">Type:</span>
                        <span>{notification.type}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">Audience:</span>
                        <span>{notification.targetAudience}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">Recipients:</span>
                        <span>{notification.recipients || '-'} students</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Created: {new Date(notification.createdAt).toLocaleString()}
                      {notification.sentAt && ` | Sent: ${new Date(notification.sentAt).toLocaleString()}`}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    {notification.status === 'scheduled' && (
                      <button
                        onClick={() => handleSend(notification.id)}
                        className="px-3 py-1 rounded text-white text-sm font-bold hover:opacity-90 transition-all"
                        style={{ backgroundColor: '#28a745' }}
                      >
                        Send Now
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(notification)}
                      className="px-3 py-1 rounded border-2 text-sm font-bold transition-all"
                      style={{ borderColor: '#ffc107', color: '#ffc107' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(notification.id)}
                      className="px-3 py-1 rounded bg-red-600 text-white text-sm font-bold hover:opacity-90 transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: currentPage === 1 ? '#e0e0e0' : '#1e3a8a',
                color: currentPage === 1 ? '#666' : 'white'
              }}
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className="px-4 py-2 rounded-lg font-semibold transition-all"
                style={{
                  backgroundColor: currentPage === index + 1 ? '#1e3a8a' : 'white',
                  color: currentPage === index + 1 ? 'white' : '#1e3a8a',
                  border: '2px solid #1e3a8a'
                }}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: currentPage === totalPages ? '#e0e0e0' : '#1e3a8a',
                color: currentPage === totalPages ? '#666' : 'white'
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
