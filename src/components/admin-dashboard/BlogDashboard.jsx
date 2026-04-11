import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, Users, Eye, UserCheck, MessageSquare } from 'lucide-react';
import { adminApi } from '../../api/blogApi';

export default function BlogDashboard({ setCurrentView }) {
    const [stats, setStats] = useState({ total: 0, pending: 0, published: 0, subscribers: 0, pendingComments: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [blogsRes, subsRes, commentsRes] = await Promise.allSettled([
                    adminApi.getAdminBlogs({ page: 0, size: 1 }),
                    adminApi.getSubscribers({ page: 0, size: 1 }),
                    adminApi.getPendingComments({ page: 0, size: 1 }),
                ]);

                const blogsData = blogsRes.status === 'fulfilled' ? blogsRes.value.data : null;
                const subsData = subsRes.status === 'fulfilled' ? subsRes.value.data : null;
                const commentsData = commentsRes.status === 'fulfilled' ? commentsRes.value.data : null;

                // Fetch pending & published counts separately
                const [pendingRes, publishedRes] = await Promise.allSettled([
                    adminApi.getAdminBlogs({ status: 'PENDING', page: 0, size: 1 }),
                    adminApi.getAdminBlogs({ status: 'PUBLISHED', page: 0, size: 1 }),
                ]);

                setStats({
                    total: blogsData?.totalElements ?? 0,
                    pending: pendingRes.status === 'fulfilled' ? (pendingRes.value.data?.totalElements ?? 0) : 0,
                    published: publishedRes.status === 'fulfilled' ? (publishedRes.value.data?.totalElements ?? 0) : 0,
                    subscribers: subsData?.totalElements ?? 0,
                    pendingComments: commentsData?.totalElements ?? 0,
                });
            } catch (err) {
                console.error('Failed to load blog stats', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { label: 'Total Blogs',    value: stats.total,       icon: FileText,    color: '#1e3a8a', bg: '#eff6ff' },
        { label: 'Pending Review', value: stats.pending,     icon: Clock,       color: '#f59e0b', bg: '#fff8e1' },
        { label: 'Published',      value: stats.published,   icon: CheckCircle, color: '#16a34a', bg: '#dcfce7' },
        { label: 'Subscribers',    value: stats.subscribers,     icon: Users,          color: '#7c3aed', bg: '#f5f3ff' },
    ];

    return (
        <div className="w-full px-4 md:px-8 py-8">
            <h1 className="text-3xl font-bold mb-1 text-blue-900">Blog Dashboard</h1>
            <p className="text-gray-500 mb-8">Manage blog posts and newsletter subscribers</p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
                {statCards.map(s => {
                    const Icon = s.icon;
                    return (
                        <div key={s.label} className="bg-white rounded-xl shadow-md p-5 border-l-4"
                            style={{ borderLeftColor: s.color, backgroundColor: s.bg }}>
                            <div className="flex items-center gap-3 mb-2">
                                <Icon className="w-5 h-5" style={{ color: s.color }} />
                                <p className="text-xs font-semibold text-gray-500">{s.label}</p>
                            </div>
                            {loading ? (
                                <div className="h-8 w-12 bg-gray-200 rounded animate-pulse" />
                            ) : (
                                <p className="text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Navigation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Blog Moderation */}
                <button onClick={() => setCurrentView('blogs')}
                    className="bg-white rounded-xl shadow-md p-6 text-left hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-900 group">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl" style={{ backgroundColor: '#eff6ff' }}>
                            <Eye className="w-7 h-7 text-blue-900" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold mb-1 text-blue-900">Blog Moderation</h2>
                            <p className="text-gray-500 text-sm">Approve, reject, or edit submissions</p>
                        </div>
                    </div>
                </button>

                {/* Manage Subscribers */}
                <button onClick={() => setCurrentView('subscribers')}
                    className="bg-white rounded-xl shadow-md p-6 text-left hover:shadow-xl transition-all border-2 border-transparent hover:border-[#7c3aed] group">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl" style={{ backgroundColor: '#f5f3ff' }}>
                            <UserCheck className="w-7 h-7" style={{ color: '#7c3aed' }} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold mb-1" style={{ color: '#7c3aed' }}>Manage Subscribers</h2>
                            <p className="text-gray-500 text-sm">View and manage email subscribers</p>
                        </div>
                    </div>
                </button>

                {/* Comment Moderation */}
                <button onClick={() => setCurrentView('comment-management')}
                    className="bg-white rounded-xl shadow-md p-6 text-left hover:shadow-xl transition-all border-2 border-transparent hover:border-[#e11d48] group md:col-span-2">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl" style={{ backgroundColor: '#fff1f2' }}>
                            <MessageSquare className="w-7 h-7" style={{ color: '#e11d48' }} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold mb-1" style={{ color: '#e11d48' }}>Comment Moderation</h2>
                            <p className="text-gray-500 text-sm">Review, hide, or delete pending comments</p>
                            {stats.pendingComments > 0 && (
                                <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-600">
                                    {stats.pendingComments} pending
                                </span>
                            )}
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
}
