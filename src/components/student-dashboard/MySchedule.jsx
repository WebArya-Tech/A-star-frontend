import React, { useState } from 'react'

export default function MySchedule() {
  const [view, setView] = useState('week') // week or month

  const schedule = {
    Monday: [
      { time: '10:00 AM - 11:00 AM', subject: 'Mathematics - Calculus', tutor: 'Ms. Ramya Rajamani', type: 'live', link: 'join' },
      { time: '2:00 PM - 3:00 PM', subject: 'Physics - Mechanics', tutor: 'Mr. Ram G. Mohan', type: 'live', link: 'join' }
    ],
    Tuesday: [
      { time: '11:00 AM - 12:00 PM', subject: 'Organic Chemistry', tutor: 'B. Aishwarya', type: 'live', link: 'join' },
      { time: '4:00 PM - 5:00 PM', subject: 'Computer Science - DS', tutor: 'Mr. Ashwin Jain', type: 'live', link: 'join' }
    ],
    Wednesday: [
      { time: '10:00 AM - 11:00 AM', subject: 'Mathematics - Calculus', tutor: 'Ms. Ramya Rajamani', type: 'live', link: 'join' },
      { time: '3:00 PM - 4:00 PM', subject: 'Physics Lab', tutor: 'Mr. Ram G. Mohan', type: 'lab', link: 'join' }
    ],
    Thursday: [
      { time: '11:00 AM - 12:00 PM', subject: 'Organic Chemistry', tutor: 'B. Aishwarya', type: 'live', link: 'join' },
      { time: '2:00 PM - 3:00 PM', subject: 'Statistics', tutor: 'Ms. Ramya Rajamani', type: 'live', link: 'join' }
    ],
    Friday: [
      { time: '10:00 AM - 11:00 AM', subject: 'Computer Science - DS', tutor: 'Mr. Ashwin Jain', type: 'live', link: 'join' },
      { time: '4:00 PM - 5:00 PM', subject: 'Doubt Session', tutor: 'All Tutors', type: 'doubt', link: 'join' }
    ],
    Saturday: [
      { time: '10:00 AM - 12:00 PM', subject: 'Weekend Workshop', tutor: 'Multiple Tutors', type: 'workshop', link: 'join' }
    ],
    Sunday: [
      { time: 'No Classes', subject: 'Rest Day', tutor: '', type: 'rest', link: '' }
    ]
  }

  const upcomingEvents = [
    { title: 'Mathematics Quiz', date: 'Jan 25, 2026', time: '10:00 AM', type: 'quiz', color: '#dc3545' },
    { title: 'Physics Midterm', date: 'Jan 28, 2026', time: '2:00 PM', type: 'exam', color: '#dc3545' },
    { title: 'Chemistry Workshop', date: 'Jan 30, 2026', time: '4:00 PM', type: 'workshop', color: '#f59e0b' },
    { title: 'Guest Lecture - AI', date: 'Feb 2, 2026', time: '11:00 AM', type: 'special', color: '#1e3a8a' }
  ]

  const getTypeIcon = (type) => {
    switch (type) {
      case 'live':
        return '🎥'
      case 'lab':
        return '🔬'
      case 'doubt':
        return '💬'
      case 'workshop':
        return '🛠️'
      case 'rest':
        return '😊'
      default:
        return '📚'
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'live':
        return '#1e3a8a'
      case 'lab':
        return '#28a745'
      case 'doubt':
        return '#f59e0b'
      case 'workshop':
        return '#ffc107'
      case 'rest':
        return '#6c757d'
      default:
        return '#1e3a8a'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border-b-2 border-blue-900 rounded-xl p-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-blue-900">My Schedule</h2>
          <p className="text-gray-500 text-sm">View your weekly class schedule and upcoming events</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView('week')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all border-2 border-gray-300 ${
              view === 'week' ? 'bg-blue-900 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Week View
          </button>
          <button
            onClick={() => setView('month')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all border-2 border-gray-300 ${
              view === 'month' ? 'bg-blue-900 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Month View
          </button>
        </div>
      </div>

      {/* Current Week Info */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-blue-900">
              Week of January 19 - 25, 2026
            </h3>
            <p className="text-gray-600 mt-1">Total Classes: 12 • Live Sessions: 10 • Labs: 2</p>
          </div>
          <button
            className="px-6 py-3 rounded-lg font-semibold shadow-md hover:opacity-90 transition-all bg-blue-900 text-white"
          >
            Download Schedule
          </button>
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(schedule).map(([day, classes]) => (
          <div key={day} className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold mb-4 text-blue-900">
              {day}
              {day === 'Monday' && (
                <span className="ml-2 px-3 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: '#f59e0b' }}>
                  Today
                </span>
              )}
            </h3>
            <div className="space-y-3">
              {classes.map((cls, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border-l-4 hover:shadow-md transition-all"
                  style={{
                    backgroundColor: '#ffffff',
                    borderLeftColor: getTypeColor(cls.type)
                  }}
                >
                  {cls.type !== 'rest' ? (
                    <>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="mb-1">
                            <h4 className="font-bold text-gray-800">{cls.subject}</h4>
                          </div>
                          <p className="text-sm text-gray-600">{cls.tutor}</p>
                          <p className="text-sm text-gray-700 mt-1">{cls.time}</p>
                        </div>
                        {cls.link && (
                          <button
                            className="px-4 py-2 rounded-lg text-white font-semibold text-sm hover:opacity-90 transition-all"
                            style={{ backgroundColor: getTypeColor(cls.type) }}
                          >
                            Join Class
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-600 font-semibold">No Classes - Rest Day</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-2xl font-bold mb-6 text-blue-900">Upcoming Events & Exams</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingEvents.map((event, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border-l-4 hover:shadow-md transition-all"
              style={{
                backgroundColor: '#ffffff',
                borderLeftColor: event.color
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 mb-2">{event.title}</h4>
                  <p className="text-sm text-gray-600">{event.date}</p>
                  <p className="text-sm text-gray-600">{event.time}</p>
                </div>
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: event.color }}
                >
                  {event.type.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Study Hours Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-900">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-3xl font-bold text-blue-900">12</h3>
          </div>
          <p className="text-gray-700 font-semibold">Hours This Week</p>
          <p className="text-sm text-gray-600 mt-2">+2 hours from last week</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-400">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-3xl font-bold text-yellow-500">10</h3>
          </div>
          <p className="text-gray-700 font-semibold">Classes Attended</p>
          <p className="text-sm text-gray-600 mt-2">95% attendance rate</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4" style={{ borderLeftColor: '#28a745' }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-3xl font-bold" style={{ color: '#28a745' }}>2</h3>
          </div>
          <p className="text-gray-700 font-semibold">Upcoming Today</p>
          <p className="text-sm text-gray-600 mt-2">Next at 10:00 AM</p>
        </div>
      </div>
    </div>
  )
}
