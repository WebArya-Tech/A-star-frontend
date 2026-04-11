import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign, GraduationCap, FileText, Users, CheckCircle } from 'lucide-react';

const CounsellingRegion = () => {
  const { region } = useParams<{ region: string }>();

  const regionData: { [key: string]: any } = {
    europe: {
      name: 'European Colleges',
      description: 'Explore world-class education opportunities across Europe with affordable tuition and rich cultural experiences.',
      image: 'https://images.pexels.com/photos/161758/london-big-ben-uk-england-161758.jpeg?auto=compress&cs=tinysrgb&w=1200',
      countries: ['United Kingdom', 'Germany', 'Netherlands', 'France', 'Switzerland', 'Sweden'],
      advantages: [
        'Lower tuition fees compared to US universities',
        'Rich cultural heritage and history',
        'Strong job market and post-study work opportunities',
        'Excellent public transportation and healthcare',
        'Diverse international student community',
        'English-taught programs widely available'
      ],
      topUniversities: [
        { name: 'University of Oxford', country: 'UK', ranking: '#1' },
        { name: 'University of Cambridge', country: 'UK', ranking: '#2' },
        { name: 'Imperial College London', country: 'UK', ranking: '#3' },
        { name: 'ETH Zurich', country: 'Switzerland', ranking: '#8' },
        { name: 'University College London', country: 'UK', ranking: '#9' },
        { name: 'TU Delft', country: 'Netherlands', ranking: '#15' }
      ],
      requirements: [
        'A Level grades: A*A*A to AAB depending on university',
        'IELTS: 6.5-7.5 or TOEFL equivalent',
        'Personal Statement and References',
        'UCAS application for UK universities',
        'Portfolio for creative subjects'
      ],
      costs: {
        tuition: '£10,000 - £40,000 per year',
        living: '£8,000 - £15,000 per year',
        total: '£18,000 - £55,000 per year'
      },
      timeline: [
        { phase: 'Year 1 (Grade 11)', tasks: 'Research universities, build profile, prepare for AS levels' },
        { phase: 'Summer Year 1', tasks: 'University visits, summer programs, standardized tests' },
        { phase: 'Year 2 (Grade 12)', tasks: 'Complete applications, interviews, A Level exams' },
        { phase: 'Results Day', tasks: 'Receive offers, make final decision' }
      ]
    },
    usa: {
      name: 'American Universities',
      description: 'Access world-renowned higher education with diverse programs, extensive research opportunities, and vibrant campus life.',
      image: 'https://images.pexels.com/photos/12064/pexels-photo-12064.jpeg?auto=compress&cs=tinysrgb&w=1200',
      countries: ['United States'],
      advantages: [
        'Flexible curriculum with liberal arts education',
        'Extensive research opportunities',
        'Strong alumni networks globally',
        'Need-based and merit-based scholarships',
        'Diverse campus communities',
        'Optional Practical Training (OPT) for international students'
      ],
      topUniversities: [
        { name: 'Harvard University', country: 'USA', ranking: '#1' },
        { name: 'MIT', country: 'USA', ranking: '#2' },
        { name: 'Stanford University', country: 'USA', ranking: '#3' },
        { name: 'Yale University', country: 'USA', ranking: '#4' },
        { name: 'Princeton University', country: 'USA', ranking: '#5' },
        { name: 'University of Chicago', country: 'USA', ranking: '#6' }
      ],
      requirements: [
        'SAT: 1400+ or ACT: 32+ for competitive schools',
        'AP courses: 3-5 subjects with scores 4-5',
        'TOEFL: 100+ or IELTS: 7.0+',
        'Strong extracurricular activities',
        'Essays and recommendation letters',
        'Demonstrated leadership and community service'
      ],
      costs: {
        tuition: '$30,000 - $60,000 per year',
        living: '$15,000 - $25,000 per year',
        total: '$45,000 - $85,000 per year'
      },
      timeline: [
        { phase: 'Year 1 (Grade 11)', tasks: 'Take SAT/ACT, build activity profile, research colleges' },
        { phase: 'Summer Year 1', tasks: 'Campus visits, summer programs, essay drafting' },
        { phase: 'Year 2 (Grade 12)', tasks: 'Complete applications, interviews, financial aid forms' },
        { phase: 'Spring Year 2', tasks: 'Receive decisions, compare offers, enroll' }
      ]
    },
    singapore: {
      name: 'Singapore Colleges',
      description: 'Study in Asia\'s education hub with world-class universities, strategic location, and excellent career prospects.',
      image: 'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=1200',
      countries: ['Singapore'],
      advantages: [
        'Strategic location in Southeast Asia',
        'Multicultural and English-speaking environment',
        'Strong economy with excellent job prospects',
        'Global financial and technology hub',
        'Safe and modern living environment',
        'Gateway to Asia-Pacific markets'
      ],
      topUniversities: [
        { name: 'National University of Singapore', country: 'Singapore', ranking: '#11' },
        { name: 'Nanyang Technological University', country: 'Singapore', ranking: '#12' },
        { name: 'Singapore Management University', country: 'Singapore', ranking: '#500+' },
        { name: 'Singapore University of Technology and Design', country: 'Singapore', ranking: '#500+' },
        { name: 'Singapore Institute of Management', country: 'Singapore', ranking: 'Private' },
        { name: 'James Cook University Singapore', country: 'Singapore', ranking: 'Branch Campus' }
      ],
      requirements: [
        'A Level grades: AAA to BBC depending on course',
        'IELTS: 6.5+ or TOEFL: 93+',
        'Subject-specific requirements',
        'Portfolio for design/arts programs',
        'Interview for some programs'
      ],
      costs: {
        tuition: 'S$20,000 - S$45,000 per year',
        living: 'S$15,000 - S$25,000 per year',
        total: 'S$35,000 - S$70,000 per year'
      },
      timeline: [
        { phase: 'Year 1 (Grade 11)', tasks: 'Research programs, prepare for AS levels' },
        { phase: 'December Year 1', tasks: 'Early applications open' },
        { phase: 'March Year 2', tasks: 'Application deadlines, interviews' },
        { phase: 'May-July Year 2', tasks: 'Receive offers, complete A levels' }
      ]
    },
    india: {
      name: 'Indian Schools',
      description: 'Pursue quality education at premier Indian institutions with growing global recognition and emerging opportunities.',
      image: 'https://images.pexels.com/photos/3585047/pexels-photo-3585047.jpeg?auto=compress&cs=tinysrgb&w=1200',
      countries: ['India'],
      advantages: [
        'Cost-effective quality education',
        'Rapidly growing economy and job market',
        'Cultural familiarity and family proximity',
        'Strong emphasis on STEM education',
        'Emerging startup ecosystem',
        'English as medium of instruction'
      ],
      topUniversities: [
        { name: 'Indian Institute of Technology (IIT)', country: 'India', ranking: '#172' },
        { name: 'Indian Institute of Management (IIM)', country: 'India', ranking: 'Top Business' },
        { name: 'Indian School of Business', country: 'India', ranking: 'Top Business' },
        { name: 'Ashoka University', country: 'India', ranking: 'Liberal Arts' },
        { name: 'BITS Pilani', country: 'India', ranking: 'Engineering' },
        { name: 'Indian Statistical Institute', country: 'India', ranking: 'Statistics' }
      ],
      requirements: [
        'Class 12th: 85%+ from recognized board',
        'Entrance exams: JEE, NEET, CAT, etc.',
        'English proficiency for international programs',
        'Specific subject requirements per course',
        'State quota considerations'
      ],
      costs: {
        tuition: '₹50,000 - ₹15,00,000 per year',
        living: '₹1,00,000 - ₹3,00,000 per year',
        total: '₹1,50,000 - ₹18,00,000 per year'
      },
      timeline: [
        { phase: 'Year 1 (Grade 11)', tasks: 'Prepare for entrance exams, choose stream' },
        { phase: 'Year 2 (Grade 12)', tasks: 'Board exams, entrance exams, applications' },
        { phase: 'Summer Year 2', tasks: 'Counseling, seat allocation, admission' },
        { phase: 'July-August', tasks: 'Classes begin' }
      ]
    }
  };

  const currentRegion = regionData[region || 'europe'];

  if (!currentRegion) {
    return <div>Region not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="absolute inset-0">
          <img
            src={currentRegion.image}
            alt={currentRegion.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {currentRegion.name}
            </h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              {currentRegion.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/contact"
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-colors text-center"
              >
                Book Free Consultation
              </Link>
              <button
                onClick={() => window.open('https://wa.me/918861919000', '_blank')}
                className="border-2 border-white hover:bg-white hover:text-black px-8 py-4 rounded-lg font-semibold text-lg transition-colors text-center"
              >
                WhatsApp Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Advantages */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose {currentRegion.name}?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentRegion.advantages.map((advantage: string, index: number) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{advantage}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Universities */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Top Universities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentRegion.topUniversities.map((university: any, index: number) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900">{university.name}</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {university.ranking}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600 text-sm">{university.country}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements & Costs */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Requirements */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                <GraduationCap className="inline h-8 w-8 text-blue-600 mr-3" />
                Entry Requirements
              </h2>
              <div className="space-y-4">
                {currentRegion.requirements.map((requirement: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{requirement}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Costs */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                <DollarSign className="inline h-8 w-8 text-blue-600 mr-3" />
                Cost Breakdown
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Tuition Fees</span>
                    <span className="text-blue-600 font-semibold">{currentRegion.costs.tuition}</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Living Expenses</span>
                    <span className="text-blue-600 font-semibold">{currentRegion.costs.living}</span>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total Annual Cost</span>
                    <span className="text-blue-800 font-bold text-lg">{currentRegion.costs.total}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            <Clock className="inline h-8 w-8 text-blue-600 mr-3" />
            Application Timeline
          </h2>
          <div className="space-y-8">
            {currentRegion.timeline.map((phase: any, index: number) => (
              <div key={index} className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-8">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{phase.phase}</h3>
                  <p className="text-gray-600">{phase.tasks}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Apply to {currentRegion.name}?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Get personalized guidance from our expert counselors who have helped hundreds of students
            secure admissions to top universities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Start Your Application Journey
            </Link>
            <Link
              to="/counselling"
              className="border-2 border-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Explore Other Regions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CounsellingRegion;