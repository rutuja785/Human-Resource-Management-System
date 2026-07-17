import React, { useState } from 'react';
import { 
  GitMerge, 
  ChevronDown, 
  ChevronRight, 
  Users, 
  Layers, 
  User, 
  Network
} from 'lucide-react';
import { Employee } from '../../types';

interface OrgChartViewProps {
  employees: Employee[];
}

export default function OrgChartView({ employees }: OrgChartViewProps) {
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});

  const toggleCollapse = (id: string) => {
    setCollapsedNodes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Group employees by department hierarchy
  // VP/Engineering as Root
  const vp = employees.find(e => e.role.toLowerCase().includes('vp') || e.role.toLowerCase().includes('director'));
  const others = employees.filter(e => e.id !== (vp ? vp.id : ''));

  // Separate departments that reports to VP
  const departments = Array.from(new Set(others.map(e => e.department)));

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Enterprise Organization Tree</h2>
          <p className="text-xs text-slate-500">Visualize reporting structures, lines of command, and staff distributions dynamically</p>
        </div>
        <span className="text-xs font-mono text-purple-400 flex items-center gap-1">
          <Network className="w-4 h-4" />
          Live Interactive Chart
        </span>
      </div>

      {/* Visual Collapsible Tree Representation */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-sm dark:shadow-none min-h-[400px] overflow-x-auto flex flex-col items-center">
        
        {/* Core Hierarchy Container */}
        <div className="space-y-8 min-w-[320px] flex flex-col items-center">
          
          {/* Executive VP Root node */}
          {vp && (
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-gradient-to-tr from-purple-600 to-indigo-500 p-0.5 rounded-2xl shadow-xl shadow-purple-500/10">
                <div className="bg-white dark:bg-slate-950 px-5 py-4 rounded-2xl flex items-center gap-3 border border-slate-200 dark:border-slate-800/60 w-64 select-none">
                  <img src={vp.avatar} alt={vp.name} className="w-10 h-10 rounded-full object-cover border border-purple-500/40" />
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white">{vp.name}</h4>
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold block">{vp.role}</span>
                    <span className="text-[8px] text-slate-500 dark:text-slate-400 font-mono tracking-widest block uppercase mt-0.5">{vp.department}</span>
                  </div>
                </div>
              </div>

              {/* Connector line */}
              <div className="w-0.5 h-8 bg-slate-200 dark:bg-slate-800 relative">
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-purple-500" />
              </div>
            </div>
          )}

          {/* Department subdivisions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {departments.map((dept, i) => {
              const deptStaff = others.filter(e => e.department === dept);
              const isCollapsed = collapsedNodes[dept];

              return (
                <div key={dept} className="flex flex-col items-center space-y-4 relative">
                  
                  {/* Vertical branch header line */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-slate-200 dark:bg-slate-800" />

                  {/* Department Group Node */}
                  <div 
                    onClick={() => toggleCollapse(dept)}
                    className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 px-4 py-3 rounded-xl flex items-center justify-between gap-3 w-56 cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-md select-none"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-purple-100 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/30 flex items-center justify-center">
                        <Users className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-wider">{dept} ({deptStaff.length})</span>
                    </div>

                    {isCollapsed ? <ChevronRight className="w-3.5 h-3.5 text-slate-500" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
                  </div>

                  {/* Subdivision Children - Render if Expanded */}
                  {!isCollapsed && (
                    <div className="space-y-3 flex flex-col items-center pt-2">
                      <div className="w-0.5 h-3 bg-slate-200 dark:bg-slate-800" />
                      
                      {deptStaff.map(emp => (
                        <div 
                          key={emp.id}
                          className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/60 p-3 rounded-xl flex items-center gap-2.5 w-48 shadow-sm"
                        >
                          <img src={emp.avatar} alt={emp.name} className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700/50" />
                          <div>
                            <h5 className="text-[10px] font-bold text-slate-900 dark:text-white leading-normal">{emp.name}</h5>
                            <span className="text-[8px] text-slate-500 dark:text-slate-400 block truncate">{emp.role}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              );
            })}

          </div>

        </div>
      </div>

    </div>
  );
}
