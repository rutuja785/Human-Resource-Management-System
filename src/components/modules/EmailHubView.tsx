import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  Gift, 
  Calendar, 
  CreditCard, 
  Activity, 
  Sparkles, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Bell,
  Trash2,
  Clock,
  Inbox,
  User,
  ExternalLink,
  Eye,
  ArrowRight,
  Copy
} from 'lucide-react';
import { Employee, EmailLog } from '../../types';

interface EmailHubViewProps {
  employees: Employee[];
  emailLogs: EmailLog[];
  onTriggerEmailCampaign: (campaign: Omit<EmailLog, 'id' | 'timestamp'>) => void;
  onClearLogs: () => void;
}

export default function EmailHubView({
  employees,
  emailLogs,
  onTriggerEmailCampaign,
  onClearLogs
}: EmailHubViewProps) {
  const [campaignType, setCampaignType] = useState<'Birthday' | 'Work Anniversary' | 'Payslip' | 'General Notice'>('Birthday');
  const [customSubject, setCustomSubject] = useState('');
  const [customBody, setCustomBody] = useState('');
  const [selectedEmpId, setSelectedEmpId] = useState(employees[0]?.id || '');
  const [copied, setCopied] = useState(false);

  // Interaction Tabs
  const [activeLogTab, setActiveLogTab] = useState<'inbox' | 'outbox' | 'preview'>('inbox');
  const [selectedInboxEmpId, setSelectedInboxEmpId] = useState(employees[0]?.id || '');
  const [selectedInboxEmailId, setSelectedInboxEmailId] = useState<string | null>(null);

  // Helper to dynamically get sender name
  const getSenderForCampaign = (type: string) => {
    switch(type) {
      case 'Payslip': return 'HR Studio Payroll';
      case 'Work Anniversary': return 'HR Studio Leadership';
      case 'Birthday': return 'HR Operations';
      default: return 'HR Communications';
    }
  };

  // Helper to compile the active form inputs into a temporary template preview
  const getTemplatePreview = () => {
    const emp = employees.find(e => e.id === selectedEmpId) || employees[0];
    if (!emp) return { subject: '', body: '', emp: undefined };

    let subject = customSubject;
    let body = customBody;

    if (campaignType === 'Birthday') {
      subject = `Happy Birthday, ${emp.name}! 🎂`;
      body = `Hi ${emp.name},\n\nThe entire team at HR Studio wishes you an incredible birthday! Thank you for bringing your talent and positive energy to work every day. Have a fantastic day!\n\nWarm regards,\nHR Operations`;
    } else if (campaignType === 'Work Anniversary') {
      subject = `Happy Work Anniversary, ${emp.name}! 🌟`;
      body = `Hi ${emp.name},\n\nCongratulations on reaching another career milestone with us! We are incredibly grateful for your continuous hard work and dedication. Here's to many more years of shared success!\n\nBest wishes,\nHR Studio Leadership`;
    } else if (campaignType === 'Payslip') {
      subject = `Payslip June 2026 Released - ${emp.name}`;
      body = `Hi ${emp.name},\n\nYour payslip for June 2026 has been successfully generated and compiled. You can review and print it inside your secure HR Studio Portal.\n\nBest regards,\nPayroll Team`;
    }

    return { subject, body, emp };
  };

  const getPlainTextTemplateDraft = (emp: Employee) => {
    let finalSubject = customSubject;
    let finalBody = customBody;

    if (campaignType === 'Birthday') {
      finalSubject = `Happy Birthday, ${emp.name}! 🎂`;
      const code = `BDAY-2026-${emp.name.substring(0,3).toUpperCase()}`;
      finalBody = `Dear ${emp.name},

The entire team at HR Studio wishes you an incredible birthday! Thank you for bringing your talent and positive energy to work every day. Have a fantastic day!

----------------------------------------
🎁 BIRTHDAY PERK ACTIVATED!
Enjoy a complimentary Starbucks voucher on HR Studio.
Code: ${code}
----------------------------------------

Warm regards,
HR Operations`;
    } else if (campaignType === 'Work Anniversary') {
      finalSubject = `Happy Work Anniversary, ${emp.name}! 🌟`;
      finalBody = `Dear ${emp.name},

Congratulations on reaching another career milestone with us! We are incredibly grateful for your continuous hard work and dedication. Here's to many more years of shared success!

----------------------------------------
🌟 AN ANNIVERSARY TOKEN OF GRATITUDE
We appreciate your commitment and loyalty. Your custom performance reward is unlocked in your portal.
----------------------------------------

Best wishes,
HR Studio Leadership`;
    } else if (campaignType === 'Payslip') {
      finalSubject = `Payslip Released: June 2026 - ${emp.name}`;
      const basic = emp.salary.basic;
      const hra = emp.salary.hra;
      const allowances = emp.salary.allowances;
      const deductions = emp.salary.deductions;
      const net = basic + hra + allowances - deductions;

      finalBody = `Dear ${emp.name},

Your payslip for June 2026 has been successfully generated and compiled. You can review and print it inside your secure HR Studio Portal.

----------------------------------------
 June 2026 Payslip Summary
----------------------------------------
Basic Pay: ₹${basic}
HRA Allowance: ₹${hra}
Special Allowances: ₹${allowances}
Provident Fund Deduct.: -₹${deductions}
----------------------------------------
Net Take Home Pay: ₹${net}
----------------------------------------

Best regards,
Payroll Team`;
    } else {
      if (!finalSubject || !finalBody) {
        return null;
      }
    }

    return { subject: finalSubject, body: finalBody };
  };

  const triggerLocalMailtoCampaign = () => {
    const emp = employees.find(e => e.id === selectedEmpId) || employees[0];
    if (!emp) return;

    const draft = getPlainTextTemplateDraft(emp);
    if (!draft) {
      alert("Please complete custom Subject and Body for General Notices!");
      return;
    }

    onTriggerEmailCampaign({
      employeeId: emp.id,
      employeeName: emp.name,
      recipientEmail: emp.email,
      campaignType,
      subject: draft.subject,
      body: draft.body,
      status: 'Sent'
    });

    const mailtoUrl = `mailto:${encodeURIComponent(emp.email)}?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`;
    window.location.href = mailtoUrl;

    // Auto-select and show recipient's inbox so they see it received!
    setActiveLogTab('inbox');
    setSelectedInboxEmpId(emp.id);
    setSelectedInboxEmailId(null);

    // Reset inputs
    setCustomSubject('');
    setCustomBody('');
  };

  const triggerGmailWebCampaign = () => {
    const emp = employees.find(e => e.id === selectedEmpId) || employees[0];
    if (!emp) return;

    const draft = getPlainTextTemplateDraft(emp);
    if (!draft) {
      alert("Please complete custom Subject and Body for General Notices!");
      return;
    }

    onTriggerEmailCampaign({
      employeeId: emp.id,
      employeeName: emp.name,
      recipientEmail: emp.email,
      campaignType,
      subject: draft.subject,
      body: draft.body,
      status: 'Sent'
    });

    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emp.email)}&su=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`;
    window.open(gmailComposeUrl, '_blank', 'noopener,noreferrer');

    // Auto-select and show recipient's inbox so they see it received!
    setActiveLogTab('inbox');
    setSelectedInboxEmpId(emp.id);
    setSelectedInboxEmailId(null);

    // Reset inputs
    setCustomSubject('');
    setCustomBody('');
  };

  const getFormattedHTMLForCampaign = (
    type: 'Birthday' | 'Work Anniversary' | 'Payslip' | 'General Notice',
    emp: Employee
  ) => {
    let headerColor = "#8b5cf6"; // Purple-500
    let bannerText = "HR Studio Operations & Internal Communications";
    let titleText = "HR Notification";
    let accentBlock = "";

    const netSalary = emp 
      ? emp.salary.basic + emp.salary.hra + emp.salary.allowances - emp.salary.deductions
      : 12800;

    const body = type === 'Birthday' 
      ? `Dear ${emp.name},\n\nThe entire team at HR Studio wishes you an incredible birthday! Thank you for bringing your talent and positive energy to work every day. Have a fantastic day!`
      : type === 'Work Anniversary'
      ? `Dear ${emp.name},\n\nCongratulations on reaching another career milestone with us! We are incredibly grateful for your continuous hard work and dedication. Here's to many more years of shared success!`
      : type === 'Payslip'
      ? `Dear ${emp.name},\n\nYour payslip for June 2026 has been successfully generated and compiled. You can review and print it inside your secure HR Studio Portal.`
      : customBody;

    const subject = type === 'Birthday' 
      ? `Happy Birthday, ${emp.name}! 🎂`
      : type === 'Work Anniversary'
      ? `Happy Work Anniversary, ${emp.name}! 🌟`
      : type === 'Payslip'
      ? `Payslip Released: June 2026 - ${emp.name}`
      : customSubject;

    if (type === "Birthday") {
      headerColor = "#ec4899"; // Pink-500
      titleText = "Happy Birthday! 🎂";
      bannerText = "HR Studio Celebrates You";
      accentBlock = `
        <div style="margin-top: 20px; padding: 18px; background-color: #fdf2f8; border: 1px solid #fbcfe8; border-radius: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td width="35" valign="top" style="font-size: 24px; padding-right: 12px; line-height: 1;">🎁</td>
              <td valign="top">
                <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: bold; color: #9d174d;">Birthday Perk Activated!</p>
                <p style="margin: 3px 0 0 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; color: #be185d; line-height: 1.4;">Enjoy a complimentary Starbucks voucher on HR Studio.</p>
                <span style="display: inline-block; margin-top: 8px; padding: 4px 8px; font-family: monospace; font-size: 11px; font-weight: bold; color: #9d174d; background-color: #fce7f3; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Code: BDAY-2026-${emp.name.substring(0, 3).toUpperCase()}</span>
              </td>
            </tr>
          </table>
        </div>
      `;
    } else if (type === "Work Anniversary") {
      headerColor = "#6366f1"; // Indigo-500
      titleText = "Milestone Moment! 🌟";
      bannerText = "HR Studio Career Milestone";
      accentBlock = `
        <div style="margin-top: 20px; padding: 18px; background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td width="35" valign="top" style="font-size: 24px; padding-right: 12px; line-height: 1;">🌟</td>
              <td valign="top">
                <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: bold; color: #92400e;">An Anniversary Token of Gratitude</p>
                <p style="margin: 3px 0 0 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; color: #b45309; line-height: 1.4;">We appreciate your commitment and loyalty. Your custom performance reward is unlocked in your portal.</p>
              </td>
            </tr>
          </table>
        </div>
      `;
    } else if (type === "Payslip") {
      headerColor = "#059669"; // Emerald-600
      titleText = "Salary Slip Dispatched 📑";
      bannerText = "HR Studio Secure Payroll";
      accentBlock = `
        <div style="margin-top: 20px; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="background-color: #f1f5f9; padding: 10px 15px; border-bottom: 1px solid #e2e8f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; font-weight: bold; color: #334155; text-align: left;">
            June 2026 Payslip Summary
          </div>
          <table width="100%" border="0" cellspacing="0" cellpadding="10" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; border-collapse: collapse; text-align: left;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="color: #64748b; font-weight: 500;">Basic Pay</td>
              <td align="right" style="font-weight: bold; color: #334155;">₹${emp.salary.basic}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="color: #64748b; font-weight: 500;">HRA Allowance</td>
              <td align="right" style="font-weight: bold; color: #334155;">₹${emp.salary.hra}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="color: #64748b; font-weight: 500;">Special Allowances</td>
              <td align="right" style="font-weight: bold; color: #334155;">₹${emp.salary.allowances}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="color: #64748b; font-weight: 500;">Deductions (PF, Taxes)</td>
              <td align="right" style="font-weight: bold; color: #ef4444;">-₹${emp.salary.deductions}</td>
            </tr>
            <tr style="background-color: #f1f5f9; font-weight: bold; font-size: 13px;">
              <td style="color: #1e293b; padding: 12px 15px;">Net Take-Home Pay</td>
              <td align="right" style="color: #059669; padding: 12px 15px;">₹${netSalary}</td>
            </tr>
          </table>
        </div>
      `;
    } else {
      headerColor = "#475569"; // Slate-600
      titleText = subject || "Team Announcement";
      bannerText = "HR Studio Team Memorandum";
    }

    return `
      <div style="background-color: #f1f5f9; padding: 30px 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table align="center" width="100%" style="max-width: 500px; width: 100%; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; border-collapse: separate; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);" cellspacing="0" cellpadding="0">
          <tr>
            <td style="background-color: ${headerColor}; padding: 24px; text-align: center;">
              <p style="margin: 0; text-transform: uppercase; letter-spacing: 1.5px; font-family: monospace; font-size: 10px; font-weight: bold; color: rgba(255,255,255,0.85);">${bannerText}</p>
              <h1 style="margin: 6px 0 0 0; font-family: sans-serif; font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">${titleText}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px; text-align: left;">
              <p style="margin: 0 0 12px 0; font-family: sans-serif; font-size: 14px; font-weight: bold; color: #1e293b;">Dear ${emp.name},</p>
              <p style="margin: 0; font-family: sans-serif; font-size: 13px; color: #475569; line-height: 1.6; white-space: pre-line;">${body}</p>
              \${accentBlock}
              <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #f1f5f9; font-family: sans-serif; font-size: 12px; color: #94a3b8; text-align: center;">
                This secure memorandum is intended solely for employees of HR Studio Inc.
              </div>
            </td>
          </tr>
        </table>
      </div>
    `;
  };

  const copyStyledEmailToClipboard = async () => {
    const emp = employees.find(e => e.id === selectedEmpId) || employees[0];
    if (!emp) return;

    const htmlContent = getFormattedHTMLForCampaign(campaignType, emp);
    const plainText = getPlainTextTemplateDraft(emp)?.body || '';

    try {
      const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
      const plainBlob = new Blob([plainText], { type: 'text/plain' });
      
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': htmlBlob,
          'text/plain': plainBlob
        })
      ]);
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);

      onTriggerEmailCampaign({
        employeeId: emp.id,
        employeeName: emp.name,
        recipientEmail: emp.email,
        campaignType,
        subject: getPlainTextTemplateDraft(emp)?.subject || `HR Studio Campaign: \${campaignType}`,
        body: plainText,
        status: 'Sent'
      });

      // Auto-select and show recipient's inbox so they see it received!
      setActiveLogTab('inbox');
      setSelectedInboxEmpId(emp.id);
      setSelectedInboxEmailId(null);
    } catch (err) {
      console.error("Failed to copy styled email:", err);
      try {
        await navigator.clipboard.writeText(plainText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (e) {
        alert("Could not access clipboard.");
      }
    }
  };

  // Gorgeous visual email layout renderer
  const renderEmailCardHTML = (
    type: 'Birthday' | 'Work Anniversary' | 'Payslip' | 'General Notice',
    employeeName: string,
    subject: string,
    body: string,
    emp?: Employee
  ) => {
    const netSalary = emp 
      ? emp.salary.basic + emp.salary.hra + emp.salary.allowances - emp.salary.deductions
      : 12800;

    return (
      <div className="w-full max-w-xl mx-auto bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm font-sans transition-all duration-200">
        {/* Email Header Banner */}
        {type === 'Birthday' && (
          <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 p-5 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-15">
              <Sparkles className="w-20 h-20 rotate-12" />
            </div>
            <p className="text-[9px] uppercase tracking-widest font-mono font-bold opacity-90">HR Studio Celebrates You</p>
            <h4 className="text-lg font-extrabold tracking-tight mt-1">Happy Birthday! 🎂</h4>
          </div>
        )}
        {type === 'Work Anniversary' && (
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 p-5 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-15">
              <Calendar className="w-20 h-20 rotate-12" />
            </div>
            <p className="text-[9px] uppercase tracking-widest font-mono font-bold opacity-90">HR Studio Career Milestone</p>
            <h4 className="text-lg font-extrabold tracking-tight mt-1">Milestone Moment! 🌟</h4>
          </div>
        )}
        {type === 'Payslip' && (
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-5 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-15">
              <CreditCard className="w-20 h-20 rotate-12" />
            </div>
            <p className="text-[9px] uppercase tracking-widest font-mono font-bold opacity-90">HR Studio Secure Payroll</p>
            <h4 className="text-lg font-extrabold tracking-tight mt-1">Salary Slip Dispatched 📑</h4>
          </div>
        )}
        {type === 'General Notice' && (
          <div className="bg-slate-800 dark:bg-slate-900 p-5 text-white text-center relative overflow-hidden border-b border-slate-700">
            <div className="absolute top-0 right-0 p-3 opacity-15">
              <Mail className="w-20 h-20 rotate-12" />
            </div>
            <p className="text-[9px] uppercase tracking-widest font-mono font-bold opacity-90">HR Studio Team Memorandum</p>
            <h4 className="text-md font-extrabold tracking-tight mt-1 truncate">{subject || 'Notice Title'}</h4>
          </div>
        )}

        {/* Email Body Content */}
        <div className="p-5 bg-white dark:bg-slate-900 space-y-4 text-slate-800 dark:text-slate-200 text-left">
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-slate-900 dark:text-white">Dear {employeeName || 'Team Member'},</p>
            <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed font-sans">
              {body || 'Select a campaign preset or type custom notice body.'}
            </p>
          </div>

          {/* Decorative / Highlight Badges */}
          {type === 'Birthday' && (
            <div className="p-3 bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 rounded-xl flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-lg shrink-0">
                <Gift className="w-5 h-5 animate-pulse" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-purple-900 dark:text-purple-300">Birthday Perk Activated!</p>
                <p className="text-[10px] text-purple-700 dark:text-purple-400">Enjoy a complimentary Starbucks voucher on HR Studio.</p>
                <p className="text-[9px] font-mono font-bold text-purple-900 dark:text-purple-300 mt-1 uppercase tracking-wider bg-purple-100/50 dark:bg-purple-900/30 px-1.5 py-0.5 rounded inline-block">Code: BDAY-2026-{employeeName.substring(0,3).toUpperCase()}</p>
              </div>
            </div>
          )}

          {type === 'Work Anniversary' && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-xl flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-lg shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-900 dark:text-amber-300">An Anniversary Token of Gratitude</p>
                <p className="text-[10px] text-amber-700 dark:text-amber-400">We appreciate your commitment and loyalty. Your custom performance reward is unlocked in your portal.</p>
              </div>
            </div>
          )}

          {type === 'Payslip' && (
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-950/50">
              <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <span className="text-[9px] font-bold font-mono uppercase tracking-wider text-slate-500">June 2026 Payslip Summary</span>
                <span className="text-[9px] font-semibold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded">ACH Processed</span>
              </div>
              <div className="p-3 space-y-1.5 font-mono text-[10px]">
                <div className="flex justify-between border-b border-dashed border-slate-200 dark:border-slate-800 pb-1">
                  <span className="text-slate-500">Basic Pay</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">₹{emp?.salary.basic || 8000}</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-slate-200 dark:border-slate-800 pb-1">
                  <span className="text-slate-500">HRA Allowance</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">₹{emp?.salary.hra || 3000}</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-slate-200 dark:border-slate-800 pb-1">
                  <span className="text-slate-500">Special Allowances</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">₹{emp?.salary.allowances || 2000}</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-slate-200 dark:border-slate-800 pb-1">
                  <span className="text-slate-500">Provident Fund Deduct.</span>
                  <span className="font-semibold text-rose-600 dark:text-rose-400">-₹{emp?.salary.deductions || 1000}</span>
                </div>
                <div className="flex justify-between pt-1 font-bold text-[11px]">
                  <span className="text-slate-950 dark:text-white">Net Take Home Pay</span>
                  <span className="text-emerald-600 dark:text-emerald-400">{netSalary.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}</span>
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Render CTA button */}
          <div className="pt-1.5 text-center">
            {type === 'Birthday' && (
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-[11px] font-bold shadow-md shadow-purple-500/10 hover:bg-purple-500 transition-all cursor-pointer">
                Claim Birthday Perk 🍰
              </button>
            )}
            {type === 'Work Anniversary' && (
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-[11px] font-bold shadow-md shadow-indigo-500/10 hover:bg-indigo-500 transition-all cursor-pointer">
                Say Thanks on HR Studio 🏆
              </button>
            )}
            {type === 'Payslip' && (
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-[11px] font-bold shadow-md shadow-emerald-500/10 hover:bg-emerald-500 transition-all cursor-pointer">
                Download Official PDF Slip 📄
              </button>
            )}
            {type === 'General Notice' && (
              <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg text-[11px] font-bold shadow-md transition-all cursor-pointer">
                View Employee Bulletin 📣
              </button>
            )}
          </div>
        </div>

        {/* Email Footer */}
        <div className="bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-5 py-3 text-[9px] text-slate-500 text-center space-y-0.5">
          <p className="font-bold text-slate-700 dark:text-slate-400">HR Studio Operations & Internal Communications</p>
          <p>This is an automated transactional notification sent directly to your secure staff record.</p>
          <p>© 2026 HR Studio Inc. 123 Business Ave, Suite 400, San Francisco, CA.</p>
        </div>
      </div>
    );
  };

  const previewData = getTemplatePreview();
  const currentInboxEmails = emailLogs.filter(log => log.employeeId === selectedInboxEmpId);
  const activeInboxEmail = currentInboxEmails.find(log => log.id === selectedInboxEmailId) || currentInboxEmails[0];
  const activeInboxEmp = employees.find(e => e.id === selectedInboxEmpId) || employees[0];

  return (
    <div className="space-y-6">
      
      {/* Banner Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-purple-500" />
            <span>HR Email Dispatch Hub</span>
          </h2>
          <p className="text-xs text-slate-500">Deploy automated personalized communication campaigns & visually render received letters</p>
        </div>

        <button
          onClick={onClearLogs}
          className="px-3.5 py-2 bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear logs</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left Column: Campaign Config Panel */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-4 shadow-sm dark:shadow-none self-start">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Configure Campaign</h3>
            <span className="text-[9px] font-mono bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 px-1.5 py-0.5 rounded font-bold">READY</span>
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-mono text-slate-400 font-semibold block">Campaign Preset</label>
            <div className="grid grid-cols-2 gap-2">
              {(['Birthday', 'Work Anniversary', 'Payslip', 'General Notice'] as const).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setCampaignType(type)}
                  className={`py-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                    campaignType === type 
                      ? 'bg-purple-50 dark:bg-purple-950/30 border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-400' 
                      : 'bg-transparent border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-mono text-slate-400 font-semibold block">Target Recipient</label>
            <select
              value={selectedEmpId}
              onChange={e => setSelectedEmpId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-lg p-2.5 text-slate-900 dark:text-white outline-none focus:border-purple-500"
            >
              {employees.map(e => (
                <option key={e.id} value={e.id}>{e.name} ({e.email})</option>
              ))}
            </select>
          </div>

          {campaignType === 'General Notice' && (
            <>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono text-slate-400 font-semibold block">Email Subject</label>
                <input
                  type="text"
                  required
                  value={customSubject}
                  onChange={e => setCustomSubject(e.target.value)}
                  placeholder="e.g. All-Hands Q3 Sync Announcement"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-lg p-2.5 text-slate-900 dark:text-white outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono text-slate-400 font-semibold block">Email Body / Template</label>
                <textarea
                  rows={4}
                  required
                  value={customBody}
                  onChange={e => setCustomBody(e.target.value)}
                  placeholder="Draft your general memo here..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-lg p-2.5 text-slate-900 dark:text-white outline-none focus:border-purple-500"
                />
              </div>
            </>
          )}

          {/* Dispatch Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5">
            <button
              onClick={copyStyledEmailToClipboard}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                copied 
                  ? 'bg-emerald-600 text-white shadow-emerald-500/10' 
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/10'
              }`}
              title="Copies the fully-styled HTML email card to your clipboard. Simply paste (Ctrl+V) it in Gmail or Outlook to send an identical beautiful design!"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 shrink-0 animate-bounce" />
                  <span>Copied Styled Email! Paste in Mail client 🎉</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 shrink-0" />
                  <span>Copy Styled Email (Paste in Gmail/Outlook)</span>
                </>
              )}
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={triggerGmailWebCampaign}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-700"
                title="Opens Gmail Online in your browser with a pre-filled draft containing the subject and template"
              >
                <Mail className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                <span>Open in Gmail</span>
              </button>

              <button
                onClick={triggerLocalMailtoCampaign}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-700"
                title="Instantly opens your default local Mail client with subject and template pre-filled"
              >
                <ExternalLink className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                <span>Local Mail App</span>
              </button>
            </div>

            <p className="text-[10px] text-center text-slate-400 mt-1">
              💡 <b>Tip:</b> Click <b>Copy Styled Email</b> to paste the exact beautiful gradient design with tables and perks into your email compose window!
            </p>
          </div>
        </div>

        {/* Right Column: Interaction & Simulator Panel */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm dark:shadow-none flex flex-col min-h-[550px]">
          
          {/* Tabs header */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 mb-4 p-0.5 bg-slate-50 dark:bg-slate-950 rounded-xl">
            <button
              onClick={() => setActiveLogTab('inbox')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeLogTab === 'inbox'
                  ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm border border-slate-200/40 dark:border-slate-800/40'
                  : 'text-slate-500 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>Recipient Inbox Simulator</span>
              {emailLogs.length > 0 && (
                <span className="text-[9px] bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 px-1.5 py-0.5 rounded-full font-mono font-extrabold">
                  {emailLogs.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveLogTab('preview')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeLogTab === 'preview'
                  ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm border border-slate-200/40 dark:border-slate-800/40'
                  : 'text-slate-500 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Design Preview</span>
            </button>
            <button
              onClick={() => setActiveLogTab('outbox')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeLogTab === 'outbox'
                  ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm border border-slate-200/40 dark:border-slate-800/40'
                  : 'text-slate-500 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Outbox Registry</span>
            </button>
          </div>

          {/* Tab Content 1: Recipient Inbox Simulator (Gmail/Outlook Mimic) */}
          {activeLogTab === 'inbox' && (
            <div className="flex flex-col flex-1">
              
              {/* Profile selector dropdown */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl mb-4">
                <span className="text-[10px] font-bold font-mono text-slate-500 shrink-0">Switch Mailbox:</span>
                <select
                  value={selectedInboxEmpId}
                  onChange={e => {
                    setSelectedInboxEmpId(e.target.value);
                    setSelectedInboxEmailId(null);
                  }}
                  className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs rounded-lg p-1.5 text-slate-900 dark:text-white outline-none focus:border-purple-500"
                >
                  {employees.map(e => {
                    const count = emailLogs.filter(l => l.employeeId === e.id).length;
                    return (
                      <option key={e.id} value={e.id}>
                        {e.name} ({count} received)
                      </option>
                    );
                  })}
                </select>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[9px] font-mono font-bold text-slate-400">ONLINE</span>
                </div>
              </div>

              {currentInboxEmails.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-1 items-stretch">
                  
                  {/* Left Column of Inbox: Mail items */}
                  <div className="md:col-span-2 border-r border-slate-200 dark:border-slate-800 pr-1 space-y-2 max-h-[380px] overflow-y-auto">
                    {currentInboxEmails.map(log => {
                      const isActive = activeInboxEmail?.id === log.id;
                      const sender = getSenderForCampaign(log.campaignType);
                      return (
                        <div
                          key={log.id}
                          onClick={() => setSelectedInboxEmailId(log.id)}
                          className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                            isActive
                              ? 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800/80 shadow-xs'
                              : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-850'
                          }`}
                        >
                          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                            <span>{sender}</span>
                            <span>{log.timestamp.split(' ')[1]}</span>
                          </div>
                          <p className={`text-[11px] font-bold mt-1 truncate ${isActive ? 'text-purple-700 dark:text-purple-400' : 'text-slate-900 dark:text-slate-200'}`}>
                            {log.subject}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {log.body}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Right Column of Inbox: Render area */}
                  <div className="md:col-span-3 max-h-[380px] overflow-y-auto bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800/50 rounded-xl p-3 flex flex-col justify-between">
                    {activeInboxEmail ? (
                      <div className="space-y-4">
                        {/* Header Details */}
                        <div className="border-b border-slate-200 dark:border-slate-800 pb-2 text-left">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-[11px] font-bold text-slate-900 dark:text-white">
                                {getSenderForCampaign(activeInboxEmail.campaignType)}
                              </p>
                              <p className="text-[9px] text-slate-500">
                                To: {activeInboxEmail.employeeName} &lt;{activeInboxEmail.recipientEmail}&gt;
                              </p>
                            </div>
                            <span className="text-[8px] font-mono font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded">
                              {activeInboxEmail.timestamp}
                            </span>
                          </div>
                        </div>

                        {/* Beautiful Visual Render */}
                        {renderEmailCardHTML(
                          activeInboxEmail.campaignType,
                          activeInboxEmail.employeeName,
                          activeInboxEmail.subject,
                          activeInboxEmail.body,
                          activeInboxEmp
                        )}
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-6">
                        <Mail className="w-8 h-8 text-purple-300 animate-pulse mb-2" />
                        <span className="text-xs text-slate-500 font-bold">Select an email to render preview</span>
                      </div>
                    )}
                  </div>

                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-200 dark:border-slate-800/60 rounded-2xl bg-slate-50 dark:bg-slate-950/20">
                  <Mail className="w-10 h-10 text-slate-400 dark:text-slate-600 animate-bounce mb-3" />
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Inbox is empty for {activeInboxEmp?.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm">
                    No campaigns have been dispatched to this staff member yet. Use the campaign builder to dispatch one!
                  </p>
                  <button 
                    onClick={() => {
                      setSelectedEmpId(selectedInboxEmpId);
                      setCampaignType('Birthday');
                    }}
                    className="mt-4 px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>Configure Preset for {activeInboxEmp?.name.split(' ')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

            </div>
          )}

          {/* Tab Content 2: Live Design Preview (Real-time dynamic compilation) */}
          {activeLogTab === 'preview' && (
            <div className="flex-1 flex flex-col justify-between space-y-4">
              <div className="text-left bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 p-3 rounded-xl">
                <p className="text-[11px] font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-500 animate-pulse" />
                  <span>Real-time Template Render Compiler</span>
                </p>
                <p className="text-[10px] text-purple-700 dark:text-purple-400 mt-0.5">
                  Rendering preset values and layout styles matching the target: <b>{previewData.emp?.name}</b>.
                </p>
              </div>

              <div className="flex-1 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/60 rounded-2xl max-h-[380px] overflow-y-auto">
                {renderEmailCardHTML(
                  campaignType,
                  previewData.emp?.name || 'Employee',
                  previewData.subject,
                  previewData.body,
                  previewData.emp
                )}
              </div>

              <div className="flex flex-col gap-2 pt-3 border-t border-slate-100 dark:border-slate-800/60">
                <button
                  onClick={copyStyledEmailToClipboard}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
                    copied 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-purple-600 hover:bg-purple-500 text-white'
                  }`}
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      <span>Copied Styled HTML Email! Paste it now 🌟</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 shrink-0" />
                      <span>Copy Styled HTML Email for Pasting</span>
                    </>
                  )}
                </button>

                <div className="flex justify-between items-center gap-2 mt-1">
                  <span className="text-[10px] font-mono text-slate-400">Preset: {campaignType}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={triggerLocalMailtoCampaign}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-bold rounded-lg transition-all cursor-pointer border border-slate-200 dark:border-slate-700/60"
                    >
                      Mail App 📬
                    </button>
                    <button
                      onClick={triggerGmailWebCampaign}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-bold rounded-lg transition-all cursor-pointer border border-slate-200 dark:border-slate-700/60"
                    >
                      Gmail Online 🚀
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 3: Outbox Registry (Audit logs) */}
          {activeLogTab === 'outbox' && (
            <div className="flex-1 flex flex-col justify-between">
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {emailLogs.map(log => {
                  const isSent = log.status === 'Sent';
                  const isSimulated = log.status === 'Simulated';
                  const isFailed = log.status === 'Failed' || log.status === 'SMTP-Failed';
                  
                  return (
                    <div 
                      key={log.id} 
                      className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl space-y-2.5 shadow-sm transition-colors text-left"
                    >
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-slate-900 dark:text-slate-100">{log.employeeName} ({log.recipientEmail})</span>
                        <span className={`flex items-center gap-1 font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                          isSent ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200/40' :
                          isSimulated ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-500 dark:text-blue-400 border border-blue-200/40' :
                          'bg-rose-50 dark:bg-rose-950/30 text-rose-500 dark:text-rose-400 border border-rose-200/40'
                        }`}>
                          {isSent && <CheckCircle className="w-3 h-3 text-emerald-500" />}
                          {isSimulated && <CheckCircle className="w-3 h-3 text-blue-500" />}
                          {isFailed && <XCircle className="w-3 h-3 text-rose-500" />}
                          {log.status}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <span className="font-extrabold text-slate-500 dark:text-slate-400 uppercase block font-mono text-[9px] tracking-wider">Campaign: {log.campaignType}</span>
                        <span className="font-semibold text-purple-700 dark:text-purple-400 block text-xs">Subject: {log.subject}</span>
                        <p className="text-slate-600 dark:text-slate-300 whitespace-pre-line text-[11px] mt-1 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/60 font-sans italic">
                          "{log.body}"
                        </p>
                      </div>

                      {log.previewUrl && (
                        <div className="pt-1">
                          <a 
                            href={log.previewUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white text-[10px] font-bold rounded-lg transition-all shadow-sm cursor-pointer"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>View Delivered Email Inbox (Ethereal Free SMTP)</span>
                          </a>
                        </div>
                      )}

                      <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-900/60">
                        <span>ID: {log.id}</span>
                        <span>{log.timestamp}</span>
                      </div>
                    </div>
                  );
                })}

                {emailLogs.length === 0 && (
                  <div className="h-64 flex flex-col items-center justify-center text-center">
                    <Mail className="w-10 h-10 text-slate-400 dark:text-slate-600 animate-bounce mb-2" />
                    <span className="text-xs text-slate-500 font-bold">No emails dispatched in current session</span>
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

