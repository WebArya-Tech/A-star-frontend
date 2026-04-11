import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Share2, BookOpen, User, Tag } from 'lucide-react';

const BlogPost = () => {
  useParams<{ slug: string }>();

  // Mock blog post data - in a real app, this would be fetched based on slug
  const blogPost = {
    title: "IGCSE vs AS/A Level: Complete Guide to Understanding the Difference",
    content: `
      <h2>Introduction</h2>
      <p>Understanding the difference between IGCSE and AS/A Level examinations is crucial for students and parents planning their educational journey. Both are internationally recognized qualifications offered by Cambridge Assessment International Education, but they serve different purposes and target different age groups.</p>
      
      <h2>What is IGCSE?</h2>
      <p>The International General Certificate of Secondary Education (IGCSE) is designed for students aged 14-16 (typically grades 9 and 10). It provides a solid foundation for further study and is widely recognized by universities and employers worldwide.</p>
      
      <h3>Key Features of IGCSE:</h3>
      <ul>
        <li>Broad curriculum covering essential subjects</li>
        <li>Flexible subject combinations</li>
        <li>Focus on practical application of knowledge</li>
        <li>Preparation for advanced study at AS/A Level</li>
      </ul>
      
      <h2>What are AS/A Levels?</h2>
      <p>Advanced Subsidiary (AS) and Advanced (A) Levels are post-16 qualifications for students aged 16-19 (grades 11 and 12). These are more specialized and in-depth than IGCSE, focusing on fewer subjects in greater detail.</p>
      
      <h3>Key Features of AS/A Levels:</h3>
      <ul>
        <li>In-depth study of 3-4 subjects</li>
        <li>University-level thinking and analysis</li>
        <li>Direct pathway to university admission</li>
        <li>Internationally recognized for university entry</li>
      </ul>
      
      <h2>Assessment Methods</h2>
      <p>Both qualifications use different assessment methods:</p>
      
      <h3>IGCSE Assessment:</h3>
      <ul>
        <li>Written examinations</li>
        <li>Practical assessments (for sciences)</li>
        <li>Coursework components</li>
        <li>Oral assessments (for languages)</li>
      </ul>
      
      <h3>AS/A Level Assessment:</h3>
      <ul>
        <li>Linear assessment system</li>
        <li>Final examinations at the end of the course</li>
        <li>Extended projects and research</li>
        <li>Practical endorsements</li>
      </ul>
      
      // <h2>University Recognition</h2>
      // <p>Both qualifications are highly regarded by universities worldwide, but they serve different purposes in the admissions process.</p>
      
      // <h2>Which Path Should You Choose?</h2>
      // <p>The choice between these pathways depends on various factors including your academic goals, university aspirations, and personal circumstances. It's important to consult with educational counselors to make the best decision for your future.</p>
      
      // <h2>Conclusion</h2>
      // <p>Understanding these differences will help you make informed decisions about your educational journey. Both IGCSE and AS/A Levels offer excellent preparation for university study and future career success.</p>
    `,
    category: "IGCSE",
    author: "Dr. Sarah Williams",
    date: "2024-01-15",
    readTime: "8 min read",
    image: "https://images.pexels.com/photos/5905516/pexels-photo-5905516.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tags: ["IGCSE", "AS Level", "A Level", "Cambridge", "Education", "Comparison"],
    authorBio: "Dr. Sarah Williams is an experienced educator with over 15 years in international curriculum development. She holds a PhD in Educational Assessment and has worked with Cambridge Assessment International Education."
  };

  const relatedPosts = [
    {
      title: "How to Plan Past Paper Practice Effectively",
      slug: "effective-past-paper-practice-strategies",
      image: "https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Study Tips"
    },
    {
      title: "Top 10 Common Mistakes in IGCSE Chemistry",
      slug: "common-igcse-chemistry-calculation-mistakes",
      image: "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "IGCSE"
    },
    {
      title: "Time Management Strategies for A Level Students",
      slug: "time-management-strategies-a-level-students",
      image: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Study Tips"
    }
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blogPost.title,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Article URL copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20">
        <div className="absolute inset-0">
          <img
            src={blogPost.image}
            alt={blogPost.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="mb-4">
            <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
              {blogPost.category}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {blogPost.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-gray-200">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              {blogPost.author}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              {new Date(blogPost.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              {blogPost.readTime}
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900"
                dangerouslySetInnerHTML={{ __html: blogPost.content }}
              />

              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center mb-4">
                  <Tag className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-gray-700 font-medium">Tags:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {blogPost.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Author Bio */}
              <div className="mt-12 p-6 bg-gray-100 rounded-xl">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {blogPost.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">About {blogPost.author}</h4>
                    <p className="text-gray-600">{blogPost.authorBio}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                {/* Share Button */}
                <div className="mb-8">
                  <button
                    onClick={handleShare}
                    className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Article
                  </button>
                </div>

                {/* Table of Contents */}
                <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Table of Contents</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#introduction" className="text-blue-600 hover:text-blue-800">Introduction</a></li>
                    <li><a href="#what-is-igcse" className="text-blue-600 hover:text-blue-800">What is IGCSE?</a></li>
                    <li><a href="#what-are-as-a-levels" className="text-blue-600 hover:text-blue-800">What are AS/A Levels?</a></li>
                    <li><a href="#assessment-methods" className="text-blue-600 hover:text-blue-800">Assessment Methods</a></li>
                    <li><a href="#university-recognition" className="text-blue-600 hover:text-blue-800">University Recognition</a></li>
                    <li><a href="#which-path" className="text-blue-600 hover:text-blue-800">Which Path Should You Choose?</a></li>
                    <li><a href="#conclusion" className="text-blue-600 hover:text-blue-800">Conclusion</a></li>
                  </ul>
                </div>

                {/* CTA Box */}
                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <h4 className="text-lg font-bold text-gray-900 mb-3">Need Expert Guidance?</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Get personalized advice on choosing between IGCSE and AS/A Level pathways.
                  </p>
                  <Link
                    to="/#demo-form"
                    className="w-full block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Book Free Consultation
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-12">
            <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Related Articles</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((post, index) => (
              <article key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
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
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    <Link to={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                      {post.title}
                    </Link>
                  </h3>

                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
                  >
                    Read More
                    <ArrowLeft className="h-4 w-4 ml-1 rotate-180" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Stay Updated with More Educational Insights
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Subscribe to our newsletter for the latest study tips, exam strategies, and educational updates.
          </p>
          <Link
            to="/blog"
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
          >
            Explore More Articles
          </Link>
        </div>
      </section>
    </div>
  );
};

export default BlogPost;