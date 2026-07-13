import React, { useState, useRef } from "react";
import { Employee } from "../types";
import { X, Printer, Camera, CreditCard, Layers, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface IDCardGeneratorProps {
  employee: Employee | null;
  onClose: () => void;
}

export default function IDCardGenerator({ employee, onClose }: IDCardGeneratorProps) {
  const [theme, setTheme] = useState("cosmic"); // cosmic, minimal, emerald, dark
  const [customPhoto, setCustomPhoto] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("HR STUDIO");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!employee) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === "string") {
          setCustomPhoto(event.target.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById("printable-badge-card");
    if (!printContent) return;

    const originalContent = document.body.innerHTML;
    
    // Create simple printable window
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>ID Badge - ${employee.name}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @media print {
                body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
                .no-print { display: none !important; }
              }
              body { background-color: white; font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
            </style>
          </head>
          <body>
            <div class="p-6">
              ${printContent.outerHTML}
            </div>
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

  const getThemeStyles = () => {
    switch (theme) {
      case "emerald":
        return {
          bg: "bg-radial from-emerald-950 to-slate-900 text-white",
          accent: "bg-emerald-500",
          ring: "ring-emerald-400/30",
          badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
          textAccent: "text-emerald-400",
        };
      case "dark":
        return {
          bg: "bg-slate-950 text-white",
          accent: "bg-slate-400",
          ring: "ring-slate-400/30",
          badge: "bg-slate-800 text-slate-200 border-slate-700",
          textAccent: "text-slate-400",
        };
      case "minimal":
        return {
          bg: "bg-slate-50 text-slate-800 border border-slate-200",
          accent: "bg-sky-500",
          ring: "ring-sky-200",
          badge: "bg-sky-50 text-sky-700 border-sky-100",
          textAccent: "text-sky-600",
        };
      case "cosmic":
      default:
        return {
          bg: "bg-linear-to-br from-indigo-950 via-slate-900 to-rose-950 text-white",
          accent: "bg-indigo-500",
          ring: "ring-rose-500/30",
          badge: "bg-rose-500/10 text-rose-300 border-rose-500/20",
          textAccent: "text-indigo-400",
        };
    }
  };

  const currentStyle = getThemeStyles();

  return (
    <div id="id-card-generator-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div id="id-card-generator-panel" className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 overflow-hidden my-8">
        
        {/* Left Side: Customization panel */}
        <div className="md:col-span-5 p-6 border-r border-slate-100 flex flex-col justify-between bg-slate-50/50">
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-500" />
                Badge Studio
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Customize, preview, and print a front-side employee ID card.
              </p>
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Company Header
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3.5 py-1.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-semibold uppercase tracking-wider"
              />
            </div>

            {/* Custom Photo Upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Employee Profile Photo
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2 px-3 border border-dashed border-slate-200 rounded-xl hover:border-indigo-400 hover:bg-white text-xs font-medium text-slate-600 flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <Camera className="w-4 h-4 text-slate-400" />
                {customPhoto ? "Replace Profile Image" : "Upload Custom Avatar"}
              </button>
            </div>

            {/* Theme picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Card Design Theme
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "cosmic", name: "Cosmic Twilight", color: "bg-indigo-900" },
                  { id: "emerald", name: "Emerald Forest", color: "bg-emerald-900" },
                  { id: "dark", name: "Steel Graphite", color: "bg-slate-900" },
                  { id: "minimal", name: "Polar Ice (Light)", color: "bg-slate-100 border border-slate-200" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`p-2.5 rounded-xl flex items-center gap-2 text-xs font-semibold text-left transition border cursor-pointer ${
                      theme === t.id
                        ? "border-indigo-500 ring-2 ring-indigo-100 bg-white"
                        : "border-slate-100 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full ${t.color} shrink-0`} />
                    <span className="truncate">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 mt-6 flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex-1 py-2.5 px-4 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-sm rounded-xl transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

        {/* Right Side: Visual ID Card Display Container */}
        <div className="md:col-span-7 p-8 flex flex-col items-center justify-center bg-slate-100/50 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="text-xs text-slate-400 font-mono mb-4 flex items-center gap-1.5 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Live Preview
          </span>

          {/* Printable Element Block */}
          <div
            id="printable-badge-card"
            className="w-[300px] h-[460px] rounded-[24px] shadow-2xl relative overflow-hidden flex flex-col items-center p-6 border transition-all duration-300 select-none"
            style={{
              background:
                theme === "cosmic"
                  ? "linear-gradient(145deg, #1e1b4b 0%, #0f172a 40%, #4c0519 100%)"
                  : theme === "emerald"
                  ? "linear-gradient(145deg, #064e3b 0%, #0f172a 60%, #022c22 100%)"
                  : theme === "dark"
                  ? "linear-gradient(145deg, #0f172a 0%, #1e293b 100%)"
                  : "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
              borderColor: theme === "minimal" ? "#e2e8f0" : "#1e293b",
            }}
          >
            {/* Glossy overlay sheen */}
            {theme !== "minimal" && (
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
            )}

            {/* Top Company Title */}
            <div className="w-full text-center mt-2 relative z-10">
              <span
                className={`text-[11px] font-extrabold tracking-[0.25em] block ${
                  theme === "minimal" ? "text-slate-500" : "text-white/60"
                }`}
              >
                IDENTIFICATION PASS
              </span>
              <h4
                className={`text-lg font-black tracking-widest mt-1 uppercase ${
                  theme === "minimal" ? "text-indigo-600" : "text-white"
                }`}
              >
                {companyName}
              </h4>
            </div>

            {/* Tech chip ornament */}
            <div className="w-full flex justify-between items-center px-2 mt-4 relative z-10">
              <div
                className={`w-8 h-6 rounded-md opacity-70 ${
                  theme === "minimal" ? "bg-slate-200" : "bg-gradient-to-r from-amber-400 to-yellow-600"
                }`}
              />
              <div
                className={`text-[9px] font-mono ${
                  theme === "minimal" ? "text-slate-400" : "text-white/40"
                }`}
              >
                HR-S // SECURE_PAS
              </div>
            </div>

            {/* Profile Picture Placeholder or Custom Upload */}
            <div className="mt-5 relative z-10">
              <div
                className={`w-32 h-32 rounded-2xl overflow-hidden ring-4 ${
                  theme === "minimal" ? "ring-slate-100" : "ring-white/10"
                } flex items-center justify-center bg-slate-800 shadow-xl`}
              >
                {customPhoto ? (
                  <img
                    src={customPhoto}
                    alt={employee.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-white text-4xl font-extrabold"
                    style={{ backgroundColor: employee.avatarColor || "#4F46E5" }}
                  >
                    {employee.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>
                )}
              </div>
            </div>

            {/* Employee Information */}
            <div className="text-center mt-5 w-full flex-1 flex flex-col justify-between relative z-10">
              <div>
                <h3
                  className={`text-xl font-bold tracking-tight leading-snug ${
                    theme === "minimal" ? "text-slate-800" : "text-white"
                  }`}
                >
                  {employee.name}
                </h3>
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mt-1">
                  {employee.role}
                </p>
                <div className="mt-2.5 inline-block">
                  <span
                    className={`px-3 py-0.5 text-[10px] font-extrabold rounded-full uppercase border ${
                      theme === "minimal"
                        ? "bg-slate-100 text-slate-600 border-slate-200"
                        : "bg-white/5 text-white/80 border-white/10"
                    }`}
                  >
                    {employee.department}
                  </span>
                </div>
              </div>

              {/* Barcode and UID info */}
              <div className="mt-auto w-full pt-4 border-t border-dashed border-slate-700/30">
                <div className="flex items-center justify-between px-2 text-[10px] font-mono text-slate-400">
                  <div className="text-left">
                    <span className="block text-[8px] uppercase tracking-wider text-slate-500 font-bold">
                      Badge No
                    </span>
                    <span className={theme === "minimal" ? "text-slate-700 font-semibold" : "text-white/80"}>
                      {employee.id}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[8px] uppercase tracking-wider text-slate-500 font-bold">
                      Issued Date
                    </span>
                    <span className={theme === "minimal" ? "text-slate-700 font-semibold" : "text-white/80"}>
                      {employee.joinDate}
                    </span>
                  </div>
                </div>

                {/* Simulated Barcode */}
                <div className="mt-3 bg-white p-1 rounded-sm w-full h-8 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full flex gap-[1px]">
                    {Array.from({ length: 48 }).map((_, idx) => {
                      const heights = [1, 1, 0.7, 0.9, 0.4, 0.8, 1, 0.6];
                      const heightPercent = heights[idx % heights.length] * 100;
                      const width = idx % 3 === 0 ? "w-[3px]" : idx % 5 === 0 ? "w-[2px]" : "w-[1px]";
                      const isWhite = idx % 7 === 0 || idx % 11 === 0;

                      return (
                        <div
                          key={idx}
                          className={`bg-slate-900 ${width}`}
                          style={{
                            height: `${heightPercent}%`,
                            opacity: isWhite ? 0 : 1,
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
