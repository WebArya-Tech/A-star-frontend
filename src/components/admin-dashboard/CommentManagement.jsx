import React, { useState, useEffect, useCallback } from 'react';
import { blogApi, adminApi } from '../../api/blogApi';
import {
    MessageSquare, Trash2, Eye, ChevronLeft, ChevronRight,
    AlertTriangle, RefreshCw, Search, ArrowLeft, FileText, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const formatDate = (d) => {
    if (!d) return 'N/A';
    try {
        const date = new Date(d);
        return isNaN(date.getTime()) ? 'N/A' : format(date, 'MMM dd, yyyy HH:mm');
    } catch { return 'N/A'; }
};

const StatusBadge = ({ status }) => {
    const map = {
        PENDING: 'bg-yellow-100 text-yellow-800',
        VISIBLE: 'bg-green-100 text-green-800',
        HIDDEN: 'bg-gray-100 text-gray-500',
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[status] || map.PENDING}`}>
            {status || 'PENDING'}
        </span>
    );
};

const BlogStatusDot = ({ status }) => {
    const colors = { PUBLISHED: 'bg-green-400', PENDING: 'bg-yellow-400', REJECTED: 'bg-red-400', DRAFT: 'bg-gray-400' };
    return <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${colors[status] || 'bg-gray-300'}`} />;
};

export const CommentManagement = ({ onBack }) => {
    // ── Blog list state ──────────────────────────────────────────
    const [blogs, setBlogs] = useState([]);
    const [blogsLoading, setBlogsLoading] = useState(true);
    const [blogSearch, setBlogSearch] = useState('');
    const [blogPage, setBlogPage] = useState(0);
    const [blogPagination, setBlogPagination] = useState({ totalPages: 0, totalElements: 0 });
    const BLOG_PAGE_SIZE = 15;

    // ── Selected blog & its comments ────────────────────────────
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [commentPage, setCommentPage] = useState(0);
    const [commentPagination, setCommentPagination] = useState({ totalPages: 0, totalElements: 0 });
    const COMMENT_PAGE_SIZE = 20;

    // ── Action state ─────────────────────────────────────────────
    const [actionLoading, setActionLoading] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [viewComment, setViewComment] = useState(null);

    // ── Fetch all blogs ──────────────────────────────────────────
    const fetchBlogs = useCallback(async (page = 0) => {
        setBlogsLoading(true);
        try {
            const r = await adminApi.getAdminBlogs({ page, size: BLOG_PAGE_SIZE });
            setBlogs(r.data?.content || []);
            setBlogPage(r.data?.page ?? page);
            setBlogPagination({
                totalPages: r.data?.totalPages || 0,
                totalElements: r.data?.totalElements || 0,
            });
        } catch {
            toast.error('Failed to load blogs');
            setBlogs([]);
        } finally {
            setBlogsLoading(false);
        }
    }, []);

    useEffect(() => { fetchBlogs(0); }, [fetchBlogs]);

    // ── Fetch comments for a blog ────────────────────────────────
    const fetchComments = useCallback(async (blogId, page = 0) => {
        setCommentsLoading(true);
        try {
            const r = await blogApi.getComments(blogId, { page, size: COMMENT_PAGE_SIZE });
            setComments(r.data?.content || []);
            setCommentPage(r.data?.page ?? page);
            setCommentPagination({
                totalPages: r.data?.totalPages || 0,
                totalElements: r.data?.totalElements || 0,
            });
        } catch {
            toast.error('Failed to load comments');
            setComments([]);
        } finally {
            setCommentsLoading(false);
        }
    }, []);

    const openBlog = (blog) => {
        setSelectedBlog(blog);
        setComments([]);
        setCommentPage(0);
        fetchComments(blog.id, 0);
    };

    const closeBlog = () => {
        setSelectedBlog(null);
        setComments([]);
    };

    // ── Actions ──────────────────────────────────────────────────


    const handleDelete = async () => {
        if (!deleteConfirm) return;
        setActionLoading(deleteConfirm.id);
        try {
            await adminApi.deleteComment(deleteConfirm.id);
            toast.success('Comment deleted');
            setComments(prev => prev.filter(c => c.id !== deleteConfirm.id));
            setBlogs(prev => prev.map(b =>
                b.id === selectedBlog.id
                    ? { ...b, commentsCount: Math.max(0, (b.commentsCount || 1) - 1) }
                    : b
            ));
            setSelectedBlog(prev => ({ ...prev, commentsCount: Math.max(0, (prev.commentsCount || 1) - 1) }));
            setDeleteConfirm(null);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete');
        } finally {
            setActionLoading(null);
        }
    };

    // ── Filtered blogs: only those with comments, optionally by search ──
    const filteredBlogs = blogs.filter(b =>
        (b.commentsCount > 0) &&
        (
            !blogSearch.trim() ||
            b.title?.toLowerCase().includes(blogSearch.toLowerCase()) ||
            b.authorName?.toLowerCase().includes(blogSearch.toLowerCase())
        )
    );

    // ─────────────────────────────────────────────────────────────
    // RENDER: Comments panel (when a blog is selected)
    // ─────────────────────────────────────────────────────────────
    if (selectedBlog) {
        return (
            <div className="min-h-screen" style={{ backgroundColor: '#ffffff' }}>
                {/* Sticky header */}
                <div className="bg-white shadow-sm sticky top-18 z-40 px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3 min-w-0">
                        <button onClick={closeBlog}
                            className="p-2 rounded-lg hover:bg-gray-100 transition shrink-0" title="Back to all blogs">
                            <ArrowLeft className="w-5 h-5 text-blue-900" />
                        </button>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <MessageSquare className="w-5 h-5 shrink-0 text-blue-900" />
                                <h1 className="text-base font-bold truncate max-w-sm text-blue-900">
                                    {selectedBlog.title}
                                </h1>
                                <BlogStatusDot status={selectedBlog.status} />
                                <span className="text-xs text-gray-400">{selectedBlog.status}</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5">
                                {commentPagination.totalElements} comment{commentPagination.totalElements !== 1 ? 's' : ''} total
                                {selectedBlog.authorName && ` · By ${selectedBlog.authorName}`}
                            </p>
                        </div>
                    </div>
                    <button onClick={() => fetchComments(selectedBlog.id, commentPage)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-50 transition shrink-0 text-blue-900">
                        <RefreshCw className="w-4 h-4" /> Refresh
                    </button>
                </div>

                <div className="max-w-5xl mx-auto px-6 py-8">
                    {commentsLoading ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-20 text-center">
                            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2"
                                style={{ borderColor: '#1e3a8a', borderTopColor: '#eab308' }} />
                            <p className="mt-4 text-gray-500 text-sm">Loading comments...</p>
                        </div>
                    ) : comments.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-20 text-center">
                            <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">No comments on this blog</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {comments.map((c, idx) => (
                                <div key={c.id}
                                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col md:flex-row md:items-start gap-4">
                                    <div className="flex items-start gap-3 min-w-0 flex-1">
                                        <span className="text-xs text-gray-300 font-mono mt-1 shrink-0 w-5 text-right">
                                            {commentPage * COMMENT_PAGE_SIZE + idx + 1}
                                        </span>
                                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 bg-blue-900">
                                            {(c.name || 'A').charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                                <span className="text-sm font-semibold text-gray-800">{c.name || 'Anonymous'}</span>
                                                <StatusBadge status={c.status} />
                                                <span className="text-xs text-gray-400">{formatDate(c.createdAt)}</span>
                                            </div>
                                            <p className="text-sm text-gray-700 leading-relaxed">{c.commentText}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0 self-end md:self-start mt-1">
                                        <button onClick={() => setViewComment(c)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition">
                                            <Eye className="w-3.5 h-3.5" /> View
                                        </button>
                                        <button onClick={() => setDeleteConfirm(c)} disabled={actionLoading === c.id}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition disabled:opacity-50">
                                            <Trash2 className="w-3.5 h-3.5" /> Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Comment Pagination */}
                    {commentPagination.totalPages > 1 && (
                        <div className="mt-6 flex items-center justify-between">
                            <button
                                onClick={() => { const p = commentPage - 1; setCommentPage(p); fetchComments(selectedBlog.id, p); }}
                                disabled={commentPage === 0}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-50 transition disabled:opacity-40 text-blue-900">
                                <ChevronLeft className="w-4 h-4" /> Previous
                            </button>
                            <span className="text-sm text-gray-500">Page {commentPage + 1} of {commentPagination.totalPages}</span>
                            <button
                                onClick={() => { const p = commentPage + 1; setCommentPage(p); fetchComments(selectedBlog.id, p); }}
                                disabled={commentPage >= commentPagination.totalPages - 1}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-50 transition disabled:opacity-40 text-blue-900">
                                Next <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* View Comment Modal */}
                {viewComment && (
                    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
                        onClick={() => setViewComment(null)}>
                        <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full"
                            onClick={e => e.stopPropagation()}>
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0 bg-blue-900">
                                        {(viewComment.name || 'A').charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">{viewComment.name || 'Anonymous'}</p>
                                        <p className="text-xs text-gray-400">{formatDate(viewComment.createdAt)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <StatusBadge status={viewComment.status} />
                                    <button onClick={() => setViewComment(null)}
                                        className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-400">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-4 mb-5 whitespace-pre-wrap">
                                {viewComment.commentText}
                            </p>
                            <div className="flex gap-2 justify-end">
                                <button
                                    onClick={() => { setDeleteConfirm(viewComment); setViewComment(null); }}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition">
                                    <Trash2 className="w-4 h-4" /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirm Modal */}
                {deleteConfirm && (
                    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
                        onClick={() => setDeleteConfirm(null)}>
                        <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                    <AlertTriangle className="w-5 h-5 text-red-500" />
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-gray-800">Delete Comment</h2>
                                    <p className="text-xs text-gray-400">By {deleteConfirm.name || 'Anonymous'}</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3 mb-4 italic line-clamp-4">
                                "{deleteConfirm.commentText}"
                            </p>
                            <p className="text-sm text-gray-500 mb-5">This action is permanent and cannot be undone.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setDeleteConfirm(null)}
                                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
                                    Cancel
                                </button>
                                <button onClick={handleDelete} disabled={actionLoading === deleteConfirm.id}
                                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50">
                                    {actionLoading === deleteConfirm.id ? 'Deleting...' : 'Yes, Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // ─────────────────────────────────────────────────────────────
    // RENDER: Blog list panel
    // ─────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen" style={{ backgroundColor: '#ffffff' }}>
            {/* Sticky header */}
            <div className="bg-white shadow-sm sticky top-18 z-40 px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                    {onBack && (
                        <button onClick={onBack} className="p-2 rounded-lg hover:bg-gray-100 transition" title="Back">
                            <ArrowLeft className="w-5 h-5 text-blue-900" />
                        </button>
                    )}
                    <MessageSquare className="w-6 h-6 shrink-0 text-blue-900" />
                    <div>
                        <h1 className="text-xl font-bold text-blue-900">Comment Management</h1>
                        <p className="text-xs text-gray-400">Select a blog to view and manage its comments</p>
                    </div>
                </div>
                <button onClick={() => fetchBlogs(blogPage)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-50 transition text-blue-900">
                    <RefreshCw className="w-4 h-4" /> Refresh
                </button>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-8">
                {/* Search */}
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Search blogs by title or author..."
                        value={blogSearch} onChange={e => setBlogSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent" />
                </div>

                <p className="text-sm text-gray-500 mb-4">
                    <span className="font-semibold text-gray-700">{blogPagination.totalElements}</span> blogs total · Click a blog to see its comments
                </p>

                {/* Blogs table */}
                {blogsLoading ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-20 text-center">
                        <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2"
                            style={{ borderColor: '#1e3a8a', borderTopColor: '#eab308' }} />
                        <p className="mt-4 text-gray-500 text-sm">Loading blogs...</p>
                    </div>
                ) : filteredBlogs.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-20 text-center">
                        <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">No blogs found</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="hidden md:grid grid-cols-12 gap-3 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            <div className="col-span-6">Blog Title</div>
                            <div className="col-span-2">Author</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-2 text-center">Comments</div>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {filteredBlogs.map((blog) => (
                                <button key={blog.id} onClick={() => openBlog(blog)}
                                    className="w-full px-6 py-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-center text-left hover:bg-blue-50/40 transition group">
                                    <div className="col-span-1 md:col-span-6 flex items-center gap-3 min-w-0">
                                        <BlogStatusDot status={blog.status} />
                                        <span className="text-sm font-semibold text-gray-800 truncate group-hover:text-blue-900 transition">
                                            {blog.title}
                                        </span>
                                    </div>
                                    <div className="col-span-1 md:col-span-2 text-sm text-gray-500 truncate">
                                        {blog.authorName || '—'}
                                    </div>
                                    <div className="col-span-1 md:col-span-2">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                            blog.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                                            blog.status === 'PENDING'   ? 'bg-yellow-100 text-yellow-800' :
                                            blog.status === 'REJECTED'  ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-600'
                                        }`}>{blog.status}</span>
                                    </div>
                                    <div className="col-span-1 md:col-span-2 flex items-center justify-center gap-1.5">
                                        <MessageSquare className="w-4 h-4 text-gray-400" />
                                        <span className={`text-sm font-bold ${(blog.commentsCount || 0) > 0 ? 'text-blue-900' : 'text-gray-300'}`}>
                                            {blog.commentsCount ?? 0}
                                        </span>
                                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-900 transition ml-1" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Blog Pagination */}
                {blogPagination.totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-between">
                        <button
                            onClick={() => { const p = blogPage - 1; setBlogPage(p); fetchBlogs(p); }}
                            disabled={blogPage === 0}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-50 transition disabled:opacity-40 text-blue-900">
                            <ChevronLeft className="w-4 h-4" /> Previous
                        </button>
                        <span className="text-sm text-gray-500">Page {blogPage + 1} of {blogPagination.totalPages}</span>
                        <button
                            onClick={() => { const p = blogPage + 1; setBlogPage(p); fetchBlogs(p); }}
                            disabled={blogPage >= blogPagination.totalPages - 1}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-50 transition disabled:opacity-40 text-blue-900">
                            Next <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
