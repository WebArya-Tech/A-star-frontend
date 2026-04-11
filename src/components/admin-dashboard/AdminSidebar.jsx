import React from 'react'
import { useAuth } from '../../context/AuthContext'

export default function AdminSidebar({ currentView, setCurrentView, sidebarOpen, setSidebarOpen }) {
  const { logout } = useAuth()

  const menuItems = [
    { id: 'home', label: 'Dashboard' },
    { id: 'students', label: 'Students' },
    { id: 'courses', label: 'Courses' },
    { id: 'running-classes', label: 'Running Classes' },
    { id: 'fee-payment', label: 'Fee Payments' },
    { id: 'demo-settings', label: 'Demo Settings' },
    { id: 'demo-requests', label: 'Demo Requests' },
    { id: 'contact-requests', label: 'Contact Requests' },
    { id: 'homework', label: 'Homework' },
    { id: 'practice-tests', label: 'Practice Tests' },
    { id: 'questions', label: 'Q&A Management' },
    { id: 'announcements', label: 'Announcements' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'feedback', label: 'Feedback' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'tutors', label: 'Tutors' },
    { id: 'blog', label: 'Blog' },
    { id: 'profile', label: 'Profile' },
  ]

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout()
      window.history.pushState({}, '', '/')
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }

  const handleItemClick = (id) => {
    setCurrentView(id)
    if (window.innerWidth < 1024) setSidebarOpen(false)
  }

  return (
    <>
      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-white shadow-xl border-r border-gray-200 flex flex-col z-40 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Sidebar Header - Hidden on desktop to prevent overlap with main dashboard header */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 px-5 py-4 flex items-center justify-between shrink-0 lg:hidden">
          <div>
            <p className="text-white font-bold text-base">A Star Classes</p>
            <p className="text-blue-300 text-xs">Admin Portal</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white/70 hover:text-white transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`w-full text-left px-5 py-3 text-sm transition-all border-l-4 ${currentView === item.id
                ? 'bg-white text-blue-900 font-semibold border-yellow-400'
                : 'text-gray-600 hover:bg-white hover:text-blue-900 border-transparent'
                }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="px-5 py-4 border-t border-gray-200 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 rounded-lg bg-blue-900 text-white font-semibold hover:bg-blue-800 transition text-sm"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
