import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Clock, Award, CheckCircle, TrendingUp, Target } from 'lucide-react';

const ASALevelHub = () => {
  const subjects = [
    {
      name: 'Physics',
      slug: 'physics',
      description: 'Advanced physics concepts for university preparation',
      topics: ['Mechanics', 'Fields', 'Nuclear Physics', 'Quantum Physics'],
      color: 'bg-blue-500',
      image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=600'
    },
    {
      name: 'Chemistry',
      slug: 'chemistry',
      description: 'Comprehensive organic and inorganic chemistry',
      topics: ['Physical Chemistry', 'Organic Synthesis', 'Thermodynamics', 'Kinetics'],
      color: 'bg-green-500',
      image: 'https://images.unsplash.com/photo-1532187875605-1ef6c237f142?auto=format&fit=crop&q=80&w=600'
    },
    {
      name: 'Mathematics',
      slug: 'math',
      description: 'Advanced mathematical concepts and applications',
      topics: ['Pure Mathematics', 'Mechanics', 'Statistics', 'Decision Mathematics'],
      color: 'bg-purple-500',
      image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=600'
    },
    {
      name: 'Economics',
      slug: 'economics',
      description: 'Advanced economic theory and policy analysis',
      topics: ['Market Failures', 'International Trade', 'Development Economics', 'Monetary Policy'],
      color: 'bg-orange-500',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600'
    },
    {
      name: 'Biology',
      slug: 'biology',
      description: 'Advanced biological systems and processes',
      topics: ['Molecular Biology', 'Genetics & Evolution', 'Ecosystems', 'Human Physiology'],
      color: 'bg-teal-500',
      image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=600'
    },
    {
      name: 'Further Mathematics',
      slug: 'further-math',
      description: 'University-level mathematics for top performers',
      topics: ['Complex Analysis', 'Advanced Calculus', 'Number Theory', 'Graph Theory'],
      color: 'bg-indigo-500',
      image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=600'
    },
    {
      name: 'Languages',
      slug: 'languages',
      description: 'Advanced language and literature studies',
      topics: ['Advanced Writing', 'Critical Analysis', 'Literature Studies', 'Linguistics'],
      color: 'bg-pink-500',
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600'
    }
  ];

  const features = [
    {
      icon: <Target className="h-6 w-6 text-blue-600" />,
      title: "University Preparation",
      description: "Curriculum designed to prepare students for top universities"
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-blue-600" />,
      title: "Advanced Concepts",
      description: "Deep dive into complex topics with expert guidance"
    },
    {
      icon: <Award className="h-6 w-6 text-blue-600" />,
      title: "Research Skills",
      description: "Develop critical thinking and research methodologies"
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-blue-600" />,
      title: "Exam Mastery",
      description: "Proven strategies for AS/A Level examination success"
    }
  ];

  const pathways = [
    {
      title: "AS Level (Grade 11)",
      description: "Foundation year covering core concepts",
      duration: "1 Year",
      subjects: "3-4 Subjects",
      outcome: "AS Level Certificates"
    },
    {
      title: "A Level (Grade 12)",
      description: "Advanced study building on AS foundation",
      duration: "1 Year",
      subjects: "3-4 Subjects",
      outcome: "A Level Certificates"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-900 via-blue-800 to-indigo-900 text-white py-10 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              AS/A Level Excellence
              <span className="block text-yellow-400">Grades 11 & 12</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Advanced Cambridge AS/A Level preparation for university entrance. Master complex concepts
              with expert faculty and secure admission to top universities worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.open('https://wa.me/918073982848', '_blank')}
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg"
              >
                Book Free Demo
              </button>
              <Link
                to="/counselling"
                className="border-2 border-white hover:bg-white hover:text-black px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                University Counselling
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AS/A Level Pathways */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Your Path to University Success
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pathways.map((pathway, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{pathway.title}</h3>
                <p className="text-gray-600 mb-6">{pathway.description}</p>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700 font-medium">Duration:</span>
                    <span className="text-blue-600 font-semibold">{pathway.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 font-medium">Subjects:</span>
                    <span className="text-blue-600 font-semibold">{pathway.subjects}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 font-medium">Outcome:</span>
                    <span className="text-blue-600 font-semibold">{pathway.outcome}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Our AS/A Level Program?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-xl hover:shadow-lg transition-shadow">
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
      <section className="py-10 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              AS/A Level Subjects We Offer
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced coaching for university-level subjects with comprehensive Cambridge curriculum coverage.
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
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Advanced Topics:</h4>
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
                    to={`/as-a-level/${subject.slug}`}
                    className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center py-3 rounded-lg font-semibold transition-colors"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stats */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our AS/A Level Success Record</h2>
            <p className="text-lg text-indigo-100">Proven track record of university admissions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">98%</div>
              <div className="text-indigo-100">A*/A Grades</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">150+</div>
              <div className="text-indigo-100">University Offers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">25+</div>
              <div className="text-indigo-100">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">£2M+</div>
              <div className="text-indigo-100">Scholarships Won</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-10 md:py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Secure Your Place at Top Universities
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Join our AS/A Level program and take the first step towards your dream university admission.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.open('https://wa.me/918073982848', '_blank')}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg"
            >
              Start Your Journey
            </button>
            <button
              onClick={() => window.open('https://wa.me/918073982848', '_blank')}
              className="border-2 border-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Chat with Counselor
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ASALevelHub;