import React, { useState, useEffect } from 'react';
import { Clock, Users, Video, BookOpen, GraduationCap, CheckCircle2, MessageSquare, PlayCircle, ClipboardList, BarChart3, X } from 'lucide-react';
import * as classesApi from '../api/api/runningClassesApi';
import LoginModal from '../components/LoginModal';
import DemoForm from '../components/DemoForm';
import { useAuth } from '../context/AuthContext.tsx';

const DemoFormModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[#1e3a8a]/40 backdrop-blur-md" onClick={onClose}>
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto custom-scrollbar" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-all"
        >
          <X size={20} />
        </button>
        <DemoForm onSuccess={onClose} />
      </div>
    </div>
  );
};

const RunningClasses = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const data = await classesApi.getActiveClasses({ page: 0, size: 50 });
      // Add dummy data for demo if API returns empty
      const fetchedClasses = data.content || [];
      if (fetchedClasses.length === 0) {
        setClasses([
          { id: 'd1', title: 'UG Mathematics', subject: 'UG Mathematics', category: 'Undergraduate', instructor: 'Ms. Neha Aggarwal', schedule: 'Mon, Wed, Fri - 6:00 PM IST', description: 'Comprehensive mathematics coverage for B.Sc and B.Tech students with focus on Calculus and Linear Algebra.' },
          { id: 'd2', title: 'UG Physics', subject: 'UG Physics', category: 'Undergraduate', instructor: 'Mr. Arvind', schedule: 'Tue, Thu - 5:30 PM IST', description: 'Advanced physics concepts with real-world applications and experimental analysis.' },
          { id: 'd3', title: 'UG Chemistry', subject: 'UG Chemistry', category: 'Undergraduate', instructor: 'B. Aishwarya', schedule: 'Mon, Wed, Fri - 4:30 PM IST', description: 'Organic, Inorganic, and Physical Chemistry fundamentals for university level students.' },
          { id: 'd4', title: 'Computer Science', subject: 'Computer Science Fundamentals', category: 'Undergraduate', instructor: 'Mr. Ashwin Jain', schedule: 'Tue, Thu, Sat - 7:00 PM IST', description: 'Programming, algorithms, and software design principles with practical coding sessions.' }
        ]);
      } else {
        setClasses(fetchedClasses);
      }
    } catch (error) {
      console.error('Error fetching running classes:', error);
      // Fallback to dummy data on error
      setClasses([
        { id: 'd1', title: 'UG Mathematics', subject: 'UG Mathematics', category: 'Undergraduate', instructor: 'Ms. Neha Aggarwal', schedule: 'Mon, Wed, Fri - 6:00 PM IST', description: 'Comprehensive mathematics coverage for B.Sc and B.Tech students.' },
        { id: 'd2', title: 'UG Physics', subject: 'UG Physics', category: 'Undergraduate', instructor: 'Mr. Arvind', schedule: 'Tue, Thu - 5:30 PM IST', description: 'Advanced physics concepts with real-world applications.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = () => {
    setIsDemoModalOpen(true);
  };

  const features = [
    {
      title: "Small Batch Classes",
      desc: "Personalized attention with limited class size ensures every student gets mentored effectively",
      icon: Users
    },
    {
      title: "Flexible Timings",
      desc: "Classes scheduled at convenient times for Indian and international students across time zones",
      icon: Clock
    },
    {
      title: "Expert Instructors",
      desc: "Learn from seasoned educators with 10+ years of teaching experience and strong subject expertise",
      icon: GraduationCap
    },
    {
      title: "Structured Curriculum",
      desc: "Carefully designed course content aligned with academic standards and examination patterns",
      icon: BookOpen
    },
    {
      title: "Interactive Learning",
      desc: "Doubt-clearing sessions, live interactions, and real-time feedback during every class",
      icon: MessageSquare
    },
    {
      title: "Class Recordings",
      desc: "Access recorded sessions anytime for revision and to catch up on missed classes",
      icon: PlayCircle
    },
    {
      title: "Assignments & Tests",
      desc: "Regular practice assignments and tests to monitor progress and identify learning gaps",
      icon: ClipboardList
    },
    {
      title: "Progress Tracking",
      desc: "Periodic evaluations and detailed feedback to help you stay on track with your goals",
      icon: BarChart3
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans overflow-x-hidden">
      {/* Page Header / Hero Section */}
      <section className="bg-white py-4 md:py-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center mb-4 gap-3">
              <div className="p-3 bg-gray-100 rounded-2xl shadow-sm">
                <GraduationCap className="w-10 h-10 md:w-12 md:h-12 text-gray-800" />
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                Running Classes
              </h1>
            </div>
            <p className="text-gray-500 text-sm md:text-lg max-w-3xl mx-auto font-medium leading-relaxed mb-4 md:mb-6">
              Join our active online classes with expert instructors, structured curriculum, and personalized guidance across multiple subjects and levels
            </p>
            {!isAuthenticated ? (
              <button
                onClick={handleDemoClick}
                className="px-6 py-3 bg-gradient-to-r from-[#ffb800] to-[#ff7a00] text-[#1e3a8a] rounded-[12px] font-black text-base md:text-lg hover:shadow-2xl hover:scale-105 transition-all shadow-xl active:scale-95"
              >
                Book Free Demo
              </button>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="px-6 py-2 bg-[#EBFDF5] text-[#059669] rounded-xl font-black text-sm flex items-center gap-2 border-2 border-[#10B981]/20 shadow-sm">
                  <div className="bg-[#10B981] p-1 rounded-full text-white">
                    <CheckCircle2 size={14} strokeWidth={3} />
                  </div>
                  Welcome back! Ready to book a free demo.
                </div>
                <button
                  onClick={handleDemoClick}
                  className="px-6 py-2 bg-gradient-to-r from-[#ffb800] to-[#ff7a00] text-[#1e3a8a] rounded-[10px] font-black text-sm hover:shadow-xl hover:scale-105 transition-all active:scale-95 shadow-lg shadow-orange-500/20"
                >
                  Book Free Demo
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Decorative background element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden opacity-5">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Main Content Section - Two Column Layout */}
      <section className="py-8 md:py-16 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Left: Text Content */}
          <div className="flex-1 text-left">
            <h2 className="text-xl md:text-4xl lg:text-6xl font-black text-[#1e3a8a] mb-4 md:mb-6 leading-[1.1]">
              Real-Time Learning with Expert Mentors
            </h2>
            <div className="space-y-3 md:space-y-4 text-gray-600 text-sm md:text-lg leading-relaxed font-medium mb-4 md:mb-6">
              <p>
                A Star Classes' running classes are live, interactive learning sessions designed to provide students with expert guidance, structured content delivery, and personalized mentoring.
              </p>
              <p>
                Classes are conducted by highly qualified educators with extensive teaching experience. Each session emphasizes conceptual clarity, problem-solving skills, and exam preparation with regular doubt-clearing and interactive discussions.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: Users, label: "8-18 per batch" },
                { icon: Clock, label: "Flexible timing" },
                { icon: Video, label: "Live interaction" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-white p-3 md:p-4 rounded-xl shadow-lg shadow-blue-900/5 border border-gray-100">
                  <item.icon className="text-blue-600 shrink-0" size={20} />
                  <span className="font-bold text-[#1e3a8a] text-sm md:text-base">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Image Section */}
          <div className="flex-1 w-full max-w-[600px]">
            <div className="relative">
              <div className="aspect-[4/3] bg-white rounded-2xl md:rounded-[48px] overflow-hidden shadow-2xl shadow-blue-900/20 border-[8px] md:border-[12px] border-white relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800"
                  alt="Coaching and Mentoring"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative elements behind image */}
              <div className="absolute -top-6 -right-6 w-full h-full bg-amber-400/20 rounded-2xl md:rounded-[48px] -z-10 rotate-3"></div>
              <div className="absolute -bottom-6 -left-6 w-full h-full bg-blue-600/10 rounded-2xl md:rounded-[48px] -z-10 -rotate-3"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Section - Updated to match screenshot */}
      <section className="py-6 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
              <h2 className="text-xl md:text-4xl font-black text-[#1e3a8a] mb-3">Why Join Our Running Classes?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-[#f0f7ff] p-4 sm:p-6 md:p-8 rounded-xl shadow-sm border-l-4 border-blue-600 transition-all duration-300 hover:shadow-md">
                <h3 className="text-lg font-black text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Active Classes Section - Updated to match screenshot */}
      <section className="py-8 md:py-16 px-4 bg-blue-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-xl md:text-4xl font-black text-[#1e3a8a] mb-3">Currently Active Classes</h2>
            <p className="text-sm md:text-base text-gray-500 font-medium">Browse our live and upcoming classes across various subjects and levels</p>
          </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 md:mb-12">
            {loading ? (
              <div className="col-span-full flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : classes.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                <p className="text-2xl text-gray-400 font-bold">No active classes found at the moment.</p>
              </div>
            ) : classes.map((cls, index) => (
              <div key={index} className="group bg-white rounded-2xl border-l-4 border-blue-600 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full p-6">
                <div className="flex-1">
                  <h3 className="text-xl font-black text-gray-900 mb-3">
                    {cls.subject || cls.title}
                  </h3>
                  <div className="mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                      {cls.category?.toLowerCase().replace('_', ' ') || cls.level || 'Undergraduate'}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                    {cls.description}
                  </p>
                  <div className="space-y-3 mb-8">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-black text-gray-900">Instructor: {cls.instructorName || cls.instructor || 'TBA'}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-black text-gray-900">Schedule: {cls.schedule || 'TBA'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="px-4 py-1.5 min-w-[90px] text-center bg-[#00875A]/10 text-[#00875A] text-[12px] font-bold rounded-full uppercase tracking-wider border border-[#00875A]/20">
                    {cls.status || 'Active'}
                  </span>
                  <button
                    onClick={handleDemoClick}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#ffb800] to-[#ff7a00] text-[#1e3a8a] rounded-xl font-black text-sm hover:shadow-xl hover:scale-105 transition-all active:scale-95 shadow-md shadow-orange-500/20 whitespace-nowrap"
                  >
                    Free Demo
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ... other sections ... */}

      {/* Modals */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <DemoFormModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />

      {/* How Our Classes Work Section - Updated to match screenshot */}
      <section className="py-8 md:py-16 bg-blue-50/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-xl md:text-4xl font-black text-[#1e3a8a] mb-6 md:mb-10">How Our Classes Work</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Choose Your Class", desc: "Browse available classes and select the one matching your subject and schedule" },
              { step: "2", title: "Enroll & Access", desc: "Complete enrollment and get instant access to class materials and schedule" },
              { step: "3", title: "Attend & Interact", desc: "Join live classes, participate in discussions, and ask doubts in real-time" },
              { step: "4", title: "Learn & Grow", desc: "Receive feedback, track progress, and improve with continuous guidance" }
            ].map((s, i) => (
              <div key={i} className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-[#1e3a8a] rounded-full flex items-center justify-center text-white font-black text-lg mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="text-base font-black text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-xs font-medium leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 md:mt-16">
            <p className="text-gray-600 text-sm md:text-base font-medium mb-4">Ready to start your learning journey with live, interactive classes?</p>
            <a
              href="https://wa.me/918073982848"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-[10px] font-black text-base hover:shadow-xl hover:scale-105 transition-all active:scale-95 shadow-lg shadow-green-500/20"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RunningClasses;
