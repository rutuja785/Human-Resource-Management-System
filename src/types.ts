export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  birthDate: string; // YYYY-MM-DD
  joinDate: string;  // YYYY-MM-DD
  phone: string;
  avatarColor: string; // Background color for placeholder avatar
  avatarUrl?: string;  // Base64 or standard URL
  salary?: string;
  notes?: string;
}

export interface HRDocument {
  id: string;
  employeeId?: string;
  title: string;
  type: string;
  content: string; // Markdown or plain text
  createdAt: string;
}

export interface DocTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  defaultPrompt: string;
  placeholderText: string;
}
