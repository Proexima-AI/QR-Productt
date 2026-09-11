import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, Users, CreditCard, MessageSquare, Save, Settings, X, Search, ChevronRight } from 'lucide-react';
import axios from 'axios';

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ totalUsers: 0, totalRevenue: 0, graphData: [] });
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Edit User Modal
  const [editingUser, setEditingUser] = useState(null);
  
  // Reply Modal
  const [replyingTicket, setReplyingTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      if (activeTab === 'overview') {
        const { data } = await axios.get('/api/admin/stats', { headers });
        setStats(data);
      } else if (activeTab === 'customers') {
        const { data } = await axios.get('/api/admin/users', { headers });
        setUsers(data);
      } else if (activeTab === 'support') {
        const { data } = await axios.get('/api/admin/tickets', { headers });
        setTickets(data);
      }
    } catch (err) {
      if (err.response?.status === 403) {
        alert("Admin Access Required!");
        navigate('/dashboard');
      }
      console.error("Failed to fetch admin data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/admin/users/${editingUser.id}`, {
        role: editingUser.role,
        subscription_ends_at: editingUser.subscription_ends_at
      }, { headers: { Authorization: `Bearer ${token}` } });
      setEditingUser(null);
      fetchData();
    } catch (err) {
      alert('Failed to update user');
    }
  };

  const handleReplyTicket = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/admin/tickets/${replyingTicket.id}/reply`, {
        reply: replyMessage
      }, { headers: { Authorization: `Bearer ${token}` } });
      setReplyingTicket(null);
      setReplyMessage('');
      fetchData();
    } catch (err) {
      alert('Failed to send reply');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col fixed h-full z-20">
        <div className="p-6">
          <div className="text-xl font-black text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-amber-500" /> Super Admin
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold flex items-center gap-3 transition-all ${
              activeTab === 'overview' ? 'bg-amber-500/10 text-amber-500' : 'hover:bg-slate-900 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" /> Overview
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold flex items-center gap-3 transition-all ${
              activeTab === 'customers' ? 'bg-amber-500/10 text-amber-500' : 'hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Users className="w-5 h-5" /> Customers
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold flex items-center gap-3 transition-all ${
              activeTab === 'support' ? 'bg-amber-500/10 text-amber-500' : 'hover:bg-slate-900 hover:text-white'
            }`}
          >
            <MessageSquare className="w-5 h-5" /> Support Chat
          </button>
        </nav>
        <div className="p-4 border-t border-slate-900">
          <button onClick={() => navigate('/dashboard')} className="w-full text-sm text-slate-500 hover:text-white font-medium flex items-center justify-between">
            Exit Admin <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64 p-8">
        
        {loading ? (
          <div className="h-64 flex items-center justify-center text-slate-500 font-bold animate-pulse">Loading Admin Data...</div>
        ) : (
          <>
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-black text-slate-900">Platform Overview</h2>
                  <p className="text-slate-500 font-medium">Global metrics and growth charts.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-5"><Users className="w-24 h-24" /></div>
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-wider block mb-2 relative z-10">Total Users</span>
                    <div className="text-5xl font-black text-slate-900 relative z-10">{stats.totalUsers}</div>
                  </div>
                  
                  <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-5"><CreditCard className="w-24 h-24" /></div>
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-wider block mb-2 relative z-10">Total Revenue</span>
                    <div className="text-5xl font-black text-emerald-600 relative z-10">₹{stats.totalRevenue.toLocaleString()}</div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">User Growth (Last 7 Days)</h3>
                  <div className="h-72 w-full">
                    {stats.graphData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={stats.graphData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dx={-10} />
                          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                          <Line type="monotone" dataKey="users" stroke="#f59e0b" strokeWidth={3} dot={{r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-400 text-sm font-medium">Not enough data to display graph.</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* CUSTOMERS TAB */}
            {activeTab === 'customers' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900">Customer Management</h2>
                    <p className="text-slate-500 font-medium">Manage all users and business profiles.</p>
                  </div>
                  <div className="relative">
                    <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                    <input type="text" placeholder="Search customers..." className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 w-64 shadow-sm" />
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                        <th className="p-4">Email</th>
                        <th className="p-4">Business</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Role</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {users.map(u => (
                        <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 font-bold text-slate-900">{u.email}</td>
                          <td className="p-4 text-slate-600 font-medium">{u.business_name || <span className="text-slate-400 italic">Pending Setup</span>}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                              u.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'
                            }`}>
                              {u.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                              u.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500'
                            }`}>{u.role}</span>
                          </td>
                          <td className="p-4 text-right">
                            <button onClick={() => setEditingUser(u)} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors">
                              Edit Profile
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {users.length === 0 && <div className="p-8 text-center text-slate-500 font-medium">No users found.</div>}
                </div>
              </div>
            )}

            {/* SUPPORT CHAT TAB */}
            {activeTab === 'support' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-black text-slate-900">Support Tickets</h2>
                  <p className="text-slate-500 font-medium">Respond to customer issues and inquiries.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl shadow-sm h-[600px] overflow-y-auto flex flex-col">
                    {tickets.length === 0 ? (
                      <div className="p-8 text-center text-slate-500 font-medium m-auto">No support tickets!</div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {tickets.map(t => (
                          <div 
                            key={t.id} 
                            onClick={() => setReplyingTicket(t)}
                            className={`p-4 cursor-pointer transition-colors hover:bg-slate-50 ${replyingTicket?.id === t.id ? 'bg-amber-50/50 border-l-4 border-amber-500' : 'border-l-4 border-transparent'}`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-bold text-slate-900 text-sm truncate">{t.subject}</span>
                              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-sm ${t.status === 'open' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-500'}`}>{t.status}</span>
                            </div>
                            <div className="text-xs text-slate-500 truncate">{t.email}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm h-[600px] flex flex-col">
                    {replyingTicket ? (
                      <>
                        <div className="p-6 border-b border-slate-100">
                          <h3 className="text-xl font-bold text-slate-900">{replyingTicket.subject}</h3>
                          <p className="text-sm text-slate-500">From: {replyingTicket.email}</p>
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto bg-slate-50 space-y-4">
                          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm max-w-[80%]">
                            <p className="text-xs text-slate-400 font-bold mb-1">Customer</p>
                            <p className="text-sm text-slate-800">{replyingTicket.message}</p>
                          </div>
                          {replyingTicket.reply && (
                            <div className="bg-amber-100 border border-amber-200 p-4 rounded-xl shadow-sm max-w-[80%] ml-auto">
                              <p className="text-xs text-amber-700 font-bold mb-1">Admin (You)</p>
                              <p className="text-sm text-amber-900">{replyingTicket.reply}</p>
                            </div>
                          )}
                        </div>
                        <div className="p-4 border-t border-slate-200 bg-white">
                          <form onSubmit={handleReplyTicket} className="flex gap-3">
                            <input 
                              type="text" 
                              value={replyMessage}
                              onChange={e => setReplyMessage(e.target.value)}
                              placeholder="Type your reply here..." 
                              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                              required
                            />
                            <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 rounded-xl text-sm transition-colors shadow-md">
                              Send Reply
                            </button>
                          </form>
                        </div>
                      </>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                        <MessageSquare className="w-12 h-12 mb-3 opacity-20" />
                        <p className="font-medium">Select a ticket to view conversation</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* EDIT MODAL */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-black text-slate-900">Edit User Profile</h3>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleUpdateUser} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">User Email</label>
                <input type="text" disabled value={editingUser.email} className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-slate-500 font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Role</label>
                <select 
                  value={editingUser.role} 
                  onChange={e => setEditingUser({...editingUser, role: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-sm"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Subscription Ends At (YYYY-MM-DD HH:MM:SS)</label>
                <input 
                  type="text" 
                  value={editingUser.subscription_ends_at || ''} 
                  onChange={e => setEditingUser({...editingUser, subscription_ends_at: e.target.value})}
                  placeholder="e.g. 2027-12-31 23:59:59"
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-sm" 
                />
                <p className="text-xs text-slate-400 mt-2">Leave blank or update manually to extend/revoke access.</p>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setEditingUser(null)} className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-md transition-colors flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
