import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, Calendar } from 'lucide-react';
import { FaWhatsapp, FaLinkedin, FaYoutube, FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { getContactSubjects, submitContactForm, getContactSettingsPublic } from '../api/api/contactApi';
import toast from 'react-hot-toast';
import CenteredModal from '../components/CenteredModal';

interface ContactSubject {
  id: string;
  name: string;
  displayName?: string;
}

interface ContactSettings {
  phoneNumber: string;
  whatsappNumber: string;
  emailAddress: string;
  officeAddress: string;
  officeHours: string;
  googleMapsUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
}

const Contact = () => {
  const [searchParams] = useSearchParams();
  const isDirect = searchParams.get('mode') === 'direct';
  const [formData, setFormData] = useState({
    fullName: '',
    emailAddress: '',
    phoneNumber: '',
    subjectId: searchParams.get('subject') || '',
    messageText: ''
  });

  const [subjects, setSubjects] = useState<ContactSubject[]>([]);
  const [settings, setSettings] = useState<ContactSettings | null>(null);
  const [loadingSubjects, setLoadingSubjects] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const fallbackSubjects: ContactSubject[] = [
        { id: "69f59c3b7fba777198d8f385", name: "Course Inquiry" },
        { id: "69f59c3b7fba777198d8f386", name: "Fees & Payments" },
        { id: "69f59c3b7fba777198d8f387", name: "Technical Support" },
        { id: "69f59c3b7fba777198d8f388", name: "Partnership" },
        { id: "69f59c3b7fba777198d8f389", name: "Other" }
      ];

      try {
        const [subjectsData, settingsData] = await Promise.all([
          getContactSubjects(),
          getContactSettingsPublic()
        ]);

        // Handle data nesting if API returns { data: [...] }
        const finalSubjects = Array.isArray(subjectsData)
          ? subjectsData
          : (subjectsData?.data || fallbackSubjects);

        setSubjects(finalSubjects);
        setSettings(settingsData);
      } catch (error) {
        console.error('Failed to load contact data:', error);
        setSubjects(fallbackSubjects);
      } finally {
        setLoadingSubjects(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const subject = searchParams.get('subject');
    if (subject) {
      setFormData(prev => ({ ...prev, subjectId: subject }));
      // Direct scroll to form if subject is provided
      setTimeout(() => {
        const formElement = document.getElementById('contact-form');
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [searchParams]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Strict phone validation: must be exactly 10 digits
      if (formData.phoneNumber) {
        if (formData.phoneNumber.length < 10) {
          toast.error('Mobile number is too short. It must be exactly 10 digits.');
          setIsSubmitting(false);
          return;
        }
        if (formData.phoneNumber.length > 10) {
          toast.error('Mobile number is too long. It must be exactly 10 digits.');
          setIsSubmitting(false);
          return;
        }
        if (!/^\d{10}$/.test(formData.phoneNumber)) {
          toast.error('Please enter a valid 10-digit mobile number (digits only).');
          setIsSubmitting(false);
          return;
        }
      }

      await submitContactForm(formData);

      setSubmitted(true);
      toast.success('✅ Message sent successfully! We will contact you soon.');
    } catch (error: any) {
      console.error('Form submission error:', error);
      const errorMsg = error.message || 'Failed to send message. Please try again.';
      toast.error(`❌ ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6 text-blue-600" />,
      title: "Phone Number",
      details: [settings?.phoneNumber || "+91-886 191 9000"],
      action: `tel:${(settings?.phoneNumber || "+918861919000").replace(/[\s-]/g, '')}`
    },
    {
      icon: <FaWhatsapp className="h-6 w-6 text-green-600" />,
      title: "WhatsApp Number",
      details: [settings?.whatsappNumber || "+91-807 398 2848"],
      action: `https://wa.me/${(settings?.whatsappNumber || "918073982848").replace(/\D/g, '')}`
    },
    {
      icon: <Mail className="h-6 w-6 text-blue-600" />,
      title: "Email Address",
      details: [settings?.emailAddress || "info@astarclasses.com"],
      action: `mailto:${settings?.emailAddress || "info@astarclasses.com"}`
    },
    {
      icon: <MapPin className="h-6 w-6 text-blue-600" />,
      title: "Address",
      details: settings?.officeAddress ? [settings.officeAddress] : [
        "DronaVyas Ixpoe Private Limited",
        "A Star Classes",
        "No. 81, Ground Floor, Share Space",
        "Borewell Road, Nallurahalli, Whitefield",
        "Bangalore - 560066, Karnataka",
        "GST Number: 29AAECD7872Q1ZO"
      ],
      action: settings?.googleMapsUrl || null
    },
    {
      icon: <Clock className="h-6 w-6 text-blue-600" />,
      title: "Office Hours",
      details: settings?.officeHours ? [settings.officeHours] : [
        "Monday - Friday: 10:00 AM - 6:00 PM",
        "Saturday-Sunday: Closed"
      ],
      action: null
    }
  ];

  const quickActions = [
    {
      icon: <Calendar className="h-8 w-8 text-white" />,
      title: "Schedule Demo",
      description: "Book a free demo class",
      action: "/demoform",
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-white" />,
      title: "WhatsApp",
      description: "Chat with us instantly",
      action: "https://wa.me/918073982848",
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      icon: <Phone className="h-8 w-8 text-white" />,
      title: "Call Now",
      description: "Speak to an advisor",
      action: "tel:+918861919000",
      color: "bg-orange-600 hover:bg-orange-700"
    }
  ];



  return (
    <div className="min-h-screen bg-gray-50">
      <CenteredModal open={submitted} onClose={() => setSubmitted(false)} title={"Message Sent Successfully!"}>
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Send className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Message Sent Successfully!</h2>
        <p className="text-gray-600 mb-6 text-center">
          Thank you for contacting A Star Classes. We'll get back to you within 24 hours.
        </p>
        <div className="text-center">
          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({ fullName: '', emailAddress: '', phoneNumber: '', subjectId: '', messageText: '' });
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Send Another Message
          </button>
        </div>
      </CenteredModal>
      {/* Hero Section (hidden to match provided design) */}
      {/*
      {!isDirect && (
        <section className="bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Get in Touch
                <span className="block text-yellow-400">We're Here to Help</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                Have questions about our courses, admissions, or need academic guidance?
                Our expert team is ready to assist you on your educational journey.
              </p>
            </div>
          </div>
        </section>
      )}
      */}

      {/* Quick Actions */}
      {!isDirect && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Quick Ways to Reach Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {quickActions.map((action, index) => (
                <a
                  key={index}
                  href={action.action}
                  className={`${action.color} text-white rounded-2xl p-8 text-center transition-all duration-300 transform hover:scale-105 hover:shadow-xl`}
                >
                  <div className="flex justify-center mb-4">
                    {action.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{action.title}</h3>
                  <p className="text-gray-100">{action.description}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Form & Info */}
      <section className={`py-20 bg-gray-50 ${isDirect ? 'pt-10' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid grid-cols-1 ${isDirect ? '' : 'lg:grid-cols-2'} gap-12`}>
            {/* Contact Form */}
            <div id="contact-form" className={`bg-white rounded-2xl shadow-xl p-8 scroll-mt-24 ${isDirect ? 'max-w-2xl mx-auto' : ''}`}>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        if (val.length <= 10) {
                          setFormData(prev => ({ ...prev, phoneNumber: val }));
                        }
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="9876543210"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    name="subjectId"
                    value={formData.subjectId}
                    onChange={handleInputChange}
                    required
                    disabled={loadingSubjects}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100"
                  >
                    <option value="">
                      {loadingSubjects ? 'Loading subjects...' : 'Select a subject'}
                    </option>
                    {Array.isArray(subjects) && subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name || sub.displayName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="messageText"
                    value={formData.messageText}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Please describe your inquiry or question..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Information</h2>
                <p className="text-gray-600 mb-8">
                  We're always here to help. Reach out to us through any of the following methods.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {info.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
                        <div className="space-y-1">
                          {info.details.map((detail, detailIndex) => (
                            <p key={detailIndex} className="text-gray-600">
                              {info.action && detailIndex === 0 ? (
                                <a
                                  href={info.action}
                                  className="text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                  {detail}
                                </a>
                              ) : (
                                detail
                              )}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map Placeholder */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Find Us</h3>
                <div className="bg-gray-100 rounded-lg h-64 overflow-hidden">
                  <iframe
                    src={settings?.googleMapsUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.4086849004847!2d77.7233037!3d12.9732394!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae182ca143b6cb%3A0xe0e4c8f6c2af4a6e!2sWhitefield%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000"}
                    width="100%"
                    height="100%"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full border-0"
                    title="A Star Classes Location"
                  ></iframe>
                </div>
                <div className="mt-4 text-gray-600 text-sm">
                  <p>A Star Classes</p>
                  <p>DronaVyas Ixpoe Private Limited</p>
                  <p>No. 81, Ground Floor, Share Space</p>
                  <p>Borewell Road, Nallurahalli, Whitefield</p>
                  <p>Bangalore - 560066</p>
                  <p>Karnataka, India</p>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect With Us</h3>
                <p className="text-gray-600 mb-4">Follow us for updates, resources, and new course announcements.</p>
                <div className="flex items-center gap-4">
                  <a href="https://www.linkedin.com/company/astarclasses" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 text-2xl">
                    <FaLinkedin />
                  </a>
                  <a href="https://www.youtube.com/@AStarClass" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 text-2xl">
                    <FaYoutube />
                  </a>
                  <a href="https://www.instagram.com/classesastar/" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-700 text-2xl">
                    <FaInstagram />
                  </a>
                  <a href="https://x.com/AStarClasses" target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:text-sky-700 text-2xl">
                    <FaXTwitter />
                  </a>
                  <a href="https://www.facebook.com/astarclasses" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-2xl">
                    <FaFacebook />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How quickly can I expect a response?
              </h3>
              <p className="text-gray-600">
                We typically respond to all inquiries within 24 hours during business days.
                For urgent matters, please call us directly or use WhatsApp.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I schedule a consultation outside office hours?
              </h3>
              <p className="text-gray-600">
                Yes! We offer flexible scheduling including evenings and weekends.
                Please mention your preferred time in your message and we'll accommodate.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you offer free consultations?
              </h3>
              <p className="text-gray-600">
                Absolutely! We provide free educational consultations and demo classes
                to help you understand our teaching methodology and course structure.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;