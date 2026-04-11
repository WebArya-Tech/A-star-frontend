import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, X, Search, Settings, BookOpen, GraduationCap, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { demoApi } from '../../api/demoApi';

export default function DemoSettings() {
    const [grades, setGrades] = useState([]);
    const [boards, setBoards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('grades');

    // Form states
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const results = await Promise.allSettled([
                demoApi.getAdminGrades(),
                demoApi.getAdminBoards()
            ]);

            const gradesData = results[0].status === 'fulfilled' ? results[0].value : [];
            const boardsData = results[1].status === 'fulfilled' ? results[1].value : [];

            setGrades(Array.isArray(gradesData) ? gradesData : []);
            setBoards(Array.isArray(boardsData) ? boardsData : []);

            if (results.some((result) => result.status === 'rejected')) {
                console.error('Some admin settings failed to load:', results);
                // toast.error('Using fallback data for some settings');
            }
        } catch (error) {
            console.error('Failed to load demo settings:', error);
            setGrades([]);
            setBoards([]);
            toast.error('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({ name: '' });
        setIsAdding(false);
        setEditingId(null);
    };

    const startEditing = (item) => {
        setEditingId(item.id);
        setFormData({
            name: item.name
        });
        setIsAdding(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast.error('Please enter a name');
            return;
        }

        try {
            // Create only - Update not supported by API yet
            if (activeTab === 'grades') {
                await demoApi.createAdminGrade(formData);
                toast.success('Grade created successfully');
            } else {
                await demoApi.createAdminBoard(formData);
                toast.success('Board created successfully');
            }
            await loadData();
            resetForm();
        } catch (error) {
            console.error('Failed to save:', error);
            toast.error('Failed to save changes');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;

        try {
            if (activeTab === 'grades') {
                await demoApi.deleteAdminGrade(id);
                setGrades(prev => prev.filter(g => g.id !== id));
                toast.success('Grade deleted successfully');
            } else {
                await demoApi.deleteAdminBoard(id);
                setBoards(prev => prev.filter(b => b.id !== id));
                toast.success('Board deleted successfully');
            }
        } catch (error) {
            console.error('Failed to delete:', error);
            toast.error('Failed to delete item');
        }
    };

    const currentData = activeTab === 'grades' ? grades : boards;
    const currentTitle = activeTab === 'grades' ? 'Grades' : 'Boards';
    const CurrentIcon = activeTab === 'grades' ? GraduationCap : BookOpen;

    return (
        <div className="w-full">
            {/* Header */}
            <div className="bg-white border-b-2 border-blue-900 rounded-xl p-6 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-blue-900 flex items-center gap-3">
                        <Settings className="w-8 h-8" />
                        Demo Settings
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Manage grades and boards for demo scheduling</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('grades')}
                        className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${activeTab === 'grades'
                            ? 'text-blue-900 border-b-2 border-blue-900 bg-blue-50'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <GraduationCap className="w-5 h-5 inline mr-2" />
                        Grades ({grades.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('boards')}
                        className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${activeTab === 'boards'
                            ? 'text-blue-900 border-b-2 border-blue-900 bg-blue-50'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <BookOpen className="w-5 h-5 inline mr-2" />
                        Boards ({boards.length})
                    </button>
                </div>
            </div>

            {/* Add Form - Always Visible */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 mb-6">
                <div className="flex items-center gap-2 mb-4 text-blue-900 font-bold">
                    <Plus size={20} />
                    <span>Add New {currentTitle.slice(0, -1)}</span>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                            placeholder={`e.g., ${activeTab === 'grades' ? 'Grade 9' : 'IGCSE'}`}
                            required
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="px-8 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition shadow-md flex items-center gap-2 font-medium"
                        >
                            <Save size={18} />
                            Save {currentTitle.slice(0, -1)}
                        </button>
                        {formData.name && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <CurrentIcon className="w-5 h-5" />
                        {currentTitle}
                    </h3>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-gray-600 font-medium">Loading {currentTitle.toLowerCase()}...</p>
                    </div>
                ) : currentData.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-b-xl border-t border-gray-200">
                        <AlertCircle className="mx-auto mb-4 text-gray-400" size={48} />
                        <p className="text-gray-600 text-lg font-medium">No {currentTitle.toLowerCase()} found</p>
                        <p className="text-gray-400 text-sm mt-1">Add your first {currentTitle.slice(0, -1).toLowerCase()} to get started</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {currentData.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}