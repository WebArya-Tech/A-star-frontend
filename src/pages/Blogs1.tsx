import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Clock, ArrowRight, BookOpen, TrendingUp } from 'lucide-react';

const Blogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'IGCSE', 'AS/A Level', 'Study Tips'];

  const blogPosts = [
    {
      id: 1,
      title: "IGCSE vs AS/A Level: Complete Guide to Understanding the Difference",
      excerpt: "Learn about the key differences between IGCSE and AS/A Level examinations, including curriculum structure, assessment methods, and university recognition.",
      category: "IGCSE",
      author: "Dr. Sarah Williams",
      date: "2024-01-15",
      readTime: "8 min read",
      image: "https://images.pexels.com/photos/5905516/pexels-photo-5905516.jpeg?auto=compress&cs=tinysrgb&w=600",
      slug: "igcse-vs-as-a-level-complete-guide",
      featured: true
    },
    {
      id: 2,
      title: "How to Plan Past Paper Practice Effectively for Maximum Results",
      excerpt: "Discover proven strategies for using past papers to improve your exam performance, including timing techniques and error analysis methods.",
      category: "Study Tips",
      author: "Prof. Michael Chen",
      date: "2024-01-12",
      readTime: "6 min read",
      image: "https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=600",
      slug: "effective-past-paper-practice-strategies",
      featured: false
    },
    // {
    //   id: 3,
    //   title: "SAT vs ACT: Which Test Should You Take in 2024?",
    //   excerpt: "Compare SAT and ACT examinations to determine which test aligns better with your strengths and university admission goals.",
    //   category: "SAT Prep",
    //   author: "Emily Johnson",
    //   date: "2024-01-10",
    //   readTime: "10 min read",
    //   image: "https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=600",
    //   slug: "sat-vs-act-which-test-to-choose",
    //   featured: true
    // },
    {
      id: 4,
      title: "Top 10 Common Mistakes in IGCSE Chemistry Calculations",
      excerpt: "Avoid these frequent errors that cost students valuable marks in IGCSE Chemistry exams, with detailed examples and solutions.",
      category: "IGCSE",
      author: "Dr. James Thompson",
      date: "2024-01-08",
      readTime: "7 min read",
      image: "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=600",
      slug: "common-igcse-chemistry-calculation-mistakes",
      featured: false
    },
    // {
    //   id: 5,
    //   title: "Writing a Compelling College Essay: Tips from Admissions Officers",
    //   excerpt: "Learn insider tips from university admissions officers on crafting essays that stand out and make a lasting impression.",
    //   category: "University Admissions",
    //   author: "Lisa Rodriguez",
    //   date: "2024-01-05",
    //   readTime: "12 min read",
    //   image: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=600",
    //   slug: "writing-compelling-college-essays",
    //   featured: true
    // },
    {
      id: 6,
      title: "AS Level Physics: Mastering Mechanics Problems Step by Step",
      excerpt: "Comprehensive guide to solving complex mechanics problems in AS Level Physics with worked examples and problem-solving strategies.",
      category: "AS/A Level",
      author: "Dr. Robert Kumar",
      date: "2024-01-03",
      readTime: "9 min read",
      image: "https://images.pexels.com/photos/3791664/pexels-photo-3791664.jpeg?auto=compress&cs=tinysrgb&w=600",
      slug: "as-level-physics-mechanics-problems",
      featured: false
    },
    {
      id: 7,
      title: "Time Management Strategies for A Level Students",
      excerpt: "Essential time management techniques to balance multiple A Level subjects, extracurriculars, and university applications effectively.",
      category: "Study Tips",
      author: "Amanda Foster",
      date: "2024-01-01",
      readTime: "5 min read",
      image: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600",
      slug: "time-management-strategies-a-level-students",
      featured: false
    },
    // {
    //   id: 8,
    //   title: "University Application Deadlines: Complete 2024 Calendar",
    //   excerpt: "Stay organized with this comprehensive calendar of application deadlines for universities in the UK, US, Canada, and Australia.",
    //   category: "University Admissions",
    //   author: "David Park",
    //   date: "2023-12-28",
    //   readTime: "4 min read",
    //   image: "https://images.pexels.com/photos/3585047/pexels-photo-3585047.jpeg?auto=compress&cs=tinysrgb&w=600",
    //   slug: "university-application-deadlines-2024",
    //   featured: false
    // }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Educational Insights & Tips
              <span className="block text-yellow-400">Expert Guidance for Success</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Discover valuable study strategies, exam tips, and educational insights from our expert faculty.
              Stay updated with the latest trends in international education.
            </p>

            {/* Search and Filter */}
            <div className="max-w-2xl mx-auto">
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category
                      ? 'bg-yellow-400 text-black'
                      : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      {selectedCategory === 'All' && searchTerm === '' && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center mb-12">
              <TrendingUp className="h-8 w-8 text-blue-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">Featured Articles</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post, index) => (
                <div key={post.id} className={`${index === 0 ? 'lg:col-span-2' : ''}`}>
                  <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full">
                    <div className="relative">
                      <img
                        src={post.image}
                        alt={post.title}
                        className={`w-full object-cover ${index === 0 ? 'h-64' : 'h-48'}`}
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className={`font-bold text-gray-900 mb-3 line-clamp-2 ${index === 0 ? 'text-2xl' : 'text-xl'
                        }`}>
                        <Link to={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                          {post.title}
                        </Link>
                      </h3>

                      <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(post.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {post.readTime}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">By {post.author}</span>
                        <Link
                          to={`/blog/${post.slug}`}
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
                        >
                          Read More
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Articles */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-12">
            <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">
              {selectedCategory === 'All' ? 'Latest Articles' : `${selectedCategory} Articles`}
            </h2>
          </div>

          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(selectedCategory === 'All' && searchTerm === '' ? regularPosts : filteredPosts).map((post) => (
                <article key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      <Link to={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                        {post.title}
                      </Link>
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(post.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {post.readTime}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">By {post.author}</span>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
                      >
                        Read More
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No articles found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Stay Updated with Educational Insights
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Subscribe to our newsletter and never miss important study tips, exam strategies, and educational updates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg font-semibold transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blogs;