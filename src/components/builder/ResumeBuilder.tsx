"use client";

import { useEffect, useState } from "react";

import { defaultResume } from "@/lib/resume/defaultResume";
import { ResumeData } from "@/lib/resume/types";
import ResumePreview from "@/components/resume/ResumePreview";

/* =========================================================
   TYPES
========================================================= */

type ResumeFromDB = ResumeData & {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
};

/* =========================================================
   NORMALIZE
========================================================= */

function normalizeResume(
  data?: Partial<ResumeData>
): ResumeData {
  const source = data || {};

  return {
    ...defaultResume,

    ...source,

    personal: {
      ...defaultResume.personal,
      ...(source.personal || {}),
    },

    summary:
      typeof source.summary === "string"
        ? source.summary
        : defaultResume.summary,

    education: Array.isArray(source.education)
      ? source.education.map((item) => ({
          id:
            item.id ||
            crypto.randomUUID(),

          school:
            item.school || "",

          degree:
            item.degree || "",

          location:
            item.location || "",

          startDate:
            item.startDate || "",

          endDate:
            item.endDate || "",

          description:
            typeof item.description === "string"
              ? item.description
              : "",
        }))
      : [],

    experience: Array.isArray(source.experience)
      ? source.experience.map((item) => ({
          id:
            item.id ||
            crypto.randomUUID(),

          company:
            item.company || "",

          position:
            item.position || "",

          location:
            item.location || "",

          startDate:
            item.startDate || "",

          endDate:
            item.endDate || "",

          description:
            Array.isArray(item.description)
              ? item.description.filter(
                  (text) =>
                    typeof text === "string"
                )
              : [""],
        }))
      : [],

    projects: Array.isArray(source.projects)
      ? source.projects.map((item) => ({
          id:
            item.id ||
            crypto.randomUUID(),

          name:
            item.name || "",

          role:
            item.role || "",

          url:
            item.url || "",

          location:
            item.location || "",

          startDate:
            item.startDate || "",

          endDate:
            item.endDate || "",

          description:
            Array.isArray(item.description)
              ? item.description.filter(
                  (text) =>
                    typeof text === "string"
                )
              : [""],
        }))
      : [],

    skills: {
      ...defaultResume.skills,
      ...(source.skills || {}),
    },

    certifications:
      Array.isArray(source.certifications)
        ? source.certifications.map(
            (item) => ({
              id:
                item.id ||
                crypto.randomUUID(),

              name:
                item.name || "",

              issuer:
                item.issuer || "",

              year:
                item.year || "",
            })
          )
        : [],
  };
}

/* =========================================================
   MAIN
========================================================= */

export default function ResumeBuilder() {
  const [resume, setResume] =
    useState<ResumeData>(
      normalizeResume(defaultResume)
    );

  const [saving, setSaving] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [savedId, setSavedId] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState("");

  /* =======================================================
     LOAD
  ======================================================= */

  useEffect(() => {
    async function loadResume() {
      try {
        setLoading(true);

        const id =
          localStorage.getItem(
            "resumeId"
          );

        if (!id) {
          setLoading(false);
          return;
        }

        const response =
          await fetch(
            `/api/resumes/${id}`,
            {
              method: "GET",
              cache: "no-store",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          localStorage.removeItem(
            "resumeId"
          );

          setSavedId(null);

          setResume(
            normalizeResume(
              defaultResume
            )
          );

          return;
        }

        const normalized =
          normalizeResume(data);

        setResume(normalized);

        setSavedId(
          data._id || id
        );

        setMessage(
          "CV đã được tải."
        );
      } catch (error) {
        console.error(
          "Load resume error:",
          error
        );

        setMessage(
          "Không thể tải CV."
        );
      } finally {
        setLoading(false);
      }
    }

    loadResume();
  }, []);

  /* =======================================================
     PERSONAL
  ======================================================= */

  function updatePersonal(
    field: keyof ResumeData["personal"],
    value: string
  ) {
    setResume((prev) => ({
      ...prev,

      personal: {
        ...prev.personal,
        [field]: value,
      },
    }));
  }

  /* =======================================================
     SUMMARY
  ======================================================= */

  function updateSummary(
    value: string
  ) {
    setResume((prev) => ({
      ...prev,
      summary: value,
    }));
  }

  /* =======================================================
     SKILLS
  ======================================================= */

  function updateSkill(
    field: keyof ResumeData["skills"],
    value: string
  ) {
    setResume((prev) => ({
      ...prev,

      skills: {
        ...prev.skills,
        [field]: value,
      },
    }));
  }

  /* =======================================================
     EDUCATION
  ======================================================= */

  function addEducation() {
    setResume((prev) => ({
      ...prev,

      education: [
        ...(prev.education || []),

        {
          id: crypto.randomUUID(),
          school: "",
          degree: "",
          location: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    }));
  }

  function removeEducation(
    index: number
  ) {
    setResume((prev) => ({
      ...prev,

      education:
        prev.education.filter(
          (_, i) => i !== index
        ),
    }));
  }

  function updateEducation(
    index: number,
    field:
      | "school"
      | "degree"
      | "location"
      | "startDate"
      | "endDate"
      | "description",
    value: string
  ) {
    setResume((prev) => ({
      ...prev,

      education:
        prev.education.map(
          (item, i) =>
            i === index
              ? {
                  ...item,
                  [field]: value,
                }
              : item
        ),
    }));
  }

  /* =======================================================
     EXPERIENCE
  ======================================================= */

  function addExperience() {
    setResume((prev) => ({
      ...prev,

      experience: [
        ...(prev.experience || []),

        {
          id: crypto.randomUUID(),
          company: "",
          position: "",
          location: "",
          startDate: "",
          endDate: "",
          description: [""],
        },
      ],
    }));
  }

  function removeExperience(
    index: number
  ) {
    setResume((prev) => ({
      ...prev,

      experience:
        prev.experience.filter(
          (_, i) => i !== index
        ),
    }));
  }

  function updateExperience(
    index: number,
    field:
      | "company"
      | "position"
      | "location"
      | "startDate"
      | "endDate",
    value: string
  ) {
    setResume((prev) => ({
      ...prev,

      experience:
        prev.experience.map(
          (item, i) =>
            i === index
              ? {
                  ...item,
                  [field]: value,
                }
              : item
        ),
    }));
  }

  function updateExperienceDescription(
    experienceIndex: number,
    bulletIndex: number,
    value: string
  ) {
    setResume((prev) => ({
      ...prev,

      experience:
        prev.experience.map(
          (experience, i) =>
            i === experienceIndex
              ? {
                  ...experience,

                  description:
                    Array.isArray(
                      experience.description
                    )
                      ? experience.description.map(
                          (text, j) =>
                            j ===
                            bulletIndex
                              ? value
                              : text
                        )
                      : [value],
                }
              : experience
        ),
    }));
  }

  function addExperienceAchievement(
    experienceIndex: number
  ) {
    setResume((prev) => ({
      ...prev,

      experience:
        prev.experience.map(
          (experience, i) =>
            i === experienceIndex
              ? {
                  ...experience,

                  description: [
                    ...(Array.isArray(
                      experience.description
                    )
                      ? experience.description
                      : []),

                    "",
                  ],
                }
              : experience
        ),
    }));
  }

  function removeExperienceAchievement(
    experienceIndex: number,
    bulletIndex: number
  ) {
    setResume((prev) => ({
      ...prev,

      experience:
        prev.experience.map(
          (experience, i) =>
            i === experienceIndex
              ? {
                  ...experience,

                  description:
                    experience.description.filter(
                      (_, j) =>
                        j !== bulletIndex
                    ),
                }
              : experience
        ),
    }));
  }

  /* =======================================================
     PROJECTS
  ======================================================= */

  function addProject() {
    setResume((prev) => ({
      ...prev,

      projects: [
        ...(prev.projects || []),

        {
          id: crypto.randomUUID(),
          name: "",
          role: "",
          url: "",
          location: "",
          startDate: "",
          endDate: "",
          description: [""],
        },
      ],
    }));
  }

  function removeProject(
    index: number
  ) {
    setResume((prev) => ({
      ...prev,

      projects:
        prev.projects.filter(
          (_, i) => i !== index
        ),
    }));
  }

  function updateProject(
    index: number,
    field:
      | "name"
      | "role"
      | "url"
      | "location"
      | "startDate"
      | "endDate",
    value: string
  ) {
    setResume((prev) => ({
      ...prev,

      projects:
        prev.projects.map(
          (item, i) =>
            i === index
              ? {
                  ...item,
                  [field]: value,
                }
              : item
        ),
    }));
  }

  function updateProjectDescription(
    projectIndex: number,
    bulletIndex: number,
    value: string
  ) {
    setResume((prev) => ({
      ...prev,

      projects:
        prev.projects.map(
          (project, i) =>
            i === projectIndex
              ? {
                  ...project,

                  description:
                    Array.isArray(
                      project.description
                    )
                      ? project.description.map(
                          (text, j) =>
                            j ===
                            bulletIndex
                              ? value
                              : text
                        )
                      : [value],
                }
              : project
        ),
    }));
  }

  function addProjectAchievement(
    projectIndex: number
  ) {
    setResume((prev) => ({
      ...prev,

      projects:
        prev.projects.map(
          (project, i) =>
            i === projectIndex
              ? {
                  ...project,

                  description: [
                    ...(Array.isArray(
                      project.description
                    )
                      ? project.description
                      : []),

                    "",
                  ],
                }
              : project
        ),
    }));
  }

  function removeProjectAchievement(
    projectIndex: number,
    bulletIndex: number
  ) {
    setResume((prev) => ({
      ...prev,

      projects:
        prev.projects.map(
          (project, i) =>
            i === projectIndex
              ? {
                  ...project,

                  description:
                    project.description.filter(
                      (_, j) =>
                        j !== bulletIndex
                    ),
                }
              : project
        ),
    }));
  }

  /* =======================================================
     CERTIFICATIONS
  ======================================================= */

  function addCertification() {
    setResume((prev) => ({
      ...prev,

      certifications: [
        ...(prev.certifications || []),

        {
          id: crypto.randomUUID(),
          name: "",
          issuer: "",
          year: "",
        },
      ],
    }));
  }

  function removeCertification(
    index: number
  ) {
    setResume((prev) => ({
      ...prev,

      certifications:
        prev.certifications.filter(
          (_, i) => i !== index
        ),
    }));
  }

  function updateCertification(
    index: number,
    field:
      | "name"
      | "issuer"
      | "year",
    value: string
  ) {
    setResume((prev) => ({
      ...prev,

      certifications:
        prev.certifications.map(
          (item, i) =>
            i === index
              ? {
                  ...item,
                  [field]: value,
                }
              : item
        ),
    }));
  }

  /* =======================================================
     SAVE
  ======================================================= */

  async function saveResume() {
    try {
      setSaving(true);
      setMessage("");

      const payload = {
        personal: {
          name:
            resume.personal?.name || "",

          title:
            resume.personal?.title || "",

          email:
            resume.personal?.email || "",

          phone:
            resume.personal?.phone || "",

          location:
            resume.personal?.location || "",

          website:
            resume.personal?.website || "",

          github:
            resume.personal?.github || "",

          linkedin:
            resume.personal?.linkedin || "",
        },

        summary:
          resume.summary || "",

        education:
          (resume.education || []).map(
            (item) => ({
              id:
                item.id ||
                crypto.randomUUID(),

              school:
                item.school || "",

              degree:
                item.degree || "",

              location:
                item.location || "",

              startDate:
                item.startDate || "",

              endDate:
                item.endDate || "",

              description:
                item.description || "",
            })
          ),

        experience:
          (resume.experience || []).map(
            (item) => ({
              id:
                item.id ||
                crypto.randomUUID(),

              company:
                item.company || "",

              position:
                item.position || "",

              location:
                item.location || "",

              startDate:
                item.startDate || "",

              endDate:
                item.endDate || "",

              description:
                Array.isArray(
                  item.description
                )
                  ? item.description
                  : [""],
            })
          ),

        projects:
          (resume.projects || []).map(
            (item) => ({
              id:
                item.id ||
                crypto.randomUUID(),

              name:
                item.name || "",

              role:
                item.role || "",

              url:
                item.url || "",

              location:
                item.location || "",

              startDate:
                item.startDate || "",

              endDate:
                item.endDate || "",

              description:
                Array.isArray(
                  item.description
                )
                  ? item.description
                  : [""],
            })
          ),

        skills: {
          languages:
            resume.skills?.languages ||
            "",

          frameworks:
            resume.skills?.frameworks ||
            "",

          tools:
            resume.skills?.tools ||
            "",

          databases:
            resume.skills?.databases ||
            "",

          cloud:
            resume.skills?.cloud ||
            "",
        },

        certifications:
          (resume.certifications || []).map(
            (item) => ({
              id:
                item.id ||
                crypto.randomUUID(),

              name:
                item.name || "",

              issuer:
                item.issuer || "",

              year:
                item.year || "",
            })
          ),
      };

      console.log(
        "POST /api/resumes body:",
        payload
      );

      const url = savedId
        ? `/api/resumes/${savedId}`
        : "/api/resumes";

      const method = savedId
        ? "PUT"
        : "POST";

      const response =
        await fetch(url, {
          method,

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            payload
          ),
        });

      const data =
        await response.json();

      console.log(
        "Save response:",
        data
      );

      if (!response.ok) {
        console.error(
          "API error:",
          data
        );

        throw new Error(
          data?.message ||
            "Failed to save resume"
        );
      }

      const normalized =
        normalizeResume(data);

      setResume(normalized);

      setSavedId(data._id);

      localStorage.setItem(
        "resumeId",
        data._id
      );

      setMessage(
        savedId
          ? "✓ CV đã được cập nhật!"
          : "✓ CV đã được lưu!"
      );
    } catch (error) {
      console.error(
        "Save resume error:",
        error
      );

      setMessage(
        "✕ Không thể lưu CV."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =======================================================
     DELETE
  ======================================================= */

  async function deleteResume() {
    if (!savedId) {
      setResume(
        normalizeResume(
          defaultResume
        )
      );

      setMessage(
        "Đã tạo CV mới."
      );

      return;
    }

    const confirmed =
      window.confirm(
        "Bạn có chắc chắn muốn xóa CV này?"
      );

    if (!confirmed) return;

    try {
      setSaving(true);

      const response =
        await fetch(
          `/api/resumes/${savedId}`,
          {
            method: "DELETE",
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to delete resume"
        );
      }

      localStorage.removeItem(
        "resumeId"
      );

      setSavedId(null);

      setResume(
        normalizeResume(
          defaultResume
        )
      );

      setMessage(
        "✓ CV đã được xóa."
      );
    } catch (error) {
      console.error(
        "Delete resume error:",
        error
      );

      setMessage(
        "✕ Không thể xóa CV."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =======================================================
     NEW CV
  ======================================================= */

  function newResume() {
    const confirmed =
      window.confirm(
        "Bạn muốn tạo CV mới? Những thay đổi chưa lưu sẽ bị mất."
      );

    if (!confirmed) return;

    localStorage.removeItem(
      "resumeId"
    );

    setSavedId(null);

    setResume(
      normalizeResume(
        defaultResume
      )
    );

    setMessage(
      "Đã tạo CV mới."
    );
  }

  /* =======================================================
     PRINT
  ======================================================= */

  function downloadPDF() {
    window.print();
  }

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
        }}
      >
        <h2>
          Loading CV...
        </h2>
      </div>
    );
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="builder">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="builder-header no-print">

        <div>
          <strong>
            CV Builder
          </strong>

          <span>
            Build your professional resume
          </span>
        </div>

        <div className="builder-actions">

          {message && (
            <span className="save-message">
              {message}
            </span>
          )}

          <button
            type="button"
            className="button secondary"
            onClick={newResume}
          >
            New CV
          </button>

          {savedId && (
            <button
              type="button"
              className="button secondary"
              onClick={deleteResume}
              disabled={saving}
            >
              Delete
            </button>
          )}

          <button
            type="button"
            className="button secondary"
            onClick={downloadPDF}
          >
            Download PDF
          </button>

          <button
            type="button"
            className="button primary"
            onClick={saveResume}
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save CV"}
          </button>

        </div>

      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <div className="builder-layout">

        {/* =================================================
            SIDEBAR
        ================================================= */}

        <aside className="builder-sidebar no-print">

          {/* =================================================
              PERSONAL
          ================================================= */}

          <section className="form-section">

            <h2>
              Personal Information
            </h2>

            <Input
              label="Full Name"
              value={
                resume.personal?.name ||
                ""
              }
              onChange={(value) =>
                updatePersonal(
                  "name",
                  value
                )
              }
            />

            <Input
              label="Job Title"
              value={
                resume.personal?.title ||
                ""
              }
              onChange={(value) =>
                updatePersonal(
                  "title",
                  value
                )
              }
            />

            <Input
              label="Email"
              value={
                resume.personal?.email ||
                ""
              }
              onChange={(value) =>
                updatePersonal(
                  "email",
                  value
                )
              }
            />

            <Input
              label="Phone"
              value={
                resume.personal?.phone ||
                ""
              }
              onChange={(value) =>
                updatePersonal(
                  "phone",
                  value
                )
              }
            />

            <Input
              label="Location"
              value={
                resume.personal?.location ||
                ""
              }
              onChange={(value) =>
                updatePersonal(
                  "location",
                  value
                )
              }
            />

            <Input
              label="Website"
              value={
                resume.personal?.website ||
                ""
              }
              onChange={(value) =>
                updatePersonal(
                  "website",
                  value
                )
              }
            />

            <Input
              label="GitHub"
              value={
                resume.personal?.github ||
                ""
              }
              onChange={(value) =>
                updatePersonal(
                  "github",
                  value
                )
              }
            />

            <Input
              label="LinkedIn"
              value={
                resume.personal?.linkedin ||
                ""
              }
              onChange={(value) =>
                updatePersonal(
                  "linkedin",
                  value
                )
              }
            />

          </section>

          {/* =================================================
              SUMMARY
          ================================================= */}

          <section className="form-section">

            <h2>
              Professional Summary
            </h2>

            <textarea
              value={
                resume.summary || ""
              }
              onChange={(e) =>
                updateSummary(
                  e.target.value
                )
              }
              rows={6}
              placeholder="Write a short professional summary..."
            />

          </section>

          {/* =================================================
              EDUCATION
          ================================================= */}

          <section className="form-section">

            <div className="section-title-row">

              <h2>
                Education
              </h2>

              <button
                type="button"
                onClick={
                  addEducation
                }
              >
                + Add
              </button>

            </div>

            {(
              resume.education || []
            ).map(
              (
                education,
                index
              ) => (

                <div
                  className="form-card"
                  key={education.id}
                >

                  <Input
                    label="School"
                    value={
                      education.school ||
                      ""
                    }
                    onChange={(value) =>
                      updateEducation(
                        index,
                        "school",
                        value
                      )
                    }
                  />

                  <Input
                    label="Degree"
                    value={
                      education.degree ||
                      ""
                    }
                    onChange={(value) =>
                      updateEducation(
                        index,
                        "degree",
                        value
                      )
                    }
                  />

                  <Input
                    label="Location"
                    value={
                      education.location ||
                      ""
                    }
                    onChange={(value) =>
                      updateEducation(
                        index,
                        "location",
                        value
                      )
                    }
                  />

                  <div className="form-row">

                    <Input
                      label="Start Date"
                      value={
                        education.startDate ||
                        ""
                      }
                      onChange={(value) =>
                        updateEducation(
                          index,
                          "startDate",
                          value
                        )
                      }
                    />

                    <Input
                      label="End Date"
                      value={
                        education.endDate ||
                        ""
                      }
                      onChange={(value) =>
                        updateEducation(
                          index,
                          "endDate",
                          value
                        )
                      }
                    />

                  </div>

                  <Input
                    label="Description"
                    value={
                      education.description ||
                      ""
                    }
                    onChange={(value) =>
                      updateEducation(
                        index,
                        "description",
                        value
                      )
                    }
                  />

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() =>
                      removeEducation(
                        index
                      )
                    }
                  >
                    Remove Education
                  </button>

                </div>
              )
            )}

          </section>

          {/* =================================================
              EXPERIENCE
          ================================================= */}

          <section className="form-section">

            <div className="section-title-row">

              <h2>
                Experience
              </h2>

              <button
                type="button"
                onClick={
                  addExperience
                }
              >
                + Add
              </button>

            </div>

            {(
              resume.experience || []
            ).map(
              (
                experience,
                index
              ) => (

                <div
                  className="form-card"
                  key={experience.id}
                >

                  <Input
                    label="Company"
                    value={
                      experience.company ||
                      ""
                    }
                    onChange={(value) =>
                      updateExperience(
                        index,
                        "company",
                        value
                      )
                    }
                  />

                  <Input
                    label="Position"
                    value={
                      experience.position ||
                      ""
                    }
                    onChange={(value) =>
                      updateExperience(
                        index,
                        "position",
                        value
                      )
                    }
                  />

                  <Input
                    label="Location"
                    value={
                      experience.location ||
                      ""
                    }
                    onChange={(value) =>
                      updateExperience(
                        index,
                        "location",
                        value
                      )
                    }
                  />

                  <div className="form-row">

                    <Input
                      label="Start Date"
                      value={
                        experience.startDate ||
                        ""
                      }
                      onChange={(value) =>
                        updateExperience(
                          index,
                          "startDate",
                          value
                        )
                      }
                    />

                    <Input
                      label="End Date"
                      value={
                        experience.endDate ||
                        ""
                      }
                      onChange={(value) =>
                        updateExperience(
                          index,
                          "endDate",
                          value
                        )
                      }
                    />

                  </div>

                  <label>
                    Achievements
                  </label>

                  {(
                    Array.isArray(
                      experience.description
                    )
                      ? experience.description
                      : []
                  ).map(
                    (
                      item,
                      bulletIndex
                    ) => (

                      <div
                        className="bullet-input"
                        key={bulletIndex}
                      >

                        <input
                          type="text"
                          value={
                            item || ""
                          }
                          placeholder="Describe your achievement..."
                          onChange={(e) =>
                            updateExperienceDescription(
                              index,
                              bulletIndex,
                              e.target.value
                            )
                          }
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeExperienceAchievement(
                              index,
                              bulletIndex
                            )
                          }
                        >
                          ×
                        </button>

                      </div>

                    )
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      addExperienceAchievement(
                        index
                      )
                    }
                  >
                    + Achievement
                  </button>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() =>
                      removeExperience(
                        index
                      )
                    }
                  >
                    Remove Experience
                  </button>

                </div>

              )
            )}

          </section>

          {/* =================================================
              PROJECTS
          ================================================= */}

          <section className="form-section">

            <div className="section-title-row">

              <h2>
                Projects
              </h2>

              <button
                type="button"
                onClick={
                  addProject
                }
              >
                + Add
              </button>

            </div>

            {(
              resume.projects || []
            ).map(
              (
                project,
                index
              ) => (

                <div
                  className="form-card"
                  key={project.id}
                >

                  <Input
                    label="Project Name"
                    value={
                      project.name ||
                      ""
                    }
                    onChange={(value) =>
                      updateProject(
                        index,
                        "name",
                        value
                      )
                    }
                  />

                  <Input
                    label="Role"
                    value={
                      project.role ||
                      ""
                    }
                    onChange={(value) =>
                      updateProject(
                        index,
                        "role",
                        value
                      )
                    }
                  />

                  <Input
                    label="Project URL"
                    value={
                      project.url ||
                      ""
                    }
                    onChange={(value) =>
                      updateProject(
                        index,
                        "url",
                        value
                      )
                    }
                  />

                  <Input
                    label="Location"
                    value={
                      project.location ||
                      ""
                    }
                    onChange={(value) =>
                      updateProject(
                        index,
                        "location",
                        value
                      )
                    }
                  />

                  <div className="form-row">

                    <Input
                      label="Start Date"
                      value={
                        project.startDate ||
                        ""
                      }
                      onChange={(value) =>
                        updateProject(
                          index,
                          "startDate",
                          value
                        )
                      }
                    />

                    <Input
                      label="End Date"
                      value={
                        project.endDate ||
                        ""
                      }
                      onChange={(value) =>
                        updateProject(
                          index,
                          "endDate",
                          value
                        )
                      }
                    />

                  </div>

                  <label>
                    Achievements
                  </label>

                  {(
                    Array.isArray(
                      project.description
                    )
                      ? project.description
                      : []
                  ).map(
                    (
                      item,
                      bulletIndex
                    ) => (

                      <div
                        className="bullet-input"
                        key={bulletIndex}
                      >

                        <input
                          type="text"
                          value={
                            item || ""
                          }
                          placeholder="Describe project achievement..."
                          onChange={(e) =>
                            updateProjectDescription(
                              index,
                              bulletIndex,
                              e.target.value
                            )
                          }
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeProjectAchievement(
                              index,
                              bulletIndex
                            )
                          }
                        >
                          ×
                        </button>

                      </div>

                    )
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      addProjectAchievement(
                        index
                      )
                    }
                  >
                    + Achievement
                  </button>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() =>
                      removeProject(
                        index
                      )
                    }
                  >
                    Remove Project
                  </button>

                </div>

              )
            )}

          </section>

          {/* =================================================
              SKILLS
          ================================================= */}

          <section className="form-section">

            <h2>
              Skills
            </h2>

            <Input
              label="Languages"
              value={
                resume.skills
                  ?.languages || ""
              }
              onChange={(value) =>
                updateSkill(
                  "languages",
                  value
                )
              }
            />

            <Input
              label="Frameworks"
              value={
                resume.skills
                  ?.frameworks || ""
              }
              onChange={(value) =>
                updateSkill(
                  "frameworks",
                  value
                )
              }
            />

            <Input
              label="Tools"
              value={
                resume.skills?.tools ||
                ""
              }
              onChange={(value) =>
                updateSkill(
                  "tools",
                  value
                )
              }
            />

            <Input
              label="Databases"
              value={
                resume.skills
                  ?.databases || ""
              }
              onChange={(value) =>
                updateSkill(
                  "databases",
                  value
                )
              }
            />

            <Input
              label="Cloud"
              value={
                resume.skills?.cloud ||
                ""
              }
              onChange={(value) =>
                updateSkill(
                  "cloud",
                  value
                )
              }
            />

          </section>

          {/* =================================================
              CERTIFICATIONS
          ================================================= */}

          <section className="form-section">

            <div className="section-title-row">

              <h2>
                Certifications
              </h2>

              <button
                type="button"
                onClick={
                  addCertification
                }
              >
                + Add
              </button>

            </div>

            {(
              resume.certifications ||
              []
            ).map(
              (
                certification,
                index
              ) => (

                <div
                  className="form-card"
                  key={
                    certification.id
                  }
                >

                  <Input
                    label="Certification"
                    value={
                      certification.name ||
                      ""
                    }
                    onChange={(value) =>
                      updateCertification(
                        index,
                        "name",
                        value
                      )
                    }
                  />

                  <Input
                    label="Issuer"
                    value={
                      certification.issuer ||
                      ""
                    }
                    onChange={(value) =>
                      updateCertification(
                        index,
                        "issuer",
                        value
                      )
                    }
                  />

                  <Input
                    label="Year"
                    value={
                      certification.year ||
                      ""
                    }
                    onChange={(value) =>
                      updateCertification(
                        index,
                        "year",
                        value
                      )
                    }
                  />

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() =>
                      removeCertification(
                        index
                      )
                    }
                  >
                    Remove Certification
                  </button>

                </div>

              )
            )}

          </section>

        </aside>

        {/* =================================================
            PREVIEW
        ================================================= */}

        <main className="builder-preview">

          <div className="preview-toolbar no-print">

            <span>
              Web Preview
            </span>

            <span>
              PDF View
            </span>

          </div>

          <div className="resume-preview-container">

            <ResumePreview
              resume={resume}
            />

          </div>

        </main>

      </div>

    </div>
  );
}

/* =========================================================
   INPUT
========================================================= */

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
}) {
  return (
    <div className="input-group">

      <label>
        {label}
      </label>

      <input
        type="text"
        value={value || ""}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
      />

    </div>
  );
}