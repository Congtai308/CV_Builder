import { ResumeData } from "./types";

export const defaultResume: ResumeData = {
  personal: {
    name: "Your Name",
    title: "Software Engineer",
    email: "you@example.com",
    phone: "+1 (555) 000-0000",
    location: "City, Country",
    website: "",
    github: "github.com/username",
    linkedin: "linkedin.com/in/username",
  },

  summary:
    "Short summary of who you are, what you build, and what you're looking for. Two to three sentences.",

  education: [
    {
      id: crypto.randomUUID(),
      school: "Your University",
      degree: "B.S. in Computer Science",
      location: "City, Country",
      startDate: "",
      endDate: "Expected 2027",
      description: "GPA: 3.8/4.0",
    },
  ],

  experience: [
    {
      id: crypto.randomUUID(),
      company: "Company Name",
      position: "Software Engineer Intern",
      location: "City, Country",
      startDate: "June 2025",
      endDate: "August 2025",
      description: [
        "Describe an impact-focused achievement with a measurable outcome.",
        "Describe another achievement, tools/technologies used, and the result.",
      ],
    },
  ],

  projects: [
    {
      id: crypto.randomUUID(),
      name: "Project Name",
      role: "Full-stack Developer",
      url: "",
      location: "City, Country",
      startDate: "Jan 2025",
      endDate: "Mar 2025",
      description: [
        "Summarize the problem, your approach, and the outcome in one line.",
        "Call out a technical decision worth highlighting.",
      ],
    },
  ],

  skills: {
    languages: "TypeScript, JavaScript, Python",
    frameworks: "Next.js, React, Node.js",
    tools: "Git, Docker, PostgreSQL",
    databases: "MongoDB, MySQL",
    cloud: "AWS",
  },

  certifications: [],
};