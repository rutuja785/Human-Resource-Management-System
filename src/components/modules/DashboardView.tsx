import React from 'react';
import { 
  Users, 
  Calendar, 
  Briefcase, 
  Laptop, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Sparkles, 
  Plus, 
  FileText,
  Cake,
  Gift
} from 'lucide-react';
import { Employee, LeaveRequest, JobOpening, Asset } from '../../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface DashboardViewProps {
  employees: Employee[];
  leaveRequests: LeaveRequest[];
  jobOpenings: JobOpening[];
  assets: Asset[];
  currentUserName?: string;
  onNavigate: (tab: string) => void;
  onQuickCheckIn: () => void;
  isCheckedIn: boolean;
  checkInTime: string | null;
}

export default function DashboardView({
  employees,
  leaveRequests,
  jobOpenings,
  assets,
  currentUserName,
  onNavigate,
  onQuickCheckIn,
  isCheckedIn,
  checkInTime
}: DashboardViewProps) {
  
  // Calculate metric values
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === 'Active').length;
  const pendingLeaves = leaveRequests.filter(l => l.status === 'Pending').length;
  const activeJobs = jobOpenings.filter(j => j.status === 'Active').length;
  const assignedAssets = assets.filter(a => a.status === 'Assigned').length;

  // Prepare chart data for department distribution
  const deptMap: Record<string, number> = {};
  employees.forEach(e => {
    deptMap[e.department] = (deptMap[e.department] || 0) + 1;
  });
  const deptData = Object.keys(deptMap).map(name => ({
    name,
    value: deptMap[name]
  }));

  const COLORS = ['#4f46e5', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#64748b'];

  // Quick Action lists
  const quickActions = [
    { title: "New Employee", icon: Plus, tab: "employees", desc: "Add team member" },
    { title: "Apply Leave", icon: Calendar, tab: "leaves", desc: "Request leave" },
    { title: "Generate ID", icon: Sparkles, tab: "idcards", desc: "Create badge" },
    { title: "Recruitment (ATS)", icon: Briefcase, tab: "recruitment", desc: "Manage openings" }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Welcome Card with Live Attendance Status */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm transition-colors duration-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Hello, {currentUserName || 'Sarah Jenkins'} <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs mt-1">
            Welcome back. Daydrift is fully active. All security protocols and automated campaign schedules are verified online.
          </p>
        </div>

        {/* Attendance simulator */}
        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3">
          <div className="text-right">
            <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400 block font-semibold">Attendance Tracker</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {isCheckedIn ? `Checked In: ${checkInTime}` : "Currently Clocked Out"}
            </span>
          </div>
          <button
            onClick={onQuickCheckIn}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 ${
              isCheckedIn 
                ? 'bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/10'
            }`}
          >
            {isCheckedIn ? "Clock Out" : "Clock In Now"}
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Headcount", val: `${activeEmployees}/${totalEmployees}`, icon: Users, desc: "Active / Signed", color: "text-indigo-600 dark:text-indigo-400", bgIcon: "bg-indigo-50 dark:bg-indigo-950/50" },
          { label: "Pending Leaves", val: pendingLeaves, icon: Calendar, desc: "Awaiting approval", color: "text-amber-600 dark:text-amber-400", bgIcon: "bg-amber-50 dark:bg-amber-950/50", alert: pendingLeaves > 0 },
          { label: "Active Jobs", val: activeJobs, icon: Briefcase, desc: "Currently recruiting", color: "text-blue-600 dark:text-blue-400", bgIcon: "bg-blue-50 dark:bg-blue-950/50" },
          { label: "Assigned Assets", val: `${assignedAssets}/${assets.length}`, icon: Laptop, desc: "Laptops / monitors in use", color: "text-emerald-600 dark:text-emerald-400", bgIcon: "bg-emerald-50 dark:bg-emerald-950/50" }
        ].map((kpi, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl relative overflow-hidden shadow-sm transition-colors duration-200">
            {kpi.alert && (
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40 text-[9px] px-1.5 py-0.5 rounded-full font-semibold animate-pulse">
                <AlertCircle className="w-2.5 h-2.5" />
                Action Required
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{kpi.label}</span>
              <div className={`p-1.5 rounded-lg ${kpi.bgIcon}`}>
                <kpi.icon className={`w-3.5 h-3.5 ${kpi.color}`} />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono tracking-tight">{kpi.val}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">{kpi.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Split Charts & Upcoming Celebrations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Charts Container */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-sm flex flex-col justify-between transition-colors duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Headcount by Department</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Distribution of company staff members</p>
            </div>
            <span className="text-[10px] font-mono text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-900/30">Operational</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {deptData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff', 
                      borderColor: document.documentElement.classList.contains('dark') ? '#334155' : '#e2e8f0', 
                      borderRadius: '8px',
                      fontSize: '11px',
                      color: document.documentElement.classList.contains('dark') ? '#f8fafc' : '#0f172a'
                    }} 
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {deptData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-xs text-slate-500 dark:text-slate-400">No employee data to display</span>
            )}
          </div>
        </div>

        {/* Quick Announcements & Milestones */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-sm transition-colors duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Employee Celebrations</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Milestones in the next 15 days</p>
            </div>
            <Gift className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-pink-50 dark:bg-pink-950/20 border border-pink-100 dark:border-pink-900/20">
              <Cake className="w-4 h-4 text-pink-600 dark:text-pink-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">Elena Rostova</span>
                <span className="text-[10px] text-slate-600 dark:text-slate-400 block">Birthday is coming up on July 10th</span>
                <span className="text-[9px] font-semibold text-pink-700 dark:text-pink-400 bg-pink-100 dark:bg-pink-950/30 px-1.5 py-0.5 rounded border border-pink-200 dark:border-pink-900/30 inline-block mt-2">Personalized Email Scheduled</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/20">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">{currentUserName || 'Sarah Jenkins'}</span>
                <span className="text-[10px] text-slate-600 dark:text-slate-400 block">4 Year Work Anniversary on July 12th</span>
                <span className="text-[9px] font-semibold text-indigo-700 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950/30 px-1.5 py-0.5 rounded border border-indigo-200 dark:border-indigo-900/30 inline-block mt-2">Automated Card Ready</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Quick Access Menu Grid */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Quick Administrative Tools</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((act, i) => (
            <button
              key={i}
              onClick={() => onNavigate(act.tab)}
              className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex items-center gap-3 transition-colors text-left group active:scale-[0.98] shadow-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-center group-hover:border-indigo-200 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/30 transition-colors shrink-0">
                <act.icon className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{act.title}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{act.desc}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
