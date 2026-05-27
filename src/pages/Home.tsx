import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, BookOpen, CheckCircle, Clock, Globe, MessageSquare, TrendingUp, Users, Play, Video } from 'lucide-react';
import DemoForm from '../components/DemoForm';
import 'swiper/css';
import 'swiper/css/pagination';
import { Slider } from './slider';
// import Neha from '../assets/Neha.jpg';
// import RohitGupta from '../assets/Rohit-Gupta.jpg';

import { getPublicTeachers } from '../api/api/teacherApi.js';

const Home = () => {
  const [tutors, setTutors] = useState<any[]>([]);

  // Determine the best image URL to show for tutors
  const getTutorImageUrl = (tutor: any) => {
    const photoUrl = tutor.photoUrl || tutor.image;
    if (!photoUrl) return 'https://images.unsplash.com/photo-1544717305-27a734ef1904?auto=format&fit=crop&q=80&w=400';
    if (photoUrl.startsWith('http')) return photoUrl;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.astarclasses.com';
    return `${baseUrl}${photoUrl.startsWith('/') ? '' : '/'}${photoUrl}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teachersData = await getPublicTeachers();

        const tutorList = teachersData?.content || (Array.isArray(teachersData) ? teachersData : []);
        setTutors(tutorList.slice(0, 3));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);
  const features = [
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Expert Faculty",
      description: "10,000+ hours of combined teaching experience with proven A*/A grade outcomes across all subjects."
    },
    {
      icon: <BookOpen className="h-8 w-8 text-blue-600" />,
      title: "Structured Syllabus",
      description: "Comprehensive weekly plans perfectly mapped to Cambridge IGCSE & AS/A Level curriculum requirements."
    },
    {
      icon: <Award className="h-8 w-8 text-blue-600" />,
      title: "Exam Readiness",
      description: "Regular topic tests, extensive past paper practice, checkpoints, and targeted revision sessions."
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-blue-600" />,
      title: "Personalized Support",
      description: "Small batch sizes with dedicated 1:1 doubt clearing sessions and individualized attention."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-blue-600" />,
      title: "Parent Updates",
      description: "Regular progress reports, goal tracking, and transparent communication with parents."
    }
  ];

  const subjects = [
    { name: 'Physics', slug: 'physics', level: 'IGCSE & AS/A Level', color: 'bg-blue-500', image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=400' },
    { name: 'Chemistry', slug: 'chemistry', level: 'IGCSE & AS/A Level', color: 'bg-green-500', image: 'https://images.unsplash.com/photo-1532187875605-186c7131ef53?auto=format&fit=crop&q=80&w=400' },
    { name: 'Mathematics', slug: 'math', level: 'IGCSE & AS/A Level', color: 'bg-purple-500', image: 'https://images.unsplash.com/photo-1509228468518-180dd48a542f?auto=format&fit=crop&q=80&w=400' },
    { name: 'Economics', slug: 'economics', level: 'IGCSE & AS/A Level', color: 'bg-orange-500', image: 'https://images.unsplash.com/photo-1454165833767-027508496b4c?auto=format&fit=crop&q=80&w=400' },
    { name: 'Biology', slug: 'biology', level: 'IGCSE & AS/A Level', color: 'bg-teal-500', image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=400' },
    { name: 'Further Math', slug: 'further-math', level: 'IGCSE & AS/A Level', color: 'bg-indigo-500', image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=400' },
    { name: 'Languages', slug: 'languages', level: 'IGCSE & AS/A Level', color: 'bg-pink-500', image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=400' }
  ];

  const steps = [
    {
      number: "01",
      title: "Diagnostic Assessment",
      description: "Comprehensive evaluation to understand current level and create personalized learning plan"
    },
    {
      number: "02",
      title: "Live Interactive Classes",
      description: "Small batch sessions with expert faculty using modern teaching methodologies"
    },
    {
      number: "03",
      title: "Practice & Feedback",
      description: "Regular assignments, topic tests, and detailed feedback for continuous improvement"
    },
    {
      number: "04",
      title: "Mock Examinations",
      description: "Timed practice exams with detailed analysis and performance tracking"
    },
    {
      number: "05",
      title: "Final Exam Sprint",
      description: "Intensive revision sessions and last-minute preparation for board examinations"
    }
  ];




  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-10">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            {/* Left: Hero Text */}
            <div className="text-left">
              <h1 className="font-sans font-bold text-[1.2rem] md:text-[1.6rem] lg:text-[2rem] leading-tight mb-3 tracking-tight text-white">
                IGCSE &amp; AS/A Level Mastery
                <span className="block font-semibold text-yellow-400 text-[0.95rem] md:text-[1.1rem] lg:text-[1.2rem] mt-1 tracking-normal">
                  From First Principles to Top Scores
                </span>
              </h1>
              <p className="text-sm md:text-base text-gray-200 mb-4 leading-normal max-w-md">
                Live, interactive classes by expert faculty. Personalized doubt-clearing, proven exam strategies, and comprehensive past-paper practice to ensure your academic success.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <a
                  href="https://wa.me/918073982848"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 text-center"
                >
                  Book a Free Demo Class
                </a>
                <button
                  onClick={() => window.open('https://wa.me/918073982848', '_blank')}
                  className="border border-white hover:bg-white hover:text-black px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 text-center"
                >
                  WhatsApp Us
                </button>
              </div>
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-4 mt-8">
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-400">95%</div>
                  <div className="text-xs text-gray-300">A*/A Grades</div>
                </div>
                <div className="text-center border-l border-r border-yellow-400 border-opacity-30 px-4">
                  <div className="text-lg font-bold text-yellow-400">500+</div>
                  <div className="text-xs text-gray-300">Students Taught</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-400">8+</div>
                  <div className="text-xs text-gray-300">Years Experience</div>
                </div>
              </div>
            </div>
            {/* Right: Swiper Slider */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <Slider />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why A Star Classes */}
      <section className="py-10 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose A Star Classes?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine expert teaching with proven methodologies to deliver exceptional results for every student.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 md:p-8 hover:shadow-xl transition-all duration-300 hover:border-blue-500">
                <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects & Tracks */}
      <section className="py-10 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Subject Coverage
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expert coaching across all major IGCSE and AS/A Level subjects with specialized test preparation.
            </p>
          </div>

          {/* IGCSE & AS/A Level Subjects */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">IGCSE & AS/A Level Subjects</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {subjects.map((subject, index) => (
                <Link
                  key={index}
                  to={`/igcse/${subject.slug}`}
                  className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 hover:scale-105 p-6 flex flex-col items-center justify-center"
                >
                  <div className={`w-16 h-16 ${subject.color} rounded-full flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-900 mb-1">{subject.name}</h4>
                    <p className="text-xs text-gray-600">{subject.level}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Standardized Tests */}
          {/* <div className="bg-blue-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">Standardized Test Preparation</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {['SAT', 'AP', 'AMC', 'TMUA', 'ACT'].map((test, index) => (
                <Link
                  key={index}
                  to={`/sat-prep/${test.toLowerCase()}`}
                  className="bg-white rounded-xl p-6 text-center border border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <div className="w-12 h-12 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900">{test}</h4>
                </Link>
              ))}
            </div>
          </div> */}
        </div>
      </section>

      {/* Results & Proof */}
      <section className="py-10 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Proven Track Record of Excellence
            </h2>
            <p className="text-xl text-gray-600">
              Our students consistently achieve top grades and secure admissions to prestigious universities worldwide.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-2xl sm:text-4xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-gray-700">Students Score A*/A</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-4xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-700">Students Guided</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-4xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-gray-700">Top Universities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-4xl font-bold text-orange-600 mb-2">8+</div>
              <div className="text-gray-700">Years Experience</div>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white text-center">
              <Globe className="h-12 w-12 mx-auto mb-4" />
              <h4 className="text-xl font-bold mb-2">Global Recognition</h4>
              <p className="text-blue-100">Students admitted to top universities across UK, US, Canada, and Australia</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white text-center">
              <Award className="h-12 w-12 mx-auto mb-4" />
              <h4 className="text-xl font-bold mb-2">Perfect Scores</h4>
              <p className="text-green-100">Multiple students achieved maximum marks in various subjects</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-4" />
              <h4 className="text-xl font-bold mb-2">Grade Improvement</h4>
              <p className="text-purple-100">Average improvement of 2+ grades within one academic year</p>
            </div>
          </div>
        </div>
      </section>

      {/* How Classes Work */}
      <section className="py-10 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Proven Learning Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A systematic approach designed to maximize learning outcomes and exam performance.
            </p>
          </div>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-8">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {step.number}
                  </div>
                </div>
                <div className="flex-1 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-10 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Expert Faculty
            </h2>
            <p className="text-xl text-gray-600">
              Learn from the best educators dedicated to your success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tutors.map((tutor) => (
              <div key={tutor._id || tutor.id} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                <div className="h-48 sm:h-64 md:h-80 overflow-hidden relative bg-gray-100 flex items-center justify-center">
                  <img src={getTutorImageUrl(tutor)} alt={tutor.name} className="w-full h-full object-contain" />
                </div>
                <div className="p-6 flex-1 flex flex-col text-center">
                  <h4 className="font-bold text-xl text-gray-900 mb-2">{tutor.fullName || tutor.name}</h4>
                  <div className="mb-3 flex justify-center">
                    <span className="px-3 py-1 bg-blue-900 text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-lg inline-block">
                      {tutor.category}
                    </span>
                  </div>
                  <p className="text-sm text-blue-600 font-semibold mb-3 uppercase tracking-wide">{tutor.subject}</p>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-6 italic">"{tutor.bio}"</p>
                  <div className="mt-auto pt-4 border-t border-gray-50 flex justify-center">
                    <Link to="/tutors" className="text-blue-900 font-bold text-sm inline-flex items-center gap-2 hover:gap-3 transition-all">
                      VIEW FULL PROFILE <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/tutors"
              className="inline-flex items-center px-8 py-3 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20"
            >
              Meet All Tutors
              <Users className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Demo Form Section */}
      <section id="demo-form" className="py-10 md:py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Start Your Success Journey?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Book a free personalized demo class and experience our teaching methodology firsthand.
              No commitment required - just quality education.
            </p>
          </div>

          <div className="flex justify-center">
            <a 
              href="https://wa.me/918073982848" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-10 py-4 bg-green-600 text-white rounded-2xl font-bold text-lg hover:bg-green-700 transition-all shadow-xl shadow-green-600/20 active:scale-95 gap-3"
            >
              <MessageSquare className="h-6 w-6" />
              Book a Free Demo Class (WhatsApp)
            </a>
          </div>

          <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">100% Free Demo</h4>
                <p className="text-gray-600">No hidden charges or commitments</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Expert Faculty</h4>
                <p className="text-gray-600">Learn from experienced professionals</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Flexible Timing</h4>
                <p className="text-gray-600">Choose your preferred time slot</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;