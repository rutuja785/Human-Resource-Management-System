import { DocTemplate } from "../types";

export const PREMADE_TEMPLATES: DocTemplate[] = [
  {
    id: "offer-letter",
    title: "Job Offer Letter",
    description: "Standard job offer details including compensation, start date, and role.",
    category: "Onboarding",
    defaultPrompt: "Generate a formal Job Offer Letter for an employee. Include placeholders for role, department, annual salary, reporting manager, and start date. Keep the tone warm, welcoming, and highly professional.",
    placeholderText: `# JOB OFFER LETTER

Date: [Current Date]

Dear [Employee Name],

We are thrilled to offer you the position of **[Job Title]** in the **[Department]** department at our company, effective **[Start Date]**.

## 1. Compensation and Benefits
Your initial gross annual salary will be **[Salary]**, paid in accordance with our standard payroll cycle. You will also be eligible for our comprehensive benefits package, including medical insurance, paid time off, and retirement contributions.

## 2. Reporting
In this role, you will report directly to **[Manager Name]**. 

## 3. Terms of Employment
This offer is contingent upon successful completion of background checks and signing our standard Non-Disclosure Agreement (NDA).

To accept this offer, please sign and return this letter by [Acceptance Deadline].

We look forward to welcoming you to the team!

Warm regards,

**[HR Representative Name]**  
Head of Human Resources
`
  },
  {
    id: "employment-agreement",
    title: "Employment Agreement",
    description: "Detailed legal contract outlining code of conduct, hours, and termination terms.",
    category: "Legal",
    defaultPrompt: "Generate a standard Employment Agreement outline including standard clauses like probationary period, hours of work, confidentiality, and termination conditions.",
    placeholderText: `# EMPLOYMENT AGREEMENT

This Employment Agreement (the "Agreement") is entered into as of [Date] by and between:

**Employer:** HR Studio Corporation  
**Employee:** [Employee Name]

### 1. Position and Duties
The Employee is hired as a **[Job Title]**. The Employee agrees to perform all duties required by this position faithfully and to the best of their ability.

### 2. Probationary Period
The first three (3) months of employment shall be a probationary period, during which either party may terminate this agreement with one week's notice.

### 3. Hours of Work and Location
This is a full-time position requiring approximately 40 hours per week. The location of work will be [Location / Remote].

### 4. Confidentiality
The Employee agrees not to disclose any confidential information, trade secrets, or proprietary data of the Employer both during and after the termination of employment.

### 5. Termination
Following the probationary period, either party may terminate this agreement by providing two (2) weeks' written notice.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

Employer Signature: _____________________  
Employee Signature: _____________________
`
  },
  {
    id: "certificate-appreciation",
    title: "Certificate of Appreciation",
    description: "Recognize outstanding contributions or performance milestones.",
    category: "Recognition",
    defaultPrompt: "Generate a beautiful Certificate of Appreciation text recognizing an employee for outstanding performance, leadership, and dedication. Include placeholders for specific achievement details.",
    placeholderText: `# CERTIFICATE OF APPRECIATION

This certificate is proudly presented to:

## **[Employee Name]**

In recognition of your exceptional dedication, outstanding performance, and invaluable contributions to the **[Department]** team. 

Your recent achievements in **[Brief Achievement Description]** have demonstrated the highest levels of excellence and teamwork, inspiring those around you.

Thank you for your continuous commitment to HR Studio Corporation's mission and core values.

Presented on this **[Date]** day of **[Month]**, **[Year]**.

__________________________  
**[Executive Sponsor]**  
Chief Executive Officer
`
  },
  {
    id: "performance-review",
    title: "Performance Review",
    description: "A comprehensive feedback form with goals, strengths, and areas for growth.",
    category: "Performance",
    defaultPrompt: "Generate a professional Performance Review document outlining feedback, core competencies, achieved goals, and future objectives.",
    placeholderText: `# EMPLOYEE PERFORMANCE REVIEW

**Employee Name:** [Employee Name]  
**Job Title:** [Job Title]  
**Department:** [Department]  
**Review Period:** [Year / Quarter]

---

### I. CORE COMPETENCIES

1. **Job Knowledge & Execution:** [Exceeds Expectations / Meets Expectations]  
   *Feedback:* Demonstrates outstanding mastery of technical requirements and consistently delivers high-quality output.
   
2. **Communication & Collaboration:** [Meets Expectations]  
   *Feedback:* Works productively across teams and keeps stakeholders informed on progress.

3. **Problem Solving & Initiative:** [Exceeds Expectations]  
   *Feedback:* Proactively identifies inefficiencies and proposes scalable, innovative fixes.

---

### II. MAJOR ACHIEVEMENTS
- Successfully completed and shipped [Project/Goal Name] ahead of schedule.
- Improved overall department workflow efficiency by [Percentage]%.

---

### III. AREAS FOR DEVELOPMENT
- Further strengthen mentoring skills for junior staff.
- Deeper immersion into long-term strategic roadmaps.

---

### IV. FUTURE GOALS
1. Lead the upcoming [New Project Name] lifecycle.
2. Complete certification in [Relevant Skill/Technology].

Reviewer Name: _______________________  
Date: _______________________
`
  },
  {
    id: "promotion-announcement",
    title: "Promotion Announcement",
    description: "Congratulatory letter notifying the employee and company of a title elevation.",
    category: "Recognition",
    defaultPrompt: "Generate an inspiring Promotion Announcement letter that details the employee's new title, salary elevation, reporting line changes, and expressions of corporate gratitude.",
    placeholderText: `# PROMOTION ANNOUNCEMENT

Dear **[Employee Name]**,

We are incredibly pleased to formally announce your promotion to the position of **[New Job Title]**, effective **[Effective Date]**.

This promotion is a direct reflection of your hard work, leadership, and the substantial impact you have had within the **[Department]** department. Specifically, your leadership on **[Key Project]** has been exemplary.

### Key Changes:
* **New Title:** [New Job Title]
* **Reporting to:** [New Manager Name]
* **New Base Compensation:** [New Salary]

On behalf of the entire executive leadership team, we want to thank you for your commitment and congratulate you on this well-deserved promotion. We look forward to seeing you thrive in your new leadership capacity!

Sincerely,

**[Executive Name]**  
[Title]
`
  }
];

export const INITIAL_EMPLOYEES = [
  {
    id: "EMP-1024",
    name: "Alex Rivera",
    email: "alex.rivera@hrstudio.co",
    role: "Senior Software Engineer",
    department: "Engineering",
    birthDate: "1994-07-15", // Close to 13th July! Perfect for demo
    joinDate: "2021-03-10",
    phone: "+1 (555) 234-5678",
    avatarColor: "#3B82F6",
    salary: "$135,000",
    notes: "Alex leads our React team. Extremely strong mentor. Birthday in 2 days!"
  },
  {
    id: "EMP-1025",
    name: "Sofia Chen",
    email: "sofia.chen@hrstudio.co",
    role: "Lead Product Designer",
    department: "Product Design",
    birthDate: "1991-07-13", // TODAY (July 13th based on current date meta!) Perfect for showcasing Today's Birthday!
    joinDate: "2020-08-15",
    phone: "+1 (555) 876-5432",
    avatarColor: "#EC4899",
    salary: "$128,000",
    notes: "Sofia is an exceptional visual storyteller. Today is her birthday!"
  },
  {
    id: "EMP-1026",
    name: "Marcus Aurelius",
    email: "marcus.a@hrstudio.co",
    role: "HR Operations Manager",
    department: "People & Culture",
    birthDate: "1988-11-20",
    joinDate: "2019-01-05",
    phone: "+1 (555) 456-7890",
    avatarColor: "#10B981",
    salary: "$95,000",
    notes: "Marcus oversees payroll and compliance. Avid philosopher."
  }
];
