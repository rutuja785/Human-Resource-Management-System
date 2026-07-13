import { Employee } from "./types";

/**
 * Lightweight, robust CSV parser to avoid external library dependencies
 */
export function parseCSV(text: string): Partial<Employee>[] {
  const lines = text.split(/\r?\n/);
  if (lines.length === 0) return [];

  // Parse headers
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const employees: Partial<Employee>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Handle quote enclosed values (basic CSV regex)
    const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(",");
    const values = matches.map((v) => v.replace(/^"|"$/g, "").trim());

    const emp: Record<string, string> = {};
    headers.forEach((header, index) => {
      if (values[index]) {
        emp[header] = values[index];
      }
    });

    // Normalize keys
    const name = emp.name || emp.fullname || emp["full name"] || "";
    const email = emp.email || emp["email address"] || "";
    const role = emp.role || emp.title || emp["job title"] || emp.position || "";
    const department = emp.department || emp.dept || "";
    const birthDate = emp.birthdate || emp.birthday || emp["birth date"] || emp.dob || "";
    const joinDate = emp.joindate || emp["join date"] || emp.hiredate || emp["hire date"] || "";
    const phone = emp.phone || emp["phone number"] || emp.mobile || "";
    const salary = emp.salary || emp.compensation || "";
    const notes = emp.notes || emp.about || "";

    if (name) {
      employees.push({
        name,
        email,
        role,
        department,
        birthDate: formatDate(birthDate),
        joinDate: formatDate(joinDate),
        phone,
        salary,
        notes,
      });
    }
  }

  return employees;
}

/**
 * Normalizes user-input dates to standard YYYY-MM-DD
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  
  // Try standard Date parsing
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    return d.toISOString().split("T")[0];
  }

  // Fallback for DD/MM/YYYY or MM/DD/YYYY manual parsing if possible
  const parts = dateStr.split(/[-/]/);
  if (parts.length === 3) {
    let y = parseInt(parts[2]);
    let m = parseInt(parts[0]);
    let day = parseInt(parts[1]);

    if (y < 100) y += 2000; // handle 2 digit years
    if (m > 12) {
      // swap day and month if DD/MM/YYYY
      const tmp = m;
      m = day;
      day = tmp;
    }
    
    try {
      const parsedDate = new Date(y, m - 1, day);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toISOString().split("T")[0];
      }
    } catch (e) {
      // return as is
    }
  }

  return dateStr;
}

/**
 * Returns modern warm background colors for avatars
 */
export function getRandomColor(): string {
  const colors = [
    "#3B82F6", // Blue
    "#10B981", // Emerald
    "#8B5CF6", // Purple
    "#EF4444", // Red
    "#F59E0B", // Amber
    "#EC4899", // Pink
    "#06B6D4", // Cyan
    "#84CC16", // Lime
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Helper to check if an employee has a birthday today.
 * Comparing MM-DD only, ignoring the year.
 */
export function isBirthdayToday(birthDateStr: string, currentDateStr: string = "2026-07-13"): boolean {
  if (!birthDateStr) return false;
  try {
    const bDate = new Date(birthDateStr);
    const currDate = new Date(currentDateStr);
    if (isNaN(bDate.getTime()) || isNaN(currDate.getTime())) return false;

    return bDate.getMonth() === currDate.getMonth() && bDate.getDate() === currDate.getDate();
  } catch (e) {
    return false;
  }
}

/**
 * Calculates days left until the next birthday from current date.
 * Ignores the birth year, computes upcoming occurrence in the calendar year.
 */
export function getDaysUntilBirthday(birthDateStr: string, currentDateStr: string = "2026-07-13"): number {
  if (!birthDateStr) return 999;
  try {
    const today = new Date(currentDateStr);
    today.setHours(0, 0, 0, 0);

    const birth = new Date(birthDateStr);
    const nextBday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());

    // If birthday has already occurred this year, check next year
    if (nextBday.getTime() < today.getTime()) {
      nextBday.setFullYear(today.getFullYear() + 1);
    }

    const diffTime = nextBday.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch (e) {
    return 999;
  }
}

/**
 * Formats a birthday to a friendly layout like "July 13 (Ages 35)"
 */
export function getFriendlyBirthday(birthDateStr: string, currentDateStr: string = "2026-07-13"): string {
  if (!birthDateStr) return "N/A";
  try {
    const birth = new Date(birthDateStr);
    const today = new Date(currentDateStr);
    if (isNaN(birth.getTime())) return birthDateStr;

    const monthName = birth.toLocaleString("default", { month: "long" });
    const day = birth.getDate();
    let age = today.getFullYear() - birth.getFullYear();
    
    // adjust age if birthday hasn't occurred yet this year
    const mDiff = today.getMonth() - birth.getMonth();
    if (mDiff < 0 || (mDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return `${monthName} ${day} (Age ${age})`;
  } catch (e) {
    return birthDateStr;
  }
}

/**
 * Creates direct Gmail draft link or mailto backup
 */
export function getGmailLink(email: string, subject: string, body: string): string {
  const encodedTo = encodeURIComponent(email);
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  
  // High-fidelity Gmail compose link
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedTo}&su=${encodedSubject}&body=${encodedBody}`;
}
