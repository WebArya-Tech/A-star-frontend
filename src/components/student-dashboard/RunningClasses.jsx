import React, { useState, useEffect } from 'react'
import { runningClassesApi } from '../../api/runningClassesApi'
import Pagination from '../ui/Pagination'

const FALLBACK_CLASSES = [
  { id: 1, title: 'UG Mathematics', category: 'UNDERGRADUATE', schedule: 'Mon, Wed, Fri - 6:00 PM IST', batchSize: '12-15', instructorName: 'Ms. Neha Aggarwal', description: 'Comprehensive mathematics coverage for B.Sc and B.Tech students', status: 'ACTIVE' },
  { id: 2, title: 'UG Physics', category: 'UNDERGRADUATE', schedule: 'Tue, Thu - 5:30 PM IST', batchSize: '10-12', instructorName: 'Mr. Arvind', description: 'Advanced physics concepts with real-world applications', status: 'ACTIVE' },
]

export default function RunningClasses() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterCategory, setFilterCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const filtered = filterCategory === 'All' ? classes : classes.filter(c => (c.category || c.level) === filterCategory)
  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedClasses = filtered.slice(startIndex, startIndex + itemsPerPage)

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true)
        const res = await runningClassesApi.getAll()
        const data = res.data?.content || res.data?.data || res.data || []
        const active = Array.isArray(data)
          ? data.filter(c => c.status === 'ACTIVE' || c.status === 'Active' || c.status === 'active')
          : []
        if (active.length > 0) {
          setClasses(active)
        } else {
          throw new Error('empty')
        }
      } catch {
        try {
          const saved = JSON.parse(localStorage.getItem('icfy_running_classes') || 'null')
          if (saved && saved.length > 0) {
            setClasses(saved.filter(c => c.status === 'ACTIVE' || c.status === 'Active' || c.status === 'active'))
          } else {
            setClasses(FALLBACK_CLASSES)
          }
        } catch {
          setClasses(FALLBACK_CLASSES)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchClasses()
  }, [])

  const categories = ['All', ...Array.from(new Set(classes.map(c => c.category || c.level).filter(Boolean)))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border-b-2 border-blue-900 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-blue-900">Running Classes</h2>
        <p className="text-gray-500 text-sm mt-1">Browse all currently active classes available for you</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Active', value: classes.length, color: 'border-blue-900', textColor: 'text-blue-900' },
          { label: 'Undergraduate', value: classes.filter(c => (c.category || c.level) === 'UNDERGRADUATE' || (c.category || c.level) === 'Undergraduate').length, color: 'border-yellow-400', textColor: 'text-yellow-600' },
          { label: 'Post-Graduate', value: classes.filter(c => (c.category || c.level) === 'POST_GRADUATE' || (c.category || c.level) === 'Post-Graduate').length, color: 'border-orange-400', textColor: 'text-orange-600' },
          { label: 'Professional', value: classes.filter(c => (c.category || c.level) === 'PROFESSIONAL' || (c.category || c.level) === 'Professional').length, color: 'border-green-500', textColor: 'text-green-600' },
        ].map((stat, i) => (
          <div key={i} className={`bg-white rounded-xl shadow-md p-5 border-l-4 ${stat.color}`}>
            <p className="text-xs font-semibold text-gray-500 mb-1">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-xl shadow-md p-4 flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              filterCategory === cat
                ? 'bg-blue-900 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-900'
            }`}
          >
            {cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Classes Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900 border-t-yellow-400"></div>
            <p className="mt-4 text-lg font-semibold text-blue-900">Loading classes...</p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg">No active classes found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedClasses.map((classItem) => (
            <div
              key={classItem.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-900 flex flex-col"
            >
              {classItem.image && (
                <img
                  src={classItem.image}
                  alt={classItem.title || classItem.subject}
                  className="w-full h-36 object-cover"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              )}

              <div className="p-5 flex flex-col flex-1">
                <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-2 w-fit">
                  {(classItem.category || classItem.level)?.replace('_', ' ')}
                </span>

                <h3 className="text-base font-bold text-gray-900 mb-2 leading-tight">
                  {classItem.title || classItem.subject}
                </h3>

                <p className="text-gray-600 text-xs mb-4 leading-relaxed line-clamp-2 flex-1">
                  {classItem.description}
                </p>

                <div className="space-y-1.5 text-xs text-gray-600 border-t border-gray-100 pt-3 mb-3">
                  <p className="flex items-start gap-1.5">
                    <span className="font-semibold text-gray-800 shrink-0">📅 Schedule:</span>
                    <span>{classItem.schedule}</span>
                  </p>
                  <p className="flex items-start gap-1.5">
                    <span className="font-semibold text-gray-800 shrink-0">👥 Batch size:</span>
                    <span>{classItem.batchSize || classItem.students}</span>
                  </p>
                  <p className="flex items-start gap-1.5">
                    <span className="font-semibold text-gray-800 shrink-0">👨‍🏫 Instructor:</span>
                    <span>{classItem.instructorName || classItem.instructor}</span>
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${classItem.status === 'ACTIVE' ? 'bg-green-700' : 'bg-blue-900'}`}>
                    {classItem.status}
                  </span>
                  <span className="text-xs text-green-600 font-semibold">● Active</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filtered.length}
        itemsPerPage={itemsPerPage}
        alwaysShow={true}
      />
    </div>
  )
}
