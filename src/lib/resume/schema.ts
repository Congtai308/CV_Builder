import { z } from "zod";

const personalSchema = z.object({
  name: z.string().trim().min(1, "Full Name không được để trống"),
  title: z.string(),
  email: z.string(),
  phone: z.string(),
  location: z.string(),
  website: z.string(),
  github: z.string(),
  linkedin: z.string(),
});

const educationSchema = z.object({
  id: z.string(),
  school: z.string(),
  degree: z.string(),
  location: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  description: z.string(),
});

const experienceSchema = z.object({
  id: z.string(),
  company: z.string(),
  position: z.string(),
  location: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  description: z.array(z.string()),
});

const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  url: z.string(),
  location: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  description: z.array(z.string()),
});

const skillsSchema = z.object({
  languages: z.string(),
  frameworks: z.string(),
  tools: z.string(),
  databases: z.string(),
  cloud: z.string(),
});

const certificationSchema = z.object({
  id: z.string(),
  name: z.string(),
  issuer: z.string(),
  year: z.string(),
});

export const resumeSchema = z.object({
  personal: personalSchema,

  summary: z.string(),

  education: z.array(educationSchema),

  experience: z.array(experienceSchema),

  projects: z.array(projectSchema),

  skills: skillsSchema,

  certifications: z.array(certificationSchema),
});