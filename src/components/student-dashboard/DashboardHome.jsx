import React from 'react'

export default function DashboardHome({ studentData, setCurrentView }) {
  const stats = [
    { label: 'Enrolled Courses',     value: '5',  border: 'border-blue-700',   text: 'text-blue-900',   change: '+2 this month' },
    { label: 'Pending Assignments',  value: '4',  border: 'border-yellow-400', text: 'text-yellow-600', change: 'Due this week' },
    { label: 'Completed Tasks',      value: '8',  border: 'border-green-500',  text: 'text-green-700',  change: '67% completion' },
    { label: 'Upcoming Classes',     value: '3',  border: 'border-indigo-500', text: 'text-indigo-700', change: 'This week' },
  ]

  const upcomingClasses = [
    { subject: 'Mathematics - Calculus',   tutor: 'Ms. Ramya Rajamani', time: 'Today, 4:00 PM',     duration: '60 min', status: 'upcoming' },
    { subject: 'Physics - Mechanics',      tutor: 'Mr. Ram G. Mohan',   time: 'Tomorrow, 3:00 PM',  duration: '60 min', status: 'upcoming' },
    { subject: 'Chemistry - Organic',      tutor: 'B. Aishwarya',       time: 'Jan 22, 5:00 PM',    duration: '60 min', status: 'scheduled' },
  ]

  const recentAssignments = [
    { title: 'Calculus Problem Set 3',    course: 'Mathematics', dueDate: 'Jan 25, 2026', status: 'pending',   priority: 'high' },
    { title: 'Physics Lab Report',        course: 'Physics',     dueDate: 'Jan 23, 2026', status: 'pending',   priority: 'high' },
    { title: 'Chemistry Quiz 2',          course: 'Chemistry',   dueDate: 'Jan 28, 2026', status: 'pending',   priority: 'medium' },
    { title: 'Linear Algebra Assignment', course: 'Mathematics', dueDate: 'Submitted',    status: 'completed', priority: null },
  ]

  const notifications = [
    { type: 'info',    message: 'New study material added for Calculus',                   time: '2 hours ago' },
    { type: 'success', message: 'Assignment "Physics Lab Report" submitted successfully',  time: '5 hours ago' },
    { type: 'warning', message: 'Upcoming class reminder: Mathematics at 4:00 PM',        time: '1 day ago' },
  ]

  return (
    <div className="space-y-6">

      {/* Welcome Banner */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-blue-900 mb-1">Welcome back, {studentData.name.split(' ')[0]}!</h2>
        <p className="text-gray-500 text-sm mb-4">Ready to continue your learning journey with iThinkLearn?</p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setCurrentView('courses')}
            className="bg-blue-900 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition"
          >
            Browse Courses
          </button>
          <button
            onClick={() => setCurrentView('runningClasses')}
            className="border border-blue-900 text-blue-900 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-white transition"
          >
            Running Classes
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className={`bg-white rounded-xl p-5 border border-gray-200 border-l-4 ${stat.border}`}>
            <p className={`text-3xl font-bold mb-1 ${stat.text}`}>{stat.value}</p>
            <p className="text-gray-700 text-sm font-medium">{stat.label}</p>
            <p className="text-gray-400 text-xs mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setCurrentView('assignments')}
          className="bg-white border border-gray-200 text-blue-900 p-4 rounded-xl font-semibold text-sm hover:bg-white transition text-left"
        >
          Submit Assignment
        </button>
        <button
          onClick={() => setCurrentView('askQuestion')}
          className="bg-white border border-gray-200 text-blue-900 p-4 rounded-xl font-semibold text-sm hover:bg-white transition text-left"
        >
          Ask a Question
        </button>
        <button
          onClick={() => setCurrentView('support')}
          className="bg-white border border-gray-200 text-blue-900 p-4 rounded-xl font-semibold text-sm hover:bg-white transition text-left"
        >
          Get Support
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Classes */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-800">Upcoming Classes</h3>
            <button onClick={() => setCurrentView('runningClasses')} className="text-sm font-semibold text-yellow-500 hover:text-orange-500 transition">View All →</button>
          </div>
          <div className="space-y-3">
            {upcomingClasses.map((cls, i) => (
              <div key={i} className={`p-4 rounded-lg border-l-4 bg-white ${cls.status === 'upcoming' ? 'border-yellow-400' : 'border-blue-700'}`}>
                <h4 className="font-bold text-blue-900 text-sm mb-1">{cls.subject}</h4>
                <p className="text-xs text-gray-600 mb-2">Tutor: {cls.tutor}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-700">{cls.time}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold text-white ${cls.status === 'upcoming' ? 'bg-blue-900 text-white' : 'bg-blue-900'}`}>
                    {cls.duration}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Assignments */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-800">Recent Assignments</h3>
            <button onClick={() => setCurrentView('assignments')} className="text-sm font-semibold text-yellow-500 hover:text-orange-500 transition">View All →</button>
          </div>
          <div className="space-y-3">
            {recentAssignments.map((a, i) => (
              <div key={i} className={`p-4 rounded-lg border-l-4 ${a.status === 'completed' ? 'bg-white border-green-500' : a.priority === 'high' ? 'bg-white border-red-400' : 'bg-white border-yellow-400'}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-blue-900 text-sm">{a.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{a.course} · Due: {a.dueDate}</p>
                  </div>
                  <span className={`shrink-0 px-2.5 py-0.5 rounded-full text-xs font-bold text-white ${
                    a.status === 'completed' ? 'bg-green-500' : a.priority === 'high' ? 'bg-red-400' : 'bg-blue-900'
                  }`}>
                    {a.status === 'completed' ? 'Done' : a.priority === 'high' ? 'High' : 'Medium'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-800">Recent Notifications</h3>
          <button onClick={() => setCurrentView('notifications')} className="text-sm font-semibold text-yellow-500 hover:text-orange-500 transition">View All →</button>
        </div>
        <div className="space-y-3">
          {notifications.map((n, i) => (
            <div key={i} className="py-3 border-b border-gray-100 last:border-0">
              <p className="text-sm text-gray-700">{n.message}</p>
              <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
