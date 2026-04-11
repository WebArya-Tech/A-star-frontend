import React, { useState, useEffect } from 'react';
import { Send, Check } from 'lucide-react';
import { demoApi } from '../api/demoApi';
import toast from 'react-hot-toast';

interface FormData {
  studentName: string;
  parentName: string;
  grade: string;
  board: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
}

interface Grade {
  id: string;
  name: string;
  displayName: string;
}

interface Board {
  id: string;
  name: string;
  displayName: string;
}

const DemoForm = () => {
  const [formData, setFormData] = useState<FormData>({
    studentName: '',
    parentName: '',
    grade: '',
    board: '',
    email: '',
    preferredDate: '',
    preferredTime: ''
  });

  const [grades, setGrades] = useState<Grade[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingGrades, setLoadingGrades] = useState(true);
  const [loadingBoards, setLoadingBoards] = useState(true);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  // Load grades and boards on component mount
  useEffect(() => {
    const loadSettings = async () => {
      const fallbackGrades: Grade[] = [
        { id: "69d92d53ea90e2196bf61733", name: "Grade 9", displayName: "Grade 9" },
        { id: "69d92d59ea90e2196bf61734", name: "Grade 10", displayName: "Grade 10" },
        { id: "69d92d63ea90e2196bf61735", name: "Grade 11", displayName: "Grade 11" },
        { id: "69d92d68ea90e2196bf61736", name: "Grade 12", displayName: "Grade 12" }
      ];
      const fallbackBoards: Board[] = [
        { id: "69d92d9fea90e2196bf61737", name: "AS level and A levels", displayName: "AS level and A levels" },
        { id: "69d92dadea90e2196bf61738", name: "IGCSE", displayName: "IGCSE" }
      ];

      try {
        const [gradesResult, boardsResult] = await Promise.allSettled([
          demoApi.getGrades(),
          demoApi.getBoards()
        ]);

        const gradesData = gradesResult.status === 'fulfilled' && Array.isArray(gradesResult.value)
          ? gradesResult.value.map((g: any) => ({ ...g, displayName: g.displayName || g.name }))
          : fallbackGrades;

        const boardsData = boardsResult.status === 'fulfilled' && Array.isArray(boardsResult.value)
          ? boardsResult.value
              .filter((board: any) => ['IGCSE', 'AS level and A levels'].includes(board.displayName || board.name))
              .map((b: any) => ({ ...b, displayName: b.displayName || b.name }))
          : fallbackBoards;

        setGrades(gradesData);
        setBoards(boardsData);

        if (gradesResult.status === 'rejected' || boardsResult.status === 'rejected') {
          console.warn('Demo form settings loaded with fallback data:', {
            gradesError: gradesResult.status === 'rejected' ? gradesResult.reason : null,
            boardsError: boardsResult.status === 'rejected' ? boardsResult.reason : null
          });
        }
      } catch (error) {
        console.error('Failed to load demo settings:', error);
        setGrades(fallbackGrades);
        setBoards(fallbackBoards);
        toast.error('Failed to load form options. Using local defaults.');
      } finally {
        setLoadingGrades(false);
        setLoadingBoards(false);
      }
    };

    loadSettings();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      toast.error('Please enter your email address to receive OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await demoApi.sendDemoOtp(formData.email);
      console.log('OTP Response:', response);
      
      // Request succeeded, show OTP field
      setOtpStep(true);
      const successMsg = typeof response === 'string' ? response : (response && typeof response === 'object' && 'message' in response ? String(response.message) : 'OTP sent successfully');
      toast.success(successMsg);

      // Start timer
      const timer = setInterval(() => {
        setOtpTimer(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error('OTP send error:', error);
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length === 6) {
      setLoading(true);
      try {
        const response = await demoApi.verifyDemoOtp(formData.email, otp);
        if (response.success) {
          toast.success('OTP verified successfully!');
          setIsOtpVerified(true);
        } else {
          toast.error(response.message || 'Invalid OTP. Please try again.');
        }
      } catch (error) {
        console.error('OTP verification error:', error);
        toast.error('Failed to verify OTP. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      toast.error('Please enter a valid 6-digit OTP');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otpStep) {
      toast.error('Please verify your email first');
      return;
    }

    setLoading(true);

    try {
      const demoRequest = {
        studentName: formData.studentName,
        parentName: formData.parentName,
        gradeId: String(formData.grade), // Send ID as String
        boardId: String(formData.board), // Send ID as String
        emailId: formData.email, // Map to emailId
        mobileNumber: formData.phone || "9876543210", // Backend requires mobileNumber
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        otp: otp,
        scheduledAt: `${formData.preferredDate}T${formData.preferredTime}:00`
      };

      console.log('Final Demo Request Payload:', demoRequest);

      const response = await demoApi.scheduleDemo(demoRequest);

      // If we reach here, it's likely a success since makeApiCall handles error status
      setIsSubmitted(true);
      toast.success('Demo scheduled successfully!');
    } catch (error) {
      console.error('Demo scheduling error:', error);
      toast.error('Failed to schedule demo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-md ms-5 mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
        <p className="text-gray-600 mb-4">
          We've received your request for a free demo. We'll confirm your session shortly and send you the meeting details.
        </p>
        <p className="text-sm text-gray-500">
          You'll receive a confirmation email and WhatsApp message with next steps.
        </p>
      </div>
    );
  }

  return (
    <div className="demo-form max-w-md mt-10 mx-auto bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Schedule Your Free Demo</h3>
        <p className="text-gray-600">Experience our teaching methodology with a personalized demo class</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Student Name *
          </label>
          <input
            type="text"
            name="studentName"
            value={formData.studentName}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Enter student's full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Parent Name *
          </label>
          <input
            type="text"
            name="parentName"
            value={formData.parentName}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Enter parent's full name"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grade *
            </label>
            <select
              name="grade"
              value={formData.grade}
              onChange={handleInputChange}
              required
              disabled={loadingGrades}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100"
            >
              <option value="">
                {loadingGrades ? 'Loading grades...' : 'Select Grade'}
              </option>
              {grades.map((grade) => (
                <option key={grade.id} value={grade.id}>
                  {grade.displayName || grade.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Board *
            </label>
            <select
              name="board"
              value={formData.board}
              onChange={handleInputChange}
              required
              disabled={loadingBoards}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100"
            >
              <option value="">
                {loadingBoards ? 'Loading boards...' : 'Select Board'}
              </option>
              {boards.map((board) => (
                <option key={board.id} value={board.id}>
                  {board.displayName || board.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email ID * {isOtpVerified && <span className="text-green-600 text-xs">(Verified)</span>}
          </label>
          <div className="flex space-x-2">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={otpStep || isOtpVerified}
              className={`flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${(otpStep || isOtpVerified) ? 'bg-gray-100' : ''}`}
              placeholder="student@email.com"
            />
            {!otpStep && !isOtpVerified && (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            )}
          </div>
        </div>

        {otpStep && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-inner">
              <label className="block text-sm font-medium text-blue-800 mb-2">
                Enter 6-Digit OTP sent to your email *
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  if (val.length <= 6) setOtp(val);
                }}
                maxLength={6}
                className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-center text-xl tracking-widest font-bold"
                placeholder="000000"
              />
              <div className="flex justify-between items-center mt-3">
                <p className="text-xs text-blue-600">
                  Resend available in <span className="font-bold">{otpTimer}s</span>
                </p>
                <button 
                  type="button"
                  onClick={() => setOtpStep(false)}
                  className="text-xs text-gray-500 underline"
                >
                  Change Email
                </button>
              </div>
            </div>

            <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Time *
                  </label>
                  <input
                    type="time"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="consent"
                  required
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="consent" className="text-sm text-gray-600">
                  I agree to be contacted via phone, WhatsApp, and email for demo scheduling and course information.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Schedule Free Demo</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>

      <div className="mt-6 text-center">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>100% secure & spam-free</span>
        </div>
      </div>
    </div>
  );
};

export default DemoForm;