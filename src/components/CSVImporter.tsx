import React, { useState, useRef } from "react";
import { Upload, FileSpreadsheet, Check, AlertCircle, X, Info } from "lucide-react";
import { parseCSV, getRandomColor } from "../utils";
import { Employee } from "../types";

interface CSVImporterProps {
  onImportComplete: (employees: Employee[]) => void;
  onCancel: () => void;
}

export default function CSVImporter({ onImportComplete, onCancel }: CSVImporterProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<Partial<Employee>[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (!file.name.endsWith(".csv")) {
      setError("Please upload a valid CSV file (.csv format only)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === "string") {
        try {
          const parsed = parseCSV(text);
          if (parsed.length === 0) {
            setError("No valid employee records found in this CSV file. Make sure you have correct headers.");
          } else {
            setPreviewData(parsed);
            setError(null);
          }
        } catch (err: any) {
          setError(`Error parsing CSV: ${err.message || "Invalid file format"}`);
        }
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleImportSubmit = () => {
    if (previewData.length === 0) return;

    const formattedEmployees: Employee[] = previewData.map((p, idx) => {
      const randomId = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
      return {
        id: p.id || randomId,
        name: p.name || "Unnamed Employee",
        email: p.email || `employee-${idx}@company.com`,
        role: p.role || "Team Member",
        department: p.department || "General Operations",
        birthDate: p.birthDate || "1995-01-01",
        joinDate: p.joinDate || new Date().toISOString().split("T")[0],
        phone: p.phone || "",
        avatarColor: getRandomColor(),
        salary: p.salary || "",
        notes: p.notes || "",
      };
    });

    onImportComplete(formattedEmployees);
  };

  const downloadSampleCSV = () => {
    const csvContent =
      "Full Name,Email Address,Job Title,Department,Birth Date,Join Date,Phone,Salary,Notes\n" +
      "Michael Scott,michael.scott@dundermifflin.com,Regional Manager,Management,1974-03-15,2001-09-21,+1 (555) 123-4567,$80000,Loves comedy and Dunder Mifflin\n" +
      "Jim Halpert,jim.halpert@dundermifflin.com,Sales Representative,Sales,1978-10-01,2003-04-12,+1 (555) 987-6543,$65000,Prankster extraordinaire\n" +
      "Pam Beesly,pam.beesly@dundermifflin.com,Office Administrator,Admin,1979-03-25,2004-03-10,+1 (555) 234-5678,$50000,Talented sketch artist";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "hr_studio_sample_employees.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="csv-importer-container" className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Upload CSV File</h2>
          <p className="text-sm text-slate-500 mt-1">
            Import multiple employees instantly from spreadsheets.
          </p>
        </div>
        <button
          onClick={onCancel}
          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Upload Box */}
      {previewData.length === 0 ? (
        <div className="space-y-4">
          <div
            id="drag-and-drop-zone"
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all ${
              dragActive
                ? "border-sky-500 bg-sky-50/50"
                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleChange}
              className="hidden"
            />
            <div className="p-4 bg-sky-50 text-sky-500 rounded-2xl mb-4">
              <Upload className="w-8 h-8" />
            </div>
            <p className="font-semibold text-slate-700 text-center">
              Drag & drop your CSV file here, or <span className="text-sky-500 hover:underline">browse files</span>
            </p>
            <p className="text-xs text-slate-400 mt-2 text-center">
              Make sure your file has headers for Name, Email, Birth Date, and Job Title
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-amber-50/60 rounded-xl text-amber-800 text-sm gap-3">
            <div className="flex items-start gap-2.5">
              <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Need a template to get started?</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  Download our formatted template, fill in your team details, and upload it back.
                </p>
              </div>
            </div>
            <button
              id="btn-download-sample-csv"
              onClick={downloadSampleCSV}
              className="text-xs font-semibold px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition shadow-sm self-start sm:self-center cursor-pointer"
            >
              Download Sample CSV
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Scrollable Preview Table */}
          <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700">
                Data Preview ({previewData.length} employees found)
              </span>
              <button
                onClick={() => setPreviewData([])}
                className="text-xs text-rose-500 hover:underline cursor-pointer"
              >
                Clear / Upload Different File
              </button>
            </div>
            <div className="overflow-x-auto max-h-[350px]">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-slate-500 font-semibold text-xs border-b border-slate-100 select-none">
                  <tr>
                    <th className="p-3 pl-4">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Job Title / Role</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Birth Date</th>
                    <th className="p-3">Join Date</th>
                    <th className="p-3 pr-4">Phone</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-600 text-sm">
                  {previewData.map((emp, index) => (
                    <tr key={index} className="hover:bg-slate-50/50">
                      <td className="p-3 pl-4 font-semibold text-slate-800 whitespace-nowrap">
                        {emp.name || <span className="text-rose-400 italic">Required</span>}
                      </td>
                      <td className="p-3 whitespace-nowrap">{emp.email || "N/A"}</td>
                      <td className="p-3 whitespace-nowrap">{emp.role || "N/A"}</td>
                      <td className="p-3 whitespace-nowrap">{emp.department || "N/A"}</td>
                      <td className="p-3 whitespace-nowrap text-amber-600 font-medium">{emp.birthDate || <span className="text-rose-400 italic">Required</span>}</td>
                      <td className="p-3 whitespace-nowrap">{emp.joinDate || "N/A"}</td>
                      <td className="p-3 pr-4 whitespace-nowrap text-slate-400">{emp.phone || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-50">
            <button
              onClick={() => setPreviewData([])}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition cursor-pointer"
            >
              Go Back
            </button>
            <button
              id="btn-confirm-import"
              onClick={handleImportSubmit}
              className="px-5 py-2 text-sm font-semibold bg-sky-500 hover:bg-sky-600 text-white rounded-xl transition shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Confirm and Import ({previewData.length})
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-800 flex items-start gap-2.5 text-sm animate-shake">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
