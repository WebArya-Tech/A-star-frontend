import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Target, BookOpen, Award, CheckCircle, TrendingUp, Users, FileText } from 'lucide-react';

const TestPage = () => {
  const { test } = useParams<{ test: string }>();

  const testData: { [key: string]: any } = {
    sat: {
      name: 'SAT',
      fullName: 'SAT Reasoning Test',
      description: 'The SAT is a standardized test widely used for college admissions in the United States.',
      image: 'https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=1200',
      color: 'bg-blue-500',
      duration: '3 hours 50 minutes',
      maxScore: 1600,
      targetScore: '1500+',
      sections: [
        { name: 'Reading', duration: '65 minutes', questions: '52 questions' },
        { name: 'Writing & Language', duration: '35 minutes', questions: '44 questions' },
        { name: 'Math (No Calculator)', duration: '25 minutes', questions: '20 questions' },
        { name: 'Math (Calculator)', duration: '55 minutes', questions: '38 questions' }
      ],
      strategy: [
        'Master time management with regular practice tests',
        'Focus on evidence-based reading and analysis',
        'Strengthen mathematical concepts and problem-solving',
        'Practice writing clear, concise essays'
      ],
      schedule: {
        duration: '12 weeks',
        frequency: '3 sessions per week',
        hours: '2 hours per session',
        tests: 'Weekly full-length practice tests'
      },
      materials: [
        'Official SAT Study Guide',
        'Khan Academy SAT Practice',
        'Custom practice questions',
        'Vocabulary building resources',
        'Essay writing templates'
      ]
    },
    act: {
      name: 'ACT',
      fullName: 'American College Testing',
      description: 'The ACT is a standardized test used for college admissions in the United States.',
      image: 'https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=1200',
      color: 'bg-red-500',
      duration: '3 hours 35 minutes',
      maxScore: 36,
      targetScore: '32+',
      sections: [
        { name: 'English', duration: '45 minutes', questions: '75 questions' },
        { name: 'Mathematics', duration: '60 minutes', questions: '60 questions' },
        { name: 'Reading', duration: '35 minutes', questions: '40 questions' },
        { name: 'Science', duration: '35 minutes', questions: '40 questions' }
      ],
      strategy: [
        'Develop speed and accuracy across all sections',
        'Master scientific data interpretation',
        'Practice English grammar and usage rules',
        'Build reading comprehension skills'
      ],
      schedule: {
        duration: '10 weeks',
        frequency: '3 sessions per week',
        hours: '2 hours per session',
        tests: 'Bi-weekly full-length practice tests'
      },
      materials: [
        'Official ACT Prep Guide',
        'Science reasoning practice',
        'English grammar workbook',
        'Reading comprehension passages',
        'Math formula reference'
      ]
    },
    tmua: {
      name: 'TMUA',
      fullName: 'Test of Mathematics for University Admission',
      description: 'TMUA is used by several UK universities to assess mathematical thinking and reasoning skills.',
      image: 'https://images.pexels.com/photos/3729557/pexels-photo-3729557.jpeg?auto=compress&cs=tinysrgb&w=1200',
      color: 'bg-purple-500',
      duration: '2 hours 30 minutes',
      maxScore: 9,
      targetScore: '7.0+',
      sections: [
        { name: 'Mathematical Thinking', duration: '75 minutes', questions: '20 questions' },
        { name: 'Mathematical Reasoning', duration: '75 minutes', questions: '20 questions' }
      ],
      strategy: [
        'Focus on mathematical logic and reasoning',
        'Practice proof techniques and problem analysis',
        'Develop clear mathematical communication',
        'Master advanced mathematical concepts'
      ],
      schedule: {
        duration: '8 weeks',
        frequency: '2 sessions per week',
        hours: '2.5 hours per session',
        tests: 'Weekly practice papers'
      },
      materials: [
        'TMUA past papers',
        'Mathematical reasoning guides',
        'Advanced problem collections',
        'Proof writing practice',
        'Logic puzzles and challenges'
      ]
    },
    amc: {
      name: 'AMC',
      fullName: 'American Mathematics Competitions',
      description: 'AMC contests identify, recognize and reward excellence in mathematics among high school students.',
      image: 'https://images.pexels.com/photos/3729557/pexels-photo-3729557.jpeg?auto=compress&cs=tinysrgb&w=1200',
      color: 'bg-green-500',
      duration: '75 minutes',
      maxScore: 150,
      targetScore: '120+',
      sections: [
        { name: 'Problem Solving', duration: '75 minutes', questions: '25 questions' }
      ],
      strategy: [
        'Master competition mathematics techniques',
        'Practice time-efficient problem solving',
        'Learn advanced mathematical strategies',
        'Develop pattern recognition skills'
      ],
      schedule: {
        duration: '16 weeks',
        frequency: '2 sessions per week',
        hours: '2 hours per session',
        tests: 'Monthly AMC-style contests'
      },
      materials: [
        'AMC past papers (10+ years)',
        'Competition mathematics books',
        'Problem-solving strategies guide',
        'Number theory resources',
        'Geometry competition problems'
      ]
    },
    ap: {
      name: 'AP',
      fullName: 'Advanced Placement',
      description: 'AP courses offer college-level curriculum and examinations to high school students.',
      image: 'https://images.pexels.com/photos/5905516/pexels-photo-5905516.jpeg?auto=compress&cs=tinysrgb&w=1200',
      color: 'bg-orange-500',
      duration: 'Varies by subject',
      maxScore: 5,
      targetScore: '4-5',
      sections: [
        { name: 'Multiple Choice', duration: 'Varies', questions: 'Subject specific' },
        { name: 'Free Response', duration: 'Varies', questions: 'Essay/Problem based' }
      ],
      strategy: [
        'Master subject-specific content thoroughly',
        'Practice free response question formats',
        'Develop time management for each section',
        'Learn scoring rubrics and expectations'
      ],
      schedule: {
        duration: 'Full academic year',
        frequency: '2-3 sessions per week',
        hours: '2 hours per session',
        tests: 'Monthly practice exams'
      },
      materials: [
        'AP subject textbooks',
        'Released AP exam questions',
        'Subject-specific prep books',
        'Online AP resources',
        'Practice exam materials'
      ]
    }
  };

  const currentTest = testData[test || 'sat'];

  if (!currentTest) {
    return <div>Test not found</div>;
  }

  const benefits = [
    {
      icon: <Target className="h-6 w-6 text-blue-600" />,
      title: "Score Improvement",
      description: "Average 200+ point increase for SAT students"
    },
    {
      icon: <Users className="h-6 w-6 text-blue-600" />,
      title: "Expert Instructors",
      description: "Teachers with perfect or near-perfect test scores"
    },
    {
      icon: <Clock className="h-6 w-6 text-blue-600" />,
      title: "Flexible Scheduling",
      description: "Multiple time slots to fit your busy schedule"
    },
    {
      icon: <Award className="h-6 w-6 text-blue-600" />,
      title: "Proven Results",
      description: "Thousands of students admitted to top universities"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="absolute inset-0">
          <img
            src={currentTest.image}
            alt={currentTest.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-3xl">
            <div className="mb-4">
              <span className={`${currentTest.color} text-white px-4 py-2 rounded-full text-sm font-semibold`}>
                {currentTest.name} Preparation
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {currentTest.fullName}
              <span className="block text-yellow-400 text-3xl md:text-4xl mt-2">Expert Coaching</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              {currentTest.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/#demo-form"
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-colors text-center"
              >
                Start Free Diagnostic
              </Link>
              <button
                onClick={() => window.open('https://wa.me/918861919000', '_blank')}
                className="border-2 border-white hover:bg-white hover:text-black px-8 py-4 rounded-lg font-semibold text-lg transition-colors text-center"
              >
                Get Study Plan
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Test Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <Clock className="h-8 w-8 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Duration</h3>
              <p className="text-gray-600">{currentTest.duration}</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Max Score</h3>
              <p className="text-gray-600">{currentTest.maxScore}</p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <Target className="h-8 w-8 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Target Score</h3>
              <p className="text-gray-600">{currentTest.targetScore}</p>
            </div>
            <div className="text-center p-6 bg-orange-50 rounded-xl">
              <BookOpen className="h-8 w-8 text-orange-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Sections</h3>
              <p className="text-gray-600">{currentTest.sections.length} sections</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Test Structure & Format
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentTest.sections.map((section: any, index: number) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{section.name}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{section.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Questions:</span>
                    <span className="font-medium">{section.questions}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategy & Approach */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Our {currentTest.name} Strategy
              </h2>
              <div className="space-y-4">
                {currentTest.strategy.map((strategy: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{strategy}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Course Schedule
              </h2>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Program Duration:</span>
                    <span className="text-blue-600 font-semibold">{currentTest.schedule.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Class Frequency:</span>
                    <span className="text-blue-600 font-semibold">{currentTest.schedule.frequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Session Length:</span>
                    <span className="text-blue-600 font-semibold">{currentTest.schedule.hours}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Practice Tests:</span>
                    <span className="text-blue-600 font-semibold">{currentTest.schedule.tests}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Study Materials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Comprehensive Study Materials
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentTest.materials.map((material: string, index: number) => (
              <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                <FileText className="h-6 w-6 text-blue-600 flex-shrink-0" />
                <span className="text-gray-700">{material}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Our {currentTest.name} Program?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-xl hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Master the {currentTest.name}?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join our proven {currentTest.name} preparation program and achieve your target score with expert guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/#demo-form"
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Start Free Diagnostic
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Get Personalized Plan
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TestPage;