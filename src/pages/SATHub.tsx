import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Clock, Award, BookOpen, TrendingUp, Users, CheckCircle } from 'lucide-react';

const SATHub = () => {
  const tests = [
    {
      name: 'SAT',
      slug: 'sat',
      description: 'Comprehensive preparation for SAT Reasoning Test',
      duration: '3 hours 50 minutes',
      sections: ['Reading', 'Writing & Language', 'Math (No Calculator)', 'Math (Calculator)'],
      color: 'bg-blue-500',
      image: 'https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=400',
      targetScore: '1500+',
      popularity: 'Most Popular'
    },
    {
      name: 'TMUA',
      slug: 'tmua',
      description: 'Test of Mathematics for University Admission',
      duration: '2 hours 30 minutes',
      sections: ['Mathematical Thinking', 'Mathematical Reasoning'],
      color: 'bg-purple-500',
      image: 'https://images.pexels.com/photos/3729557/pexels-photo-3729557.jpeg?auto=compress&cs=tinysrgb&w=400',
      targetScore: '7.0+',
      popularity: 'Math Focused'
    },
    {
      name: 'AMC',
      slug: 'amc',
      description: 'American Mathematics Competitions preparation',
      duration: '75 minutes',
      sections: ['Problem Solving', 'Mathematical Reasoning', 'Logic'],
      color: 'bg-green-500',
      image: 'https://images.pexels.com/photos/3729557/pexels-photo-3729557.jpeg?auto=compress&cs=tinysrgb&w=400',
      targetScore: '120+',
      popularity: 'Competition'
    },
    {
      name: 'Advanced Placements',
      slug: 'ap',
      description: 'College-level courses and examinations',
      duration: 'Varies by subject',
      sections: ['Multiple Choice', 'Free Response', 'Essays'],
      color: 'bg-orange-500',
      image: 'https://images.pexels.com/photos/5905516/pexels-photo-5905516.jpeg?auto=compress&cs=tinysrgb&w=400',
      targetScore: '4-5',
      popularity: 'College Credit'
    },
    {
      name: 'ACT',
      slug: 'act',
      description: 'American College Testing preparation',
      duration: '3 hours 35 minutes',
      sections: ['English', 'Math', 'Reading', 'Science'],
      color: 'bg-red-500',
      image: 'https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=400',
      targetScore: '32+',
      popularity: 'Science Heavy'
    }
  ];

  const features = [
    {
      icon: <Target className="h-8 w-8 text-blue-600" />,
      title: "Strategic Preparation",
      description: "Focused preparation targeting your specific score goals"
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-600" />,
      title: "Time Management",
      description: "Master test-taking strategies and time optimization"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-blue-600" />,
      title: "Score Improvement",
      description: "Proven methods to maximize your test scores"
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Expert Guidance",
      description: "Learn from instructors with perfect test scores"
    }
  ];

  const approach = [
    {
      phase: "Diagnostic Assessment",
      description: "Identify strengths and weaknesses with full-length practice tests"
    },
    {
      phase: "Customized Study Plan",
      description: "8-12 week personalized preparation roadmap"
    },
    {
      phase: "Strategic Practice",
      description: "Focus on high-impact areas and question types"
    },
    {
      phase: "Mock Tests & Analysis",
      description: "Regular practice tests with detailed performance analysis"
    },
    {
      phase: "Final Sprint",
      description: "Last-minute strategies and confidence building"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-900 via-red-800 to-pink-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Standardized Test Prep
              <span className="block text-yellow-400">Excel in Every Exam</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Master the SAT, ACT, AP, and specialized tests with our expert-led preparation programs.
              Achieve your target scores and unlock doors to top universities worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/#demo-form"
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                Start Free Diagnostic
              </Link>
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
            Our Test Preparation Advantage
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

      {/* Tests Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tests We Prepare You For
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive preparation for all major standardized tests required for university admissions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tests.map((test, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-48">
                  <img
                    src={test.image}
                    alt={test.name}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute top-4 right-4 w-12 h-12 ${test.color} rounded-full flex items-center justify-center`}>
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {test.popularity}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{test.name}</h3>
                  <p className="text-gray-600 mb-4">{test.description}</p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{test.duration}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Target Score:</span>
                      <span className="font-medium text-green-600">{test.targetScore}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Test Sections:</h4>
                    <div className="flex flex-wrap gap-2">
                      {test.sections.map((section, sectionIndex) => (
                        <span
                          key={sectionIndex}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {section}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    to={`/sat-prep/${test.slug}`}
                    className="block w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-center py-3 rounded-lg font-semibold transition-colors"
                  >
                    Start Preparation
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Strategic Approach
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A systematic methodology designed to maximize score improvements and build lasting test-taking skills.
            </p>
          </div>

          <div className="space-y-8">
            {approach.map((phase, index) => (
              <div key={index} className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-8">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1 bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{phase.phase}</h3>
                  <p className="text-gray-600">{phase.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stats */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Test Prep Success Record</h2>
            <p className="text-lg text-red-100">Proven results across all standardized tests</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">1520</div>
              <div className="text-red-100">Average SAT Score</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">33</div>
              <div className="text-red-100">Average ACT Score</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">4.2</div>
              <div className="text-red-100">Average AP Score</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">300+</div>
              <div className="text-red-100">Point Improvement</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Achieve Your Target Scores
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Start your test preparation journey with a free diagnostic assessment and personalized study plan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/#demo-form"
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Free Diagnostic Test
            </Link>
            <button
              onClick={() => window.open('https://wa.me/918861919000', '_blank')}
              className="border-2 border-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Chat with Expert
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SATHub;