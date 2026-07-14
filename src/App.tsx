import { useState, useEffect } from "react";
import { Employee } from "./types";
import { INITIAL_EMPLOYEES } from "./data/templates";
import { isBirthdayToday } from "./utils";
import EmployeeCard from "./components/EmployeeCard";
import CSVImporter from "./components/CSVImporter";
import AddEmployeeForm from "./components/AddEmployeeForm";
import EmailDrafterModal from "./components/EmailDrafterModal";
import IDCardGenerator from "./components/IDCardGenerator";
import DocumentGenerator from "./components/DocumentGenerator";
import { 
  Users, 
  Upload, 
  UserPlus, 
  FileText, 
  CreditCard, 
  Cake, 
  Search, 
  Filter, 
  Mail, 
  Calendar,
  Sparkles,
  Info,
  Sun,
  Moon
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

// Mock date to July 13th, 2026 to align with system metadata
const METADATA_DATE = "2026-07-13";

export default function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");

  // Active view states
  const [activeModal, setActiveModal] = useState<"csv" | "add" | "mail" | "badge" | "doc" | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Theme states
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = (localStorage.getItem("hr_studio_theme") as "light" | "dark") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    localStorage.setItem("hr_studio_theme", nextTheme);
  };

  // Sync to local storage without dummy data
  useEffect(() => {
    // Clear legacy storage with dummy data if present
    localStorage.removeItem("hr_studio_employees");
    
    const saved = localStorage.getItem("hr_studio_employees_v2");
    if (saved) {
      try {
        setEmployees(JSON.parse(saved));
      } catch (e) {
        setEmployees([]);
      }
    } else {
      setEmployees([]);
      localStorage.setItem("hr_studio_employees_v2", JSON.stringify([]));
    }
  }, []);

  const saveEmployees = (updated: Employee[]) => {
    setEmployees(updated);
    localStorage.setItem("hr_studio_employees_v2", JSON.stringify(updated));
  };

  const handleAddEmployee = (emp: Employee) => {
    const updated = [emp, ...employees];
    saveEmployees(updated);
    setActiveModal(null);
  };

  const handleCSVImport = (imported: Employee[]) => {
    const updated = [...imported, ...employees];
    saveEmployees(updated);
    setActiveModal(null);
  };

  const handleDeleteEmployee = (id: string) => {
    if (confirm("Are you sure you want to delete this employee record? This cannot be undone.")) {
      const updated = employees.filter((e) => e.id !== id);
      saveEmployees(updated);
    }
  };

  // Find who has a birthday today!
  const birthdayPeople = employees.filter((emp) => isBirthdayToday(emp.birthDate, METADATA_DATE));

  // Departments list for filtering
  const departments = ["All", ...Array.from(new Set(employees.map((e) => e.department)))];

  // Filtered employees list
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDept = selectedDept === "All" || emp.department === selectedDept;

    return matchesSearch && matchesDept;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 antialiased font-sans pb-16 transition-colors duration-300">
      
      {/* Dynamic Upper Accent Bar */}
      <div className="h-1.5 w-full bg-linear-to-r from-sky-500 via-indigo-500 to-emerald-500" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Navigation & Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between py-6 border-b border-slate-200/60 dark:border-slate-800/60 mb-6 gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-md shadow-indigo-100 dark:shadow-none">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  HR Studio
                </h1>
                <span className="text-[10px] font-extrabold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-900 uppercase tracking-widest">
                  PRO PORTAL
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Workforce logistics, digital badge prints, and customized HR document drafting.
              </p>
            </div>
          </div>

          {/* Header Controls */}
          <div className="flex flex-wrap items-center gap-3 self-start md:self-center">
            {/* Current Date widget */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 flex items-center gap-3 shadow-xs">
              <div className="p-2 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-none">
                  Workspace Date
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap mt-0.5 block">
                  July 13, 2026
                </span>
              </div>
            </div>

            {/* Theme switch button */}
            <button
              onClick={toggleTheme}
              className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs hover:shadow-md hover:bg-slate-50 dark:hover:bg-slate-800/80 transition text-slate-600 dark:text-slate-300 cursor-pointer flex items-center justify-center shrink-0"
              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              {theme === "light" ? <Moon className="w-5 h-5 text-indigo-500" /> : <Sun className="w-5 h-5 text-amber-500" />}
            </button>
          </div>
        </header>

        {/* Birthday Alarm Section - "Get a small notification on their birthdays" */}
        {birthdayPeople.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-linear-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 border border-amber-200/60 dark:border-amber-900/40 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
          >
            <div className="flex items-start md:items-center gap-3.5">
              <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-md shrink-0">
                <Cake className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                  Today is Birthday Celebration! 🎂
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                  The studio has detected that {birthdayPeople.map((b) => b.name).join(" & ")} {birthdayPeople.length === 1 ? "is" : "are"} celebrating a birthday today! Use our smart mail tool to draft a gorgeous template.
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                id="btn-trigger-bday-draft-direct"
                onClick={() => {
                  setSelectedEmployee(birthdayPeople[0]);
                  setActiveModal("mail");
                }}
                className="px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white rounded-xl transition flex items-center gap-1.5 shadow-sm shadow-amber-200/50 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                Draft Birthday Email
              </button>
            </div>
          </motion.div>
        )}

        {/* Dashboard Actions Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-8">
          
          {/* Main search and filters */}
          <div className="md:col-span-6 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, role, email..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500 transition"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Filter className="text-slate-400 w-4 h-4" />
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="py-2 pl-3 pr-8 border border-slate-200 dark:border-slate-800 rounded-xl text-sm bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500 transition font-medium"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Trigger Buttons */}
          <div className="md:col-span-6 flex flex-wrap gap-3">
            <button
              id="btn-modal-add-employee"
              onClick={() => setActiveModal("add")}
              className="flex-1 py-3 px-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-xs cursor-pointer select-none"
            >
              <UserPlus className="w-4 h-4 text-sky-500" />
              Add Employee
            </button>

            <button
              id="btn-modal-import-csv"
              onClick={() => setActiveModal("csv")}
              className="flex-1 py-3 px-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-xs cursor-pointer select-none"
            >
              <Upload className="w-4 h-4 text-indigo-500" />
              Upload CSV
            </button>

            <button
              id="btn-modal-document-studio"
              onClick={() => {
                setSelectedEmployee(null);
                setActiveModal("doc");
              }}
              className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-sm shadow-emerald-200 dark:shadow-none cursor-pointer select-none"
            >
              <FileText className="w-4 h-4" />
              Document Studio
            </button>
          </div>

        </div>

        {/* Modal overlays containers */}
        <AnimatePresence>
          {activeModal === "add" && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xl my-8"
              >
                <AddEmployeeForm
                  onAdd={handleAddEmployee}
                  onCancel={() => setActiveModal(null)}
                />
              </motion.div>
            </div>
          )}

          {activeModal === "csv" && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xl my-8"
              >
                <CSVImporter
                  onImportComplete={handleCSVImport}
                  onCancel={() => setActiveModal(null)}
                />
              </motion.div>
            </div>
          )}

          {activeModal === "mail" && selectedEmployee && (
            <EmailDrafterModal
              employee={selectedEmployee}
              onClose={() => {
                setActiveModal(null);
                setSelectedEmployee(null);
              }}
            />
          )}

          {activeModal === "badge" && selectedEmployee && (
            <IDCardGenerator
              employee={selectedEmployee}
              onClose={() => {
                setActiveModal(null);
                setSelectedEmployee(null);
              }}
            />
          )}

          {activeModal === "doc" && (
            <DocumentGenerator
              employees={employees}
              selectedEmployee={selectedEmployee}
              onClose={() => {
                setActiveModal(null);
                setSelectedEmployee(null);
              }}
            />
          )}
        </AnimatePresence>

        {/* Main Workspace grid */}
        <main>
          {filteredEmployees.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-12 text-center shadow-xs">
              <Users className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
              <h3 className="font-bold text-slate-700 dark:text-slate-200 text-lg">No employee records found</h3>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 max-w-md mx-auto">
                {employees.length === 0 
                  ? "Your workforce is empty. Upload a CSV file or add an employee manually to populate the cards!"
                  : "We couldn't find any team members matching your search/department filters."}
              </p>
              <div className="mt-6 flex justify-center gap-3">
                {employees.length === 0 ? (
                  <>
                    <button
                      onClick={() => setActiveModal("csv")}
                      className="px-4 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition shadow-sm cursor-pointer"
                    >
                      Upload Sample CSV
                    </button>
                    <button
                      onClick={() => setActiveModal("add")}
                      className="px-4 py-2 text-sm font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition cursor-pointer"
                    >
                      Add Manually
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedDept("All");
                    }}
                    className="px-4 py-2 text-sm font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition cursor-pointer"
                  >
                    Clear Search Filters
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div>
              {/* Grid Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 px-1 gap-1 select-none">
                <span className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Active Workforce ({filteredEmployees.length} of {employees.length})
                </span>
                {/*<span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                  💡 Tip: Hover over cards to access digital ID badge print tools & custom contract drafting.
                </span>*/}
              </div>

              {/* Dynamic responsive grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEmployees.map((emp) => (
                  <EmployeeCard
                    key={emp.id}
                    employee={emp}
                    currentDate={METADATA_DATE}
                    onSelectForDoc={(e) => {
                      setSelectedEmployee(e);
                      setActiveModal("doc");
                    }}
                    onSelectForID={(e) => {
                      setSelectedEmployee(e);
                      setActiveModal("badge");
                    }}
                    onSelectForMail={(e) => {
                      setSelectedEmployee(e);
                      setActiveModal("mail");
                    }}
                    onDelete={handleDeleteEmployee}
                  />
                ))}
              </div>
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
