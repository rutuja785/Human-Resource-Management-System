import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Layers, 
  BarChart2, 
  Users, 
  Calendar, 
  CreditCard, 
  FolderLock, 
  Sparkles, 
  Briefcase, 
  Award, 
  Laptop, 
  Network, 
  Mail, 
  Bot, 
  Search, 
  Bell, 
  X, 
  LogOut,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';

import LandingPage from './components/LandingPage';
import DashboardView from './components/modules/DashboardView';
import EmployeesView from './components/modules/EmployeesView';
import LeavesView from './components/modules/LeavesView';
import PayrollView from './components/modules/PayrollView';
import DocsView from './components/modules/DocsView';
import IDCardView from './components/IDCardView';
import RecruitmentView from './components/modules/RecruitmentView';
import PerformanceView from './components/modules/PerformanceView';
import AssetsView from './components/modules/AssetsView';
import OrgChartView from './components/modules/OrgChartView';
import EmailHubView from './components/modules/EmailHubView';

import { 
  initialEmployees, 
  initialLeaveRequests, 
  initialAttendanceLogs, 
  initialDocuments, 
  initialJobOpenings, 
  initialCandidates, 
  initialAssets, 
  initialAppraisals, 
  initialNotifications, 
  initialEmailCampaigns 
} from './data';

import { Employee, LeaveRequest, AttendanceLog, EmployeeDocument, JobOpening, Candidate, Asset, Appraisal, HRNotification, EmailLog } from './types';

type TabType = 
  | 'dashboard' 
  | 'employees' 
  | 'leaves' 
  | 'payroll' 
  | 'documents' 
  | 'idcard' 
  | 'recruitment' 
  | 'performance' 
  | 'assets' 
  | 'orgchart' 
  | 'emailhub';

export default function App() {
  const [viewMode, setViewMode] = useState<'landing' | 'app'>('landing');
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('daydrift-theme');
      return (saved === 'dark' || saved === 'light') ? saved : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('daydrift-theme', theme);
  }, [theme]);

  // Shared application states
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);

  // Dynamically derive currentUser from the employee directory (EMP-101 is Sarah Jenkins)
  const currentUser = employees.find(e => e.id === 'EMP-101') || {
    id: 'EMP-101',
    name: 'Sarah Jenkins',
    email: 'sjenkins@daydrift.co',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    role: 'VP of Engineering',
    status: 'Active' as const,
    department: 'Engineering',
    contact: '+1 (555) 019-2834',
    hireDate: '2022-04-12',
    salary: { basic: 8500, hra: 3400, allowances: 2100, deductions: 1200 }
  };
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests);
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>(initialAttendanceLogs);
  const [documents, setDocuments] = useState<EmployeeDocument[]>(initialDocuments);
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>(initialJobOpenings);
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [appraisals, setAppraisals] = useState<Appraisal[]>(initialAppraisals);
  const [notifications, setNotifications] = useState<HRNotification[]>(initialNotifications);
  
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([
    {
      id: 'EML-001',
      employeeId: 'EMP-103',
      employeeName: 'Alisha Patel',
      recipientEmail: 'apatel@daydrift.co',
      campaignType: 'Payslip',
      subject: 'Payslip Released: June 2026',
      body: 'Hi Alisha, Your payslip for June 2026 has been successfully generated...',
      status: 'Sent',
      timestamp: '2026-07-04 10:00'
    }
  ]);

  const [globalSearch, setGlobalSearch] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  // Leave Handlers
  const handleApproveLeave = (id: string) => {
    setLeaveRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'Approved' } : req));
    // Automatically add present log if approved
    const target = leaveRequests.find(r => r.id === id);
    if (target) {
      // Send a compliance notification
      const newNtf: HRNotification = {
        id: `NTF-${Math.random().toString()}`,
        title: 'Leave Approved',
        message: `Leave request for ${target.employeeName} has been approved.`,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'leave',
        read: false
      };
      setNotifications(prev => [newNtf, ...prev]);
    }
  };

  const handleRejectLeave = (id: string) => {
    setLeaveRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'Rejected' } : req));
  };

  const handleApplyLeave = (newReq: Omit<LeaveRequest, 'id'>) => {
    const id = `LRV-${Math.floor(Math.random() * 900) + 100}`;
    setLeaveRequests(prev => [{ ...newReq, id }, ...prev]);
    
    // Add pending notification
    const newNtf: HRNotification = {
      id: `NTF-${Math.random().toString()}`,
      title: 'New Leave Applied',
      message: `${newReq.employeeName} submitted a ${newReq.leaveType} request.`,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'leave',
      read: false
    };
    setNotifications(prev => [newNtf, ...prev]);
  };

  // Document Handlers
  const handleAddDocument = (newDoc: Omit<EmployeeDocument, 'id'>) => {
    const id = `DOC-${Math.floor(Math.random() * 900) + 100}`;
    setDocuments(prev => [{ ...newDoc, id }, ...prev]);
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  // Recruitment Handlers
  const handleAddJobOpening = (newJob: Omit<JobOpening, 'id' | 'applicantsCount'>) => {
    const id = `JOB-${Math.floor(Math.random() * 900) + 100}`;
    setJobOpenings(prev => [...prev, { ...newJob, id, applicantsCount: 0 }]);
  };

  const handleAddCandidate = (newCand: Omit<Candidate, 'id' | 'appliedDate'>) => {
    const id = `CND-${Math.floor(Math.random() * 900) + 100}`;
    setCandidates(prev => [...prev, { ...newCand, id, appliedDate: new Date().toISOString().split('T')[0] }]);
  };

  const handleUpdateCandidateStage = (id: string, stage: Candidate['stage']) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, stage } : c));
  };

  const handleEvaluateCandidateAI = (id: string, score: number, evalText: string) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, aiScore: score, aiEvaluation: evalText } : c));
  };

  // Performance Handlers
  const handleAddAppraisal = (newApp: Omit<Appraisal, 'id' | 'date'>) => {
    const id = `APP-${Math.floor(Math.random() * 900) + 100}`;
    setAppraisals(prev => [{ ...newApp, id, date: new Date().toISOString().split('T')[0] }, ...prev]);
  };

  const handleApproveAppraisal = (id: string) => {
    setAppraisals(prev => prev.map(a => a.id === id ? { ...a, status: 'Approved' } : a));
  };

  // Asset Handlers
  const handleAddAsset = (newAsset: Omit<Asset, 'id'>) => {
    const id = `AST-${Math.floor(Math.random() * 900) + 100}`;
    setAssets(prev => [...prev, { ...newAsset, id }]);
  };

  const handleUpdateAssetStatus = (id: string, status: Asset['status'], assignedToId?: string) => {
    let assignedToName: string | undefined = undefined;
    if (assignedToId) {
      const emp = employees.find(e => e.id === assignedToId);
      if (emp) assignedToName = emp.name;
    }

    setAssets(prev => prev.map(a => a.id === id ? { 
      ...a, 
      status, 
      assignedToId: assignedToId || undefined, 
      assignedToName: assignedToName || undefined 
    } : a));
  };

  const handleDeleteAsset = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  };

  // Email Handlers
  const handleTriggerEmailCampaign = async (campaign: Omit<EmailLog, 'id' | 'timestamp'>) => {
    const id = `EML-${Math.floor(Math.random() * 900) + 100}`;
    const timestamp = new Date().toLocaleString([], { hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit' });
    
    // Create local log
    const tempLog: EmailLog = { ...campaign, id, timestamp, status: 'Sent' };
    setEmailLogs(prev => [tempLog, ...prev]);

    try {
      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignType: campaign.campaignType,
          employeeName: campaign.employeeName,
          recipientEmail: campaign.recipientEmail,
          subject: campaign.subject,
          body: campaign.body
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setEmailLogs(prev => prev.map(log => log.id === id ? { 
          ...log, 
          status: data.mode === 'ethereal' || data.mode === 'smtp' ? 'Sent' : 'Simulated',
          previewUrl: data.previewUrl
        } : log));
        
        // Add success notification
        const newNtf: HRNotification = {
          id: `NTF-${Math.random().toString()}`,
          title: data.mode === 'ethereal' ? 'Free Auto-SMTP Delivered' : 'Email Campaign Dispatched',
          message: data.mode === 'ethereal' 
            ? `Successfully delivered via Ethereal SMTP! Click the 'View Delievered Inbox' link in the outbox to see it.`
            : `Campaign for ${campaign.employeeName} successfully processed.`,
          date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'general',
          read: false
        };
        setNotifications(prev => [newNtf, ...prev]);
      } else {
        // Simulated or warning from server
        const targetStatus = data.mode === 'smtp-failed' ? 'SMTP-Failed' : 'Failed';
        setEmailLogs(prev => prev.map(log => log.id === id ? { ...log, status: targetStatus } : log));

        const newNtf: HRNotification = {
          id: `NTF-${Math.random().toString()}`,
          title: 'Delivery Warning',
          message: data.message || 'The server declined the email request.',
          date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'general',
          read: false
        };
        setNotifications(prev => [newNtf, ...prev]);
      }
    } catch (error: any) {
      console.error("Email sending exception:", error);
      setEmailLogs(prev => prev.map(log => log.id === id ? { ...log, status: 'Failed' } : log));

      const newNtf: HRNotification = {
        id: `NTF-${Math.random().toString()}`,
        title: 'Connection Refused',
        message: `Failed to contact mail service: ${error.message}`,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'general',
        read: false
      };
      setNotifications(prev => [newNtf, ...prev]);
    }
  };

  const handleClearEmailLogs = () => {
    setEmailLogs([]);
  };

  // Employee CRUD handlers
  const handleAddEmployee = (newEmp: Omit<Employee, 'id'>) => {
    const id = `EMP-${Math.floor(Math.random() * 900) + 100}`;
    setEmployees(prev => [{ ...newEmp, id }, ...prev]);
  };

  const handleEditEmployee = (id: string, updatedFields: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...updatedFields } as Employee : e));
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  if (viewMode === 'landing') {
    return (
      <LandingPage 
        onEnterApp={() => setViewMode('app')} 
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      />
    );
  }

  // Sidebar Tabs Config
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
    { id: 'employees', label: 'Employee Directory', icon: Users },
    { id: 'leaves', label: 'Leaves & Attendance', icon: Calendar },
    { id: 'payroll', label: 'Payroll Operations', icon: CreditCard },
    { id: 'documents', label: 'Secure Documents', icon: FolderLock },
    { id: 'idcard', label: 'ID Badge Generator', icon: Sparkles },
    { id: 'recruitment', label: 'Recruitment (ATS)', icon: Briefcase },
    { id: 'assets', label: 'Hardware Assets', icon: Laptop },
    { id: 'emailhub', label: 'Email Dispatch Hub', icon: Mail },
  ] as const;

  const activeNotificationCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex relative transition-colors duration-200">
      
      {/* Dynamic Left Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-20' : 'w-64'} border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 flex flex-col justify-between h-screen sticky top-0 transition-all duration-300 ease-in-out z-30 overflow-hidden`}>
        
        <div className={`space-y-6 py-5 ${sidebarCollapsed ? 'px-2' : 'px-4'} overflow-y-auto`}>
          
          {/* Brand Identity Header */}
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
            <div className="flex items-center gap-2">
              <motion.div 
                whileHover={{ rotate: sidebarCollapsed ? 90 : 0, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm shadow-indigo-500/15 cursor-pointer shrink-0"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              >
                <Layers className="w-4 h-4 text-white" />
              </motion.div>
              {!sidebarCollapsed && (
                <>
                  <span className="font-semibold text-[15px] tracking-tight text-slate-900 dark:text-white">Daydrift</span>
                  <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-mono bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/30 px-1.5 py-0.5 rounded">v2.1</span>
                </>
              )}
            </div>

            {!sidebarCollapsed && (
              <div className="flex items-center gap-0.5">
                <button 
                  onClick={() => setSidebarCollapsed(true)}
                  className="p-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                  title="Collapse Sidebar"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => setViewMode('landing')}
                  className="p-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                  title="Return to Welcome Screen"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Quick Find Bar */}
          <div className={`relative ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
            {sidebarCollapsed ? (
              <button 
                onClick={() => {
                  setSidebarCollapsed(false);
                  setTimeout(() => {
                    const el = document.getElementById('sidebar-search-input');
                    if (el) el.focus();
                  }, 150);
                }}
                className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                title="Search Employees"
              >
                <Search className="w-4 h-4" />
              </button>
            ) : (
              <>
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <input
                  id="sidebar-search-input"
                  type="text"
                  placeholder="Quick search staff..."
                  value={globalSearch}
                  onChange={e => {
                    setGlobalSearch(e.target.value);
                    if (activeTab !== 'employees') setActiveTab('employees');
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg py-1.5 pl-8 pr-3 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </>
            )}
          </div>

          {/* Sidebar Nav Items */}
          <nav className="space-y-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setGlobalSearch('');
                  }}
                  title={sidebarCollapsed ? tab.label : undefined}
                  className={`w-full rounded-md text-xs font-semibold flex items-center transition-all ${
                    sidebarCollapsed 
                      ? 'justify-center p-2.5 hover:scale-105' 
                      : 'px-3 py-2 gap-2.5 text-left'
                  } ${
                    isActive 
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 font-bold border-l-2 border-indigo-600 dark:border-indigo-400' + (sidebarCollapsed ? '' : ' pl-2.5')
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-indigo-700 dark:hover:text-indigo-400 border-l-2 border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                  {!sidebarCollapsed && <span>{tab.label}</span>}
                </button>
              );
            })}
          </nav>

        </div>

        {/* Dynamic Logged-in Person Profile Footer - Fixed Position */}
        <div className={`p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center transition-colors duration-200 sticky bottom-0 z-10 shrink-0 ${
          sidebarCollapsed ? 'justify-center' : 'justify-between'
        }`}>
          <div className="flex items-center gap-2 min-w-0">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-8 h-8 rounded-full object-cover border-2 border-indigo-100 dark:border-indigo-900 shrink-0"
              title={sidebarCollapsed ? `${currentUser.name} (${currentUser.role})` : undefined}
            />
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-slate-900 dark:text-slate-200 block truncate">{currentUser.name}</span>
                <span className="text-[9px] text-slate-600 dark:text-slate-400 font-mono block truncate">{currentUser.email}</span>
              </div>
            )}
          </div>
          {!sidebarCollapsed && (
            <span className="text-[9px] font-bold font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/40 px-1.5 py-0.5 rounded shrink-0">
              {currentUser.role === 'VP of Engineering' ? 'VP' : currentUser.role.substring(0, 3).toUpperCase()}
            </span>
          )}
        </div>

      </aside>

      {/* Main Panel Content Area */}
      <main className="flex-1 min-w-0 flex flex-col">
        
        {/* Top bar */}
        <header className="h-16 px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center sticky top-0 z-40 print:hidden transition-colors duration-200">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
              title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`} />
            </button>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Enterprise Dashboard</span>
              <span className="text-xs text-slate-300 dark:text-slate-700">/</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">{activeTab}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            
            {/* Theme Toggle Button */}
            <button 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            
            {/* Notification alert bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-all relative"
              >
                <Bell className="w-4 h-4" />
                {activeNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                )}
              </button>

              {/* Notification overlay dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-4 space-y-3 z-50">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">HR Notifications</span>
                    <button 
                      onClick={handleClearNotifications}
                      className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                    >
                      Clear all
                    </button>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {notifications.map(n => (
                      <div 
                        key={n.id} 
                        onClick={() => handleMarkNotificationRead(n.id)}
                        className={`p-2.5 rounded-lg border text-[10px] transition-all cursor-pointer ${
                          n.read 
                            ? 'bg-transparent border-transparent text-slate-400 dark:text-slate-500' 
                            : 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/30 text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        <div className="flex justify-between font-bold">
                          <span>{n.title}</span>
                          <span className="font-mono text-[8px] text-slate-400 dark:text-slate-500">{n.date}</span>
                        </div>
                        <p className="mt-0.5 text-slate-500 dark:text-slate-400 font-medium leading-normal">{n.message}</p>
                      </div>
                    ))}

                    {notifications.length === 0 && (
                      <div className="text-center py-6 text-[10px] text-slate-400 dark:text-slate-500 italic">
                        No active system alerts
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
            
            {/* Live UTC Clock & Date widget */}
            <div className="text-right hidden sm:block">
              <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500">2026-07-05 UTC</span>
              <span className="text-[9px] text-indigo-600 dark:text-indigo-400 block font-bold tracking-wider">SECURE LINK</span>
            </div>
          </div>
        </header>

        {/* Dynamic Inner Body */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {activeTab === 'dashboard' && (
            <DashboardView 
              employees={employees}
              leaveRequests={leaveRequests}
              jobOpenings={jobOpenings}
              assets={assets}
              currentUserName={currentUser.name}
              onNavigate={(tab: any) => {
                if (tab === 'idcards') setActiveTab('idcard');
                else setActiveTab(tab);
              }}
              onQuickCheckIn={() => {
                const isClockedIn = attendanceLogs.some(log => log.employeeId === currentUser.id && !log.checkOut);
                if (isClockedIn) {
                  setAttendanceLogs(prev => prev.map(log => 
                    log.employeeId === currentUser.id && !log.checkOut 
                      ? { ...log, checkOut: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } 
                      : log
                  ));
                } else {
                  const newLog: AttendanceLog = {
                    id: `ATT-${Math.floor(Math.random() * 900) + 100}`,
                    employeeId: currentUser.id,
                    employeeName: currentUser.name,
                    date: new Date().toISOString().split('T')[0],
                    checkIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    checkOut: null,
                    status: 'Present'
                  };
                  setAttendanceLogs(prev => [newLog, ...prev]);
                }
              }}
              isCheckedIn={attendanceLogs.some(log => log.employeeId === currentUser.id && !log.checkOut)}
              checkInTime={attendanceLogs.find(log => log.employeeId === currentUser.id && !log.checkOut)?.checkIn || null}
            />
          )}

          {activeTab === 'employees' && (
            <EmployeesView 
              employees={employees}
              onAddEmployee={handleAddEmployee}
              onUpdateEmployee={(emp) => handleEditEmployee(emp.id, emp)}
              onDeleteEmployee={handleDeleteEmployee}
            />
          )}

          {activeTab === 'leaves' && (
            <LeavesView 
              leaveRequests={leaveRequests}
              attendanceLogs={attendanceLogs}
              employees={employees}
              onApproveLeave={handleApproveLeave}
              onRejectLeave={handleRejectLeave}
              onApplyLeave={handleApplyLeave}
            />
          )}

          {activeTab === 'payroll' && (
            <PayrollView employees={employees} />
          )}

          {activeTab === 'documents' && (
            <DocsView 
              employees={employees}
              documents={documents}
              onAddDocument={handleAddDocument}
              onDeleteDocument={handleDeleteDocument}
            />
          )}

          {activeTab === 'idcard' && (
            <IDCardView employees={employees} />
          )}

          {activeTab === 'recruitment' && (
            <RecruitmentView 
              jobOpenings={jobOpenings}
              candidates={candidates}
              onAddJobOpening={handleAddJobOpening}
              onAddCandidate={handleAddCandidate}
              onUpdateCandidateStage={handleUpdateCandidateStage}
              onEvaluateCandidateAI={handleEvaluateCandidateAI}
            />
          )}

          {activeTab === 'performance' && (
            <PerformanceView 
              appraisals={appraisals}
              employees={employees}
              currentUserName={currentUser.name}
              onAddAppraisal={handleAddAppraisal}
              onApproveAppraisal={handleApproveAppraisal}
            />
          )}

          {activeTab === 'assets' && (
            <AssetsView 
              assets={assets}
              employees={employees}
              onAddAsset={handleAddAsset}
              onUpdateAssetStatus={handleUpdateAssetStatus}
              onDeleteAsset={handleDeleteAsset}
            />
          )}

          {activeTab === 'orgchart' && (
            <OrgChartView employees={employees} />
          )}

          {activeTab === 'emailhub' && (
            <EmailHubView 
              employees={employees}
              emailLogs={emailLogs}
              onTriggerEmailCampaign={handleTriggerEmailCampaign}
              onClearLogs={handleClearEmailLogs}
            />
          )}
            </motion.div>
          </AnimatePresence>
        </div>

      </main>

    </div>
  );
}
