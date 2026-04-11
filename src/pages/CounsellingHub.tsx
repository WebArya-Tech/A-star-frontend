import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, GraduationCap, FileText, Users, CheckCircle, MapPin, Trophy, Clock } from 'lucide-react';

const CounsellingHub = () => {
  const regions = [
    {
      name: 'European Colleges',
      slug: 'europe',
      description: 'Prestigious universities across UK, Germany, Netherlands, and more',
      features: ['Low tuition fees', 'English programs', 'Strong job prospects', 'Cultural diversity'],
      color: 'bg-blue-500',
      image: 'https://images.pexels.com/photos/161758/london-big-ben-uk-england-161758.jpeg?auto=compress&cs=tinysrgb&w=400',
      universities: ['Oxford', 'Cambridge', 'Imperial College', 'UCL', 'TU Delft']
    },
    {
      name: 'American Universities',
      slug: 'usa',
      description: 'Top-ranked universities and liberal arts colleges in the United States',
      features: ['Liberal arts education', 'Research opportunities', 'Campus life', 'Alumni networks'],
      color: 'bg-red-500',
      image: 'https://images.pexels.com/photos/12064/pexels-photo-12064.jpeg?auto=compress&cs=tinysrgb&w=400',
      universities: ['Harvard', 'MIT', 'Stanford', 'Yale', 'Princeton']
    },
    {
      name: 'Singapore Colleges',
      slug: 'singapore',
      description: 'World-class education in the heart of Southeast Asia',
      features: ['Strategic location', 'Multicultural environment', 'Strong economy', 'Tech hub'],
      color: 'bg-green-500',
      image: 'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=400',
      universities: ['NUS', 'NTU', 'SMU', 'SUTD', 'SIM']
    },
    {
      name: 'Indian Schools',
      slug: 'india',
      description: 'Premier institutions and emerging universities in India',
      features: ['Cost-effective', 'Growing opportunities', 'Familiar culture', 'Strong academics'],
      color: 'bg-orange-500',
      image: 'https://images.pexels.com/photos/3585047/pexels-photo-3585047.jpeg?auto=compress&cs=tinysrgb&w=400',
      universities: ['IIT', 'IIM', 'ISB', 'Ashoka', 'BITS Pilani']
    }
  ];

  const services = [
    {
      icon: <FileText className="h-8 w-8 text-blue-600" />,
      title: 'Profile Building',
      description: 'Develop a compelling academic and extracurricular profile'
    },
    {
      icon: <GraduationCap className="h-8 w-8 text-blue-600" />,
      title: 'University Selection',
      description: 'Strategic shortlisting based on your goals and profile'
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: 'Application Support',
      description: 'Complete guidance through application processes'
    },
    {
      icon: <Trophy className="h-8 w-8 text-blue-600" />,
      title: 'Scholarship Guidance',
      description: 'Identify and apply for financial aid opportunities'
    }
  ];

  const process = [
    {
      step: '01',
      title: 'Initial Consultation',
      description: 'Understand your goals, preferences, and academic background'
    },
    {
      step: '02',
      title: 'Profile Assessment',
      description: 'Evaluate your strengths and identify areas for improvement'
    },
    {
      step: '03',
      title: 'Strategic Planning',
      description: 'Create personalized roadmap with timeline and milestones'
    },
    {
      step: '04',
      title: 'Application Execution',
      description: 'Guide through essays, recommendations, and submissions'
    },
    {
      step: '05',
      title: 'Final Preparation',
      description: 'Interview preparation and final decision support'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              College Counselling
              <span className="block text-yellow-400">Your Path to Global Education</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Expert guidance for university admissions worldwide. From profile building to final admissions,
              we support your journey to top universities across the globe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                Book Free Consultation
              </Link>
              <button
                onClick={() => window.open('https://wa.me/918861919000', '_blank')}
                className="border-2 border-white hover:bg-white hover:text-black px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                WhatsApp Counselor
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Comprehensive Counselling Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  {service.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regions */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Global University Options
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore opportunities across different regions and find the perfect fit for your academic goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {regions.map((region, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-48">
                  <img
                    src={region.image}
                    alt={region.name}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute top-4 right-4 w-12 h-12 ${region.color} rounded-full flex items-center justify-center`}>
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{region.name}</h3>
                  <p className="text-gray-600 mb-6">{region.description}</p>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Key Advantages:</h4>
                    <div className="space-y-2">
                      {region.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-gray-600 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Top Universities:</h4>
                    <div className="flex flex-wrap gap-2">
                      {region.universities.map((university, uniIndex) => (
                        <span
                          key={uniIndex}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {university}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    to={`/counselling/${region.slug}`}
                    className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white text-center py-3 rounded-lg font-semibold transition-colors"
                  >
                    Explore {region.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Counselling Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A structured approach to ensure your success in university admissions.
            </p>
          </div>

          <div className="space-y-8">
            {process.map((step, index) => (
              <div key={index} className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-8">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {step.step}
                  </div>
                </div>
                <div className="flex-1 bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stats */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Success Record</h2>
            <p className="text-lg text-purple-100">Proven track record of university admissions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">500+</div>
              <div className="text-purple-100">Students Counselled</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">95%</div>
              <div className="text-purple-100">Admission Success</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">50+</div>
              <div className="text-purple-100">Universities</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">$2M+</div>
              <div className="text-purple-100">Scholarships Secured</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Your University Journey Today
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Book a free consultation with our expert counselors and take the first step towards your dream university.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Book Free Consultation
            </Link>
            <Link
              to="/demoform"
              className="border-2 border-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Schedule Demo Class
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CounsellingHub;