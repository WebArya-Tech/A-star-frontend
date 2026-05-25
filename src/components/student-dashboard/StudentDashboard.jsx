import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import StudentSidebar from './StudentSidebar'
import DashboardHome from './DashboardHome'
import MyCourses from './MyCourses'
import MyAssignments from './MyAssignments'
import MyProfile from './MyProfile'
import Notifications from './Notifications'
import SupportHelp from './SupportHelp'
import Homework from './Homework'
import PracticeTests from './PracticeTests'
import AskQuestion from './AskQuestion'
import RunningClasses from './RunningClasses'
import Announcements from './Announcements'
import FeePayment from './FeePayment'
import FeedbackReviews from './FeedbackReviews'
import Testimonials from './Testimonials'

export default function StudentDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const { section } = useParams()
  const navigate = useNavigate()
  const currentView = section || 'home'
  const setCurrentView = (view) =>
    navigate(view === 'home' ? '/student-dashboard' : `/student-dashboard/${view}`)
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

  // Student data from auth context
  const studentData = {
    name: user.fullName || user.name || user.email?.split('@')[0] || 'Student',
    email: user.email,
    phone: user.phone || '',
    studentId: user.studentId,
    enrollmentDate: user.enrollmentDate,
    profileImage: '',
    courses: 5,
    assignments: 12,
    completedAssignments: 8
  }

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <DashboardHome studentData={studentData} setCurrentView={setCurrentView} />
      case 'courses':
        return <MyCourses />
      case 'homework':
        return <Homework />
      case 'assignments':
        return <MyAssignments />
      case 'practice-tests':
        return <PracticeTests />
      case 'running-classes':
        return <RunningClasses />
      case 'ask-question':
        return <AskQuestion />
      case 'announcements':
        return <Announcements />
      case 'notifications':
        return <Notifications />
      case 'fee-payment':
        return <FeePayment />
      case 'feedback':
        return <FeedbackReviews />
      case 'testimonials':
        return <Testimonials />
      case 'profile':
        return <MyProfile studentData={studentData} />
      case 'support':
        return <SupportHelp />
      default:
        return <DashboardHome studentData={studentData} setCurrentView={setCurrentView} />
    }
  }

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Header - Fixed */}
      <header className="bg-linear-to-r from-blue-900 via-blue-800 to-indigo-900 shadow-xl flex-shrink-0 z-50">
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
              <h1 className="text-xl font-bold text-white">iThinkLearn</h1>
              <p className="text-xs text-blue-300">Student Portal</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* User Profile */}
            <button 
              onClick={() => setCurrentView('profile')}
              className="flex items-center gap-3 hover:bg-white/10 rounded-lg px-3 py-2 transition cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-lg bg-blue-700 shadow-md">
                {(studentData.name || '').split(' ').map(n => n[0]).join('')}
              </div>
              <div className="hidden md:block text-white">
                <p className="font-semibold text-sm">{studentData.name}</p>
                <p className="text-xs text-blue-300">Student</p>
              </div>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Fixed */}
        <StudentSidebar 
          currentView={currentView} 
          setCurrentView={setCurrentView}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Main Content - Scrollable */}
        <main className={`flex-1 overflow-y-auto transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
          <div className="p-6">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  )
}
