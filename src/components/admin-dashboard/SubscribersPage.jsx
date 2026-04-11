import React, { useState, useEffect } from 'react';
import { Users, Clock, AlertCircle, ChevronLeft } from 'lucide-react';

const Card = ({ className = '', children }) => (
  <div className={`bg-white rounded-xl shadow border border-gray-200 ${className}`}>{children}</div>
);

const Badge = ({ variant = 'default', children }) => {
  const colors = { success: 'bg-green-100 text-green-800', error: 'bg-red-100 text-red-800', default: 'bg-gray-100 text-gray-700' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[variant] || colors.default}`}>
      {children}
    </span>
  );
};

const Spinner = ({ size = 'md' }) => (
  <svg className={`animate-spin ${size === 'lg' ? 'w-10 h-10' : 'w-5 h-5'} text-blue-700 inline`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
);
import { adminApi } from '../../api/blogApi';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export const SubscribersPage = ({ onBack }) => {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [pagination, setPagination] = useState({ page: 0, totalPages: 0, totalElements: 0 });
    const [pageSize, setPageSize] = useState(20);

    const fetchSubscribers = async (params = {}) => {
        setLoading(true);
        try {
            const currentSize = params.size !== undefined ? params.size : pageSize;
            const r = await adminApi.getSubscribers({
                status: params.status !== undefined ? params.status : statusFilter,
                page: params.page || 0,
                size: currentSize,
            });
            setSubscribers(r.data.content || []);
            setPagination({ page: r.data.page || 0, totalPages: r.data.totalPages || 0, totalElements: r.data.totalElements || 0 });
        } catch (err) {
            console.error('Failed to load subscribers', err);
            toast.error('Failed to load subscribers');
            setSubscribers([]);
        }
        finally { setLoading(false); }
    };

    useEffect(() => {
        fetchSubscribers();
    }, [statusFilter, pageSize]);

    const handleStatusFilter = (s) => {
        setStatusFilter(s);
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-10">
            {onBack && (
                <button onClick={onBack}
                    className="flex items-center gap-2 text-sm font-semibold mb-4 hover:opacity-75 transition text-blue-900">
                    <ChevronLeft className="w-4 h-4" /> Back to Blog Dashboard
                </button>
            )}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-3 text-blue-900">
                        <Users className="w-8 h-8" />
                        Subscribers
                    </h1>
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
                <div className="col-span-5">Email</div>
                <div className="col-span-3">Status</div>
                <div className="col-span-4">Subscription Date</div>
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
                            <div className="col-span-1 md:col-span-5 flex items-center gap-3">
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
                            <div className="col-span-1 md:col-span-4 flex items-center gap-2 text-xs text-gray-600">
                                <Clock className="w-4 h-4 shrink-0" />
                                {(() => {
                                    const d = sub.createdAt || sub.subscribedAt;
                                    if (!d) return 'N/A';
                                    const date = new Date(d);
                                    return isNaN(date.getTime()) ? 'N/A' : format(date, 'MMM dd, yyyy HH:mm');
                                })()}
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
    );
};

