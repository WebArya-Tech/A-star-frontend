import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Clock, Award, CheckCircle } from 'lucide-react';

const IGCSEHub = () => {
  const subjects = [
    {
      name: 'Physics',
      slug: 'physics',
      description: 'Master fundamental physics concepts with practical applications',
      topics: ['Mechanics', 'Thermal Physics', 'Waves', 'Electricity & Magnetism'],
      color: 'bg-blue-500',
      image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=600'
    },
    {
      name: 'Chemistry',
      slug: 'chemistry',
      description: 'Comprehensive coverage of chemical principles and reactions',
      topics: ['Atomic Structure', 'Chemical Bonding', 'Organic Chemistry', 'Chemical Analysis'],
      color: 'bg-green-500',
      image: 'https://images.unsplash.com/photo-1532187875605-1ef6c237f142?auto=format&fit=crop&q=80&w=600'
    },
    {
      name: 'Mathematics',
      slug: 'math',
      description: 'Build strong mathematical foundations for higher studies',
      topics: ['Algebra', 'Geometry', 'Statistics', 'Calculus Basics'],
      color: 'bg-purple-500',
      image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=600'
    },
    {
      name: 'Economics',
      slug: 'economics',
      description: 'Understand economic principles and real-world applications',
      topics: ['Microeconomics', 'Macroeconomics', 'Market Structures', 'Government Policy'],
      color: 'bg-orange-500',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600'
    },
    {
      name: 'Biology',
      slug: 'biology',
      description: 'Explore life sciences with detailed biological concepts',
      topics: ['Cell Biology', 'Genetics', 'Human Biology', 'Ecology'],
      color: 'bg-teal-500',
      image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=600'
    },
    {
      name: 'Further Mathematics',
      slug: 'further-math',
      description: 'Advanced mathematical concepts for ambitious students',
      topics: ['Complex Numbers', 'Matrices', 'Advanced Calculus', 'Differential Equations'],
      color: 'bg-indigo-500',
      image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=600'
    },
    {
      name: 'Languages',
      slug: 'languages',
      description: 'Master language skills with comprehensive training',
      topics: ['Grammar', 'Literature', 'Writing Skills', 'Speaking & Listening'],
      color: 'bg-pink-500',
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600'
    }
  ];

  const features = [
    {
      icon: <Users className="h-6 w-6 text-blue-600" />,
      title: "Small Batch Sizes",
      description: "Maximum 8-10 students per batch for personalized attention"
    },
    {
      icon: <Clock className="h-6 w-6 text-blue-600" />,
      title: "Flexible Scheduling",
      description: "Multiple time slots available to suit your schedule"
    },
    {
      icon: <Award className="h-6 w-6 text-blue-600" />,
      title: "Exam Focused",
      description: "Curriculum designed specifically for IGCSE examination success"
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-blue-600" />,
      title: "Progress Tracking",
      description: "Regular assessments and detailed progress reports"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              IGCSE Excellence
              <span className="block text-yellow-400">Grades 9 & 10</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Comprehensive Cambridge IGCSE preparation with expert faculty, structured curriculum,
              and proven results. Build strong foundations for your AS/A Level success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.open('https://wa.me/918073982848', '_blank')}
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Book Free Demo
              </button>
              <Link
                to="/contact?mode=direct&subject=course-inquiry#contact-form"
                className="border-2 border-white hover:bg-white hover:text-black px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                Get Study Plan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Our IGCSE Program?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              IGCSE Subjects We Offer
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expert coaching across all major IGCSE subjects with comprehensive coverage of Cambridge syllabus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subjects.map((subject, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-48">
                  <img
                    src={subject.image}
                    alt={subject.name}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute top-4 right-4 w-12 h-12 ${subject.color} rounded-full flex items-center justify-center`}>
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{subject.name}</h3>
                  <p className="text-gray-600 mb-4">{subject.description}</p>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Topics:</h4>
                    <div className="flex flex-wrap gap-2">
                      {subject.topics.map((topic, topicIndex) => (
                        <span
                          key={topicIndex}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    to={`/igcse/${subject.slug}`}
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-lg font-semibold transition-colors"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Excel in Your IGCSE Examinations?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of successful students who achieved A*/A grades with our proven teaching methodology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.open('https://wa.me/918073982848', '_blank')}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg"
            >
              Schedule Free Demo
            </button>
            <button
              onClick={() => window.open('https://wa.me/918073982848', '_blank')}
              className="border-2 border-white hover:bg-white hover:text-blue-800 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              WhatsApp Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IGCSEHub;