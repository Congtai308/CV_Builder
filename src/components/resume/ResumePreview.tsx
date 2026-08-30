import {
  FaGithub,
  FaLinkedin,
  FaGlobe,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaExternalLinkAlt,
} from "react-icons/fa";

import { ResumeData } from "@/lib/resume/types";
import { normalizeText } from "@/lib/resume/normalize"
interface Props {
  resume: ResumeData;
}

export default function ResumePreview({
  resume,
}: Props) {
  return (
    <article className="harvard-resume">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="harvard-header">

        <h1>
          {resume.personal.name ||
            "Your Name"}
        </h1>

        {resume.personal.title && (
          <div className="harvard-title">
            {resume.personal.title}
          </div>
        )}

        <div className="harvard-contact">

          {resume.personal.location && (
            <span>
              <FaMapMarkerAlt />
              {resume.personal.location}
            </span>
          )}

          {resume.personal.email && (
            <span>
             
              {resume.personal.email}
            </span>
          )}

          {resume.personal.phone && (
            <span>
              <FaPhone />
              {resume.personal.phone}
            </span>
          )}

          {resume.personal.website && (
            <a
              href={
                resume.personal.website.startsWith(
                  "http"
                )
                  ? resume.personal.website
                  : `https://${resume.personal.website}`
              }
              target="_blank"
              rel="noreferrer"
            >
              <FaGlobe />
              Website
            </a>
          )}

          {resume.personal.github && (
            <a
              href={
                resume.personal.github.startsWith(
                  "http"
                )
                  ? resume.personal.github
                  : `https://${resume.personal.github}`
              }
              target="_blank"
              rel="noreferrer"
            >
              <FaGithub />
              GitHub
            </a>
          )}

          {resume.personal.linkedin && (
            <a
              href={
                resume.personal.linkedin.startsWith(
                  "http"
                )
                  ? resume.personal.linkedin
                  : `https://${resume.personal.linkedin}`
              }
              target="_blank"
              rel="noreferrer"
            >
              <FaLinkedin />
              LinkedIn
            </a>
          )}

        </div>

      </header>

      {/* =================================================
          SUMMARY
      ================================================= */}

      {resume.summary && (
        <HarvardSection title="SUMMARY">

          <p className="harvard-summary">
            {resume.summary}
          </p>

        </HarvardSection>
      )}

      {/* =================================================
          EDUCATION
      ================================================= */}

      {resume.education.length > 0 && (
        <HarvardSection title="EDUCATION">

          {resume.education.map(
            (education) => (
              <div
                className="harvard-entry"
                key={education.id}
              >

                <div className="harvard-entry-header">

                  <div>

                    <strong>
                      {education.school ||
                        "University"}
                    </strong>

                    {education.degree && (
                      <div className="harvard-subtitle">
                        {education.degree}
                      </div>
                    )}

                  </div>

                  <div className="harvard-date">

                    {education.endDate ||
                      education.startDate}

                    {education.location &&
                      ` | ${education.location}`}

                  </div>

                </div>

                {education.description && (
                  <ul>
                    <li>
                      {education.description}
                    </li>
                  </ul>
                )}

              </div>
            )
          )}

        </HarvardSection>
      )}

      {/* =================================================
          EXPERIENCE
      ================================================= */}

      {resume.experience.length > 0 && (
        <HarvardSection title="EXPERIENCE">

          {resume.experience.map(
            (experience) => (
              <div
                className="harvard-entry"
                key={experience.id}
              >

                <div className="harvard-entry-header">

                  <div>

                    <strong>
                      {experience.company ||
                        "Company Name"}
                    </strong>

                    {experience.position && (
                      <div className="harvard-subtitle italic">
                        {experience.position}
                      </div>
                    )}

                  </div>

                  <div className="harvard-date">

                    {experience.startDate ||
                      ""}

                    {experience.endDate &&
                      ` – ${experience.endDate}`}

                    {experience.location &&
                      ` | ${experience.location}`}

                  </div>

                </div>

                {experience.description
                  .filter(Boolean)
                  .length > 0 && (
                  <ul>
                    {experience.description
                      .filter(Boolean)
                      .map(
                        (
                          description,
                          index
                        ) => (
                          <li
                            key={index}
                          >
                            {description}
                          </li>
                        )
                      )}
                  </ul>
                )}

              </div>
            )
          )}

        </HarvardSection>
      )}

      {/* =================================================
          PROJECTS
      ================================================= */}

      {resume.projects.length > 0 && (
        <HarvardSection title="PROJECTS">

          {resume.projects.map(
            (project) => (
              <div
                className="harvard-entry"
                key={project.id}
              >

                <div className="harvard-entry-header">

                  <div>

                    <strong>

                      {project.name ||
                        "Project Name"}

                      {project.url && (
                        <a
                          className="project-link"
                          href={
                            project.url.startsWith(
                              "http"
                            )
                              ? project.url
                              : `https://${project.url}`
                          }
                          target="_blank"
                          rel="noreferrer"
                        >
                          <FaExternalLinkAlt />
                        </a>
                      )}

                    </strong>

                    {project.role && (
                      <div className="harvard-subtitle italic">
                        {project.role}
                      </div>
                    )}

                  </div>

                  <div className="harvard-date">

                    {project.startDate}

                    {project.endDate &&
                      ` – ${project.endDate}`}

                    {project.location &&
                      ` | ${project.location}`}

                  </div>

                </div>

                {project.description
                  .filter(Boolean)
                  .length > 0 && (
                  <ul>

                    {project.description
                      .filter(Boolean)
                      .map(
                        (
                          description,
                          index
                        ) => (
                          <li
                            key={index}
                          >
                            {description}
                          </li>
                        )
                      )}

                  </ul>
                )}

              </div>
            )
          )}

        </HarvardSection>
      )}

      {/* =================================================
          SKILLS
      ================================================= */}

      {Object.values(resume.skills).some(
        Boolean
      ) && (
        <HarvardSection title="SKILLS">

          <div className="harvard-skills">

            {resume.skills.languages && (
              <div>
                <strong>
                  Languages:
                </strong>{" "}
                {resume.skills.languages}
              </div>
            )}

            {resume.skills.frameworks && (
              <div>
                <strong>
                  Frameworks:
                </strong>{" "}
                {resume.skills.frameworks}
              </div>
            )}

            {resume.skills.tools && (
              <div>
                <strong>
                  Tools:
                </strong>{" "}
                {resume.skills.tools}
              </div>
            )}

            {resume.skills.databases && (
              <div>
                <strong>
                  Databases:
                </strong>{" "}
                {resume.skills.databases}
              </div>
            )}

            {resume.skills.cloud && (
              <div>
                <strong>
                  Cloud:
                </strong>{" "}
                {resume.skills.cloud}
              </div>
            )}

          </div>

        </HarvardSection>
      )}

    </article>
  );
}

/*
 * =========================================================
 * HARVARD SECTION
 * =========================================================
 */

function HarvardSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="harvard-section">

      <h2>
        {title}
      </h2>

      {children}

    </section>
  );
}