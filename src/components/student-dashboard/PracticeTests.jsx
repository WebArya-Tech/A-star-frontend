import React, { useState, useEffect } from 'react'
import Pagination from '../ui/Pagination'

const STORAGE_TESTS    = 'icfy_practice_tests'
const STORAGE_DONE     = 'icfy_completed_tests_v2'

const DEFAULT_TESTS = [
  { id: 1, name: 'Calculus Integration Practice',    subject: 'Mathematics', duration: 45, questions: 25, difficulty: 'Medium' },
  { id: 2, name: 'Organic Chemistry - Chapter 3',    subject: 'Chemistry',   duration: 60, questions: 30, difficulty: 'Hard'   },
  { id: 3, name: "Newton's Laws of Motion",           subject: 'Physics',     duration: 30, questions: 20, difficulty: 'Easy'   },
  { id: 4, name: 'Differential Equations Quiz',       subject: 'Mathematics', duration: 40, questions: 15, difficulty: 'Hard'   },
  { id: 5, name: 'Thermodynamics Practice Test',      subject: 'Physics',     duration: 75, questions: 35, difficulty: 'Medium' },
  { id: 6, name: 'Electrochemistry Assessment',       subject: 'Chemistry',   duration: 45, questions: 20, difficulty: 'Medium' },
]

const loadTests = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_TESTS) || 'null')
    if (saved && saved.length > 0) return saved
  } catch {}
  return DEFAULT_TESTS
}

const loadCompleted = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_DONE) || '{}') }
  catch { return {} }
}

const getQs = (testId) => {
  try { return JSON.parse(localStorage.getItem(`icfy_test_questions_${testId}`) || '[]') }
  catch { return [] }
}

export default function PracticeTests() {
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [currentPage, setCurrentPage]         = useState(1)
  const [tests, setTests]                     = useState(loadTests)
  const [completed, setCompleted]             = useState(loadCompleted)
  const itemsPerPage = 100

  // Test player state
  const [activeTest, setActiveTest]   = useState(null)
  const [questions, setQuestions]     = useState([])
  const [currentQ, setCurrentQ]       = useState(0)
  const [answers, setAnswers]         = useState({})
  const [showResult, setShowResult]   = useState(false)

  // Reload tests when component mounts (in case admin updated)
  useEffect(() => { setTests(loadTests()) }, [])

  // ── Helpers ──
  const startTest = (test) => {
    const qs = getQs(test.id)
    if (qs.length === 0) {
      alert('This test has no questions yet. The admin needs to add questions first.')
      return
    }
    setQuestions(qs)
    setCurrentQ(0)
    setAnswers({})
    setShowResult(false)
    setActiveTest(test)
  }

  const selectAnswer = (optIdx) => setAnswers(prev => ({ ...prev, [currentQ]: optIdx }))

  const submitTest = () => {
    let correct = 0
    questions.forEach((q, i) => { if (answers[i] === q.correct) correct++ })
    const pct = Math.round((correct / questions.length) * 100)
    const result = { score: pct, raw: correct, total: questions.length, date: new Date().toLocaleDateString('en-IN') }
    const newDone = { ...completed, [activeTest.id]: result }
    setCompleted(newDone)
    localStorage.setItem(STORAGE_DONE, JSON.stringify(newDone))
    setShowResult(true)
  }

  const closeTest = () => { setActiveTest(null); setShowResult(false); setAnswers({}); setCurrentQ(0) }

  // ── Filter / Pagination ──
  const subjects       = [...new Set(tests.map(t => t.subject).filter(Boolean))]
  const filtered       = selectedSubject === 'all' ? tests : tests.filter(t => t.subject === selectedSubject)
  const totalPages     = Math.ceil(filtered.length / itemsPerPage)
  const paged          = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const completedCount = Object.keys(completed).length
  const scores         = Object.values(completed).map(c => c.score)
  const avgScore       = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
  const diffColor      = { Easy: '#28a745', Medium: '#ffc107', Hard: '#dc3545' }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold" style={{ color: '#1e3a8a' }}>Practice Tests</h2>
        <p className="text-gray-600 mt-2">Improve your skills with practice tests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4" style={{ borderLeftColor: '#1e3a8a' }}>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Tests</h3>
          <p className="text-4xl font-bold" style={{ color: '#1e3a8a' }}>{tests.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4" style={{ borderLeftColor: '#28a745' }}>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Completed</h3>
          <p className="text-4xl font-bold" style={{ color: '#28a745' }}>{completedCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4" style={{ borderLeftColor: '#f59e0b' }}>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Average Score</h3>
          <p className="text-4xl font-bold" style={{ color: '#f59e0b' }}>{avgScore}%</p>
        </div>
      </div>

      {/* Subject Filter */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setSelectedSubject('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedSubject === 'all' ? 'text-white shadow-md' : 'text-gray-700 hover:bg-gray-50'}`}
            style={{ backgroundColor: selectedSubject === 'all' ? '#1e3a8a' : 'transparent' }}>
            All Subjects
          </button>
          {subjects.map(s => (
            <button key={s} onClick={() => setSelectedSubject(s)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedSubject === s ? 'text-white shadow-md' : 'text-gray-700 hover:bg-gray-50'}`}
              style={{ backgroundColor: selectedSubject === s ? '#1e3a8a' : 'transparent' }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Tests Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2" style={{ borderBottomColor: '#1e3a8a' }}>
                <th className="text-left px-5 py-3 font-bold" style={{ color: '#1e3a8a' }}>Test Name</th>
                <th className="text-left px-5 py-3 font-bold" style={{ color: '#1e3a8a' }}>Subject</th>
                <th className="text-left px-5 py-3 font-bold" style={{ color: '#1e3a8a' }}>Difficulty</th>
                <th className="text-left px-5 py-3 font-bold" style={{ color: '#1e3a8a' }}>Questions</th>
                <th className="text-left px-5 py-3 font-bold" style={{ color: '#1e3a8a' }}>Duration</th>
                <th className="text-left px-5 py-3 font-bold" style={{ color: '#1e3a8a' }}>Best Score</th>
                <th className="text-left px-5 py-3 font-bold" style={{ color: '#1e3a8a' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {tests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <p className="text-4xl mb-3">📋</p>
                    <p className="text-gray-600 font-medium">No practice tests available yet.</p>
                    <p className="text-gray-400 mt-1 text-xs">Tests will appear here once the admin adds them.</p>
                  </td>
                </tr>
              ) : paged.map((test) => {
                const done   = completed[test.id]
                const hasQs  = getQs(test.id).length > 0
                const dColor = diffColor[test.difficulty] || '#196d83'
                return (
                  <tr key={test.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-800">{test.name}</p>
                      {!hasQs && <p className="text-xs text-amber-600 mt-0.5">⚠️ No questions yet</p>}
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: '#1e3a8a' }}>{test.subject}</span>
                    </td>
                    <td className="px-5 py-4">
                      {test.difficulty && (
                        <span className="px-2 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: dColor }}>{test.difficulty}</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-gray-700 font-semibold">{test.questions || '—'}</td>
                    <td className="px-5 py-4 text-gray-700">{test.duration} min</td>
                    <td className="px-5 py-4">
                      {done ? (
                        <div>
                          <p className="font-bold" style={{ color: '#28a745' }}>{done.score}%</p>
                          <p className="text-xs text-gray-500">{done.date}</p>
                        </div>
                      ) : <span className="text-gray-400 text-xs">Not attempted</span>}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => startTest(test)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all whitespace-nowrap hover:text-white"
                        style={{
                          borderColor: done ? '#f59e0b' : '#1e3a8a',
                          color: done ? '#f59e0b' : '#1e3a8a',
                          backgroundColor: 'white',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = done ? '#f59e0b' : '#1e3a8a'; e.currentTarget.style.color = 'white' }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = done ? '#f59e0b' : '#1e3a8a' }}
                      >
                        {done ? '🔄 Retake' : '▶ Start'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filtered.length}
        itemsPerPage={100}
        alwaysShow={true}
      />

      {/* ── TEST PLAYER MODAL ── */}
      {activeTest && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="sticky top-0 bg-white px-6 py-4 border-b flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold" style={{ color: '#1e3a8a' }}>{activeTest.name}</h2>
                {!showResult && <p className="text-sm text-gray-500">Question {currentQ + 1} of {questions.length}</p>}
              </div>
              {!showResult && (
                <span className="text-sm text-gray-400">{Object.keys(answers).length}/{questions.length} answered</span>
              )}
            </div>

            {showResult ? (
              /* ── Result Screen ── */
              <div className="px-6 py-8 text-center">
                <div className="text-6xl mb-4">
                  {completed[activeTest.id]?.score >= 75 ? '🎉' : completed[activeTest.id]?.score >= 50 ? '👍' : '📚'}
                </div>
                <h3 className="text-3xl font-black mb-2" style={{ color: '#1e3a8a' }}>Test Complete!</h3>
                <p className="text-5xl font-black my-4"
                  style={{ color: completed[activeTest.id]?.score >= 75 ? '#28a745' : completed[activeTest.id]?.score >= 50 ? '#ddaa2c' : '#dc3545' }}>
                  {completed[activeTest.id]?.score}%
                </p>
                <p className="text-gray-600 mb-6">
                  You answered <strong>{completed[activeTest.id]?.raw}</strong> out of <strong>{completed[activeTest.id]?.total}</strong> correctly.
                </p>

                {/* Answer Review */}
                <div className="text-left space-y-3 mb-6">
                  <h4 className="font-bold text-lg" style={{ color: '#1e3a8a' }}>Review Answers</h4>
                  {questions.map((q, i) => (
                    <div key={i} className={`p-4 rounded-xl border-l-4 ${answers[i] === q.correct ? 'border-green-500 bg-green-50' : 'border-red-400 bg-red-50'}`}>
                      <p className="font-semibold text-sm mb-2 text-gray-800">{i + 1}. {q.text}</p>
                      <div className="grid grid-cols-2 gap-1 mb-1">
                        {q.options.map((opt, oi) => (
                          <p key={oi} className={`text-xs px-2 py-1 rounded ${q.correct === oi ? 'bg-green-200 text-green-900 font-bold' : answers[i] === oi ? 'bg-red-200 text-red-800' : 'text-gray-600'}`}>
                            {String.fromCharCode(65 + oi)}. {opt}
                          </p>
                        ))}
                      </div>
                      {q.explanation && <p className="text-xs text-gray-500 mt-1 italic">💡 {q.explanation}</p>}
                    </div>
                  ))}
                </div>

                <button onClick={closeTest}
                  className="px-10 py-3 rounded-xl text-white font-bold hover:bg-blue-800 transition-all"
                  style={{ backgroundColor: '#1e3a8a' }}>
                  Close
                </button>
              </div>
            ) : (
              /* ── Question Screen ── */
              <div className="px-6 py-6">
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                  <div className="h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQ + 1) / questions.length) * 100}%`, backgroundColor: '#1e3a8a' }} />
                </div>

                <p className="text-lg font-bold mb-5 text-gray-800 leading-relaxed">{questions[currentQ].text}</p>

                <div className="space-y-3 mb-6">
                  {questions[currentQ].options.map((opt, i) => (
                    <button key={i} onClick={() => selectAnswer(i)}
                      className="w-full text-left px-4 py-3 rounded-xl font-semibold border-2 transition-all"
                      style={{
                        borderColor: answers[currentQ] === i ? '#1e3a8a' : '#e5e7eb',
                        backgroundColor: answers[currentQ] === i ? '#eff6ff' : 'white',
                        color: answers[currentQ] === i ? '#1e3a8a' : '#374151'
                      }}>
                      <span className="mr-3 font-bold">{String.fromCharCode(65 + i)}.</span>{opt}
                    </button>
                  ))}
                </div>

                {/* Nav Buttons */}
                <div className="flex gap-3 mb-4">
                  {currentQ > 0 && (
                    <button onClick={() => setCurrentQ(q => q - 1)}
                      className="px-5 py-2.5 rounded-lg font-semibold border-2 transition-all hover:bg-gray-50"
                      style={{ borderColor: '#1e3a8a', color: '#1e3a8a' }}>
                      ← Previous
                    </button>
                  )}
                  {currentQ < questions.length - 1 ? (
                    <button onClick={() => setCurrentQ(q => q + 1)}
                      className="flex-1 py-2.5 rounded-lg font-bold text-white hover:bg-blue-800 transition-all"
                      style={{ backgroundColor: '#1e3a8a' }}>
                      Next →
                    </button>
                  ) : (
                    <button onClick={submitTest}
                      className="flex-1 py-2.5 rounded-lg font-bold text-white hover:bg-green-700 transition-all"
                      style={{ backgroundColor: '#28a745' }}>
                      ✓ Submit Test
                    </button>
                  )}
                </div>

                {/* Question Navigator */}
                <div className="flex flex-wrap gap-2">
                  {questions.map((_, i) => (
                    <button key={i} onClick={() => setCurrentQ(i)}
                      className="w-9 h-9 rounded-full text-sm font-semibold transition-all"
                      style={{
                        backgroundColor: answers[i] !== undefined ? '#1e3a8a' : 'white',
                        color: answers[i] !== undefined ? 'white' : '#374151',
                        border: i === currentQ ? '2px solid #1e3a8a' : '2px solid #d1d5db'
                      }}>
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

