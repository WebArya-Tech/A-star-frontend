import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Users, BookOpen, Award, CheckCircle, FileText, Video, Target } from 'lucide-react';
import languageImg from '../assets/language.jpeg';
import physicsImg from '../assets/physics.jpeg';
import biologyImg from '../assets/biology.jpeg';
import math1Img from '../assets/math1.jpeg';
import math2Img from '../assets/math2.jpeg';
import economicsImg from '../assets/e-comrse.jpeg';

interface SubjectPageProps {
  level: 'IGCSE' | 'AS/A Level';
}

const SubjectPage: React.FC<SubjectPageProps> = ({ level }) => {
  const { subject } = useParams<{ subject: string }>();

  const subjectData: { [key: string]: any } = {
    physics: {
      name: 'Physics',
      description: 'Master the fundamental laws of nature and prepare for advanced studies in physics and engineering.',
      image: physicsImg,
      color: 'bg-blue-500',
      syllabus: level === 'IGCSE' ?
        ['General Physics', 'Thermal Physics', 'Properties of Waves', 'Electricity and Magnetism', 'Atomic Physics'] :
        ['Mechanics', 'Materials', 'Waves', 'Electricity', 'Further Mechanics', 'Electric and Magnetic Fields', 'Nuclear Physics', 'Medical Physics'],
      outcomes: [
        'Develop problem-solving skills through mathematical analysis',
        'Understand experimental design and data analysis',
        'Apply physics principles to real-world situations',
        'Prepare for university-level physics and engineering courses'
      ]
    },
    chemistry: {
      name: 'Chemistry',
      description: 'Explore the molecular world and chemical reactions that shape our universe.',
      image: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=800',
      color: 'bg-green-500',
      syllabus: level === 'IGCSE' ?
        ['The Particulate Nature of Matter', 'Experimental Techniques', 'Atoms Elements and Compounds', 'Stoichiometry', 'Electricity and Chemistry', 'Energy Changes in Chemical Reactions', 'Chemical Properties of Metals', 'Acids Bases and Salts', 'The Periodic Table', 'Metals', 'Air and Water', 'Sulfur', 'Carbonates', 'Organic Chemistry'] :
        ['Atomic Structure', 'Amount of Substance', 'Bonding', 'Energetics', 'Kinetics', 'Chemical Equilibria', 'Redox Reactions', 'Inorganic Chemistry', 'Organic Chemistry', 'Analytical Techniques'],
      outcomes: [
        'Master chemical bonding and molecular structure concepts',
        'Develop laboratory skills and safety awareness',
        'Understand organic and inorganic chemistry principles',
        'Prepare for careers in chemistry, medicine, and materials science'
      ]
    },
    math: {
      name: 'Mathematics',
      description: 'Build strong mathematical foundations essential for all STEM fields.',
      image: math1Img,
      color: 'bg-purple-500',
      syllabus: level === 'IGCSE' ?
        ['Number', 'Algebra', 'Geometry', 'Mensuration', 'Co-ordinate Geometry', 'Trigonometry', 'Matrices and Transformations', 'Probability', 'Statistics'] :
        ['Pure Mathematics 1', 'Pure Mathematics 2', 'Pure Mathematics 3', 'Mechanics', 'Probability & Statistics'],
      outcomes: [
        'Develop logical thinking and problem-solving abilities',
        'Master algebraic manipulation and calculus concepts',
        'Apply mathematical modeling to real-world problems',
        'Prepare for advanced mathematics and STEM courses'
      ]
    },
    economics: {
      name: 'Economics',
      description: 'Understand economic principles and their impact on society and business.',
      image: economicsImg,
      color: 'bg-orange-500',
      syllabus: level === 'IGCSE' ?
        ['The Basic Economic Problem', 'The Allocation of Resources', 'Microeconomic Decision Makers', 'Government and the Macroeconomy', 'Economic Development', 'International Trade and Globalisation'] :
        ['Basic Economic Ideas and Resource Allocation', 'The Price System and the Microeconomy', 'Government Microeconomic Intervention', 'The Macroeconomy', 'Government Macroeconomic Intervention', 'International Economic Issues'],
      outcomes: [
        'Analyze economic problems using theoretical frameworks',
        'Understand market mechanisms and government policies',
        'Evaluate economic data and current affairs',
        'Prepare for careers in business, finance, and public policy'
      ]
    },
    biology: {
      name: 'Biology',
      description: 'Explore the fascinating world of living organisms and biological processes.',
      image: biologyImg,
      color: 'bg-teal-500',
      syllabus: level === 'IGCSE' ?
        ['Characteristics and Classification of Living Organisms', 'Organisation and Maintenance of the Organism', 'Movement in and out of Cells', 'Biological Molecules', 'Enzymes', 'Plant Nutrition', 'Human Nutrition', 'Transport in Plants', 'Transport in Animals', 'Diseases and Immunity', 'Gas Exchange in Humans', 'Respiration', 'Excretion in Humans', 'Coordination and Response', 'Drugs', 'Reproduction', 'Inheritance', 'Variation and Selection', 'Organisms and their Environment', 'Biotechnology and Genetic Engineering', 'Human Influences on Ecosystems'] :
        ['Cell Structure', 'Biological Molecules', 'Enzymes', 'Cell Membranes and Transport', 'The Mitotic Cell Cycle', 'Nucleic Acids and Protein Synthesis', 'Transport in Plants', 'Transport in Mammals', 'Gas Exchange', 'Infectious Diseases', 'Immunity', 'Energy and Respiration', 'Photosynthesis', 'Homeostasis', 'Control and Coordination', 'Inherited Change', 'Selection and Evolution', 'Biodiversity, Classification and Conservation', 'Genetic Technology'],
      outcomes: [
        'Understand cellular processes and molecular biology',
        'Develop practical laboratory and fieldwork skills',
        'Analyze biological data and experimental results',
        'Prepare for careers in medicine, biotechnology, and research'
      ]
    },
    'further-math': {
      name: 'Further Mathematics',
      description: 'Advanced mathematics for the most ambitious students aiming for top universities.',
      image: math2Img,
      color: 'bg-indigo-500',
      syllabus: level === 'IGCSE' ?
        ['Functions', 'Coordinate Geometry', 'Circular Measure', 'Trigonometry', 'Permutations and Combinations', 'Series', 'Differentiation', 'Integration', 'Differential Equations', 'Vectors in Two Dimensions', 'Vectors in Three Dimensions'] :
        ['Core Pure Mathematics', 'Further Pure Mathematics', 'Further Mechanics', 'Further Statistics', 'Decision Mathematics', 'Numerical Methods'],
      outcomes: [
        'Master advanced mathematical concepts and techniques',
        'Develop rigorous mathematical reasoning skills',
        'Prepare for mathematics, physics, and engineering at top universities',
        'Excel in mathematical competitions and olympiads'
      ]
    },
    languages: {
      name: 'Languages',
      description: 'Master language skills through comprehensive literature and linguistic study.',
      image: languageImg,
      color: 'bg-pink-500',
      syllabus: level === 'IGCSE' ?
        ['Reading', 'Writing', 'Speaking', 'Listening', 'Use of English', 'Directed Writing', 'Composition', 'Summary Writing'] :
        ['Language Analysis', 'Creative Writing', 'Literature Study', 'Critical Analysis', 'Comparative Studies', 'Coursework Portfolio'],
      outcomes: [
        'Develop advanced communication skills',
        'Analyze literary texts with critical insight',
        'Master various writing styles and techniques',
        'Prepare for careers in journalism, law, and academia'
      ]
    }
  };

  const currentSubject = subjectData[subject || 'physics'];

  if (!currentSubject) {
    return <div>Subject not found</div>;
  }

  const classFormat = {
    frequency: level === 'IGCSE' ? '3 sessions per week' : '4 sessions per week',
    duration: '90 minutes per session',
    batchSize: '6-8 students maximum',
    support: '24/7 doubt clearing available'
  };

  const resources = [
    {
      icon: <FileText className="h-6 w-6 text-blue-600" />,
      title: 'Comprehensive Notes',
      description: 'Detailed study materials covering entire syllabus'
    },
    {
      icon: <Video className="h-6 w-6 text-blue-600" />,
      title: 'Recorded Sessions',
      description: 'Access to all live class recordings for revision'
    },
    {
      icon: <BookOpen className="h-6 w-6 text-blue-600" />,
      title: 'Past Papers',
      description: 'Extensive collection of past papers with solutions'
    },
    {
      icon: <Target className="h-6 w-6 text-blue-600" />,
      title: 'Topic Tests',
      description: 'Regular assessments to track progress'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-slate-800 text-white">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-4">
                <span className="bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-semibold">
                  {level}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {currentSubject.name}
                <span className="block text-yellow-400 text-3xl md:text-4xl mt-2">Expert Coaching</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                {currentSubject.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/demoform"
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-colors text-center"
                >
                  Book Free Demo
                </Link>
                <button
                  onClick={() => window.open('https://wa.me/918073982848', '_blank')}
                  className="border-2 border-white hover:bg-white hover:text-black px-8 py-4 rounded-lg font-semibold text-lg transition-colors text-center"
                >
                  WhatsApp Now
                </button>
              </div>
            </div>
            <div className="relative">
              <img
                src={currentSubject.image}
                alt={currentSubject.name}
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
              <div className={`absolute -bottom-4 -right-4 w-24 h-24 ${currentSubject.color} rounded-full flex items-center justify-center shadow-lg`}>
                <BookOpen className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Class Format */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How Our {currentSubject.name} Classes Work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <Clock className="h-8 w-8 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Class Schedule</h3>
              <p className="text-gray-600 text-sm">{classFormat.frequency}</p>
              <p className="text-gray-600 text-sm">{classFormat.duration}</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Batch Size</h3>
              <p className="text-gray-600 text-sm">{classFormat.batchSize}</p>
              <p className="text-gray-600 text-sm">Personal attention guaranteed</p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <Award className="h-8 w-8 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Expert Faculty</h3>
              <p className="text-gray-600 text-sm">10+ years experience</p>
              <p className="text-gray-600 text-sm">Subject specialists</p>
            </div>
            <div className="text-center p-6 bg-orange-50 rounded-xl">
              <CheckCircle className="h-8 w-8 text-orange-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Support</h3>
              <p className="text-gray-600 text-sm">{classFormat.support}</p>
              <p className="text-gray-600 text-sm">Personal mentoring</p>
            </div>
          </div>
        </div>
      </section>

      {/* Syllabus Coverage */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {level} {currentSubject.name} Syllabus Coverage
              </h2>
              <div className="space-y-3">
                {currentSubject.syllabus.map((topic: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{topic}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Learning Outcomes</h3>
              <div className="space-y-4">
                {currentSubject.outcomes.map((outcome: string, index: number) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-gray-700">{outcome}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Study Resources & Materials
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {resources.map((resource, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  {resource.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-gray-600 text-sm">{resource.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {currentSubject.name} Success Results
            </h2>
            <p className="text-lg text-blue-100">
              Our students consistently achieve excellent grades in {level} {currentSubject.name}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">96%</div>
              <div className="text-blue-100">Students achieve A*/A grades</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">100+</div>
              <div className="text-blue-100">Students taught annually</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">15+</div>
              <div className="text-blue-100">Years of expertise</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Excel in {level} {currentSubject.name}?
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Join our proven program and achieve the grades you need for your future success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/demoform"
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Book Your Free Demo
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Get Study Plan
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SubjectPage;