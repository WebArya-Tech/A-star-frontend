import React, { useState, useEffect } from 'react'; 
import { 
  MessageSquare, Search, Trash2, Mail, Phone, 
  User, Clock, CheckCircle, Eye, Plus, X, 
  BookOpen, ChevronLeft, ChevronRight 
} from 'lucide-react'; 
import { 
  getAdminMessages, 
  getAdminSubjects, 
  updateMessageStatusAdmin, 
  deleteMessageAdmin, 
  createSubjectAdmin, 
  deleteSubjectAdmin,
  getContactSettingsAdmin,
  updateContactSettingsAdmin 
} from '../../api/api/contactApi'; 
import toast from 'react-hot-toast'; 

const STATUS_CONFIG = { 
  UNREAD: { color: 'bg-red-100 text-red-800', label: 'Unread', icon: Mail }, 
  READ: { color: 'bg-blue-100 text-blue-800', label: 'Read', icon: Eye }, 
  RESOLVED: { color: 'bg-green-100 text-green-800', label: 'Resolved', icon: CheckCircle } 
}; 

export default function ContactRequests() { 
  const [activeTab, setActiveTab] = useState('messages'); 
  const [messages, setMessages] = useState([]); 
  const [subjects, setSubjects] = useState([]); 
  const [settings, setSettings] = useState({
    phoneNumber: '',
    whatsappNumber: '',
    emailAddress: '',
    officeAddress: '',
    officeHours: '',
    googleMapsUrl: '',
    facebookUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
    twitterUrl: ''
  });
  const [loading, setLoading] = useState(true); 
  const [savingSettings, setSavingSettings] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all'); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [pagination, setPagination] = useState({ 
    page: 0, 
    size: 10, 
    totalElements: 0, 
    totalPages: 0 
  }); 
  
  const [selectedMessage, setSelectedMessage] = useState(null); 
  const [showSubjectForm, setShowSubjectForm] = useState(false); 
  const [newSubject, setNewSubject] = useState(''); 

  useEffect(() => { 
    if (activeTab === 'messages') { 
      loadMessages(); 
    } else if (activeTab === 'subjects') { 
      loadSubjects(); 
    } else if (activeTab === 'settings') {
      loadSettings();
    }
  }, [activeTab, filterStatus, pagination.page]); 

  const loadMessages = async () => { 
    setLoading(true); 
    try { 
      const response = await getAdminMessages({ 
        status: filterStatus === 'all' ? undefined : filterStatus, 
        page: pagination.page, 
        size: pagination.size 
      }); 
      
      const content = response.content || response.data || [];
      setMessages(content); 
      setPagination(prev => ({ 
        ...prev, 
        totalElements: response.totalElements || response.totalItems || 0, 
        totalPages: response.totalPages || 0 
      })); 
    } catch (error) { 
      console.error('Failed to load messages:', error); 
      toast.error('Failed to load messages'); 
    } finally { 
      setLoading(false); 
    } 
  }; 

  const loadSubjects = async () => { 
    setLoading(true); 
    try { 
      const data = await getAdminSubjects(); 
      setSubjects(Array.isArray(data) ? data : (data.data || [])); 
    } catch (error) { 
      console.error('Failed to load subjects:', error); 
      toast.error('Failed to load subjects'); 
    } finally { 
      setLoading(false); 
    } 
  }; 

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await getContactSettingsAdmin();
      if (data) setSettings(data);
    } catch (error) {
      console.error('Failed to load settings:', error);
      toast.error('Failed to load contact settings');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await updateContactSettingsAdmin(settings);
      toast.success('✅ Contact settings updated successfully');
    } catch (error) {
      console.error('Failed to update settings:', error);
      toast.error('❌ Failed to update settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleStatusUpdate = async (id, status) => { 
    try { 
      await updateMessageStatusAdmin(id, status); 
      toast.success(`Message marked as ${status.toLowerCase()}`); 
      loadMessages(); 
      if (selectedMessage?.id === id) { 
        setSelectedMessage(prev => ({ ...prev, status })); 
      } 
    } catch (error) { 
      toast.error('Failed to update status'); 
    } 
  }; 

  const handleDeleteMessage = async (id) => { 
    if (!window.confirm('Are you sure you want to delete this message permanently?')) return; 
    try { 
      await deleteMessageAdmin(id); 
      toast.success('Message deleted'); 
      loadMessages(); 
      if (selectedMessage?.id === id) setSelectedMessage(null); 
    } catch (error) { 
      toast.error('Failed to delete message'); 
    } 
  }; 

  const handleCreateSubject = async (e) => { 
    e.preventDefault(); 
    if (!newSubject.trim()) return; 
    try { 
      await createSubjectAdmin({ name: newSubject }); 
      toast.success('Subject created'); 
      setNewSubject(''); 
      setShowSubjectForm(false); 
      loadSubjects(); 
    } catch (error) { 
      toast.error('Failed to create subject'); 
    } 
  }; 

  const handleDeleteSubject = async (id) => { 
    if (!window.confirm('Delete this subject?')) return; 
    try { 
      await deleteSubjectAdmin(id); 
      toast.success('Subject deleted'); 
      loadSubjects(); 
    } catch (error) { 
      toast.error('Failed to delete subject'); 
    } 
  }; 

  const formatDate = (dateString) => { 
    if (!dateString) return 'N/A'; 
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', month: 'short', day: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    }); 
  }; 

  return ( 
    <div className="space-y-6"> 
      <div className="bg-white border-b-2 border-blue-900 rounded-xl p-6"> 
        <h2 className="text-2xl font-bold text-blue-900">Contact Requests Management</h2> 
        <p className="text-gray-500 text-sm mt-1">Manage website inquiries and contact subjects</p> 
      </div> 

      <div className="flex border-b border-gray-200"> 
        <button 
          onClick={() => setActiveTab('messages')} 
          className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${ 
            activeTab === 'messages' ? 'border-blue-900 text-blue-900' : 'border-transparent text-gray-500 hover:text-blue-900' 
          }`} 
        > 
          Messages 
        </button> 
        <button 
          onClick={() => setActiveTab('subjects')} 
          className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${ 
            activeTab === 'subjects' ? 'border-blue-900 text-blue-900' : 'border-transparent text-gray-500 hover:text-blue-900' 
          }`} 
        > 
          Contact Subjects 
        </button> 
        <button 
          onClick={() => setActiveTab('settings')} 
          className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${ 
            activeTab === 'settings' ? 'border-blue-900 text-blue-900' : 'border-transparent text-gray-500 hover:text-blue-900' 
          }`} 
        > 
          Contact Settings 
        </button> 
      </div> 

      {activeTab === 'messages' ? ( 
        <div className="space-y-4"> 
          <div className="bg-white rounded-xl p-4 shadow-sm border flex flex-col md:flex-row gap-4 justify-between items-center"> 
            <div className="flex gap-4 w-full md:w-auto"> 
              <div className="relative flex-1 md:w-64"> 
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" /> 
                <input 
                  type="text" 
                  placeholder="Search messages..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="pl-10 pr-4 py-2 border rounded-lg w-full outline-none focus:ring-2 focus:ring-blue-900/20" 
                /> 
              </div> 
              <select 
                value={filterStatus} 
                onChange={(e) => { setFilterStatus(e.target.value); setPagination(prev => ({ ...prev, page: 0 })); }} 
                className="px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-900/20" 
              > 
                <option value="all">All Status</option> 
                <option value="UNREAD">Unread</option> 
                <option value="READ">Read</option> 
                <option value="RESOLVED">Resolved</option> 
              </select> 
            </div> 
            <div className="text-sm text-gray-500"> 
              Total: {pagination.totalElements} messages 
            </div> 
          </div> 

          <div className="bg-white rounded-xl shadow-sm border overflow-hidden"> 
            <table className="w-full text-left"> 
              <thead className="bg-gray-50 border-b"> 
                <tr> 
                  <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Sender</th> 
                  <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Subject & Date</th> 
                  <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Status</th> 
                  <th className="px-6 py-4 font-semibold text-gray-600 text-sm text-right">Actions</th> 
                </tr> 
              </thead> 
              <tbody className="divide-y"> 
                {loading ? ( 
                  <tr><td colSpan="4" className="p-10 text-center text-gray-500">Loading messages...</td></tr> 
                ) : messages.length === 0 ? ( 
                  <tr><td colSpan="4" className="p-10 text-center text-gray-500">No messages found.</td></tr> 
                ) : messages.map(msg => ( 
                  <tr key={msg.id} className="hover:bg-gray-50"> 
                    <td className="px-6 py-4"> 
                      <div className="font-medium text-gray-900">{msg.fullName}</div> 
                      <div className="text-xs text-gray-500">{msg.emailAddress}</div> 
                    </td> 
                    <td className="px-6 py-4"> 
                      <div className="text-sm text-gray-900 font-medium">{msg.subject?.name || 'General Inquiry'}</div> 
                      <div className="text-xs text-gray-500">{formatDate(msg.createdAt)}</div> 
                    </td> 
                    <td className="px-6 py-4"> 
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_CONFIG[msg.status]?.color}`}> 
                        {STATUS_CONFIG[msg.status]?.label} 
                      </span> 
                    </td> 
                    <td className="px-6 py-4 text-right space-x-2"> 
                      <button 
                        onClick={() => { setSelectedMessage(msg); if (msg.status === 'UNREAD') handleStatusUpdate(msg.id, 'READ'); }} 
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" 
                      > 
                        <Eye className="w-4 h-4" /> 
                      </button> 
                      <button 
                        onClick={() => handleDeleteMessage(msg.id)} 
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" 
                      > 
                        <Trash2 className="w-4 h-4" /> 
                      </button> 
                    </td> 
                  </tr> 
                ))} 
              </tbody> 
            </table> 

            {pagination.totalPages > 1 && ( 
              <div className="p-4 border-t flex items-center justify-between"> 
                <button 
                  disabled={pagination.page === 0} 
                  onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))} 
                  className="flex items-center gap-1 px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50" 
                > 
                  <ChevronLeft className="w-4 h-4" /> Prev 
                </button> 
                <span className="text-sm text-gray-600">Page {pagination.page + 1} of {pagination.totalPages}</span> 
                <button 
                  disabled={pagination.page >= pagination.totalPages - 1} 
                  onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))} 
                  className="flex items-center gap-1 px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50" 
                > 
                  Next <ChevronRight className="w-4 h-4" /> 
                </button> 
              </div> 
            )} 
          </div> 
        </div> 
      ) : activeTab === 'subjects' ? ( 
        <div className="space-y-4"> 
          <div className="flex justify-between items-center"> 
            <h3 className="font-bold text-lg text-blue-900">Manage Inquiry Subjects</h3> 
            <button 
              onClick={() => setShowSubjectForm(true)} 
              className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition shadow-sm" 
            > 
              <Plus className="w-4 h-4" /> Add Subject 
            </button> 
          </div> 

          {showSubjectForm && ( 
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 animate-in fade-in slide-in-from-top-2"> 
              <form onSubmit={handleCreateSubject} className="flex gap-3"> 
                <input 
                  type="text" 
                  placeholder="Subject Name (e.g. Technical Support)" 
                  value={newSubject} 
                  onChange={(e) => setNewSubject(e.target.value)} 
                  className="flex-1 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-900/20" 
                  autoFocus 
                /> 
                <button type="submit" className="bg-blue-900 text-white px-6 py-2 rounded-lg font-bold">Save</button> 
                <button type="button" onClick={() => { setShowSubjectForm(false); setNewSubject(''); }} className="px-4 py-2 text-gray-500">Cancel</button> 
              </form> 
            </div> 
          )} 

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> 
            {subjects.map(sub => ( 
              <div key={sub.id} className="bg-white p-4 rounded-xl border shadow-sm flex justify-between items-center hover:border-blue-900 transition group"> 
                <div className="font-medium text-gray-900">{sub.name}</div> 
                <button 
                  onClick={() => handleDeleteSubject(sub.id)} 
                  className="text-red-500 opacity-0 group-hover:opacity-100 transition p-2 hover:bg-red-50 rounded-lg" 
                > 
                  <Trash2 className="w-4 h-4" /> 
                </button> 
              </div> 
            ))} 
          </div> 
        </div> 
      ) : (
        <div className="bg-white rounded-xl shadow-md p-6 border">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Contact Information Settings</h3>
          <form onSubmit={handleUpdateSettings} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input
                  type="text"
                  value={settings.phoneNumber}
                  onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-900/20"
                  placeholder="+91-XXXXXXXXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">WhatsApp Number</label>
                <input
                  type="text"
                  value={settings.whatsappNumber}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-900/20"
                  placeholder="+91-XXXXXXXXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={settings.emailAddress}
                  onChange={(e) => setSettings({ ...settings, emailAddress: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-900/20"
                  placeholder="contact@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Office Hours</label>
                <input
                  type="text"
                  value={settings.officeHours}
                  onChange={(e) => setSettings({ ...settings, officeHours: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-900/20"
                  placeholder="Mon-Fri: 9AM - 6PM"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Office Address</label>
                <textarea
                  value={settings.officeAddress}
                  onChange={(e) => setSettings({ ...settings, officeAddress: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-900/20 h-24"
                  placeholder="Enter full office address..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Google Maps Embed URL</label>
                <input
                  type="text"
                  value={settings.googleMapsUrl}
                  onChange={(e) => setSettings({ ...settings, googleMapsUrl: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-900/20"
                  placeholder="https://www.google.com/maps/embed?..."
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-bold text-gray-800 mb-4">Social Media Links</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['facebook', 'instagram', 'linkedin', 'twitter'].map((social) => (
                  <div key={social}>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 capitalize">{social} URL</label>
                    <input
                      type="text"
                      value={settings[`${social}Url`]}
                      onChange={(e) => setSettings({ ...settings, [`${social}Url`]: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-900/20"
                      placeholder={`https://${social}.com/...`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={savingSettings}
                className="bg-blue-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-800 transition shadow-lg disabled:opacity-50"
              >
                {savingSettings ? 'Saving...' : 'Save All Settings'}
              </button>
            </div>
          </form>
        </div>
      ) } 

      {selectedMessage && ( 
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"> 
          <div className="absolute inset-0" onClick={() => setSelectedMessage(null)} /> 
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"> 
            <div className="p-6 border-b flex justify-between items-center bg-gray-50"> 
              <div className="flex items-center gap-3"> 
                <div className="p-2 bg-blue-100 rounded-lg text-blue-900"> 
                  <MessageSquare className="w-5 h-5" /> 
                </div> 
                <h3 className="font-bold text-lg">Message Details</h3> 
              </div> 
              <button onClick={() => setSelectedMessage(null)} className="p-2 hover:bg-gray-200 rounded-full transition"> 
                <X className="w-5 h-5" /> 
              </button> 
            </div> 
            
            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]"> 
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> 
                <div className="space-y-1"> 
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</p> 
                  <div className="flex items-center gap-2 font-medium"> 
                    <User className="w-4 h-4 text-blue-900" /> {selectedMessage.fullName} 
                  </div> 
                </div> 
                <div className="space-y-1"> 
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date Received</p> 
                  <div className="flex items-center gap-2 font-medium"> 
                    <Clock className="w-4 h-4 text-blue-900" /> {formatDate(selectedMessage.createdAt)} 
                  </div> 
                </div> 
                <div className="space-y-1"> 
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</p> 
                  <div className="flex items-center gap-2 font-medium"> 
                    <Mail className="w-4 h-4 text-blue-900" /> {selectedMessage.emailAddress} 
                  </div> 
                </div> 
                <div className="space-y-1"> 
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone Number</p> 
                  <div className="flex items-center gap-2 font-medium"> 
                    <Phone className="w-4 h-4 text-blue-900" /> {selectedMessage.phoneNumber} 
                  </div> 
                </div> 
              </div> 

              <div className="space-y-1"> 
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Subject</p> 
                <div className="flex items-center gap-2 font-medium p-3 bg-gray-50 rounded-lg"> 
                  <BookOpen className="w-4 h-4 text-blue-900" /> {selectedMessage.subject?.name || 'General Inquiry'} 
                </div> 
              </div> 

              <div className="space-y-1"> 
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Message Text</p> 
                <div className="p-4 bg-gray-50 rounded-xl text-gray-700 leading-relaxed whitespace-pre-wrap min-h-[100px] border"> 
                  {selectedMessage.messageText} 
                </div> 
              </div> 

              <div className="pt-4 border-t flex flex-wrap gap-3"> 
                {selectedMessage.status !== 'RESOLVED' && ( 
                  <button 
                    onClick={() => handleStatusUpdate(selectedMessage.id, 'RESOLVED')} 
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2" 
                  > 
                    <CheckCircle className="w-4 h-4" /> Mark as Resolved 
                  </button> 
                )} 
                {selectedMessage.status === 'RESOLVED' && ( 
                  <button 
                    onClick={() => handleStatusUpdate(selectedMessage.id, 'READ')} 
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2" 
                  > 
                    <Eye className="w-4 h-4" /> Re-open (Mark as Read) 
                  </button> 
                )} 
                <button 
                  onClick={() => handleDeleteMessage(selectedMessage.id)} 
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition flex items-center justify-center gap-2" 
                > 
                  <Trash2 className="w-4 h-4" /> Delete Permanently 
                </button> 
              </div> 
            </div> 
          </div> 
        </div> 
      )} 
    </div> 
  ); 
} 