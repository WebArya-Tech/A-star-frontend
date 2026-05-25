import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import Pagination from '../ui/Pagination'
import toast from 'react-hot-toast'

const ITEMS_PER_PAGE = 100

const AVAILABLE_CLASSES = [
  { id: 1, subject: 'UG Mathematics', level: 'Undergraduate', schedule: 'Mon, Wed, Fri – 6:00 PM IST', instructor: 'Ms. Neha Aggarwal' },
  { id: 2, subject: 'UG Physics', level: 'Undergraduate', schedule: 'Tue, Thu – 5:30 PM IST', instructor: 'Mr. Arvind' },
  { id: 3, subject: 'UG Chemistry', level: 'Undergraduate', schedule: 'Mon, Wed, Fri – 4:30 PM IST', instructor: 'B. Aishwarya' },
  { id: 4, subject: 'Computer Science Fundamentals', level: 'Undergraduate', schedule: 'Tue, Thu, Sat – 7:00 PM IST', instructor: 'Mr. Ashwin Jain' },
  { id: 5, subject: 'GRE Preparation', level: 'Post-Graduate', schedule: 'Sat, Sun – 6:00 PM IST', instructor: 'Ms. Ramya Rajamani' },
  { id: 6, subject: 'CFA Level I', level: 'Professional', schedule: 'Thu, Sat – 8:00 PM IST', instructor: 'Financial Expert' },
  { id: 7, subject: 'GMAT Coaching', level: 'Post-Graduate', schedule: 'Tue, Thu, Sat – 8:30 PM IST', instructor: 'Expert Coach' },
  { id: 8, subject: 'Engineering Mathematics', level: 'Undergraduate', schedule: 'Mon, Wed – 6:30 PM IST', instructor: 'Mr. Ram G. Mohan' },
]

const EMOJI_MAP = { 'Mathematics': '📐', 'Physics': '⚡', 'Chemistry': '🧪', 'Computer Science': '💻', 'GRE': '📝', 'CFA': '💼', 'GMAT': '🎯', 'Engineering': '⚙️' }
const getEmoji = (subject) => { for (const [k, v] of Object.entries(EMOJI_MAP)) { if (subject.includes(k)) return v } return '📚' }

const MOCK_COURSES = [
  { id: 1, subject: 'UG Mathematics', level: 'Undergraduate', instructor: 'Ms. Neha Aggarwal', progress: 75, totalClasses: 40, completedClasses: 30, nextClass: 'Today, 6:00 PM', status: 'active' },
  { id: 2, subject: 'UG Physics', level: 'Undergraduate', instructor: 'Mr. Arvind', progress: 60, totalClasses: 35, completedClasses: 21, nextClass: 'Tomorrow, 5:30 PM', status: 'active' },
  { id: 3, subject: 'UG Chemistry', level: 'Undergraduate', instructor: 'B. Aishwarya', progress: 85, totalClasses: 30, completedClasses: 25, nextClass: 'Jan 22, 5:00 PM', status: 'active' },
  { id: 4, subject: 'Computer Science Fundamentals', level: 'Undergraduate', instructor: 'Mr. Ashwin Jain', progress: 45, totalClasses: 38, completedClasses: 17, nextClass: 'Jan 23, 7:00 PM', status: 'active' },
  { id: 5, subject: 'GRE Preparation', level: 'Post-Graduate', instructor: 'Ms. Ramya Rajamani', progress: 100, totalClasses: 25, completedClasses: 25, nextClass: 'Completed', status: 'completed' },
]

export default function MyCourses() {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [filter, setFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)

  // Enroll modal state
  const [showEnrollModal, setShowEnrollModal] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState('')
  const [enrollMessage, setEnrollMessage] = useState('')
  const [enrollName, setEnrollName] = useState(user?.fullName || '')
  const [enrollEmail, setEnrollEmail] = useState(user?.email || '')

  // Course details modal state
  const [detailCourse, setDetailCourse] = useState(null)

  useEffect(() => {
    setLoading(true)
    const saved = JSON.parse(localStorage.getItem('icfy_my_courses') || 'null')
    setCourses(saved && saved.length > 0 ? saved : MOCK_COURSES)
    setLoading(false)
  }, [])

  const saveCourses = (updated) => {
    setCourses(updated)
    localStorage.setItem('icfy_my_courses', JSON.stringify(updated))
  }

  const handleEnrollSubmit = (e) => {
    e.preventDefault()
    if (!selectedSubject) { toast.error('Please select a class.'); return }
    if (courses.find(c => c.subject === selectedSubject)) { toast.error('Already enrolled in this class.'); return }
    const cls = AVAILABLE_CLASSES.find(c => c.subject === selectedSubject)
    saveCourses([...courses, {
      id: Date.now(), subject: cls.subject, level: cls.level, instructor: cls.instructor,
      progress: 0, totalClasses: 30, completedClasses: 0, nextClass: 'TBD – Admin will confirm', status: 'active',
    }])
    const enrollments = JSON.parse(localStorage.getItem('runningClassEnrollments') || '[]')
    enrollments.push({ id: `ENROLL${Date.now()}`, fullName: enrollName || '', email: enrollEmail || '', phone: user?.phone || '', classSubject: selectedSubject, message: enrollMessage, enrollmentDate: new Date().toISOString(), status: 'Pending' })
    localStorage.setItem('runningClassEnrollments', JSON.stringify(enrollments))
    toast.success(`Enrolled in ${selectedSubject}! Our team will confirm the schedule.`)
    setShowEnrollModal(false); setSelectedSubject(''); setEnrollMessage(''); setEnrollName(user?.fullName || ''); setEnrollEmail(user?.email || '')
  }

  const filteredCourses = filter === 'all' ? courses : courses.filter(c => c.status === filter)
  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE)
  const paginated = filteredCourses.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
  const handleFilterChange = (f) => { setFilter(f); setCurrentPage(1) }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#1e3a8a]"></div>
    </div>
  )

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#1e3a8a' }}>My Courses</h2>
          <p className="text-gray-500 text-sm mt-0.5">Track your enrolled courses and progress</p>
        </div>
        <button
          onClick={() => setShowEnrollModal(true)}
          className="px-5 py-2.5 rounded-lg font-semibold text-sm border-2 border-[#1e3a8a] text-[#1e3a8a] bg-white hover:bg-[#1e3a8a] hover:text-white transition-all"
        >
          + Enroll in a Course
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
        {[
          { key: 'all', label: `All (${courses.length})` },
          { key: 'active', label: `Active (${courses.filter(c => c.status === 'active').length})` },
          { key: 'completed', label: `Completed (${courses.filter(c => c.status === 'completed').length})` },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handleFilterChange(key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all border ${
              filter === key
                ? 'bg-[#1e3a8a] text-white border-[#1e3a8a]'
                : 'bg-white text-gray-600 border-gray-200 hover:border-[#1e3a8a] hover:text-[#1e3a8a]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2" style={{ borderBottomColor: '#1e3a8a' }}>
                <th className="text-left px-5 py-3 font-bold" style={{ color: '#1e3a8a' }}>Course</th>
                <th className="text-left px-5 py-3 font-bold" style={{ color: '#1e3a8a' }}>Instructor</th>
                <th className="text-left px-5 py-3 font-bold" style={{ color: '#1e3a8a' }}>Level</th>
                <th className="text-left px-5 py-3 font-bold" style={{ color: '#1e3a8a' }}>Progress</th>
                <th className="text-left px-5 py-3 font-bold" style={{ color: '#1e3a8a' }}>Classes</th>
                <th className="text-left px-5 py-3 font-bold" style={{ color: '#1e3a8a' }}>Next Class</th>
                <th className="text-left px-5 py-3 font-bold" style={{ color: '#1e3a8a' }}>Status</th>
                <th className="text-left px-5 py-3 font-bold" style={{ color: '#1e3a8a' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center">
                    <p className="text-4xl mb-3">📚</p>
                    <p className="text-gray-600 font-medium">No courses found.</p>
                    <button onClick={() => setShowEnrollModal(true)} className="mt-4 px-5 py-2 rounded-lg text-sm font-semibold border-2 border-[#1e3a8a] text-[#1e3a8a] bg-white hover:bg-[#1e3a8a] hover:text-white transition-all">
                      Enroll in a Course
                    </button>
                  </td>
                </tr>
              ) : paginated.map((course) => (
                <tr key={course.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{getEmoji(course.subject)}</span>
                      <p className="font-semibold text-gray-800">{course.subject}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-700">👨‍🏫 {course.instructor}</td>
                  <td className="px-5 py-4 text-gray-500">{course.level}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 min-w-[100px]">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${course.progress}%`, backgroundColor: course.status === 'completed' ? '#28a745' : '#f59e0b' }} />
                      </div>
                      <span className="text-xs font-bold whitespace-nowrap" style={{ color: '#1e3a8a' }}>{course.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-bold text-gray-800">{course.completedClasses}/{course.totalClasses}</td>
                  <td className="px-5 py-4 text-gray-700 text-xs">{course.nextClass}</td>
                  <td className="px-5 py-4">
                    <span
                      className="px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap"
                      style={{
                        backgroundColor: course.status === 'completed' ? '#e8f5e9' : '#fff8e1',
                        color: course.status === 'completed' ? '#28a745' : '#b45309',
                      }}
                    >
                      {course.status === 'completed' ? '✓ Done' : 'Active'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => setDetailCourse(course)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold border-2 hover:bg-[#1e3a8a] hover:text-white transition-all whitespace-nowrap"
                      style={{ borderColor: '#1e3a8a', color: '#1e3a8a', backgroundColor: 'white' }}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredCourses.length}
        itemsPerPage={100}
        alwaysShow={true}
      />

      {/* ── Enroll Modal ── */}
      {showEnrollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowEnrollModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowEnrollModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
            <h3 className="text-xl font-bold mb-1" style={{ color: '#1e3a8a' }}>Enroll in a Course</h3>
            <p className="text-sm text-gray-500 mb-5">Select a running class to join</p>
            <form onSubmit={handleEnrollSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Name</label>
                  <input 
                    value={enrollName} 
                    onChange={e => setEnrollName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1e3a8a] bg-white" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                  <input 
                    value={enrollEmail} 
                    onChange={e => setEnrollEmail(e.target.value)}
                    placeholder="Your email"
                    className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1e3a8a] bg-white" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Select Class <span className="text-red-500">*</span></label>
                <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} required className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1e3a8a] bg-white">
                  <option value="">-- Choose a class --</option>
                  {AVAILABLE_CLASSES.map(cls => (
                    <option key={cls.id} value={cls.subject}>{cls.subject} — {cls.level} ({cls.schedule})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Message (optional)</label>
                <textarea value={enrollMessage} onChange={e => setEnrollMessage(e.target.value)} placeholder="Any timing preference or requirements..." rows={2} className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1e3a8a] resize-none" />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="submit" className="flex-1 py-2.5 rounded-lg font-semibold text-sm bg-[#1e3a8a] text-white hover:bg-blue-800 transition-all">Confirm Enrollment</button>
                <button type="button" onClick={() => setShowEnrollModal(false)} className="flex-1 py-2.5 rounded-lg font-semibold text-sm border-2 border-gray-200 text-gray-600 bg-white hover:border-gray-400 transition-all">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Course Detail Modal ── */}
      {detailCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setDetailCourse(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setDetailCourse(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center text-3xl">{getEmoji(detailCourse.subject)}</div>
              <div>
                <h3 className="font-bold text-lg" style={{ color: '#1e3a8a' }}>{detailCourse.subject}</h3>
                <p className="text-gray-500 text-sm">{detailCourse.level}</p>
              </div>
            </div>
            <div className="h-0.5 rounded-full mb-4" style={{ backgroundColor: '#f59e0b' }} />
            <div className="space-y-3 text-sm">
              {[
                ['Instructor', detailCourse.instructor],
                ['Progress', `${detailCourse.progress}%`],
                ['Classes Completed', `${detailCourse.completedClasses} / ${detailCourse.totalClasses}`],
                ['Next Class', detailCourse.nextClass],
                ['Status', detailCourse.status === 'completed' ? 'Completed' : 'Active'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-gray-500">{label}</span>
                  <span className={`font-semibold ${label === 'Status' ? (detailCourse.status === 'completed' ? 'text-green-600' : 'text-amber-600') : 'text-gray-800'}`}>{value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${detailCourse.progress}%`, backgroundColor: detailCourse.status === 'completed' ? '#28a745' : '#f59e0b' }} />
            </div>
            <button onClick={() => setDetailCourse(null)} className="mt-5 w-full py-2.5 rounded-lg font-semibold text-sm border-2 border-[#1e3a8a] text-[#1e3a8a] bg-white hover:bg-[#1e3a8a] hover:text-white transition-all">Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

