import React, { useState } from 'react'
import Pagination from '../ui/Pagination'

const studentTestimonials = [
  {
    id: 1,
    name: 'Arjun Sharma',
    role: 'AP Calculus Student',
    quote: 'The structured approach to AP Calculus here is phenomenal. My score jumped from a 3 to a perfect 5. The personalized attention and rigorous practice sessions made all the difference.',
    avatar: 'AS',
    color: 'from-blue-500 to-indigo-600',
    rating: 5,
    exam: 'AP Calculus BC',
  },
  {
    id: 2,
    name: 'Priya Patel',
    role: 'SAT Math Aspirant',
    quote: 'I was struggling with SAT Math, but after just 2 months of tutoring, I scored 780! The problem-solving techniques taught here are truly exceptional.',
    avatar: 'PP',
    color: 'from-purple-500 to-pink-600',
    rating: 5,
    exam: 'SAT Math',
  },
  {
    id: 3,
    name: 'Rahul Verma',
    role: 'AMC Qualifier',
    quote: 'Thanks to the olympiad training program, I qualified for AIME for the first time! The faculty here understand competition math at the deepest level.',
    avatar: 'RV',
    color: 'from-green-500 to-teal-600',
    rating: 5,
    exam: 'AMC 10/12',
  },
  {
    id: 4,
    name: 'Sneha Kumar',
    role: 'GRE Candidate',
    quote: 'Scored 168 in GRE Quant! The focused practice and weekly mock tests helped me identify my weak areas and work on them systematically.',
    avatar: 'SK',
    color: 'from-orange-500 to-red-600',
    rating: 5,
    exam: 'GRE Quant',
  },
  {
    id: 5,
    name: 'Aditya Singh',
    role: 'GMAT Student',
    quote: 'Achieved 49 in GMAT Quant on my first attempt. The structured curriculum and expert guidance from iThinkLearn were invaluable throughout my preparation.',
    avatar: 'AS',
    color: 'from-cyan-500 to-blue-600',
    rating: 5,
    exam: 'GMAT Quant',
  },
  {
    id: 6,
    name: 'Meera Joshi',
    role: 'IB Math Student',
    quote: 'From struggling with IB Math HL to scoring a 7! The step-by-step explanations and practice problems here are incredibly well designed.',
    avatar: 'MJ',
    color: 'from-yellow-500 to-orange-600',
    rating: 5,
    exam: 'IB Math HL',
  },
  {
    id: 7,
    name: 'Karan Malhotra',
    role: 'TMUA Candidate',
    quote: 'Secured top 10 percentile in TMUA! iThinkLearn\'s unique reasoning-focused approach prepared me for the most challenging questions in the test.',
    avatar: 'KM',
    color: 'from-violet-500 to-purple-600',
    rating: 5,
    exam: 'TMUA',
  },
]

const parentTestimonials = [
  {
    id: 1,
    name: 'Mrs. Anjali Sharma',
    role: 'Parent of AP Student',
    quote: 'My son\'s confidence in mathematics has grown tremendously. The faculty is responsive, caring, and truly invested in each student\'s success.',
    avatar: '👩',
    color: 'from-blue-600 to-indigo-700',
    rating: 5,
  },
  {
    id: 2,
    name: 'Mr. Ramesh Patel',
    role: 'Parent of SAT Student',
    quote: 'Excellent teaching methodology. My daughter achieved her target SAT score and got into her dream university. Forever grateful to iThinkLearn.',
    avatar: '👨',
    color: 'from-green-600 to-teal-700',
    rating: 5,
  },
  {
    id: 3,
    name: 'Mrs. Sunita Verma',
    role: 'Parent of AMC Qualifier',
    quote: 'The personalized attention and timely feedback have been outstanding. My son qualified for AIME — something we had only dreamed of before.',
    avatar: '👩',
    color: 'from-purple-600 to-pink-700',
    rating: 5,
  },
  {
    id: 4,
    name: 'Mr. Vijay Kumar',
    role: 'Parent of GRE Student',
    quote: 'iThinkLearn provided the perfect environment for my daughter to prepare for GRE. The mock tests and feedback sessions were incredibly valuable.',
    avatar: '👨',
    color: 'from-orange-600 to-red-700',
    rating: 5,
  },
]

const renderStars = (rating) =>
  [...Array(rating)].map((_, i) => (
    <span key={i} className="text-yellow-400 text-base">★</span>
  ))

export default function Testimonials() {
  const [activeTab, setActiveTab] = useState('students')
  const [filter, setFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 100

  const filteredTestimonials = filter === 'all'
    ? (activeTab === 'students' ? studentTestimonials : parentTestimonials)
    : (activeTab === 'students' ? studentTestimonials.filter(t => t.role.toLowerCase().includes(filter.toLowerCase())) : parentTestimonials.filter(t => t.role.toLowerCase().includes(filter.toLowerCase())))

  const totalPages = Math.ceil(filteredTestimonials.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedTestimonials = filteredTestimonials.slice(startIndex, startIndex + itemsPerPage)

  const tabs = [
    { id: 'students', label: 'Student Reviews' },
    { id: 'parents', label: 'Parent Reviews' },
  ]

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Page Header */}
      <div className="bg-white border-b-2 border-blue-900 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-blue-900">Testimonials & Success Stories</h2>
        <p className="text-gray-500 text-sm mt-1">What our students and parents say about iThinkLearn</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Reviews', value: studentTestimonials.length + parentTestimonials.length },
          { label: 'Average Rating', value: '5.0 ★' },
          { label: 'Student Reviews', value: studentTestimonials.length },
          { label: 'Parent Reviews', value: parentTestimonials.length },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-blue-900">{stat.value}</div>
            <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-3 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-lg font-semibold text-sm transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Testimonial Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedTestimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200 relative overflow-hidden"
          >
            {/* Background Decoration */}
            <div
              className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-br ${testimonial.color} opacity-5 rounded-bl-full`}
            ></div>

            {/* Big Quote */}
            <div className="absolute top-4 right-4 text-5xl text-gray-100 leading-none select-none">"</div>

            {/* Exam Badge (students only) */}
            {testimonial.exam && (
              <div
                className={`inline-flex items-center gap-1 bg-gradient-to-r ${testimonial.color} text-white text-xs font-bold px-3 py-1 rounded-full mb-4`}
              >
                {testimonial.exam}
              </div>
            )}

            {/* Quote */}
            <p className="text-gray-700 leading-relaxed mb-5 relative z-10 italic text-sm">
              "{testimonial.quote}"
            </p>

            {/* Rating */}
            <div className="flex gap-0.5 mb-4">{renderStars(testimonial.rating)}</div>

            {/* Author */}
            <div className="border-t border-gray-100 pt-4 flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}
              >
                {testimonial.avatar}
              </div>
              <div>
                <div className="font-bold text-gray-900 text-sm">{testimonial.name}</div>
                <div className="text-xs text-gray-500">{testimonial.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredTestimonials.length}
        itemsPerPage={itemsPerPage}
        alwaysShow={true}
      />
    </div>
  )
}
