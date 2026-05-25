import React from 'react'

export default function MyProgress() {
  const overallProgress = {
    totalCourses: 5,
    completedCourses: 1,
    averageGrade: 87,
    attendanceRate: 92,
    assignmentsCompleted: 8,
    totalAssignments: 12
  }

  const courseProgress = [
    {
      course: 'Mathematics - Calculus',
      progress: 75,
      grade: 88,
      attendance: 95,
      assignments: { completed: 6, total: 8 }
    },
    {
      course: 'Physics - Mechanics',
      progress: 60,
      grade: 85,
      attendance: 90,
      assignments: { completed: 5, total: 7 }
    },
    {
      course: 'Organic Chemistry',
      progress: 85,
      grade: 92,
      attendance: 93,
      assignments: { completed: 7, total: 8 }
    },
    {
      course: 'Computer Science',
      progress: 45,
      grade: 78,
      attendance: 88,
      assignments: { completed: 4, total: 9 }
    },
    {
      course: 'Statistics',
      progress: 100,
      grade: 94,
      attendance: 100,
      assignments: { completed: 6, total: 6 }
    }
  ]

  const recentGrades = [
    { assignment: 'Physics Lab Report', course: 'Physics', grade: 92, maxGrade: 100, date: 'Jan 15, 2026' },
    { assignment: 'Calculus Quiz 3', course: 'Mathematics', grade: 88, maxGrade: 100, date: 'Jan 12, 2026' },
    { assignment: 'Chemistry Problem Set', course: 'Chemistry', grade: 95, maxGrade: 100, date: 'Jan 10, 2026' },
    { assignment: 'Programming Assignment', course: 'Computer Science', grade: 85, maxGrade: 100, date: 'Jan 8, 2026' }
  ]

  const getGradeColor = (grade) => {
    if (grade >= 90) return '#28a745'
    if (grade >= 80) return '#f59e0b'
    if (grade >= 70) return '#ffc107'
    return '#dc3545'
  }

  const getProgressColor = (progress) => {
    if (progress >= 75) return '#28a745'
    if (progress >= 50) return '#f59e0b'
    return '#ffc107'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border-b-2 border-blue-900 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-blue-900">My Progress</h2>
        <p className="text-gray-500 text-sm mt-1">Track your academic performance and achievements</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-900">
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl font-bold text-blue-900">
              {overallProgress.completedCourses}/{overallProgress.totalCourses}
            </span>
          </div>
          <p className="text-gray-700 font-semibold">Courses Progress</p>
          <div className="w-full h-2 bg-gray-200 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-900"
              style={{
                width: `${(overallProgress.completedCourses / overallProgress.totalCourses) * 100}%`
              }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border-l-4" style={{ borderLeftColor: '#f59e0b' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl font-bold" style={{ color: '#f59e0b' }}>
              {overallProgress.averageGrade}%
            </span>
          </div>
          <p className="text-gray-700 font-semibold">Average Grade</p>
          <div className="w-full h-2 bg-gray-200 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${overallProgress.averageGrade}%`,
                backgroundColor: '#f59e0b'
              }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border-l-4" style={{ borderLeftColor: '#28a745' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl font-bold" style={{ color: '#28a745' }}>
              {overallProgress.attendanceRate}%
            </span>
          </div>
          <p className="text-gray-700 font-semibold">Attendance Rate</p>
          <div className="w-full h-2 bg-gray-200 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${overallProgress.attendanceRate}%`,
                backgroundColor: '#28a745'
              }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border-l-4" style={{ borderLeftColor: '#ffc107' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl font-bold" style={{ color: '#ffc107' }}>
              {overallProgress.assignmentsCompleted}/{overallProgress.totalAssignments}
            </span>
          </div>
          <p className="text-gray-700 font-semibold">Assignments Done</p>
          <div className="w-full h-2 bg-gray-200 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(overallProgress.assignmentsCompleted / overallProgress.totalAssignments) * 100}%`,
                backgroundColor: '#ffc107'
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Course-wise Progress */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-2xl font-bold mb-6" style={{ color: '#1e3a8a' }}>Course-wise Performance</h3>
        <div className="space-y-6">
          {courseProgress.map((course, index) => (
            <div key={index} className="p-4 rounded-lg border-2" style={{ borderColor: '#f0f0f0' }}>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-gray-800">{course.course}</h4>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold" style={{ color: getGradeColor(course.grade) }}>
                    {course.grade}%
                  </p>
                  <p className="text-sm text-gray-600">Grade</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Course Progress</span>
                    <span className="text-sm font-bold" style={{ color: getProgressColor(course.progress) }}>
                      {course.progress}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${course.progress}%`,
                        backgroundColor: getProgressColor(course.progress)
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Attendance</span>
                    <span className="text-sm font-bold" style={{ color: '#28a745' }}>
                      {course.attendance}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${course.attendance}%`,
                        backgroundColor: '#28a745'
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Assignments</span>
                    <span className="text-sm font-bold" style={{ color: '#1e3a8a' }}>
                      {course.assignments.completed}/{course.assignments.total}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(course.assignments.completed / course.assignments.total) * 100}%`,
                        backgroundColor: '#1e3a8a'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Grades */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-2xl font-bold mb-6" style={{ color: '#1e3a8a' }}>Recent Grades</h3>
        <div className="space-y-3">
          {recentGrades.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-lg flex items-center justify-between hover:shadow-md transition-all"
              style={{ backgroundColor: '#ffffff' }}
            >
              <div className="flex-1">
                <h4 className="font-bold text-gray-800">{item.assignment}</h4>
                <p className="text-sm text-gray-600">{item.course} • {item.date}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold" style={{ color: getGradeColor((item.grade / item.maxGrade) * 100) }}>
                  {item.grade}/{item.maxGrade}
                </p>
                <p className="text-sm text-gray-600">
                  {Math.round((item.grade / item.maxGrade) * 100)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>


    </div>
  )
}
