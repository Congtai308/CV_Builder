export interface ResumeData {
  personal: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    github: string;
    linkedin: string;
  };

  summary: string;

  education: {
    id: string;
    school: string;
    degree: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];

  experience: {
    id: string;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string[];
  }[];

  projects: {
    id: string;
    name: string;
    role: string;
    url: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string[];
  }[];

  skills: {
    languages: string;
    frameworks: string;
    tools: string;
    databases: string;
    cloud: string;
  };

  certifications: {
    id: string;
    name: string;
    issuer: string;
    year: string;
  }[];
}