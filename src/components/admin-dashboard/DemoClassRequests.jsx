import React, { useState, useEffect } from 'react'
import Pagination from '../ui/Pagination' 
 
 const SAMPLE_REQUESTS = [ 
   { id: 'DEMO001', name: 'Rajesh Kumar', email: 'rajesh@example.com', phone: '+91 98765 43210', course: 'Mathematics', preferredDate: 'Mar 01, 2026', preferredTime: '4:00 PM', status: 'pending', notes: 'Interested in calculus', requestedOn: '2026-02-20' }, 
   { id: 'DEMO002', name: 'Sneha Patel', email: 'sneha@example.com', phone: '+91 98765 43211', course: 'Physics', preferredDate: 'Mar 05, 2026', preferredTime: '2:00 PM', status: 'scheduled', notes: 'Looking for mechanics help', requestedOn: '2026-02-21' }, 
 ] 
 
 const loadRequests = () => { 
   try { 
     const saved = JSON.parse(localStorage.getItem('icfy_demo_requests') || 'null') 
     return saved && saved.length > 0 ? saved : SAMPLE_REQUESTS 
   } catch { return SAMPLE_REQUESTS } 
 } 
 
 const STATUS_COLORS = { 
   pending:   { bg: '#fff8e1', text: '#b45309' }, 
   scheduled: { bg: '#e0f2fe', text: '#0369a1' }, 
   completed: { bg: '#dcfce7', text: '#166534' }, 
   cancelled: { bg: '#fee2e2', text: '#991b1b' }, 
 } 
 
 export default function DemoClassRequests() { 
   const [requests, setRequests] = useState(loadRequests) 
   const [filterStatus, setFilterStatus] = useState('all') 
   const [currentPage, setCurrentPage] = useState(1) 
   const [viewRequest, setViewRequest] = useState(null) 
   const itemsPerPage = 100 
 
   useEffect(() => { 
     const saved = JSON.parse(localStorage.getItem('icfy_demo_requests') || 'null') 
     if (saved && saved.length > 0) setRequests(saved) 
   }, []) 
 
   const handleStatusUpdate = (id, status) => { 
     const updated = requests.map(r => r.id === id ? { ...r, status } : r) 
     setRequests(updated) 
     localStorage.setItem('icfy_demo_requests', JSON.stringify(updated)) 
     if (viewRequest?.id === id) setViewRequest(prev => ({ ...prev, status })) 
   } 
 
   const filteredRequests = filterStatus === 'all' 
     ? requests 
     : requests.filter(r => r.status === filterStatus) 
 
   const totalPages = Math.ceil(filteredRequests.length / itemsPerPage) 
   const startIndex = (currentPage - 1) * itemsPerPage 
   const paginatedRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage) 
 
   const col = (status) => STATUS_COLORS[status] || { bg: '#f3f4f6', text: '#374151' } 
 
   return ( 
     <div className="space-y-6"> 
       {/* Header */} 
       <div className="bg-white border-b-2 border-blue-900 rounded-xl p-6"> 
         <h2 className="text-2xl font-bold text-blue-900">Demo Class Requests</h2> 
         <p className="text-gray-500 text-sm mt-1">Manage demo class schedule requests</p> 
       </div> 
 
       {/* Stats */} 
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4"> 
         {[ 
           { label: 'Pending',   value: requests.filter(r => r.status === 'pending').length,   color: '#f59e0b', bg: '#fff8e1' }, 
           { label: 'Scheduled', value: requests.filter(r => r.status === 'scheduled').length, color: '#0284c7', bg: '#e0f2fe' }, 
           { label: 'Completed', value: requests.filter(r => r.status === 'completed').length, color: '#16a34a', bg: '#dcfce7' }, 
           { label: 'Total',     value: requests.length,                                        color: '#1e3a8a', bg: '#eff6ff' }, 
         ].map(s => ( 
           <div key={s.label} className="rounded-xl shadow-md p-5 border-l-4" style={{ backgroundColor: s.bg, borderLeftColor: s.color }}> 
             <p className="text-xs font-semibold text-gray-500 mb-1">{s.label}</p> 
             <p className="text-3xl font-bold" style={{ color: s.color }}>{s.value}</p> 
           </div> 
         ))} 
       </div> 
 
       {/* Filters */} 
       <div className="bg-white rounded-xl shadow-md p-4 flex flex-wrap gap-2"> 
         {['all', 'pending', 'scheduled', 'completed', 'cancelled'].map(status => ( 
           <button key={status} onClick={() => { setFilterStatus(status); setCurrentPage(1) }} 
             className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all border-2 border-blue-900 ${ 
               filterStatus === status ? 'bg-blue-900 text-white' : 'bg-transparent text-gray-700 hover:bg-blue-50' 
             }`}> 
             {status.charAt(0).toUpperCase() + status.slice(1)} 
           </button> 
         ))} 
       </div> 
 
       {/* Table */} 
       <div className="bg-white rounded-xl shadow-md overflow-hidden"> 
         <div className="overflow-x-auto"> 
           <table className="w-full text-sm"> 
             <thead className="bg-blue-900"> 
               <tr> 
                 {['ID', 'Name', 'Email', 'Phone', 'Course', 'Preferred Date & Time', 'Requested On', 'Status', 'Actions'].map(h => ( 
                   <th key={h} className="px-4 py-3 text-left text-white font-semibold whitespace-nowrap">{h}</th> 
                 ))} 
               </tr> 
             </thead> 
             <tbody> 
               {paginatedRequests.length === 0 ? ( 
                 <tr><td colSpan="9" className="text-center py-12 text-gray-400">No requests found.</td></tr> 
               ) : paginatedRequests.map((r, idx) => { 
                 const c = col(r.status) 
                 return ( 
                   <tr key={r.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}> 
                     <td className="px-4 py-3 font-mono text-xs text-gray-500">{r.id}</td> 
                     <td className="px-4 py-3 font-semibold text-blue-900">{r.name}</td> 
                     <td className="px-4 py-3 text-gray-600">{r.email}</td> 
                     <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{r.phone}</td> 
                     <td className="px-4 py-3 text-gray-700">{r.course}</td> 
                     <td className="px-4 py-3 whitespace-nowrap text-gray-700">{r.preferredDate}{r.preferredTime ? ` | ${r.preferredTime}` : ''}</td> 
                     <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{r.requestedOn}</td> 
                     <td className="px-4 py-3"> 
                       <span className="px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap" 
                         style={{ backgroundColor: c.bg, color: c.text }}> 
                         {r.status.toUpperCase()} 
                       </span> 
                     </td> 
                     <td className="px-4 py-3"> 
                       <button onClick={() => setViewRequest(r)} 
                         className="px-3 py-1 rounded text-white text-xs font-semibold whitespace-nowrap bg-blue-900"> 
                         View 
                       </button> 
                     </td> 
                   </tr> 
                 ) 
               })} 
             </tbody> 
           </table> 
         </div> 
 
         {/* Pagination */} 
         <Pagination 
           currentPage={currentPage} 
           totalPages={totalPages} 
           onPageChange={setCurrentPage} 
           totalItems={filteredRequests.length} 
           itemsPerPage={itemsPerPage} 
           alwaysShow={true} 
         /> 
       </div> 
 
       {/* View Detail Modal */} 
       {viewRequest && ( 
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" 
           onClick={() => setViewRequest(null)}> 
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto" 
             onClick={e => e.stopPropagation()}> 
 
             {/* Modal Header */} 
             <div className="flex items-center justify-between px-6 py-5 rounded-t-2xl bg-blue-900"> 
               <div> 
                 <h3 className="text-xl font-bold text-white">{viewRequest.name}</h3> 
                 <p className="text-white/70 text-sm">ID: {viewRequest.id} | Requested {viewRequest.requestedOn}</p> 
               </div> 
               <span className="px-3 py-1 rounded-full text-xs font-bold" 
                 style={{ backgroundColor: col(viewRequest.status).bg, color: col(viewRequest.status).text }}> 
                 {viewRequest.status.toUpperCase()} 
               </span> 
             </div> 
 
             {/* Modal Body */} 
             <div className="px-6 py-5 space-y-4"> 
               <div className="grid grid-cols-2 gap-4"> 
                 <div className="bg-gray-50 rounded-lg p-3"> 
                   <p className="text-xs text-gray-500 mb-1 font-semibold">Email</p> 
                   <p className="font-semibold text-sm text-gray-800">{viewRequest.email}</p> 
                 </div> 
                 <div className="bg-gray-50 rounded-lg p-3"> 
                   <p className="text-xs text-gray-500 mb-1 font-semibold">Phone</p> 
                   <p className="font-semibold text-sm text-gray-800">{viewRequest.phone}</p> 
                 </div> 
                 <div className="bg-gray-50 rounded-lg p-3"> 
                   <p className="text-xs text-gray-500 mb-1 font-semibold">Course</p> 
                   <p className="font-semibold text-sm text-gray-800">{viewRequest.course}</p> 
                 </div> 
                 <div className="bg-gray-50 rounded-lg p-3"> 
                   <p className="text-xs text-gray-500 mb-1 font-semibold">Preferred Date & Time</p> 
                   <p className="font-semibold text-sm text-gray-800">{viewRequest.preferredDate} at {viewRequest.preferredTime}</p> 
                 </div> 
               </div> 
 
               {viewRequest.notes && ( 
                 <div className="bg-blue-50 rounded-lg p-4"> 
                   <p className="text-xs text-blue-600 mb-1 font-semibold">Notes</p> 
                   <p className="text-gray-700 text-sm">{viewRequest.notes}</p> 
                 </div> 
               )} 
 
               {/* Update Status */} 
               <div className="flex items-center gap-3"> 
                 <p className="text-sm font-semibold text-gray-600 whitespace-nowrap">Update Status:</p> 
                 <select value={viewRequest.status} 
                   onChange={e => handleStatusUpdate(viewRequest.id, e.target.value)} 
                   className="flex-1 px-3 py-2 border-2 rounded-lg text-sm focus:outline-none" 
                   style={{ borderColor: '#1e3a8a' }}> 
                   <option value="pending">Pending</option> 
                   <option value="scheduled">Scheduled</option> 
                   <option value="completed">Completed</option> 
                   <option value="cancelled">Cancelled</option> 
                 </select> 
               </div> 
             </div> 
 
             {/* Modal Footer */} 
             <div className="px-6 py-4 border-t flex gap-3"> 
               {viewRequest.status === 'pending' && ( 
                 <> 
                   <button onClick={() => handleStatusUpdate(viewRequest.id, 'scheduled')} 
                     className="flex-1 py-2 rounded-lg text-white font-semibold text-sm" 
                     style={{ backgroundColor: '#16a34a' }}> 
                     Schedule Class 
                   </button> 
                   <button onClick={() => handleStatusUpdate(viewRequest.id, 'cancelled')} 
                     className="flex-1 py-2 rounded-lg text-white font-semibold text-sm" 
                     style={{ backgroundColor: '#dc2626' }}> 
                     Decline 
                   </button> 
                 </> 
               )} 
               <a href={`mailto:${viewRequest.email}`} 
                 className="flex-1 py-2 rounded-lg font-semibold text-sm text-center border-2" 
                 style={{ borderColor: '#1e3a8a', color: '#1e3a8a' }}> 
                 Contact Student 
               </a> 
               <button onClick={() => setViewRequest(null)} 
                 className="px-4 py-2 rounded-lg text-gray-500 font-semibold text-sm border"> 
                 Close 
               </button> 
             </div> 
           </div> 
         </div> 
       )} 
     </div> 
   ) 
 } 
