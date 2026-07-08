import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Mail, 
  Phone, 
  Calendar, 
  Briefcase, 
  IndianRupee, 
  X, 
  Edit2, 
  Trash2, 
  Check, 
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';
import { Employee } from '../../types';

interface EmployeesViewProps {
  employees: Employee[];
  onAddEmployee: (emp: Omit<Employee, 'id'>) => void;
  onUpdateEmployee: (emp: Employee) => void;
  onDeleteEmployee: (id: string) => void;
}

export default function EmployeesView({
  employees,
  onAddEmployee,
  onUpdateEmployee,
  onDeleteEmployee
}: EmployeesViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  
  // Modals / Form toggles
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [contact, setContact] = useState('');
  const [hireDate, setHireDate] = useState(new Date().toISOString().split('T')[0]);
  const [avatar, setAvatar] = useState('');
  const [basic, setBasic] = useState(5000);
  const [hra, setHra] = useState(2000);
  const [allowances, setAllowances] = useState(1000);
  const [deductions, setDeductions] = useState(500);

  // Unique departments for filter
  const departments = ['All', ...Array.from(new Set(employees.map(e => e.department)))];

  // Filtered employees
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          emp.role.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          emp.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const handleOpenAdd = () => {
    setName('');
    setEmail('');
    setRole('');
    setDepartment('Engineering');
    setContact('');
    setHireDate(new Date().toISOString().split('T')[0]);
    setAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face');
    setBasic(5000);
    setHra(2000);
    setAllowances(1000);
    setDeductions(500);
    setIsEditing(false);
    setShowAddForm(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setName(emp.name);
    setEmail(emp.email);
    setRole(emp.role);
    setDepartment(emp.department);
    setContact(emp.contact);
    setHireDate(emp.hireDate);
    setAvatar(emp.avatar);
    setBasic(emp.salary.basic);
    setHra(emp.salary.hra);
    setAllowances(emp.salary.allowances);
    setDeductions(emp.salary.deductions);
    setIsEditing(true);
    setShowAddForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      email,
      role,
      department,
      status: 'Active' as const,
      contact,
      hireDate,
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      salary: { basic, hra, allowances, deductions }
    };

    if (isEditing && selectedEmp) {
      onUpdateEmployee({
        ...payload,
        id: selectedEmp.id,
        status: selectedEmp.status
      });
      setSelectedEmp({
        ...payload,
        id: selectedEmp.id,
        status: selectedEmp.status
      });
    } else {
      onAddEmployee(payload);
    }
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      
      {/* If an employee is selected, render their full detail card */}
      {selectedEmp ? (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setSelectedEmp(null)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-950 flex items-center gap-1 text-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Directory</span>
            </button>
            <span className="text-slate-400 font-mono text-xs">/ {selectedEmp.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Basic Details */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl text-center space-y-4">
              <img 
                src={selectedEmp.avatar} 
                alt={selectedEmp.name} 
                className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-purple-500/25 shadow-lg"
              />
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedEmp.name}</h3>
                <span className="text-xs text-purple-400 font-medium font-mono block mt-0.5">{selectedEmp.id}</span>
                <span className="text-slate-500 text-xs font-semibold block mt-1">{selectedEmp.role}</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-mono mt-0.5">{selectedEmp.department}</span>
              </div>

              <div className="flex justify-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                  selectedEmp.status === 'Active' 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {selectedEmp.status}
                </span>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800/60 pt-4 text-left space-y-3">
                <div className="flex items-center gap-2 text-xs">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-300 truncate">{selectedEmp.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-300">{selectedEmp.contact}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-300">Hired on {selectedEmp.hireDate}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => handleOpenEdit(selectedEmp)}
                  className="flex-1 py-2 rounded-lg bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all flex items-center justify-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={() => {
                    if(confirm("Confirm deletion of employee record?")) {
                      onDeleteEmployee(selectedEmp.id);
                      setSelectedEmp(null);
                    }
                  }}
                  className="py-2 px-3 rounded-lg bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 text-red-400 transition-all text-xs flex items-center justify-center"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Column: Financial Structure & Analytics */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Salary Structure Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm dark:shadow-none">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/60 pb-4 mb-4">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <IndianRupee className="w-4 h-4 text-purple-400" />
                    Salary and Compensations Breakdown
                  </h4>
                  <span className="text-[10px] text-emerald-400 font-mono">Verified Base</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Basic Pay", val: selectedEmp.salary.basic },
                    { label: "House Rent Allowance (HRA)", val: selectedEmp.salary.hra },
                    { label: "Special Allowances", val: selectedEmp.salary.allowances },
                    { label: "Professional Deductions", val: selectedEmp.salary.deductions, isDeduction: true }
                  ].map((sal, idx) => (
                    <div key={idx} className="bg-slate-950/20 border border-slate-200 dark:border-slate-800/40 p-3 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block font-semibold">{sal.label}</span>
                        <span className={`text-base font-black font-mono tracking-tight ${sal.isDeduction ? 'text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                          {sal.isDeduction ? '-' : ''}₹{sal.val.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-purple-950/10 border border-purple-500/20 p-4 rounded-xl mt-6 flex justify-between items-center">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block">Net Take-Home Salary</span>
                    <span className="text-[10px] text-slate-500">Calculated sum after standard deductions</span>
                  </div>
                  <span className="text-2xl font-black font-mono text-purple-400">
                    ₹{(selectedEmp.salary.basic + selectedEmp.salary.hra + selectedEmp.salary.allowances - selectedEmp.salary.deductions).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Onboarding Checklist Status */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm dark:shadow-none">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800/60 mb-4">Onboarding Milestones</h4>
                <div className="space-y-3">
                  {[
                    { milestone: "Signed Employment Contract", done: true },
                    { milestone: "Provision Company Laptop & Gear", done: true },
                    { milestone: "HR Welcome Onboarding Sync", done: true },
                    { milestone: "Generate RFID Identity Card", done: true }
                  ].map((m, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 dark:text-slate-300">{m.milestone}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                        m.done 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                      }`}>
                        {m.done ? 'Completed' : 'Pending Action'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      ) : (
        /* Directory List View */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Employee Directory</h2>
              <p className="text-xs text-slate-500">Search and manage full-time, remote, and contract staff details</p>
            </div>
            
            <button 
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Employee</span>
            </button>
          </div>

          {/* Search, Filter controls */}
          <div className="flex flex-wrap gap-3 items-center bg-slate-50 dark:bg-slate-950/30 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input 
                type="text"
                placeholder="Search by name, role, or ID..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs rounded-lg py-2 pl-9 pr-4 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <div className="flex gap-1 overflow-x-auto">
                {departments.map(dept => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDept(dept)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                      selectedDept === dept 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Employee Grid/Directory Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEmployees.map(emp => (
              <div 
                key={emp.id}
                onClick={() => setSelectedEmp(emp)}
                className="bg-white dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl cursor-pointer hover:border-purple-500/50 dark:hover:border-slate-700 hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={emp.avatar} 
                      alt={emp.name} 
                      className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700/50 group-hover:border-purple-500 transition-colors"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">{emp.name}</h4>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">{emp.role}</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500">{emp.id}</span>
                </div>

                <div className="flex justify-between items-center mt-6 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-[10px]">
                  <span className="text-slate-400">{emp.department}</span>
                  <span className={`px-2 py-0.5 rounded-full font-semibold border ${
                    emp.status === 'Active' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {emp.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] transition-colors">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {isEditing ? "Modify Employee Record" : "Onboard New Employee"}
              </h3>
              <button 
                onClick={() => setShowAddForm(false)}
                className="p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-slate-400 font-semibold block">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={name} 
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-lg p-2.5 text-slate-900 dark:text-white outline-none focus:border-purple-500"
                    placeholder="Jane Doe"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-slate-400 font-semibold block">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-lg p-2.5 text-slate-900 dark:text-white outline-none focus:border-purple-500"
                    placeholder="jdoe@hrstudio.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-slate-400 font-semibold block">Designation Role</label>
                  <input 
                    type="text" 
                    required
                    value={role} 
                    onChange={e => setRole(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-lg p-2.5 text-slate-900 dark:text-white outline-none focus:border-purple-500"
                    placeholder="Senior Engineer"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-slate-400 font-semibold block">Department</label>
                  <select 
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-lg p-2.5 text-slate-900 dark:text-white outline-none focus:border-purple-500"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Product">Product</option>
                    <option value="Human Resources">Human Resources</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-slate-400 font-semibold block">Contact Number</label>
                  <input 
                    type="text" 
                    required
                    value={contact} 
                    onChange={e => setContact(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-lg p-2.5 text-slate-900 dark:text-white outline-none focus:border-purple-500"
                    placeholder="+1 (555) 012-3456"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-slate-400 font-semibold block">Hire Date</label>
                  <input 
                    type="date" 
                    required
                    value={hireDate} 
                    onChange={e => setHireDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-lg p-2.5 text-slate-900 dark:text-white outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono text-slate-400 font-semibold block">Profile Image URL</label>
                <input 
                  type="text" 
                  value={avatar} 
                  onChange={e => setAvatar(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-lg p-2.5 text-slate-900 dark:text-white outline-none focus:border-purple-500"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              {/* Salary Configuration Block */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5 text-purple-400" />
                  Configure Monthly Salary Bands (INR)
                </h4>
                
                <div className="grid grid-cols-4 gap-2">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-mono text-slate-500 block">Basic</label>
                    <input 
                      type="number" 
                      value={basic} 
                      onChange={e => setBasic(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-lg p-2 text-slate-900 dark:text-white outline-none focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-mono text-slate-500 block">HRA</label>
                    <input 
                      type="number" 
                      value={hra} 
                      onChange={e => setHra(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-lg p-2 text-slate-900 dark:text-white outline-none focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-mono text-slate-500 block">Allowances</label>
                    <input 
                      type="number" 
                      value={allowances} 
                      onChange={e => setAllowances(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-lg p-2 text-slate-900 dark:text-white outline-none focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-mono text-slate-500 block">Deductions</label>
                    <input 
                      type="number" 
                      value={deductions} 
                      onChange={e => setDeductions(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-lg p-2 text-slate-900 dark:text-white outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-2.5 rounded-lg bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition-all shadow-md shadow-purple-500/10"
                >
                  {isEditing ? "Save Changes" : "Confirm Onboard"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
