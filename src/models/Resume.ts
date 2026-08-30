import mongoose, { Schema, Model } from "mongoose";

/* =========================================================
   PERSONAL
========================================================= */

const PersonalSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      default: "",
    },

    title: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    github: {
      type: String,
      default: "",
    },

    linkedin: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

/* =========================================================
   EDUCATION
========================================================= */

const EducationSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },

    school: {
      type: String,
      default: "",
    },

    degree: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    startDate: {
      type: String,
      default: "",
    },

    endDate: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

/* =========================================================
   EXPERIENCE
========================================================= */

const ExperienceSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },

    company: {
      type: String,
      default: "",
    },

    position: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    startDate: {
      type: String,
      default: "",
    },

    endDate: {
      type: String,
      default: "",
    },

    description: {
      type: [String],
      default: [],
    },
  },
  {
    _id: false,
  }
);

/* =========================================================
   PROJECT
========================================================= */

const ProjectSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      default: "",
    },

    url: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    startDate: {
      type: String,
      default: "",
    },

    endDate: {
      type: String,
      default: "",
    },

    description: {
      type: [String],
      default: [],
    },
  },
  {
    _id: false,
  }
);

/* =========================================================
   SKILLS
========================================================= */

const SkillsSchema = new Schema(
  {
    languages: {
      type: String,
      default: "",
    },

    frameworks: {
      type: String,
      default: "",
    },

    tools: {
      type: String,
      default: "",
    },

    databases: {
      type: String,
      default: "",
    },

    cloud: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

/* =========================================================
   CERTIFICATION
========================================================= */

const CertificationSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      default: "",
    },

    issuer: {
      type: String,
      default: "",
    },

    year: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

/* =========================================================
   RESUME SCHEMA
========================================================= */

const ResumeSchema = new Schema(
  {
    personal: {
      type: PersonalSchema,
      required: true,
    },

    summary: {
      type: String,
      default: "",
    },

    education: {
      type: [EducationSchema],
      default: [],
    },

    experience: {
      type: [ExperienceSchema],
      default: [],
    },

    projects: {
      type: [ProjectSchema],
      default: [],
    },

    skills: {
      type: SkillsSchema,
      default: {},
    },

    certifications: {
      type: [CertificationSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

/* =========================================================
   TYPES
========================================================= */

export interface ResumeDocument extends mongoose.Document {
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

  education: Array<{
    id: string;
    school: string;
    degree: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;

  experience: Array<{
    id: string;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string[];
  }>;

  projects: Array<{
    id: string;
    name: string;
    role: string;
    url: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string[];
  }>;

  skills: {
    languages: string;
    frameworks: string;
    tools: string;
    databases: string;
    cloud: string;
  };

  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    year: string;
  }>;
}

/* =========================================================
   MONGOOSE MODEL
========================================================= */

export const Resume: Model<ResumeDocument> =
  mongoose.models.Resume ||
  mongoose.model<ResumeDocument>("Resume", ResumeSchema);