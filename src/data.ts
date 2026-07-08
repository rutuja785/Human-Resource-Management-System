import { 
  Employee, 
  LeaveRequest, 
  AttendanceLog, 
  EmployeeDocument, 
  JobOpening, 
  Candidate, 
  Asset, 
  Appraisal, 
  HRNotification, 
  EmailCampaign 
} from './types';

export const initialEmployees: Employee[] = [
  {
    id: 'EMP-101',
    name: 'Sarah Jenkins',
    email: 'sjenkins@daydrift.co',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    role: 'VP of Engineering',
    department: 'Engineering',
    status: 'Active',
    contact: '+1 (555) 019-2834',
    hireDate: '2022-04-12',
    salary: { basic: 8500, hra: 3400, allowances: 2100, deductions: 1200 }
  },
  {
    id: 'EMP-102',
    name: 'Michael Chen',
    email: 'mchen@daydrift.co',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    role: 'Lead UX Designer',
    department: 'Design',
    status: 'Active',
    contact: '+1 (555) 014-9988',
    hireDate: '2023-01-15',
    salary: { basic: 7200, hra: 2880, allowances: 1800, deductions: 950 }
  },
  {
    id: 'EMP-103',
    name: 'Alisha Patel',
    email: 'apatel@daydrift.co',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
    role: 'Senior Frontend Developer',
    department: 'Engineering',
    status: 'Active',
    contact: '+1 (555) 017-3322',
    hireDate: '2023-08-01',
    salary: { basic: 6500, hra: 2600, allowances: 1400, deductions: 800 }
  },
  {
    id: 'EMP-104',
    name: 'David Kojo',
    email: 'dkojo@daydrift.co',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    role: 'HR Specialist',
    department: 'Human Resources',
    status: 'Active',
    contact: '+1 (555) 012-7744',
    hireDate: '2021-11-10',
    salary: { basic: 5000, hra: 2000, allowances: 1100, deductions: 600 }
  },
  {
    id: 'EMP-105',
    name: 'Elena Rostova',
    email: 'erostova@daydrift.co',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    role: 'Product Manager',
    department: 'Product',
    status: 'On Leave',
    contact: '+1 (555) 011-5511',
    hireDate: '2024-02-28',
    salary: { basic: 7800, hra: 3120, allowances: 1950, deductions: 1100 }
  },
  {
    id: 'EMP-106',
    name: 'Marcus Brody',
    email: 'mbrody@daydrift.co',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
    role: 'Security Engineer',
    department: 'Engineering',
    status: 'Active',
    contact: '+1 (555) 013-1122',
    hireDate: '2024-05-15',
    salary: { basic: 7000, hra: 2800, allowances: 1500, deductions: 900 }
  }
];

export const initialLeaveRequests: LeaveRequest[] = [
  {
    id: 'LRV-501',
    employeeId: 'EMP-105',
    employeeName: 'Elena Rostova',
    leaveType: 'Maternity Leave',
    startDate: '2026-06-20',
    endDate: '2026-09-20',
    reason: 'Family expansion and maternity leave care.',
    status: 'Approved',
    days: 92
  },
  {
    id: 'LRV-502',
    employeeId: 'EMP-103',
    employeeName: 'Alisha Patel',
    leaveType: 'Annual Sick Leave',
    startDate: '2026-07-06',
    endDate: '2026-07-08',
    reason: 'Severe seasonal flu symptoms and dental surgery recovery.',
    status: 'Pending',
    days: 3
  },
  {
    id: 'LRV-503',
    employeeId: 'EMP-102',
    employeeName: 'Michael Chen',
    leaveType: 'Casual Leave',
    startDate: '2026-07-15',
    endDate: '2026-07-16',
    reason: 'Attending sibling\'s wedding in New York.',
    status: 'Pending',
    days: 2
  },
  {
    id: 'LRV-504',
    employeeId: 'EMP-106',
    employeeName: 'Marcus Brody',
    leaveType: 'Casual Leave',
    startDate: '2026-06-01',
    endDate: '2026-06-02',
    reason: 'Extended weekend trip.',
    status: 'Approved',
    days: 2
  }
];

export const initialAttendanceLogs: AttendanceLog[] = [
  {
    id: 'ATT-001',
    employeeId: 'EMP-101',
    employeeName: 'Sarah Jenkins',
    date: '2026-07-04',
    checkIn: '08:45',
    checkOut: '17:30',
    status: 'Present'
  },
  {
    id: 'ATT-002',
    employeeId: 'EMP-102',
    employeeName: 'Michael Chen',
    date: '2026-07-04',
    checkIn: '09:05',
    checkOut: '18:15',
    status: 'Present'
  },
  {
    id: 'ATT-003',
    employeeId: 'EMP-103',
    employeeName: 'Alisha Patel',
    date: '2026-07-04',
    checkIn: '09:35',
    checkOut: '17:00',
    status: 'Late'
  },
  {
    id: 'ATT-004',
    employeeId: 'EMP-104',
    employeeName: 'David Kojo',
    date: '2026-07-04',
    checkIn: '08:50',
    checkOut: '17:10',
    status: 'Present'
  },
  {
    id: 'ATT-005',
    employeeId: 'EMP-106',
    employeeName: 'Marcus Brody',
    date: '2026-07-04',
    checkIn: '08:58',
    checkOut: '18:00',
    status: 'Present'
  }
];

export const initialDocuments: EmployeeDocument[] = [
  {
    id: 'DOC-901',
    employeeId: 'EMP-101',
    name: 'Employment_Contract_SJenkins.pdf',
    category: 'Contract',
    uploadDate: '2022-04-12',
    size: '1.4 MB'
  },
  {
    id: 'DOC-902',
    employeeId: 'EMP-101',
    name: 'Passport_Scan_Sarah_J.jpg',
    category: 'ID Proof',
    uploadDate: '2022-04-12',
    size: '4.2 MB'
  },
  {
    id: 'DOC-903',
    employeeId: 'EMP-102',
    name: 'UX_Design_Master_Degree.pdf',
    category: 'Certificate',
    uploadDate: '2023-01-15',
    size: '2.8 MB'
  },
  {
    id: 'DOC-904',
    employeeId: 'EMP-104',
    name: 'HR_Ethics_Compliance_Cert.pdf',
    category: 'Certificate',
    uploadDate: '2021-11-20',
    size: '950 KB'
  }
];

export const initialJobOpenings: JobOpening[] = [
  {
    id: 'JOB-201',
    title: 'Senior DevOps Engineer',
    department: 'Engineering',
    location: 'Remote, US',
    type: 'Full-time',
    status: 'Active',
    applicantsCount: 14
  },
  {
    id: 'JOB-202',
    title: 'Visual Brand Designer',
    department: 'Design',
    location: 'San Francisco, CA',
    type: 'Full-time',
    status: 'Active',
    applicantsCount: 8
  },
  {
    id: 'JOB-203',
    title: 'QA Automation Engineer',
    department: 'Engineering',
    location: 'Remote, Europe',
    type: 'Contract',
    status: 'Closed',
    applicantsCount: 22
  }
];

export const initialCandidates: Candidate[] = [
  {
    id: 'CND-801',
    name: 'Raymond Fletcher',
    email: 'rfletcher@gmail.com',
    phone: '+1 (555) 018-4499',
    jobId: 'JOB-201',
    jobTitle: 'Senior DevOps Engineer',
    stage: 'Interview',
    appliedDate: '2026-06-25',
    resumeText: `RAYMOND FLETCHER - SENIOR DEVOPS ENGINEER
Email: rfletcher@gmail.com | Phone: (555) 018-4499
Summary: 7+ years of experience in managing Kubernetes clusters, AWS cloud infrastructure (Terraform, CloudFormation), and CI/CD pipelines (GitHub Actions, Jenkins). Passionate about dev productivity and system observability.
Skills: Kubernetes, Docker, AWS, Terraform, GitHub Actions, Prometheus, Grafana, Python, Bash.
Experience:
- Lead DevOps Engineer at CloudSpace (2022-Present): Migrated legacy applications to AWS EKS, reducing cloud spend by 35% and build latency by 50%.
- DevOps Engineer at FinTechCorp (2019-2022): Built secure PCI-compliant infrastructure on AWS using Terraform. Automated infrastructure deployment.`,
    aiScore: 92,
    aiEvaluation: 'Excellent DevOps background. Extremely strong Kubernetes and AWS skills. Highly suited for Senior DevOps Engineer. Demonstrated leadership and substantial savings in cloud budget in previous roles.'
  },
  {
    id: 'CND-802',
    name: 'Clara Oswald',
    email: 'coswald@gmail.com',
    phone: '+1 (555) 011-8811',
    jobId: 'JOB-202',
    jobTitle: 'Visual Brand Designer',
    stage: 'Applied',
    appliedDate: '2026-07-02',
    resumeText: `CLARA OSWALD - VISUAL BRAND DESIGNER
Email: coswald@gmail.com | Portfolio: claraoswald.design
Professional Designer with 4 years creating outstanding SaaS brand assets, Figma component systems, and premium promotional marketing illustrations.
Expert in: Figma, Illustrator, Photoshop, Framer, Webflow, After Effects.
Experience:
- Graphic & Web Designer at PitchUp SaaS (2023-Present): Redesigned the brand identity resulting in 40% increase in lead generation. Created promotional materials and marketing pages in Framer.`,
    aiScore: 85,
    aiEvaluation: 'Strong portfolio and SaaS branding experience. Expert in Figma and modern landing page builders like Framer. Standard UI/UX design skillset. Recommend moving to interview stage for brand designer role.'
  },
  {
    id: 'CND-803',
    name: 'George Henderson',
    email: 'ghenderson@gmail.com',
    phone: '+1 (555) 014-4321',
    jobId: 'JOB-201',
    jobTitle: 'Senior DevOps Engineer',
    stage: 'Rejected',
    appliedDate: '2026-06-22',
    resumeText: `GEORGE HENDERSON - IT SUPPORT / NETWORK TECH
Experienced in network infrastructure installation, router config, hardware setups, and level 2 IT support helpdesk tickets.
Technical Skills: Cisco routers, LAN/WAN, Windows Server, Linux Server administration, Active Directory, ticket resolution.`,
    aiScore: 30,
    aiEvaluation: 'Candidate has IT and networking support background, but lacks AWS, Kubernetes, and automated CI/CD experience required for a Senior DevOps position. Not suitable.'
  }
];

export const initialAssets: Asset[] = [
  {
    id: 'AST-401',
    name: 'MacBook Pro 16" (M3 Pro, 32GB)',
    serialNumber: 'C02HG89UP01F',
    category: 'Laptop',
    status: 'Assigned',
    assignedToId: 'EMP-101',
    assignedToName: 'Sarah Jenkins',
    purchaseDate: '2024-01-10'
  },
  {
    id: 'AST-402',
    name: 'MacBook Pro 14" (M2 Pro, 16GB)',
    serialNumber: 'C02FG42UP05G',
    category: 'Laptop',
    status: 'Assigned',
    assignedToId: 'EMP-103',
    assignedToName: 'Alisha Patel',
    purchaseDate: '2023-08-05'
  },
  {
    id: 'AST-403',
    name: 'Studio Display 27" 5K',
    serialNumber: 'S27A5K9981B',
    category: 'Monitor',
    status: 'Assigned',
    assignedToId: 'EMP-102',
    assignedToName: 'Michael Chen',
    purchaseDate: '2023-02-18'
  },
  {
    id: 'AST-404',
    name: 'iPhone 15 Pro Max (256GB)',
    serialNumber: 'G89H2D8Y791L',
    category: 'Mobile',
    status: 'Available',
    purchaseDate: '2023-11-15'
  },
  {
    id: 'AST-405',
    name: 'Dell UltraSharp 34" Curved',
    serialNumber: 'DEL34C81102A',
    category: 'Monitor',
    status: 'Maintenance',
    purchaseDate: '2022-09-12'
  }
];

export const initialAppraisals: Appraisal[] = [
  {
    id: 'APP-701',
    employeeId: 'EMP-103',
    employeeName: 'Alisha Patel',
    reviewerName: 'Sarah Jenkins',
    period: 'H1 2026',
    goalsSet: '1. Standardize UI component library in Tailwind V4.\n2. Improve dashboard render performance by 30%.\n3. Mentor junior frontend engineers.',
    selfRating: 4.5,
    managerRating: 4.8,
    feedback: 'Alisha has excelled in building robust design systems. The Tailwind V4 migration was a huge success. Mentorship has been appreciated by all juniors. Outstanding work!',
    status: 'Approved',
    date: '2026-06-30'
  },
  {
    id: 'APP-702',
    employeeId: 'EMP-102',
    employeeName: 'Michael Chen',
    reviewerName: 'Sarah Jenkins',
    period: 'H1 2026',
    goalsSet: '1. Deliver redesigned mobile app UX prototype.\n2. Conduct usability testing with 20 real users.\n3. Implement dark mode layouts across full dashboard.',
    selfRating: 4.2,
    managerRating: 4.0,
    feedback: 'Michael has delivered gorgeous visual guidelines. The Framer and Stripe inspired assets are premium. Next term, let\'s focus on finishing usability studies earlier.',
    status: 'Submitted',
    date: '2026-07-01'
  }
];

export const initialNotifications: HRNotification[] = [
  {
    id: 'NTF-001',
    title: 'New Leave Request',
    message: 'Alisha Patel applied for Casual Leave for 3 days starting July 6th.',
    date: '2026-07-05 08:30',
    type: 'leave',
    read: false
  },
  {
    id: 'NTF-002',
    title: 'Appraisal Submitted',
    message: 'Michael Chen submitted his H1 2026 self-appraisal review.',
    date: '2026-07-01 14:15',
    type: 'general',
    read: true
  },
  {
    id: 'NTF-003',
    title: 'New Candidate Applied',
    message: 'Clara Oswald applied for the Visual Brand Designer position.',
    date: '2026-07-02 10:05',
    type: 'recruitment',
    read: false
  },
  {
    id: 'NTF-004',
    title: 'Payroll Generated',
    message: 'Draft payroll calculations for June 2026 are generated and pending review.',
    date: '2026-06-30 18:00',
    type: 'payroll',
    read: true
  }
];

export const initialEmailCampaigns: EmailCampaign[] = [
  {
    id: 'ECP-001',
    name: 'Personalized Birthday Wish',
    triggerType: 'Birthday',
    subject: 'Happy Birthday, {{employee_name}}! 🎂',
    templateBody: 'Hi {{employee_name}},\n\nWishing you a fantastic birthday from all of us here at Daydrift! 🥂 Thank you for bringing your awesome energy and talent to our team every single day. We hope your year ahead is filled with joy, growth, and happiness.\n\nEnjoy your special day!\n\nBest Wishes,\nYour Daydrift HR Team',
    active: true
  },
  {
    id: 'ECP-002',
    name: 'Work Anniversary Milestone',
    triggerType: 'Anniversary',
    subject: 'Congratulations on {{years}} Years at Daydrift! 🎉',
    templateBody: 'Hi {{employee_name}},\n\nHappy Work Anniversary! 🌟 Today marks {{years}} year(s) since you joined our mission. We are incredibly grateful for your dedication, brilliant work, and positive impact on the team. We look forward to achieving many more milestones together!\n\nWarmly,\nYour Daydrift Family',
    active: true
  },
  {
    id: 'ECP-003',
    name: 'Monthly Payslip Notification',
    triggerType: 'Payslip',
    subject: 'Daydrift - Your Payslip for {{month}} is Available 💰',
    templateBody: 'Hello {{employee_name}},\n\nYour payslip for the month of {{month}} is now available for download. \n\nNet Pay Credited: ${{net_pay}}\nPayment Date: {{pay_date}}\n\nYou can access detailed deductions and basic breakdowns by logging into your Daydrift ESS (Employee Self-Service) portal anytime.\n\nBest regards,\nDaydrift Finance Department',
    active: true
  },
  {
    id: 'ECP-004',
    name: 'New Hire Onboarding Welcome',
    triggerType: 'Welcome',
    subject: 'Welcome to Daydrift, {{employee_name}}! 🚀',
    templateBody: 'Welcome to the team, {{employee_name}}!\n\nWe are absolutely thrilled to have you join us as our new {{role}} in the {{department}} department.\n\nYour official start date is {{hire_date}}. On your first day, you will meet with your onboarding manager to review team guidelines, access setups, and receive your new company laptop.\n\nLet\'s build something extraordinary together!\n\nCheers,\nThe Daydrift HR & Executive Team',
    active: false
  }
];
