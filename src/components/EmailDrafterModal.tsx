import React, { useState, useEffect } from "react";
import { Mail, X, Sparkles, Send, Copy, Check, Loader2 } from "lucide-react";
import { Employee } from "../types";
import { getGmailLink } from "../utils";

interface EmailDrafterModalProps {
  employee: Employee | null;
  onClose: () => void;
}

export default function EmailDrafterModal({ employee, onClose }: EmailDrafterModalProps) {
  const [tone, setTone] = useState("warm and creative");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDraft = async (selectedTone: string) => {
    if (!employee) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/generate-birthday-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employee, tone: selectedTone }),
      });

      const data = await response.json();
      if (data.success) {
        setSubject(data.subject);
        setBody(data.body);
      } else {
        throw new Error(data.error || "Failed to generate email");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred. A high-quality default template has been loaded instead.");
      // Standard high-quality local fallback in case backend is not reached or configured
      setSubject(`Wishing you a very Happy Birthday, ${employee.name}! 🎉`);
      setBody(`Dear ${employee.name},\n\nOn behalf of the entire team, I wanted to take a moment to wish you a very Happy Birthday! 🎂\n\nWe are incredibly grateful for your contributions as our ${employee.role} in the ${employee.department} department. Your dedication, hard work, and presence make our workplace a better, brighter place.\n\nHope your special day is filled with joy, rest, and celebration!\n\nBest wishes,\n[Your Name]\nHR Manager`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employee) {
      fetchDraft(tone);
    }
  }, [employee]);

  const handleToneChange = (newTone: string) => {
    setTone(newTone);
    fetchDraft(newTone);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!employee) return null;

  return (
    <div id="email-drafter-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div id="email-drafter-modal" className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-2xl w-full flex flex-col my-8 overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-50 text-amber-500 rounded-xl">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">
                Draft Birthday Email for {employee.name}
              </h3>
              <p className="text-xs text-slate-500">
                Generate highly creative and professional email templates powered by Gemini AI.
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

        {/* Modal Content */}
        <div className="p-6 flex-1 space-y-5 overflow-y-auto max-h-[70vh]">
          {/* Tone Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 select-none">
              Choose Tone
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Warm & Caring", value: "warm, supportive, and caring" },
                { label: "Professional", value: "formal, appreciative, and highly professional" },
                { label: "Playful & Fun", value: "funny, highly energetic, with friendly humor" },
                { label: "Brief & Sweet", value: "short, crisp, direct and friendly" },
              ].map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => handleToneChange(t.value)}
                  disabled={loading}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer select-none ${
                    tone === t.value
                      ? "bg-amber-500 text-white shadow-xs"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Loader or Editors */}
          {loading ? (
            <div className="h-60 flex flex-col items-center justify-center text-slate-400 gap-3 border border-slate-100 rounded-2xl bg-slate-50/50">
              <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
              <p className="text-sm font-medium animate-pulse">Drafting customized celebration email...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {error && (
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-amber-800 text-xs">
                  {error}
                </div>
              )}

              {/* Subject Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                  placeholder="Subject of the birthday draft"
                />
              </div>

              {/* Body Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Email Body
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={10}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-slate-800 text-sm leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition font-sans"
                  placeholder="Write or edit the congratulatory body text..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              disabled={loading}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition flex items-center gap-1.5 border border-slate-200 bg-white cursor-pointer select-none"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Text
                </>
              )}
            </button>
            <button
              onClick={() => fetchDraft(tone)}
              disabled={loading}
              className="px-4 py-2 text-sm font-semibold text-amber-600 hover:bg-amber-50 rounded-xl transition flex items-center gap-1.5 border border-amber-200 bg-white cursor-pointer select-none"
            >
              <Sparkles className="w-4 h-4" />
              Regenerate
            </button>
          </div>

          <a
            id="btn-mailto-trigger"
            href={getGmailLink(employee.email, subject, body)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition shadow-md flex items-center gap-1.5 cursor-pointer hover:shadow-lg select-none"
          >
            <Send className="w-4 h-4" />
            Open in Gmail
          </a>
        </div>

      </div>
    </div>
  );
}
