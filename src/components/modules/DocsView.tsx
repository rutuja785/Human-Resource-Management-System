import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Sparkles, 
  Upload, 
  FolderLock, 
  Search, 
  Trash2, 
  Plus, 
  Copy, 
  Check, 
  Printer, 
  Wand2,
  X,
  UserCheck,
  Save
} from 'lucide-react';
import { Employee, EmployeeDocument, GeneratedDoc } from '../../types';

interface DocsViewProps {
  employees: Employee[];
  documents: EmployeeDocument[];
  onAddDocument: (doc: Omit<EmployeeDocument, 'id'>) => void;
  onDeleteDocument: (id: string) => void;
}

function getTemplateContent(
  type: 'Offer Letter' | 'Appointment Letter' | 'LOR' | 'Experience Letter',
  employee: Employee,
  extra: string
) {
  const currentDate = new Date().toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });
  const annualSalary = (employee.salary.basic + employee.salary.hra + employee.salary.allowances) * 12;
  const monthlySalary = employee.salary.basic + employee.salary.hra + employee.salary.allowances;

  let subject = '';
  let body = '';

  switch (type) {
    case 'Offer Letter':
      subject = `Offer of Employment - ${employee.name}`;
      body = `Date: ${currentDate}

To,
${employee.name}
Email: ${employee.email}
Contact: ${employee.contact}

Subject: Offer of Employment for the Position of ${employee.role}

Dear ${employee.name},

We are pleased to offer you employment with Daydrift Technologies as a ${employee.role} in the ${employee.department} department. We were highly impressed by your credentials and look forward to having you join our team.

Here are the key details of your employment offer:

- Position: ${employee.role}
- Department: ${employee.department}
- Annual Gross Salary: $${annualSalary.toLocaleString()} (comprising basic, HRA, and allowances)
- Monthly Compensation: $${monthlySalary.toLocaleString()}/month
- Target Start Date: ${employee.hireDate}
- Employment Status: Full-time

As a member of the Daydrift team, you will also be eligible for our comprehensive benefits package, including health insurance, paid time off, and standard performance bonuses as defined by company policy.
${extra ? `\nSpecial Terms & Context:\n${extra}\n` : ''}
Please review this offer and confirm your acceptance by signing and returning a copy of this letter on or before your proposed start date.

Should you have any questions, feel free to contact our Human Resources department.

Sincerely,

HR Team
Daydrift Technologies`;
      break;

    case 'Appointment Letter':
      subject = `Letter of Appointment - ${employee.name}`;
      body = `Date: ${currentDate}

To,
${employee.name}
Email: ${employee.email}
Contact: ${employee.contact}

Subject: Letter of Appointment

Dear ${employee.name},

Following your acceptance of our offer, we are delighted to formally appoint you as a ${employee.role} in the ${employee.department} department at Daydrift Technologies, effective from your joining date of ${employee.hireDate}.

Terms and Conditions of Appointment:

1. Place of Work: Your initial place of work will be the Daydrift Headquarters. You may be requested to work remotely or travel based on business requirements.
2. Duties and Responsibilities: You will perform the duties assigned to you by your supervisor to the best of your skills and abilities.
3. Salary and Compensation: Your annual basic compensation is set at $${(employee.salary.basic * 12).toLocaleString()} with standard HRA and allowances bringing your total package to $${annualSalary.toLocaleString()} per annum, subject to standard tax deductions.
4. Probationary Period: You will be on probation for a period of 3 months. Upon successful completion of this period, your employment will be confirmed in writing.
5. Code of Conduct: You are expected to adhere to all company policies, data protection guidelines, and maintain absolute confidentiality regarding company affairs.
${extra ? `\nAdditional Appointment Terms:\n${extra}\n` : ''}
Please sign the duplicate copy of this letter as a token of your acceptance of the terms and conditions outlined above.

We welcome you to Daydrift Technologies and wish you a successful career ahead.

Sincerely,

Director of Human Resources
Daydrift Technologies`;
      break;

    case 'LOR':
      subject = `Letter of Recommendation - ${employee.name}`;
      body = `Date: ${currentDate}

To Whom It May Concern,

It is my distinct pleasure to write this Letter of Recommendation for ${employee.name}, who has served as a ${employee.role} in the ${employee.department} department at Daydrift Technologies since ${employee.hireDate}.

During their tenure at Daydrift, ${employee.name} has consistently demonstrated exceptional dedication, high technical competence, and a collaborative team spirit. They have been instrumental in executing key deliverables and optimizing internal operations within our ${employee.department} division.

Key Attributes and Contributions:
- Professional Competence: Demonstrated a deep understanding of ${employee.role} duties, consistently exceeding performance targets.
- Leadership and Teamwork: Worked seamlessly with cross-functional teams, showing remarkable adaptability and professional maturity.
- Problem Solving: Proactively addressed complex issues, bringing creative and structured solutions to our workflows.
${extra ? `\nPerformance Highlights & Notes:\n${extra}\n` : ''}
I have the utmost confidence in ${employee.name}'s professional capabilities and personal integrity. I am certain they will be an invaluable asset to any organization they choose to join. I recommend them with the highest enthusiasm and without any reservation.

Please feel free to contact my office if you require any further information.

Sincerely,

Managing Director
Daydrift Technologies`;
      break;

    case 'Experience Letter':
      subject = `Certificate of Experience - ${employee.name}`;
      body = `Date: ${currentDate}

To Whom It May Concern,

This is to certify that ${employee.name} was employed with Daydrift Technologies as a ${employee.role} in the ${employee.department} department.

Employment History:
- Date of Joining: ${employee.hireDate}
- Tenure Status: Full-time (Active)
- Role & Designation: ${employee.role}

During their time with Daydrift Technologies, ${employee.name} demonstrated deep professionalism, exemplary work ethic, and made significant contributions to our team. Their behavior and conduct were consistently excellent, and they maintained strong working relationships with peers and management alike.
${extra ? `\nKey Achievements & Professional Scope:\n${extra}\n` : ''}
We thank ${employee.name} for their dedicated service and wish them the very best in all their future professional endeavors.

Sincerely,

HR Operations Manager
Daydrift Technologies`;
      break;
  }

  return { subject, body };
}

export default function DocsView({
  employees,
  documents,
  onAddDocument,
  onDeleteDocument
}: DocsViewProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'manage'>('generate');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Doc Generator States
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [docType, setDocType] = useState<'Offer Letter' | 'Appointment Letter' | 'LOR' | 'Experience Letter'>('Offer Letter');
  const [extraDetails, setExtraDetails] = useState('');
  const [draftSubject, setDraftSubject] = useState('');
  const [draftBody, setDraftBody] = useState('');
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // File Upload states
  const [uploadEmpId, setUploadEmpId] = useState('');
  const [fileName, setFileName] = useState('');
  const [category, setCategory] = useState<'Contract' | 'ID Proof' | 'Certificate' | 'Other'>('Contract');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Automatically update the template content when employee or document type changes
  useEffect(() => {
    if (selectedEmpId) {
      const emp = employees.find(e => e.id === selectedEmpId);
      if (emp) {
        const { subject, body } = getTemplateContent(docType, emp, extraDetails);
        setDraftSubject(subject);
        setDraftBody(body);
      }
    } else {
      setDraftSubject('');
      setDraftBody('');
    }
  }, [selectedEmpId, docType, employees]);

  const filteredDocs = documents.filter(doc => {
    const emp = employees.find(e => e.id === doc.employeeId);
    const empName = emp ? emp.name : '';
    return doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           empName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           doc.category.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Re-run template compilation with current extraDetails context
  const handleRegenerate = () => {
    const emp = employees.find(e => e.id === selectedEmpId);
    if (!emp) {
      alert("Please select a target employee first.");
      return;
    }
    const { subject, body } = getTemplateContent(docType, emp, extraDetails);
    setDraftSubject(subject);
    setDraftBody(body);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${draftSubject}\n\n${draftBody}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToVault = () => {
    const emp = employees.find(e => e.id === selectedEmpId);
    if (!emp) return;

    const cleanDocName = `${docType.replace(/\s+/g, '_')}_${emp.name.replace(/\s+/g, '_')}`;
    const docCategory = (docType === 'Offer Letter' || docType === 'Appointment Letter') ? 'Contract' : 'Certificate';

    onAddDocument({
      employeeId: selectedEmpId,
      name: `${cleanDocName}.pdf`,
      category: docCategory,
      uploadDate: new Date().toISOString().split('T')[0],
      size: `${(Math.random() * 0.3 + 0.8).toFixed(1)} MB`
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadEmpId || !fileName) return;

    onAddDocument({
      employeeId: uploadEmpId,
      name: fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`,
      category,
      uploadDate: new Date().toISOString().split('T')[0],
      size: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`
    });

    setShowUploadModal(false);
    setFileName('');
  };

  return (
    <div className="space-y-6">
      
      {/* Module Title */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Document Automation & Vault</h2>
          <p className="text-xs text-slate-500 font-sans">Draft certified HR correspondence with real-time templates or organize stored contracts securely</p>
        </div>

        {/* Inner page navigation */}
        <div className="flex bg-slate-950/25 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('generate')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'generate' 
                ? 'bg-purple-600 text-white' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Document Templates</span>
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'manage' 
                ? 'bg-purple-600 text-white' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderLock className="w-3.5 h-3.5" />
            <span>Document Vault</span>
          </button>
        </div>
      </div>

      {activeTab === 'generate' ? (
        /* Document Generator Tab */
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Generator Config Form */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm dark:shadow-none space-y-4 self-start">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Template Settings</h3>
            
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono text-slate-400 font-semibold block">Select Staff Profile</label>
              <select
                required
                value={selectedEmpId}
                onChange={e => setSelectedEmpId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-lg p-2.5 text-slate-900 dark:text-white outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="">-- Choose Employee --</option>
                {employees.map(e => (
                  <option key={e.id} value={e.id}>{e.name} ({e.role})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono text-slate-400 font-semibold block">Template Type</label>
              <select
                value={docType}
                onChange={e => setDocType(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-lg p-2.5 text-slate-900 dark:text-white outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="Offer Letter">Offer Letter</option>
                <option value="Appointment Letter">Appointment Letter</option>
                <option value="LOR">Letter of Recommendation (LOR)</option>
                <option value="Experience Letter">Experience Letter</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono text-slate-400 font-semibold block">Custom Context / Parameters</label>
              <textarea
                rows={4}
                value={extraDetails}
                onChange={e => setExtraDetails(e.target.value)}
                placeholder="Include custom terms, probation details, bonus percentages or unique performance highlights..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-lg p-2.5 text-slate-900 dark:text-white outline-none focus:border-purple-500"
              />
              <p className="text-[9.5px] text-slate-500 leading-relaxed font-sans">
                Type terms here and click the button below to regenerate the template incorporating this context.
              </p>
            </div>

            <button
              onClick={handleRegenerate}
              disabled={!selectedEmpId}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 disabled:opacity-50 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-purple-500/15 cursor-pointer"
            >
              <Wand2 className="w-4 h-4" />
              <span>Apply Context & Regenerate</span>
            </button>
          </div>

          {/* Generated Document Draft Display */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-none min-h-[400px] flex flex-col justify-between">
            {draftBody ? (
              <div className="space-y-4 h-full flex flex-col justify-between">
                
                {/* Header Actions */}
                <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800/60 print:hidden">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold font-mono text-purple-500 uppercase tracking-wider">Verified Template</span>
                    <span className="text-[11px] text-slate-400">Live Draft (Feel free to edit text directly below)</span>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={handleCopy}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:text-purple-500 text-[11px] flex items-center gap-1 font-semibold transition-all cursor-pointer"
                      title="Copy content to clipboard"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                      <span>{copied ? "Copied" : "Copy"}</span>
                    </button>
                    <button
                      onClick={handleSaveToVault}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:text-emerald-500 text-[11px] flex items-center gap-1 font-semibold transition-all cursor-pointer"
                      title="Add to Stored Document Vault"
                    >
                      {saveSuccess ? <Check className="w-3.5 h-3.5 text-emerald-500 animate-bounce" /> : <Save className="w-3.5 h-3.5 text-slate-400" />}
                      <span>{saveSuccess ? "Saved to Vault!" : "Save to Vault"}</span>
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:text-purple-500 text-[11px] flex items-center gap-1 font-semibold transition-all cursor-pointer"
                      title="Print Document"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-400" />
                      <span>Print</span>
                    </button>
                  </div>
                </div>

                {/* Printable Document Box - Editable */}
                <div className="p-6 bg-white border border-slate-200 rounded-xl flex-1 overflow-y-auto font-sans text-slate-950 shadow-inner my-2 flex flex-col gap-2">
                  <input 
                    type="text"
                    value={draftSubject}
                    onChange={e => setDraftSubject(e.target.value)}
                    className="text-sm font-black border-b border-slate-200 pb-2 mb-2 font-serif text-slate-950 bg-transparent outline-none focus:border-purple-500 w-full"
                    placeholder="Document Subject"
                  />
                  <textarea
                    value={draftBody}
                    onChange={e => setDraftBody(e.target.value)}
                    rows={18}
                    className="text-xs whitespace-pre-wrap font-serif leading-relaxed text-slate-900 bg-transparent outline-none w-full flex-1 resize-none focus:bg-slate-50/50 p-1 rounded transition-all"
                    placeholder="Document Body content goes here..."
                  />
                </div>

                <span className="text-[10px] text-slate-400 dark:text-slate-500 block italic mt-1 leading-normal">
                  💡 You can click directly inside the subject and body box above to edit, add signatures, or finalize details before printing or saving.
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center h-full my-auto space-y-3">
                <FileText className="w-10 h-10 text-slate-500 animate-pulse" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Awaiting Profile Selection</h4>
                  <p className="text-xs text-slate-500 max-w-sm mt-1 mx-auto">Select a staff profile in the sidebar to instantly render and edit professional, customized HR templates.</p>
                </div>
              </div>
            )}
          </div>

        </div>
      ) : (
        /* Document Manage/Vault Tab */
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 justify-between items-center">
            
            {/* Search document */}
            <div className="flex-1 min-w-[250px] relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input 
                type="text"
                placeholder="Search archived employee documents..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950/40 border border-slate-200 dark:border-slate-800 text-xs rounded-lg py-2 pl-9 pr-4 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 outline-none focus:border-purple-500"
              />
            </div>

            <button
              onClick={() => {
                if (employees.length > 0) setUploadEmpId(employees[0].id);
                setShowUploadModal(true);
              }}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 shrink-0"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Document</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDocs.map(doc => {
              const emp = employees.find(e => e.id === doc.employeeId);
              return (
                <div 
                  key={doc.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-sm dark:shadow-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-950 flex items-center justify-center border border-slate-800 shrink-0">
                      <FileText className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block truncate max-w-xs">{doc.name}</span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-semibold text-indigo-400">{doc.category}</span>
                        <span>•</span>
                        <span>{emp ? emp.name : 'Unknown Employee'}</span>
                        <span>•</span>
                        <span>{doc.size}</span>
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteDocument(doc.id)}
                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}

            {filteredDocs.length === 0 && (
              <div className="col-span-2 text-center py-12 bg-slate-950/20 border border-dashed border-slate-800 rounded-2xl">
                <FolderLock className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <span className="text-xs text-slate-500">No matching archived documents in secure vault</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md overflow-hidden flex flex-col transition-colors">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Upload Stored File to Vault</h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400 block">Select Employee Profile</label>
                <select
                  required
                  value={uploadEmpId}
                  onChange={e => setUploadEmpId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-lg p-2.5 text-slate-900 dark:text-white outline-none focus:border-purple-500"
                >
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.name} ({e.role})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400 block">Document Name</label>
                <input
                  type="text"
                  required
                  value={fileName}
                  onChange={e => setFileName(e.target.value)}
                  placeholder="e.g. Identity_Passport_Scan"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-lg p-2.5 text-slate-900 dark:text-white outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400 block">File Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-lg p-2.5 text-slate-900 dark:text-white outline-none"
                >
                  <option value="Contract">Contract</option>
                  <option value="ID Proof">ID Proof</option>
                  <option value="Certificate">Certificate</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 py-2.5 rounded-lg bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition-all shadow-md"
                >
                  Archive File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
