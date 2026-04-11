import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AdminSidebar from './AdminSidebar'
import AdminHome from './AdminHome'
import StudentManagement from './StudentManagement'
import QuestionManagement from './QuestionManagement'
import DemoClassRequests from './DemoClassRequests'
import DemoSettings from './DemoSettings'
import CourseManagement from './CourseManagement'
import RunningClassesManagement from './RunningClassesManagement'
import FeePaymentManagement from './FeePaymentManagement'
import FeedbackManagement from './FeedbackManagement'
import PracticeTestManagement from './PracticeTestManagement'
import HomeworkManagement from './HomeworkManagement'
import TestimonialManagement from './TestimonialManagement'
import TutorManagement from './TutorManagement'
import AnnouncementManagement from './AnnouncementManagement'
import { BlogModerationPage } from './BlogModerationPage'
import { SubscribersPage } from './SubscribersPage'
import { CommentManagement } from './CommentManagement'
import BlogDashboard from './BlogDashboard'
import AdminProfile from './AdminProfile'
import AdminNotifications from './AdminNotifications'
import ContactRequests from './ContactRequests'

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading, isAdmin } = useAuth()
  const { section } = useParams()
  const navigate = useNavigate()
  const currentView = section || 'home'
  const setCurrentView = (view) =>
    navigate(view === 'home' ? '/admin-dashboard' : `/admin-dashboard/${view}`)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Show loading screen while auth is being verified
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-900"></div>
          <p className="mt-4 text-lg font-semibold text-blue-900">Loading...</p>
        </div>
      </div>
    )
  }

  const adminData = {
    name: user?.fullName || 'Admin',
    email: user?.email || 'admin@astarclasses.com',
    role: 'Administrator',
    adminId: user?.adminId || user?.id || 'ADMIN001'
  }

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <AdminHome setCurrentView={setCurrentView} />
      case 'students':
        return <StudentManagement />
      case 'courses':
        return <CourseManagement />
      case 'questions':
        return <QuestionManagement />
      case 'demo-requests':
        return <DemoClassRequests />
      case 'contact-requests':
        return <ContactRequests />
      case 'demo-settings':
        return <DemoSettings />
      case 'running-classes':
        return <RunningClassesManagement />
      case 'homework':
        return <HomeworkManagement />
      case 'practice-tests':
        return <PracticeTestManagement />
      case 'notifications':
        return <AdminNotifications />
      case 'fee-payment':
        return <FeePaymentManagement />
      case 'feedback':
        return <FeedbackManagement />
      case 'testimonials':
        return <TestimonialManagement />
      case 'tutors':
        return <TutorManagement />
      case 'announcements':
        return <AnnouncementManagement />
      case 'blog':
        return <BlogDashboard setCurrentView={setCurrentView} />
      case 'blogs':
        return <BlogModerationPage onBack={() => setCurrentView('blog')} />
      case 'subscribers':
        return <SubscribersPage onBack={() => setCurrentView('blog')} />
      case 'comment-management':
        return <CommentManagement onBack={() => setCurrentView('blog')} />
      case 'profile':
        return <AdminProfile adminData={adminData} />
      default:
        return <AdminHome setCurrentView={setCurrentView} />
    }
  }
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 shadow-xl sticky top-0 z-50">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white p-2 rounded-lg hover:bg-white/10 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">A Star Classes</h1>
              <p className="text-xs text-blue-300">Admin Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button
              onClick={() => setCurrentView('notifications')}
              className="p-2 rounded-lg transition relative text-white hover:bg-white/10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            {/* Admin Profile */}
            <button
              onClick={() => setCurrentView('profile')}
              className="flex items-center gap-3 hover:bg-white/10 rounded-lg px-3 py-2 transition cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg bg-yellow-500 shadow-md">
                {user?.fullName?.charAt(0) || 'A'}
              </div>
              <div className="hidden md:block text-white">
                <p className="font-semibold text-sm">{user?.fullName || 'Admin'}</p>
                <p className="text-xs text-blue-300">Administrator</p>
              </div>
            </button>
          </div>
        </div>
      </header>
      {/* Sidebar */}
      <AdminSidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex">
        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : ''}`}>
          <div className="p-4 md:p-6">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  )
}