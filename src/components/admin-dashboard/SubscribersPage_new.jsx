import React, { useState, useEffect } from 'react';
import { Users, Clock, AlertCircle } from 'lucide-react';
const Card = ({ className = '', children }) => (
  <div className={`bg-white rounded-xl shadow border border-gray-200 ${className}`}>{children}</div>
);
const Badge = ({ variant = 'default', children }) => {
  const colors = { success: 'bg-green-100 text-green-800', error: 'bg-red-100 text-red-800', default: 'bg-gray-100 text-gray-700' };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[variant] || colors.default}`}>{children}</span>;
};
const Spinner = ({ size = 'md' }) => (
  <svg className={`animate-spin ${size === 'lg' ? 'w-10 h-10' : 'w-5 h-5'} text-blue-700 inline`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
);
import { blogApi, adminApi } from '../../api/blogApi';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

// Safe date formatter - handles invalid dates gracefully
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'N/A';
        return format(date, 'MMM dd, yyyy HH:mm');
    } catch (err) {
        return 'N/A';
    }
};
export const SubscribersPage = ({ setCurrentView }) => {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isInitial, setIsInitial] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [pagination, setPagination] = useState({ page: 0, totalPages: 0, totalElements: 0 });
    const [pageSize, setPageSize] = useState(20);

    const fetchSubscribers = async (params = {}, showLoader = true) => {
        try {
            if (showLoader) setLoading(true);
            const currentSize = params.size !== undefined ? params.size : pageSize;
            
            // Add 6 second timeout
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout')), 6000)
            );
            
            const response = await Promise.race([
                adminApi.getSubscribers({
                    status: params.status !== undefined ? params.status : statusFilter,
                    page: params.page || 0,
                    size: currentSize,
                }),
                timeoutPromise
            ]);
            
            setSubscribers(response.data?.content || []);
            setPagination({
                page: response.data?.page || 0,
                totalPages: response.data?.totalPages || 0,
                totalElements: response.data?.totalElements || 0
            });
            setIsInitial(false);
        } catch (err) {
            if (isInitial) toast.error('Failed to load subscribers');
            if (!subscribers.length) setSubscribers([]);
        } finally {
            if (showLoader) setLoading(false);
        }
    };

    useEffect(() => {
        // Load in background without blocking UI
        const timer = setTimeout(() => fetchSubscribers({}, !isInitial), 100);
        return () => clearTimeout(timer);
    }, [statusFilter, pageSize]);

    const handleStatusFilter = (s) => {
        setStatusFilter(s);
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#ffffff' }}>
            {/* Header with Back Button */}
            <div className="bg-white shadow-sm p-4 flex items-center gap-4 sticky top-18 z-40">
                <button
                    onClick={() => {
                        if (setCurrentView) {
                            setCurrentView('blogs');
                        } else {
                            window.history.back();
                        }
                    }}
                    className="p-2 rounded-lg transition hover:bg-gray-100"
                    title="Go Back to Blog Dashboard"
                >
                    <svg className="w-6 h-6 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-2xl font-bold flex items-center gap-3 text-blue-900">
                    <Users className="w-6 h-6" />
                    Manage Subscribers
                </h1>
            </div>
            <div className="max-w-6xl mx-auto px-6 py-10">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <p className="text-gray-600">Manage newsletter subscribers and their status</p>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-bold text-blue-900">{pagination.totalElements}</p>
                    <p className="text-sm text-gray-600">Total subscribers</p>
                </div>
            </div>
            {/* Status Filter */}
            <div className="flex gap-2 mb-6">
                {[
                    { value: '', label: 'All' },
                    { value: 'ACTIVE', label: 'Active' },
                    { value: 'UNSUBSCRIBED', label: 'Unsubscribed' },
                ].map((f) => (
                    <button
                        key={f.value}
                        onClick={() => handleStatusFilter(f.value)}
                        className={`px-4 py-2 rounded-lg transition ${statusFilter === f.value ? 'text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        style={statusFilter === f.value ? { backgroundColor: '#1e3a8a' } : {}}
                    >
                        {f.label}
                    </button>
                ))}
            </div>
            {/* Desktop Header */}
            <div className="hidden md:grid grid-cols-12 gap-3 mb-3 px-4 py-3 border-b border-gray-300 font-semibold text-sm text-gray-700">
                <div className="col-span-6">Email</div>
                <div className="col-span-3">Status</div>
                <div className="col-span-3">Subscription Date</div>
            </div>

            {/* Subscribers List */}
            {loading ? (
                <div className="py-20 text-center"><Spinner size="lg" /></div>
            ) : subscribers.length === 0 ? (
                <Card className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No subscribers found</p>
                </Card>
            ) : (
                <div className="space-y-3">
                    {subscribers.map((sub) => (
                        <Card key={sub.id} className="p-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                            {/* Email */}
                            <div className="col-span-1 md:col-span-6 flex items-center gap-3">
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0 bg-blue-900"
                                >
                                    {(sub.email || 'S').charAt(0).toUpperCase()}
                                </div>
                                <p className="text-sm truncate text-blue-900">{sub.email}</p>
                            </div>

                            {/* Status */}
                            <div className="col-span-1 md:col-span-3">
                                <Badge variant={sub.status === 'ACTIVE' ? 'success' : 'error'}>
                                    {sub.status}
                                </Badge>
                            </div>

                            {/* Subscription Date */}
                            <div className="col-span-1 md:col-span-3 flex items-center gap-2 text-xs text-gray-600">
                                <Clock className="w-4 h-4 shrink-0" />
                                {formatDate(sub.subscribedAt || sub.createdAt || sub.date)}
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="mt-8 flex items-center justify-between">
                    <button
                        onClick={() => fetchSubscribers({ page: pagination.page - 1 })}
                        disabled={pagination.page === 0}
                        className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-600">
                        Page {pagination.page + 1} of {pagination.totalPages}
                    </span>
                    <button
                        onClick={() => fetchSubscribers({ page: pagination.page + 1 })}
                        disabled={pagination.page >= pagination.totalPages - 1}
                        className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
        </div>
    );
};
