import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

// ── ICON HELPER ──
const Icon = ({ d, className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={d} />
  </svg>
);

const IC = {
  dashboard: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  users:     "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
  events:    "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  finance:   "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  feedback:  "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
  logout:    "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
  check:     "M5 13l4 4L19 7",
  x:         "M6 18L18 6M6 6l12 12",
  trash:     "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
  flag:      "M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9",
  cert:      "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
  menu:      "M4 6h16M4 12h16M4 18h16",
};

const ROLE_COLORS = {
  student:   'bg-blue-500/10 text-blue-400 border-blue-500/20',
  organizer: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  finance:   'bg-amber-500/10 text-amber-400 border-amber-500/20',
  admin:     'bg-red-500/10 text-red-400 border-red-500/20',
};

const STATUS_COLORS = {
  approved:           'bg-green-500/10 text-green-400 border-green-500/20',
  pending:            'bg-amber-500/10 text-amber-400 border-amber-500/20',
  rejected:           'bg-red-500/10 text-red-400 border-red-500/20',
  cancelled:          'bg-gray-500/10 text-gray-400 border-gray-500/20',
  draft:              'bg-white/5 text-white/40 border-white/10',
  completed:          'bg-teal-500/10 text-teal-400 border-teal-500/20',
  submitted:          'bg-blue-500/10 text-blue-400 border-blue-500/20',
  revision_requested: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
};

// ── SHARED UI ──
const Badge = ({ label, color }) => (
  <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium capitalize ${color}`}>{label}</span>
);

const EmptyState = ({ message }) => (
  <div className="text-center py-16 text-white/20 text-sm">{message}</div>
);

const DeleteModal = ({ name, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-[#0f1117] border border-white/10 rounded-2xl p-6 w-full max-w-sm">
      <h3 className="text-white font-semibold mb-2">Confirm Delete</h3>
      <p className="text-white/50 text-sm mb-6">Delete <span className="text-white font-medium">{name}</span>? This cannot be undone.</p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 bg-white/[0.05] hover:bg-white/[0.09] text-white/70 text-sm py-2.5 rounded-xl">Cancel</button>
        <button onClick={onConfirm} className="flex-1 bg-red-600 hover:bg-red-500 text-white text-sm font-medium py-2.5 rounded-xl">Delete</button>
      </div>
    </div>
  </div>
);

const StatCard = ({ label, value, sub, color, icon }) => (
  <div className="bg-[#0f1117] border border-white/[0.07] rounded-2xl p-5">
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${color.replace('text-','bg-').replace('-400','-500/10')}`}>
      <Icon d={icon} className={`w-4 h-4 ${color}`} />
    </div>
    <div className={`text-2xl font-bold ${color} mb-0.5`}>{value}</div>
    <div className="text-white/70 text-sm">{label}</div>
    {sub && <div className="text-white/30 text-xs mt-0.5">{sub}</div>}
  </div>
);

// ════════════════════
// OVERVIEW TAB
// ════════════════════
const OverviewTab = ({ users, events, budgets, feedbacks }) => {
  const stats = [
    { label:'Total Users',      value:users.length,                                        sub:`${users.filter(u=>u.isActive).length} active`,       color:'text-blue-400',   icon:IC.users    },
    { label:'Total Events',     value:events.length,                                       sub:`${events.filter(e=>e.status==='approved').length} live`,color:'text-violet-400', icon:IC.events   },
    { label:'Pending Approval', value:events.filter(e=>e.status==='pending').length,       sub:'Events awaiting review',                              color:'text-amber-400',  icon:IC.flag     },
    { label:'Budget Requests',  value:budgets.filter(b=>b.status==='submitted').length,    sub:'Awaiting finance review',                             color:'text-orange-400', icon:IC.finance  },
    { label:'Flagged Feedback', value:feedbacks.filter(f=>f.isFlagged&&!f.isHidden).length,sub:'Needs moderation',                                   color:'text-red-400',    icon:IC.feedback },
    { label:'Certificates',     value:0,                                                   sub:'Auto-generated',                                      color:'text-teal-400',   icon:IC.cert     },
  ];

  const recentEvents = [...events].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,5);
  const recentUsers  = [...users].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map(s => <StatCard key={s.label} {...s}/>)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-[#0f1117] border border-white/[0.07] rounded-2xl p-5">
          <h3 className="text-white/70 text-sm font-semibold mb-4">Recent Events</h3>
          {recentEvents.length===0 ? <EmptyState message="No events yet"/> : recentEvents.map(e=>(
            <div key={e._id} className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0">
              <div>
                <div className="text-white/80 text-sm font-medium">{e.title}</div>
                <div className="text-white/30 text-xs capitalize">{e.category} · {new Date(e.createdAt).toLocaleDateString()}</div>
              </div>
              <Badge label={e.status} color={STATUS_COLORS[e.status]||STATUS_COLORS.draft}/>
            </div>
          ))}
        </div>
        <div className="bg-[#0f1117] border border-white/[0.07] rounded-2xl p-5">
          <h3 className="text-white/70 text-sm font-semibold mb-4">Recent Users</h3>
          {recentUsers.length===0 ? <EmptyState message="No users yet"/> : recentUsers.map(u=>(
            <div key={u._id} className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-300 text-xs font-bold">
                  {u.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-white/80 text-sm">{u.name}</div>
                  <div className="text-white/30 text-xs">{u.studentId||u.email}</div>
                </div>
              </div>
              <Badge label={u.role} color={ROLE_COLORS[u.role]}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ════════════════════
// USERS TAB
// ════════════════════
const UsersTab = ({ users, onRoleChange, onToggle, onDelete }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [confirm, setConfirm] = useState(null);

  const filtered = users.filter(u => {
    const s = search.toLowerCase();
    const match = u.name?.toLowerCase().includes(s)||u.email?.toLowerCase().includes(s)||u.studentId?.toLowerCase().includes(s);
    return match && (filter==='all'||u.role===filter);
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/>
          </svg>
          <input type="text" placeholder="Search by name, email or student ID..." value={search} onChange={e=>setSearch(e.target.value)}
            className="w-full bg-[#0f1117] border border-white/10 focus:border-indigo-500/50 text-white placeholder-white/20 text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none"/>
        </div>
        <select value={filter} onChange={e=>setFilter(e.target.value)}
          className="bg-[#0f1117] border border-white/10 text-white/60 text-sm rounded-xl px-4 py-2.5 outline-none" style={{colorScheme:'dark'}}>
          <option value="all">All Roles</option>
          <option value="student">Student</option>
          <option value="organizer">Organizer</option>
          <option value="finance">Finance</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="bg-[#0f1117] border border-white/[0.07] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.07]">
                {['User','Student ID','Faculty','Role','Status','Joined','Actions'].map(h=>(
                  <th key={h} className="text-left text-white/30 text-xs font-medium uppercase tracking-wider px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length===0 ? <tr><td colSpan={7}><EmptyState message="No users found"/></td></tr>
              : filtered.map(u=>(
                <tr key={u._id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-300 text-xs font-bold shrink-0">
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-white/80 text-sm font-medium">{u.name}</div>
                        <div className="text-white/30 text-xs">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-white/40 text-sm font-mono">{u.studentId||'—'}</td>
                  <td className="px-5 py-3.5 text-white/40 text-xs max-w-[120px] truncate">{u.faculty||'—'}</td>
                  <td className="px-5 py-3.5">
                    <select value={u.role} onChange={e=>onRoleChange(u._id,e.target.value)} disabled={u.role==='admin'}
                      className={`text-xs px-2.5 py-1 rounded-full border font-medium outline-none cursor-pointer disabled:cursor-not-allowed bg-transparent ${ROLE_COLORS[u.role]}`}
                      style={{colorScheme:'dark'}}>
                      <option value="student">student</option>
                      <option value="organizer">organizer</option>
                      <option value="finance">finance</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge label={u.isActive?'Active':'Inactive'} color={u.isActive?'bg-green-500/10 text-green-400 border-green-500/20':'bg-red-500/10 text-red-400 border-red-500/20'}/>
                  </td>
                  <td className="px-5 py-3.5 text-white/30 text-xs">{new Date(u.createdAt).toLocaleDateString('en-GB')}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <button onClick={()=>onToggle(u._id,u.isActive)} disabled={u.role==='admin'}
                        className={`p-1.5 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed ${u.isActive?'text-red-400 hover:bg-red-500/10':'text-green-400 hover:bg-green-500/10'}`}>
                        <Icon d={u.isActive?IC.x:IC.check} className="w-4 h-4"/>
                      </button>
                      <button onClick={()=>setConfirm({id:u._id,name:u.name})} disabled={u.role==='admin'}
                        className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                        <Icon d={IC.trash} className="w-4 h-4"/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {confirm && <DeleteModal name={confirm.name} onConfirm={()=>{onDelete(confirm.id);setConfirm(null);}} onCancel={()=>setConfirm(null)}/>}
    </div>
  );
};

// ════════════════════
// EVENTS TAB
// ════════════════════
const EventsTab = ({ events, onApprove, onReject, onDelete }) => {
  const [filter, setFilter]   = useState('all');
  const [search, setSearch]   = useState('');
  const [confirm, setConfirm] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [reason, setReason]   = useState('');

  const filtered = events.filter(e=>{
    const s=search.toLowerCase();
    return (e.title?.toLowerCase().includes(s)||e.category?.toLowerCase().includes(s))
      && (filter==='all'||e.status===filter);
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/>
          </svg>
          <input type="text" placeholder="Search events..." value={search} onChange={e=>setSearch(e.target.value)}
            className="w-full bg-[#0f1117] border border-white/10 focus:border-indigo-500/50 text-white placeholder-white/20 text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none"/>
        </div>
        <select value={filter} onChange={e=>setFilter(e.target.value)}
          className="bg-[#0f1117] border border-white/10 text-white/60 text-sm rounded-xl px-4 py-2.5 outline-none" style={{colorScheme:'dark'}}>
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="bg-[#0f1117] border border-white/[0.07] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.07]">
                {['Event','Category','Date','Capacity','Price','Status','Actions'].map(h=>(
                  <th key={h} className="text-left text-white/30 text-xs font-medium uppercase tracking-wider px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length===0 ? <tr><td colSpan={7}><EmptyState message="No events found"/></td></tr>
              : filtered.map(e=>(
                <tr key={e._id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="text-white/80 text-sm font-medium">{e.title}</div>
                    <div className="text-white/30 text-xs">{e.organizer?.name||'Unknown'}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-white/50 bg-white/[0.05] px-2.5 py-1 rounded-lg capitalize">{e.category}</span>
                  </td>
                  <td className="px-5 py-3.5 text-white/40 text-xs">
                    {e.startDateTime?new Date(e.startDateTime).toLocaleDateString('en-GB'):'—'}
                  </td>
                  <td className="px-5 py-3.5 text-white/40 text-sm">{e.capacity||'—'}</td>
                  <td className="px-5 py-3.5 text-white/40 text-xs">{e.isFree?'Free':`LKR ${e.ticketPrice}`}</td>
                  <td className="px-5 py-3.5">
                    <Badge label={e.status} color={STATUS_COLORS[e.status]||STATUS_COLORS.draft}/>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      {e.status==='pending' && <>
                        <button onClick={()=>onApprove(e._id)} title="Approve"
                          className="p-1.5 rounded-lg text-green-400 hover:bg-green-500/10 transition-all">
                          <Icon d={IC.check} className="w-4 h-4"/>
                        </button>
                        <button onClick={()=>setRejectModal(e._id)} title="Reject"
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-all">
                          <Icon d={IC.x} className="w-4 h-4"/>
                        </button>
                      </>}
                      <button onClick={()=>setConfirm({id:e._id,name:e.title})}
                        className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all">
                        <Icon d={IC.trash} className="w-4 h-4"/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {rejectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f1117] border border-white/10 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-white font-semibold mb-2">Reject Event</h3>
            <p className="text-white/50 text-sm mb-3">Reason for rejection:</p>
            <textarea value={reason} onChange={e=>setReason(e.target.value)} rows={3} placeholder="e.g. Incomplete details, scheduling conflict..."
              className="w-full bg-white/[0.05] border border-white/10 text-white placeholder-white/20 text-sm rounded-xl px-4 py-3 outline-none resize-none mb-4"/>
            <div className="flex gap-3">
              <button onClick={()=>{setRejectModal(null);setReason('');}} className="flex-1 bg-white/[0.05] text-white/70 text-sm py-2.5 rounded-xl">Cancel</button>
              <button onClick={()=>{onReject(rejectModal,reason);setRejectModal(null);setReason('');}}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white text-sm font-medium py-2.5 rounded-xl">Reject</button>
            </div>
          </div>
        </div>
      )}
      {confirm && <DeleteModal name={confirm.name} onConfirm={()=>{onDelete(confirm.id);setConfirm(null);}} onCancel={()=>setConfirm(null)}/>}
    </div>
  );
};

// ════════════════════
// FINANCE TAB
// ════════════════════
const FinanceTab = ({ budgets, onApproveBudget, onRejectBudget }) => {
  const [filter, setFilter] = useState('all');
  const filtered = budgets.filter(b=>filter==='all'||b.status===filter);
  const totalEstimated = budgets.reduce((s,b)=>s+(b.totalEstimated||0),0);
  const totalApproved  = budgets.filter(b=>b.status==='approved').reduce((s,b)=>s+(b.totalApproved||0),0);

  return (
    <div className="space-y-4">
      {/* Finance summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          ['Total Requested','LKR '+totalEstimated.toLocaleString(),'text-amber-400'],
          ['Total Approved', 'LKR '+totalApproved.toLocaleString(),'text-green-400'],
          ['Pending Review', budgets.filter(b=>b.status==='submitted').length+' requests','text-blue-400'],
        ].map(([l,v,c])=>(
          <div key={l} className="bg-[#0f1117] border border-white/[0.07] rounded-2xl p-4">
            <div className={`text-xl font-bold ${c} mb-0.5`}>{v}</div>
            <div className="text-white/50 text-xs">{l}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {['all','submitted','approved','rejected','revision_requested'].map(s=>(
          <button key={s} onClick={()=>setFilter(s)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all capitalize ${filter===s?'bg-indigo-600 border-indigo-600 text-white':'border-white/10 text-white/40 hover:border-white/20'}`}>
            {s==='all'?'All':s.replace('_',' ')}
          </button>
        ))}
      </div>

      <div className="bg-[#0f1117] border border-white/[0.07] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.07]">
                {['Event','Submitted By','Estimated (LKR)','Approved (LKR)','Status','Actions'].map(h=>(
                  <th key={h} className="text-left text-white/30 text-xs font-medium uppercase tracking-wider px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length===0 ? <tr><td colSpan={6}><EmptyState message="No budget requests"/></td></tr>
              : filtered.map(b=>(
                <tr key={b._id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5 text-white/80 text-sm font-medium">{b.event?.title||'Unknown Event'}</td>
                  <td className="px-5 py-3.5 text-white/40 text-sm">{b.submittedBy?.name||'—'}</td>
                  <td className="px-5 py-3.5 text-amber-400 text-sm font-mono">{b.totalEstimated?.toLocaleString()||'0'}</td>
                  <td className="px-5 py-3.5 text-green-400 text-sm font-mono">{b.totalApproved?.toLocaleString()||'0'}</td>
                  <td className="px-5 py-3.5">
                    <Badge label={b.status?.replace('_',' ')} color={STATUS_COLORS[b.status]||STATUS_COLORS.draft}/>
                  </td>
                  <td className="px-5 py-3.5">
                    {b.status==='submitted' && (
                      <div className="flex gap-1">
                        <button onClick={()=>onApproveBudget(b._id)} title="Approve"
                          className="p-1.5 rounded-lg text-green-400 hover:bg-green-500/10 transition-all">
                          <Icon d={IC.check} className="w-4 h-4"/>
                        </button>
                        <button onClick={()=>onRejectBudget(b._id)} title="Reject"
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-all">
                          <Icon d={IC.x} className="w-4 h-4"/>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ════════════════════
// FEEDBACK TAB
// ════════════════════
const FeedbackTab = ({ feedbacks, onHide, onUnhide }) => {
  const [filter, setFilter] = useState('flagged');
  const filtered = feedbacks.filter(f=>{
    if (filter==='flagged') return f.isFlagged && !f.isHidden;
    if (filter==='hidden')  return f.isHidden;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {[['flagged','🚩 Flagged'],['hidden','🙈 Hidden'],['all','All']].map(([v,l])=>(
          <button key={v} onClick={()=>setFilter(v)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${filter===v?'bg-indigo-600 border-indigo-600 text-white':'border-white/10 text-white/40 hover:border-white/20'}`}>
            {l}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length===0
          ? <div className="bg-[#0f1117] border border-white/[0.07] rounded-2xl"><EmptyState message={`No ${filter} feedback`}/></div>
          : filtered.map(f=>(
          <div key={f._id} className="bg-[#0f1117] border border-white/[0.07] rounded-2xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/50 text-xs font-bold">
                    {f.isAnonymous?'A':f.student?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-white/60 text-sm">{f.isAnonymous?'Anonymous':f.student?.name}</span>
                  <span className="text-white/20 text-xs">·</span>
                  <span className="text-xs text-white/30 capitalize bg-white/[0.04] px-2 py-0.5 rounded">{f.targetType}</span>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s=>(
                      <span key={s} className={s<=f.rating?'text-amber-400':'text-white/10'} style={{fontSize:'11px'}}>★</span>
                    ))}
                  </div>
                </div>
                <p className="text-white/60 text-sm mb-2">{f.comment||<span className="text-white/20 italic">No comment</span>}</p>
                {f.isFlagged && (
                  <div className="text-xs text-red-400/70 bg-red-500/5 border border-red-500/10 rounded-lg px-3 py-1.5">
                    🚩 Flagged by {f.flaggedBy?.length||0} user(s){f.flagReason?` — ${f.flagReason}`:''}
                  </div>
                )}
              </div>
              <div className="shrink-0">
                {!f.isHidden
                  ? <button onClick={()=>onHide(f._id)} className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg transition-all">Hide</button>
                  : <button onClick={()=>onUnhide(f._id)} className="text-xs bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 px-3 py-1.5 rounded-lg transition-all">Restore</button>
                }
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ════════════════════
// CERTIFICATES TAB
// ════════════════════
const CertificatesTab = ({ certificates }) => (
  <div className="bg-[#0f1117] border border-white/[0.07] rounded-2xl overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/[0.07]">
            {['Certificate No.','Student','Event','Type','Score','Issued','Valid'].map(h=>(
              <th key={h} className="text-left text-white/30 text-xs font-medium uppercase tracking-wider px-5 py-3">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {certificates.length===0 ? <tr><td colSpan={7}><EmptyState message="No certificates yet"/></td></tr>
          : certificates.map(c=>(
            <tr key={c._id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors">
              <td className="px-5 py-3.5 text-indigo-400 text-xs font-mono">{c.certificateNumber}</td>
              <td className="px-5 py-3.5 text-white/70 text-sm">{c.student?.name||'—'}</td>
              <td className="px-5 py-3.5 text-white/50 text-sm">{c.event?.title||'—'}</td>
              <td className="px-5 py-3.5"><Badge label={c.type} color={STATUS_COLORS.approved}/></td>
              <td className="px-5 py-3.5 text-white/50 text-sm">{c.score??'—'}</td>
              <td className="px-5 py-3.5 text-white/30 text-xs">{new Date(c.issuedAt).toLocaleDateString('en-GB')}</td>
              <td className="px-5 py-3.5">
                <Badge label={c.isValid?'Valid':'Revoked'} color={c.isValid?'bg-green-500/10 text-green-400 border-green-500/20':'bg-red-500/10 text-red-400 border-red-500/20'}/>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ════════════════════
// MAIN COMPONENT
// ════════════════════
export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab]         = useState('overview');
  const [toast, setToast]     = useState('');
  const [mobileSidebar, setMobileSidebar] = useState(false);

  const [users,        setUsers]        = useState([]);
  const [events,       setEvents]       = useState([]);
  const [budgets,      setBudgets]      = useState([]);
  const [feedbacks,    setFeedbacks]    = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading,      setLoading]      = useState(true);

  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(''),3000); };

  useEffect(()=>{
    (async()=>{
      setLoading(true);
      const results = await Promise.allSettled([
        api.get('/users'),
        api.get('/events'),
        api.get('/budgets'),
        api.get('/feedback'),
        api.get('/certificates'),
      ]);
      const [u,e,b,f,c] = results;
      if(u.status==='fulfilled') setUsers(u.value.data);
      if(e.status==='fulfilled') setEvents(e.value.data);
      if(b.status==='fulfilled') setBudgets(b.value.data);
      if(f.status==='fulfilled') setFeedbacks(f.value.data);
      if(c.status==='fulfilled') setCertificates(c.value.data);
      setLoading(false);
    })();
  },[]);

  // Actions
  const handleRoleChange    = async(id,role)=>{try{await api.put(`/users/${id}/role`,{role});setUsers(p=>p.map(u=>u._id===id?{...u,role}:u));showToast('Role updated');}catch{showToast('Failed');}};
  const handleToggle        = async(id,isActive)=>{try{await api.put(`/users/${id}/toggle`);setUsers(p=>p.map(u=>u._id===id?{...u,isActive:!u.isActive}:u));showToast(`Account ${isActive?'deactivated':'activated'}`);}catch{showToast('Failed');}};
  const handleDeleteUser    = async id=>{try{await api.delete(`/users/${id}`);setUsers(p=>p.filter(u=>u._id!==id));showToast('User deleted');}catch{showToast('Failed');}};
  const handleApproveEvent  = async id=>{try{await api.put(`/events/${id}/approve`);setEvents(p=>p.map(e=>e._id===id?{...e,status:'approved'}:e));showToast('Event approved');}catch{showToast('Failed');}};
  const handleRejectEvent   = async(id,reason)=>{try{await api.put(`/events/${id}/reject`,{reason});setEvents(p=>p.map(e=>e._id===id?{...e,status:'rejected'}:e));showToast('Event rejected');}catch{showToast('Failed');}};
  const handleDeleteEvent   = async id=>{try{await api.delete(`/events/${id}`);setEvents(p=>p.filter(e=>e._id!==id));showToast('Event deleted');}catch{showToast('Failed');}};
  const handleApproveBudget = async id=>{try{await api.put(`/budgets/${id}/approve`);setBudgets(p=>p.map(b=>b._id===id?{...b,status:'approved'}:b));showToast('Budget approved');}catch{showToast('Failed');}};
  const handleRejectBudget  = async id=>{try{await api.put(`/budgets/${id}/reject`);setBudgets(p=>p.map(b=>b._id===id?{...b,status:'rejected'}:b));showToast('Budget rejected');}catch{showToast('Failed');}};
  const handleHide          = async id=>{try{await api.put(`/feedback/${id}/hide`);setFeedbacks(p=>p.map(f=>f._id===id?{...f,isHidden:true}:f));showToast('Feedback hidden');}catch{showToast('Failed');}};
  const handleUnhide        = async id=>{try{await api.put(`/feedback/${id}/unhide`);setFeedbacks(p=>p.map(f=>f._id===id?{...f,isHidden:false,isFlagged:false}:f));showToast('Feedback restored');}catch{showToast('Failed');}};

  const pendingEvents   = events.filter(e=>e.status==='pending').length;
  const pendingBudgets  = budgets.filter(b=>b.status==='submitted').length;
  const flaggedFeedback = feedbacks.filter(f=>f.isFlagged&&!f.isHidden).length;

  const navItems = [
    {key:'overview',     label:'Overview',      icon:IC.dashboard, badge:null},
    {key:'users',        label:'Users',         icon:IC.users,     badge:null},
    {key:'events',       label:'Events',        icon:IC.events,    badge:pendingEvents||null},
    {key:'finance',      label:'Finance',       icon:IC.finance,   badge:pendingBudgets||null},
    {key:'feedback',     label:'Feedback',      icon:IC.feedback,  badge:flaggedFeedback||null},
    {key:'certificates', label:'Certificates',  icon:IC.cert,      badge:null},
  ];

  const tabTitles = {overview:'Dashboard Overview',users:'User Management',events:'Event Management',finance:'Budget & Finance',feedback:'Feedback Moderation',certificates:'Certificates'};

  const SidebarInner = () => (
    <>
      <div className="flex items-center gap-2.5 mb-8">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-black text-white text-sm">S</div>
        <div>
          <div className="text-white text-sm font-bold leading-none">SLIIT EMS</div>
          <div className="text-red-400/60 text-xs">Admin Panel</div>
        </div>
      </div>
      <nav className="flex-1 space-y-0.5">
        {navItems.map(({key,label,icon,badge})=>(
          <button key={key} onClick={()=>{setTab(key);setMobileSidebar(false);}}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${tab===key?'bg-indigo-600/20 text-indigo-300 border border-indigo-500/20':'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'}`}>
            <div className="flex items-center gap-3"><Icon d={icon} className="w-4 h-4"/>{label}</div>
            {badge?<span className="bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{badge}</span>:null}
          </button>
        ))}
      </nav>
      <div className="border-t border-white/[0.06] pt-4 mt-4">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-300 text-xs font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white/80 text-xs font-medium truncate">{user?.name}</div>
            <div className="text-red-400/50 text-xs">Administrator</div>
          </div>
        </div>
        <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-400/60 hover:text-red-400 hover:bg-red-500/10 text-sm transition-all">
          <Icon d={IC.logout} className="w-4 h-4"/>Sign out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#060810] flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 flex-col bg-[#0a0c14] border-r border-white/[0.06] p-5 fixed h-full z-30">
        <SidebarInner/>
      </aside>

      {/* Mobile sidebar */}
      {mobileSidebar && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/60" onClick={()=>setMobileSidebar(false)}/>
          <div className="relative w-56 bg-[#0a0c14] border-r border-white/[0.06] p-5 flex flex-col h-full">
            <SidebarInner/>
          </div>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 md:ml-56 flex flex-col min-h-screen">
        {/* Topbar */}
        <div className="sticky top-0 z-20 bg-[#060810]/90 backdrop-blur border-b border-white/[0.05] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={()=>setMobileSidebar(true)} className="md:hidden p-1.5 text-white/40 hover:text-white rounded-lg">
              <Icon d={IC.menu} className="w-5 h-5"/>
            </button>
            <div>
              <h1 className="text-white font-semibold">{tabTitles[tab]}</h1>
              <p className="text-white/25 text-xs hidden sm:block">SLIIT Unified Schedule & Event Management</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/30 bg-white/[0.03] border border-white/[0.06] px-3 py-1.5 rounded-lg">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"/>
            Online
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"/>
            </div>
          ) : (
            <>
              {tab==='overview'     && <OverviewTab users={users} events={events} budgets={budgets} feedbacks={feedbacks}/>}
              {tab==='users'        && <UsersTab users={users} onRoleChange={handleRoleChange} onToggle={handleToggle} onDelete={handleDeleteUser}/>}
              {tab==='events'       && <EventsTab events={events} onApprove={handleApproveEvent} onReject={handleRejectEvent} onDelete={handleDeleteEvent}/>}
              {tab==='finance'      && <FinanceTab budgets={budgets} onApproveBudget={handleApproveBudget} onRejectBudget={handleRejectBudget}/>}
              {tab==='feedback'     && <FeedbackTab feedbacks={feedbacks} onHide={handleHide} onUnhide={handleUnhide}/>}
              {tab==='certificates' && <CertificatesTab certificates={certificates}/>}
            </>
          )}
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#1a1d2e] border border-white/10 text-white/80 text-sm px-5 py-3 rounded-xl shadow-2xl z-50">
          {toast}
        </div>
      )}
    </div>
  );
}