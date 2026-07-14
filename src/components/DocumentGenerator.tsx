import React, { useState, useEffect } from "react";
import { Employee, HRDocument, DocTemplate } from "../types";
import { PREMADE_TEMPLATES } from "../data/templates";
import {
  FileText,
  Sparkles,
  User,
  Settings,
  X,
  Copy,
  Download,
  Check,
  Edit3,
  Eye,
  Loader2,
  Printer,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

interface DocumentGeneratorProps {
  employees: Employee[];
  selectedEmployee: Employee | null;
  onClose: () => void;
}

export default function DocumentGenerator({
  employees,
  selectedEmployee,
  onClose,
}: DocumentGeneratorProps) {
  const [activeTab, setActiveTab] = useState<"templates" | "editor">("templates");
  const [selectedTemplate, setSelectedTemplate] = useState<DocTemplate>(PREMADE_TEMPLATES[0]);
  const [targetEmployee, setTargetEmployee] = useState<Employee | null>(selectedEmployee || null);
  
  // Custom description prompts
  const [customPrompt, setCustomPrompt] = useState("");
  const [userNotes, setUserNotes] = useState("");

  // Document draft content
  const [documentContent, setDocumentContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  
  const [editMode, setEditMode] = useState(true); // Edit text vs Render markdown preview
  const [copied, setCopied] = useState(false);

  // Sync state if selectedEmployee prop changes
  useEffect(() => {
    if (selectedEmployee) {
      setTargetEmployee(selectedEmployee);
    }
  }, [selectedEmployee]);

  // Load default template content when selection changes
  useEffect(() => {
    if (selectedTemplate) {
      setDocumentContent(bindMockPlaceholders(selectedTemplate.placeholderText, targetEmployee));
    }
  }, [selectedTemplate, targetEmployee]);

  // Quick parser to replace base tags inside our static previewer
  function bindMockPlaceholders(text: string, emp: Employee | null): string {
    if (!text) return "";
    let res = text;
    const todayStr = new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
    const monthStr = new Date().toLocaleString("default", { month: "long" });
    const yearStr = new Date().getFullYear().toString();
    const dayStr = new Date().getDate().toString();

    res = res.replace(/\[Current Date\]|\[Date\]/g, todayStr);
    res = res.replace(/\[Month\]/g, monthStr);
    res = res.replace(/\[Year\]/g, yearStr);
    res = res.replace(/\[Day\]/g, dayStr);

    if (emp) {
      res = res.replace(/\[Employee Name\]/g, emp.name);
      res = res.replace(/\[Job Title\]/g, emp.role);
      res = res.replace(/\[Department\]/g, emp.department);
      res = res.replace(/\[Salary\]/g, emp.salary || "$85,000");
      res = res.replace(/\[Start Date\]|\[Effective Date\]/g, emp.joinDate);
      res = res.replace(/\[Brief Achievement Description\]/g, emp.notes || "outstanding team leadership and engineering standards");
    } else {
      res = res.replace(/\[Employee Name\]/g, "Jane Doe");
      res = res.replace(/\[Job Title\]/g, "Software Engineer");
      res = res.replace(/\[Department\]/g, "Engineering");
      res = res.replace(/\[Salary\]/g, "$90,000");
      res = res.replace(/\[Start Date\]|\[Effective Date\]/g, todayStr);
      res = res.replace(/\[Brief Achievement Description\]/g, "contributing to key architectural modules");
    }

    // Generic fallbacks
    res = res.replace(/\[Manager Name\]/g, "Sarah Jenkins");
    res = res.replace(/\[Acceptance Deadline\]/g, "one week from receipt");
    res = res.replace(/\[HR Representative Name\]/g, "Marcus Aurelius");
    res = res.replace(/\[Executive Sponsor\]|\[Executive Name\]/g, "Robert California");
    res = res.replace(/\[Location \/ Remote\]/g, "San Francisco HQ (Hybrid)");
    res = res.replace(/\[Year \/ Quarter\]/g, "2026 Q3");
    res = res.replace(/\[New Job Title\]/g, "Lead Developer");
    res = res.replace(/\[New Manager Name\]/g, "VP of Engineering");
    res = res.replace(/\[New Salary\]/g, "$150,000");

    return res;
  }

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    try {
      const response = await fetch("/api/generate-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          templateTitle: selectedTemplate.title,
          customPrompt,
          employee: targetEmployee,
          userNotes,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setDocumentContent(data.markdown);
        setActiveTab("editor");
        setEditMode(false); // view preview on success
      } else {
        throw new Error(data.error || "Failed to generate customized document");
      }
    } catch (err: any) {
      console.error(err);
      setGenerationError(err.message || "An error occurred during customized generation.");
      // Fallback with visual feedback
      const localResult = bindMockPlaceholders(selectedTemplate.placeholderText, targetEmployee);
      setDocumentContent(localResult);
      setActiveTab("editor");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(documentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([documentContent], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${selectedTemplate.id}_${targetEmployee?.name.replace(/\s+/g, "_") || "doc"}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const printContent = document.getElementById("rendered-doc-preview");
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${selectedTemplate.title} - ${targetEmployee?.name || "Draft"}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              body { padding: 40px; font-family: Georgia, serif; line-height: 1.6; color: #1e293b; background-color: white; }
              h1 { font-size: 28px; font-weight: bold; margin-bottom: 24px; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; }
              h2 { font-size: 20px; font-weight: bold; margin-top: 24px; margin-bottom: 12px; }
              h3 { font-size: 16px; font-weight: bold; margin-top: 18px; margin-bottom: 8px; }
              p { margin-bottom: 16px; }
              ul { list-style-type: disc; padding-left: 24px; margin-bottom: 16px; }
              li { margin-bottom: 8px; }
              @media print {
                body { padding: 0; }
              }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() { window.close(); }, 500);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  // Quick markdown inline parser
  const renderDocumentMarkup = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      const trimmed = line.trim();
      
      // Headers
      if (trimmed.startsWith("# ")) {
        return <h1 key={i} className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4 mt-6 first:mt-0">{trimmed.slice(2)}</h1>;
      }
      if (trimmed.startsWith("## ")) {
        return <h2 key={i} className="text-xl font-bold text-slate-800 mt-5 mb-2">{trimmed.slice(3)}</h2>;
      }
      if (trimmed.startsWith("### ")) {
        return <h3 key={i} className="text-lg font-semibold text-slate-700 mt-4 mb-2">{trimmed.slice(4)}</h3>;
      }
      
      // Bullet lists
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        return (
          <ul key={i} className="list-disc pl-5 my-1.5 text-slate-600">
            <li>{trimmed.slice(2)}</li>
          </ul>
        );
      }

      // Dividers
      if (trimmed === "---") {
        return <hr key={i} className="my-6 border-slate-200" />;
      }

      // Blank lines
      if (!trimmed) {
        return <div key={i} className="h-3" />;
      }

      // Standard text with inline formatting
      return (
        <p key={i} className="text-slate-600 leading-relaxed text-sm my-1">
          {trimmed.split("**").map((part, idx) => {
            // odd indices are bold
            return idx % 2 === 1 ? <strong key={idx} className="font-bold text-slate-800">{part}</strong> : part;
          })}
        </p>
      );
    });
  };

  return (
    <div id="document-generator-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div id="document-generator-container" className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-6xl w-full flex flex-col my-4 overflow-hidden h-[90vh]">
        
        {/* Header Block */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-500 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">
                AI Document & Agreement Studio
              </h3>
              <p className="text-xs text-slate-500">
                Generate and edit customizable employment letters, certificates, and reviews instantly.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-100 bg-slate-50/20 shrink-0">
          <button
            onClick={() => setActiveTab("templates")}
            className={`flex-1 py-3 text-center text-sm font-semibold border-b-2 cursor-pointer transition select-none ${
              activeTab === "templates"
                ? "border-emerald-500 text-emerald-600 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50/50"
            }`}
          >
            1. Select Template & Describe Customizations
          </button>
          <button
            onClick={() => setActiveTab("editor")}
            className={`flex-1 py-3 text-center text-sm font-semibold border-b-2 cursor-pointer transition select-none ${
              activeTab === "editor"
                ? "border-emerald-500 text-emerald-600 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50/50"
            }`}
          >
            2. Edit & Preview Customized Document
          </button>
        </div>

        {/* Two Panels Layout */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* TAB 1: Selection & Input panel */}
          {activeTab === "templates" && (
            <>
              {/* Templates menu (Left side inside tab) */}
              <div className="lg:col-span-5 border-r border-slate-100 flex flex-col overflow-hidden h-full">
                <div className="p-4 bg-slate-50/30 border-b border-slate-100 shrink-0">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Choose Pre-made Base Template
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
                  {PREMADE_TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTemplate(t)}
                      className={`w-full p-3.5 rounded-xl border text-left transition cursor-pointer flex justify-between items-center ${
                        selectedTemplate.id === t.id
                          ? "border-emerald-500 bg-emerald-50/20 text-emerald-900 shadow-xs"
                          : "border-slate-100 hover:border-slate-200 bg-white"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700">
                            {t.category}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm mt-1.5">{t.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{t.description}</p>
                      </div>
                      <ChevronRight className={`w-4 h-4 shrink-0 transition ${
                        selectedTemplate.id === t.id ? "text-emerald-500 translate-x-1" : "text-slate-300"
                      }`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Binder Configuration panel (Right side inside tab) */}
              <div className="lg:col-span-7 p-6 overflow-y-auto space-y-5 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-800 text-base flex items-center gap-2 border-b border-slate-50 pb-2">
                    <Settings className="w-5 h-5 text-emerald-500" />
                    Configure Binding & Details
                  </h3>

                  {/* Bind Employee selection */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                      Target Team Member
                    </label>
                    <select
                      value={targetEmployee?.id || ""}
                      onChange={(e) => {
                        const matched = employees.find((emp) => emp.id === e.target.value);
                        setTargetEmployee(matched || null);
                      }}
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-slate-800 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition text-sm font-medium"
                    >
                      <option value="">-- Click to select employee --</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name} ({emp.role} - {emp.department})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Description Input for Customization (The Gemini Instruction Prompt) */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                      <span>Custom Description</span>
                    </label>
                    <textarea
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      rows={4}
                      placeholder="Tell the AI what to customize. e.g. 'Add a section detail stating that the employee is entitled to 20 days of paid sick leave' or 'Raise the compensation details' or 'Draft a special clause on remote work preferences...'"
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition resize-none"
                    />
                  </div>

                  {/* Optional user notes/context */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                      Additional Context or Legal Addendums
                    </label>
                    <input
                      type="text"
                      value={userNotes}
                      onChange={(e) => setUserNotes(e.target.value)}
                      placeholder="e.g. Non-disclosure agreement details or signing manager names..."
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                    />
                  </div>
                </div>

                {/* Confirm & Launch Trigger */}
                <div className="pt-6 border-t border-slate-100 flex items-center gap-3">
                  <button
                    onClick={() => {
                      // Apply default templates directly
                      setDocumentContent(bindMockPlaceholders(selectedTemplate.placeholderText, targetEmployee));
                      setActiveTab("editor");
                    }}
                    className="flex-1 py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    Use This Template
                  </button>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: Text editor & live preview panel */}
          {activeTab === "editor" && (
            <div className="lg:col-span-12 flex flex-col h-full overflow-hidden">
              {/* Internal editor toolbar */}
              <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between shrink-0 select-none">
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditMode(true)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      editMode
                        ? "bg-slate-800 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Plain Text / Markdown Editor
                  </button>
                  <button
                    id="btn-toggle-rendered-doc-view"
                    onClick={() => setEditMode(false)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      !editMode
                        ? "bg-slate-800 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Interactive Print Preview
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy text
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </button>
                  <button
                    onClick={handlePrint}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition flex items-center gap-1 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print / PDF
                  </button>
                </div>
              </div>

              {/* Dynamic Workspace: Textarea editor or Styled HTML sheet */}
              <div className="flex-1 overflow-hidden">
                {editMode ? (
                  <textarea
                    value={documentContent}
                    onChange={(e) => setDocumentContent(e.target.value)}
                    className="w-full h-full p-6 text-slate-800 font-mono text-sm leading-relaxed focus:outline-hidden bg-slate-50/30 overflow-y-auto resize-none"
                    placeholder="Enter document text..."
                  />
                ) : (
                  <div className="w-full h-full p-8 bg-slate-100 overflow-y-auto flex justify-center">
                    <div
                      id="rendered-doc-preview"
                      className="w-full max-w-3xl bg-white p-12 rounded-xl shadow-lg border border-slate-200/50 min-h-[1000px] prose prose-slate max-w-none text-left"
                    >
                      {/* Document Sheet Layout */}
                      <div className="border-b-4 border-emerald-600 pb-4 mb-8 flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-extrabold tracking-widest text-emerald-600 uppercase block">
                            OFFICIAL HR DOCUMENT
                          </span>
                          <span className="text-xs text-slate-400 font-mono mt-1 block">Ref: HRS-{Math.floor(100000 + Math.random() * 900000)}</span>
                        </div>
                        <h3 className="text-sm font-black tracking-widest text-slate-400 uppercase">
                          HR STUDIO CORP
                        </h3>
                      </div>

                      {renderDocumentMarkup(documentContent)}

                      <div className="mt-16 border-t border-slate-100 pt-8 grid grid-cols-2 gap-8 text-xs text-slate-400 select-none">
                        <div>
                          <p className="font-semibold text-slate-500 uppercase tracking-wider mb-8">
                            ISSUED ON BEHALF OF EMPLOYER
                          </p>
                          <div className="border-b border-slate-200 w-44 h-8 flex items-end italic text-indigo-500 font-semibold text-sm">
                            Marcus Aurelius
                          </div>
                          <p className="mt-1.5">Head of People & Operations</p>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-500 uppercase tracking-wider mb-8">
                            ACKNOWLEDGED BY EMPLOYEE
                          </p>
                          <div className="border-b border-slate-200 w-44 h-8 flex items-end italic text-indigo-500 font-semibold text-sm">
                            {targetEmployee?.name || "Jane Doe"}
                          </div>
                          <p className="mt-1.5">{targetEmployee?.role || "Team Member"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
