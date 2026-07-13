import React from "react";
import { Employee } from "../types";
import { Mail, Calendar, CreditCard, FileText, Trash2, Cake, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { isBirthdayToday, getDaysUntilBirthday, getFriendlyBirthday } from "../utils";

interface EmployeeCardProps {
  key?: string;
  employee: Employee;
  currentDate: string;
  onSelectForDoc: (employee: Employee) => void;
  onSelectForID: (employee: Employee) => void;
  onSelectForMail: (employee: Employee) => void;
  onDelete: (id: string) => void;
}

export default function EmployeeCard({
  employee,
  currentDate,
  onSelectForDoc,
  onSelectForID,
  onSelectForMail,
  onDelete,
}: EmployeeCardProps) {
  const isBday = isBirthdayToday(employee.birthDate, currentDate);
  const daysLeft = getDaysUntilBirthday(employee.birthDate, currentDate);
  const friendlyBday = getFriendlyBirthday(employee.birthDate, currentDate);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.div
      id={`employee-card-${employee.id}`}
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className={`relative flex flex-col bg-white dark:bg-slate-900 rounded-2xl border ${
        isBday ? "border-amber-400 dark:border-amber-500/60 ring-2 ring-amber-100 dark:ring-amber-950/40 shadow-amber-50 dark:shadow-none" : "border-slate-100 dark:border-slate-800 shadow-xs"
      } shadow-md overflow-hidden hover:shadow-xl dark:hover:shadow-slate-950/50 transition-all`}
    >
      {/* Decorative colored top bar */}
      <div
        className="h-2 w-full"
        style={{ backgroundColor: employee.avatarColor || "#3B82F6" }}
      />

      {/* Birthday Banner */}
      {isBday && (
        <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm animate-pulse z-10">
          <Cake className="w-3.5 h-3.5" />
          Birthday Today!
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col">
        {/* Header: Avatar + Identity */}
        <div className="flex items-start gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-bold shadow-sm select-none shrink-0"
            style={{ backgroundColor: employee.avatarColor || "#3B82F6" }}
          >
            {getInitials(employee.name)}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-slate-800 dark:text-white text-lg leading-snug truncate hover:text-slate-900 dark:hover:text-indigo-200">
              {employee.name}
            </h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {employee.role}
            </p>
            <span className="inline-block mt-2 px-2.5 py-0.5 text-xs font-semibold text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 rounded-md border border-sky-100 dark:border-sky-900/60">
              {employee.department}
            </span>
          </div>
        </div>

        {/* Contact info list */}
        <div className="mt-5 space-y-2.5 text-sm border-t border-slate-50 dark:border-slate-800/60 pt-4 flex-1">
          <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300 min-w-0">
            <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
            <span className="truncate select-all">{employee.email}</span>
          </div>
          {employee.phone && (
            <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
              <span className="text-xs font-mono text-slate-400 dark:text-slate-500 shrink-0">☎</span>
              <span className="truncate">{employee.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
            <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
            <span className="truncate">{friendlyBday}</span>
          </div>
        </div>

        {/* Birthday Status Footer */}
        <div className="mt-4 p-2.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl flex items-center justify-between text-xs border border-transparent dark:border-slate-800/40">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Birthday countdown</span>
          {isBday ? (
            <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
              🎉 Celebrating Today!
            </span>
          ) : daysLeft <= 7 ? (
            <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-100 dark:border-amber-900/60">
              🎂 {daysLeft} {daysLeft === 1 ? "day" : "days"} left!
            </span>
          ) : (
            <span className="text-slate-600 dark:text-slate-300 font-medium">
              📅 {daysLeft} days left
            </span>
          )}
        </div>

        {/* Detailed notes badge */}
        {employee.notes && (
          <p className="mt-3 text-xs text-slate-400 dark:text-slate-500 italic line-clamp-2">
            "{employee.notes}"
          </p>
        )}
      </div>

      {/* Action buttons footer */}
      <div className="grid grid-cols-4 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/40 p-1.5 gap-1 select-none">
        <button
          id={`btn-mail-${employee.id}`}
          onClick={() => onSelectForMail(employee)}
          title="Send Birthday Greeting Email"
          className="flex flex-col items-center justify-center p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 active:bg-amber-100 dark:active:bg-amber-900/40 transition-all cursor-pointer"
        >
          <Mail className="w-4 h-4" />
          <span className="text-[10px] mt-0.5 font-medium">Draft</span>
        </button>

        <button
          id={`btn-badge-${employee.id}`}
          onClick={() => onSelectForID(employee)}
          title="Generate ID Badge (Front)"
          className="flex flex-col items-center justify-center p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 active:bg-indigo-100 dark:active:bg-indigo-900/40 transition-all cursor-pointer"
        >
          <CreditCard className="w-4 h-4" />
          <span className="text-[10px] mt-0.5 font-medium">ID Card</span>
        </button>

        <button
          id={`btn-doc-${employee.id}`}
          onClick={() => onSelectForDoc(employee)}
          title="Draft Customized Contract/Document"
          className="flex flex-col items-center justify-center p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 active:bg-emerald-100 dark:active:bg-indigo-900/40 transition-all cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span className="text-[10px] mt-0.5 font-medium">Docs</span>
        </button>

        <button
          id={`btn-del-${employee.id}`}
          onClick={() => onDelete(employee.id)}
          title="Delete Employee"
          className="flex flex-col items-center justify-center p-2 rounded-lg text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 active:bg-rose-100 dark:active:bg-indigo-900/40 transition-all cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          <span className="text-[10px] mt-0.5 font-medium">Delete</span>
        </button>
      </div>
    </motion.div>
  );
}
