"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FaUser,
  FaFileAlt,
  FaGraduationCap,
  FaBriefcase,
  FaProjectDiagram,
  FaTools,
  FaCertificate,
} from "react-icons/fa";
import { HiArrowLeft } from "react-icons/hi";

import { defaultResume } from "@/lib/resume/defaultResume";
import { ResumeData } from "@/lib/resume/types";

import ResumePreview from "@/components/resume/ResumePreview";
import PDFPreview from "@/components/resume/PDFPreview";

type Tab =
  | "personal"
  | "summary"
  | "education"
  | "experience"
  | "projects"
  | "skills"
  | "certifications";

function ResumeBuilder() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const resumeId = searchParams.get("id");

  const [resume, setResume] = useState<ResumeData>(defaultResume);

  const [activeTab, setActiveTab] = useState<Tab>("personal");

  const [previewMode, setPreviewMode] = useState<"web" | "pdf">("web");

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [editorWidth, setEditorWidth] = useState(630);
  const [isResizing, setIsResizing] = useState(false);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [savedId, setSavedId] = useState<string | null>(resumeId);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth <= 850);
    }

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  /*
   * =========================================================
   * LOAD CV
   * =========================================================
   */

  useEffect(() => {
    if (!resumeId) {
      setResume(defaultResume);
      setSavedId(null);
      return;
    }

    async function loadResume() {
      try {
        setLoading(true);

        const response = await fetch(`/api/resumes/${resumeId}`, {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Không thể tải CV");
        }

        const data = await response.json();

        setResume(data);
        setSavedId(data._id);
        setLastSaved(
          new Date().toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
      } catch (error) {
        console.error("Load resume error:", error);

        alert("Không thể tải CV.");

        router.push("/builder");
      } finally {
        setLoading(false);
      }
    }

    loadResume();
  }, [resumeId, router]);

  /*
   * =========================================================
   * UPDATE PERSONAL
   * =========================================================
   */

  function updatePersonal(field: keyof ResumeData["personal"], value: string) {
    setResume((prev) => ({
      ...prev,

      personal: {
        ...prev.personal,
        [field]: value,
      },
    }));
  }

  /*
   * =========================================================
   * UPDATE SKILLS
   * =========================================================
   */

  function updateSkill(field: keyof ResumeData["skills"], value: string) {
    setResume((prev) => ({
      ...prev,

      skills: {
        ...prev.skills,
        [field]: value,
      },
    }));
  }

  /*
   * =========================================================
   * UPDATE EDUCATION
   * =========================================================
   */

  function updateEducation(index: number, field: string, value: string) {
    setResume((prev) => {
      const copy = [...prev.education];

      copy[index] = {
        ...copy[index],
        [field]: value,
      };

      return {
        ...prev,
        education: copy,
      };
    });
  }

  /*
   * =========================================================
   * UPDATE EXPERIENCE
   * =========================================================
   */

  function updateExperience(index: number, field: string, value: string) {
    setResume((prev) => {
      const copy = [...prev.experience];

      copy[index] = {
        ...copy[index],
        [field]: value,
      };

      return {
        ...prev,
        experience: copy,
      };
    });
  }

  /*
   * =========================================================
   * UPDATE EXPERIENCE BULLET
   * =========================================================
   */

  function updateExperienceBullet(
    experienceIndex: number,
    bulletIndex: number,
    value: string
  ) {
    setResume((prev) => {
      const copy = [...prev.experience];

      const description = [...copy[experienceIndex].description];

      description[bulletIndex] = value;

      copy[experienceIndex] = {
        ...copy[experienceIndex],
        description,
      };

      return {
        ...prev,
        experience: copy,
      };
    });
  }

  /*
   * =========================================================
   * UPDATE PROJECT
   * =========================================================
   */

  function updateProject(index: number, field: string, value: string) {
    setResume((prev) => {
      const copy = [...prev.projects];

      copy[index] = {
        ...copy[index],
        [field]: value,
      };

      return {
        ...prev,
        projects: copy,
      };
    });
  }

  /*
   * =========================================================
   * UPDATE PROJECT BULLET
   * =========================================================
   */

  function updateProjectBullet(
    projectIndex: number,
    bulletIndex: number,
    value: string
  ) {
    setResume((prev) => {
      const copy = [...prev.projects];

      const description = [...copy[projectIndex].description];

      description[bulletIndex] = value;

      copy[projectIndex] = {
        ...copy[projectIndex],
        description,
      };

      return {
        ...prev,
        projects: copy,
      };
    });
  }

  /*
   * =========================================================
   * SAVE
   * =========================================================
   */

  async function saveResume() {
    if (!resume.personal.name.trim()) {
      alert("Vui lòng nhập Full Name trước khi lưu CV.");
      setActiveTab("personal");
      return;
    }
    try {
      setSaving(true);

      const url = savedId ? `/api/resumes/${savedId}` : "/api/resumes";

      const method = savedId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(resume),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to save resume");
      }

      setSavedId(data._id);

      if (!savedId && data._id) {
        router.replace(`/builder?id=${data._id}`);
      }

      alert(savedId ? "CV đã được cập nhật!" : "CV đã được lưu thành công!");
    } catch (error) {
      console.error("Save resume error:", error);

      const message =
        error instanceof Error ? error.message : "Không thể lưu CV.";

      alert(`Lỗi: ${message}`);
    } finally {
      setSaving(false);
    }
  }
  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const confirmed = window.confirm(
      "Import CV sẽ ghi đè toàn bộ nội dung đang có trên form. Bạn có muốn tiếp tục?"
    );

    if (!confirmed) {
      e.target.value = "";
      return;
    }

    try {
      setImporting(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/resumes/import", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Không thể import CV.");
      }

      setResume(data);

      alert(
        "Import CV thành công! Vui lòng kiểm tra lại thông tin trước khi lưu."
      );
      setActiveTab("personal");
    } catch (error) {
      console.error("Import error:", error);

      const message =
        error instanceof Error ? error.message : "Không thể import CV.";

      alert(`Lỗi: ${message}`);
    } finally {
      setImporting(false);
      e.target.value = "";
    }
  }

  /*
   * =========================================================
   * DELETE
   * =========================================================
   */

  async function deleteResume() {
    if (!savedId) {
      alert("CV này chưa được lưu.");
      return;
    }

    const confirmed = window.confirm("Bạn có chắc muốn xóa CV này không?");

    if (!confirmed) return;

    try {
      setDeleting(true);

      const response = await fetch(`/api/resumes/${savedId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to delete resume");
      }

      alert("CV đã được xóa.");

      setSavedId(null);
      setResume(defaultResume);
      setLastSaved(null);
      router.replace("/builder");
    } catch (error) {
      console.error("Delete resume error:", error);

      alert("Không thể xóa CV.");
    } finally {
      setDeleting(false);
    }
  }

  /*
   * =========================================================
   * NEW CV
   * =========================================================
   */

  function createNewResume() {
    const confirmed = window.confirm(
      "Tạo CV mới? Những thay đổi chưa lưu sẽ bị mất."
    );

    if (!confirmed) return;

    setResume(defaultResume);
    setSavedId(null);
    setLastSaved(null);
    router.replace("/builder");
  }

  /*
   * =========================================================
   * DOWNLOAD PDF
   * =========================================================
   *
   * Sử dụng browser print để giữ Harvard layout.
   * PDF View bên dưới dùng PDF renderer.
   */

  async function downloadPDF() {
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const ResumePDF = (await import("@/components/resume/ResumePDF")).default;

      const blob = await pdf(<ResumePDF resume={resume} />).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `${resume.personal.name || "Resume"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download PDF error:", error);
      alert("Không thể tải PDF. Vui lòng thử lại.");
    }
  }

  // xu ly keo tha
  function startResizing() {
    setIsResizing(true);
  }

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!isResizing) return;

      const newWidth = e.clientX;

      if (newWidth >= 320 && newWidth <= 700) {
        setEditorWidth(newWidth);
      }
    }

    function handleMouseUp() {
      setIsResizing(false);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);
  /*
   * =========================================================
   * TABS
   * =========================================================
   */

  const tabs = [
    {
      id: "personal" as Tab,
      label: "Personal",
      icon: <FaUser />,
    },
    {
      id: "summary" as Tab,
      label: "Summary",
      icon: <FaFileAlt />,
    },
    {
      id: "education" as Tab,
      label: "Education",
      icon: <FaGraduationCap />,
    },
    {
      id: "experience" as Tab,
      label: "Experience",
      icon: <FaBriefcase />,
    },
    {
      id: "projects" as Tab,
      label: "Projects",
      icon: <FaProjectDiagram />,
    },
    {
      id: "skills" as Tab,
      label: "Skills",
      icon: <FaTools />,
    },
    {
      id: "certifications" as Tab,
      label: "Certifications",
      icon: <FaCertificate />,
    },
  ];

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (loading) {
    return (
      <div className="builder-loading">
        <p>Đang tải CV...</p>
      </div>
    );
  }

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <div className="builder-page">
      {/* =================================================
          HEADER
      ================================================= */}

      <header className="builder-header no-print">
        <div className="builder-header-left">
          <button className="back-button" onClick={() => router.push("/")}>
            <HiArrowLeft />
          </button>

          <div className="builder-title">
            <strong>CV Builder</strong>

            <span>
              {savedId
                ? "Editing saved resume"
                : "Build your professional resume"}
            </span>
          </div>
        </div>

        <div className="builder-actions">
          {lastSaved && (
            <span className="save-indicator">Đã lưu lúc {lastSaved}</span>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            style={{ display: "none" }}
            onChange={handleImportFile}
          />
          <button
            className="secondary-button"
            disabled={importing}
            onClick={() => fileInputRef.current?.click()}
          >
            {importing ? (
              <>
                <span className="spinner" /> Đang đọc CV...
              </>
            ) : (
              "Import PDF"
            )}
          </button>
          <button className="secondary-button" onClick={createNewResume}>
            New CV
          </button>

          {savedId && (
            <button
              className="danger-button"
              disabled={deleting}
              onClick={deleteResume}
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          )}

          <button className="secondary-button" onClick={downloadPDF}>
            Download PDF
          </button>

          <button
            className="primary-button"
            disabled={saving}
            onClick={saveResume}
          >
            {saving ? "Saving..." : savedId ? "Update CV" : "Save CV"}
          </button>
        </div>
      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <main
        className="builder-main"
        style={
          isMobile
            ? undefined
            : {
                gridTemplateColumns: `${editorWidth}px 6px 1fr`,
              }
        }
      >
        {/* =================================================
            LEFT 30%
        ================================================= */}

        <section className="builder-editor">
          {/* TABS */}

          <nav className="editor-tabs no-print">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`editor-tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>

                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* EDITOR */}

          <div className="editor-content">
            {/* =========================================
                PERSONAL
            ========================================= */}

            {activeTab === "personal" && (
              <div className="form-view">
                <div className="form-heading">
                  <p className="form-eyebrow">PROFILE</p>

                  <h2>Personal Information</h2>

                  <p>Add your contact information and professional details.</p>
                </div>

                <div className="personal-grid">
                  <Input
                    label="Full Name"
                    placeholder="Your Name"
                    value={resume.personal.name}
                    onChange={(value) => updatePersonal("name", value)}
                  />

                  <Input
                    label="Job Title"
                    placeholder="Software Engineer"
                    value={resume.personal.title}
                    onChange={(value) => updatePersonal("title", value)}
                  />

                  <Input
                    label="Email"
                    placeholder="you@example.com"
                    value={resume.personal.email}
                    onChange={(value) => updatePersonal("email", value)}
                  />

                  <Input
                    label="Phone"
                    placeholder="+1 (555) 000-0000"
                    value={resume.personal.phone}
                    onChange={(value) => updatePersonal("phone", value)}
                  />

                  <Input
                    label="Location"
                    placeholder="City, Country"
                    value={resume.personal.location}
                    onChange={(value) => updatePersonal("location", value)}
                  />

                  <Input
                    label="Website"
                    placeholder="yourwebsite.com"
                    value={resume.personal.website}
                    onChange={(value) => updatePersonal("website", value)}
                  />

                  <Input
                    label="GitHub"
                    placeholder="github.com/username"
                    value={resume.personal.github}
                    onChange={(value) => updatePersonal("github", value)}
                  />

                  <Input
                    label="LinkedIn"
                    placeholder="linkedin.com/in/username"
                    value={resume.personal.linkedin}
                    onChange={(value) => updatePersonal("linkedin", value)}
                  />
                </div>
              </div>
            )}

            {/* =========================================
                SUMMARY
            ========================================= */}

            {activeTab === "summary" && (
              <div className="form-view">
                <div className="form-heading">
                  <p className="form-eyebrow">PROFILE</p>

                  <h2>Professional Summary</h2>

                  <p>Write a short summary about yourself.</p>
                </div>

                <div className="large-textarea-wrapper">
                  <label>Summary</label>

                  <textarea
                    className="large-textarea"
                    value={resume.summary}
                    placeholder="Short summary of who you are, what you build, and what you're looking for..."
                    onChange={(e) =>
                      setResume((prev) => ({
                        ...prev,
                        summary: e.target.value,
                      }))
                    }
                  />

                  <span className="textarea-hint">
                    Recommended: 2–4 sentences.
                  </span>
                </div>
              </div>
            )}

            {/* =========================================
                EDUCATION
            ========================================= */}

            {activeTab === "education" && (
              <div className="form-view">
                <div className="form-heading-row">
                  <div>
                    <p className="form-eyebrow">EDUCATION</p>

                    <h2>Education</h2>

                    <p>Add your academic background.</p>
                  </div>

                  <button
                    className="add-main-button"
                    onClick={() =>
                      setResume((prev) => ({
                        ...prev,

                        education: [
                          ...prev.education,

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
                      }))
                    }
                  >
                    + Add Education
                  </button>
                </div>

                {resume.education.length === 0 ? (
                  <EmptyState
                    title="No education added"
                    description="Add your university or school."
                  />
                ) : (
                  resume.education.map((education, index) => (
                    <div className="form-card" key={education.id}>
                      <div className="card-header">
                        <strong>Education #{index + 1}</strong>

                        <button
                          className="remove-link"
                          onClick={() => {
                            const confirmed = window.confirm("Xóa mục này?");
                            if (!confirmed) return;
                            setResume((prev) => ({
                              ...prev,
                              education: prev.education.filter(
                                (_, i) => i !== index
                              ),
                            }));
                          }}
                        >
                          Remove
                        </button>
                      </div>

                      <div className="form-grid">
                        <Input
                          label="School"
                          value={education.school}
                          onChange={(value) =>
                            updateEducation(index, "school", value)
                          }
                        />

                        <Input
                          label="Degree"
                          value={education.degree}
                          onChange={(value) =>
                            updateEducation(index, "degree", value)
                          }
                        />

                        <Input
                          label="Location"
                          value={education.location}
                          onChange={(value) =>
                            updateEducation(index, "location", value)
                          }
                        />

                        <Input
                          label="Start Date"
                          value={education.startDate}
                          onChange={(value) =>
                            updateEducation(index, "startDate", value)
                          }
                        />

                        <Input
                          label="End Date"
                          value={education.endDate}
                          onChange={(value) =>
                            updateEducation(index, "endDate", value)
                          }
                        />
                      </div>

                      <div className="large-textarea-wrapper">
                        <label>Description</label>

                        <textarea
                          className="large-textarea small"
                          value={education.description}
                          onChange={(e) =>
                            updateEducation(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* =========================================
                EXPERIENCE
            ========================================= */}

            {activeTab === "experience" && (
              <div className="form-view">
                <div className="form-heading-row">
                  <div>
                    <p className="form-eyebrow">EXPERIENCE</p>

                    <h2>Work Experience</h2>

                    <p>Add your professional experience and achievements.</p>
                  </div>

                  <button
                    className="add-main-button"
                    onClick={() =>
                      setResume((prev) => ({
                        ...prev,

                        experience: [
                          ...prev.experience,

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
                      }))
                    }
                  >
                    + Add Experience
                  </button>
                </div>

                {resume.experience.length === 0 ? (
                  <EmptyState
                    title="No experience added"
                    description="Add your internships, jobs, or other experience."
                  />
                ) : (
                  resume.experience.map((experience, index) => (
                    <div className="form-card" key={experience.id}>
                      <div className="card-header">
                        <strong>Experience #{index + 1}</strong>

                        <button
                          className="remove-link"
                          onClick={() => {
                            const confirmed = window.confirm("Xóa mục này?");
                            if (!confirmed) return;
                            setResume((prev) => ({
                              ...prev,

                              experience: prev.experience.filter(
                                (_, i) => i !== index
                              ),
                            }));
                          }}
                        >
                          Remove
                        </button>
                      </div>

                      <div className="form-grid">
                        <Input
                          label="Company"
                          value={experience.company}
                          onChange={(value) =>
                            updateExperience(index, "company", value)
                          }
                        />

                        <Input
                          label="Position"
                          value={experience.position}
                          onChange={(value) =>
                            updateExperience(index, "position", value)
                          }
                        />

                        <Input
                          label="Location"
                          value={experience.location}
                          onChange={(value) =>
                            updateExperience(index, "location", value)
                          }
                        />

                        <Input
                          label="Start Date"
                          value={experience.startDate}
                          onChange={(value) =>
                            updateExperience(index, "startDate", value)
                          }
                        />

                        <Input
                          label="End Date"
                          value={experience.endDate}
                          onChange={(value) =>
                            updateExperience(index, "endDate", value)
                          }
                        />
                      </div>

                      <div className="achievement-section">
                        <label>Achievements</label>

                        {experience.description.map((item, bulletIndex) => (
                          <div className="bullet-input" key={bulletIndex}>
                            <span>•</span>

                            <input
                              value={item}
                              placeholder="Describe an achievement with a measurable outcome..."
                              onChange={(e) =>
                                updateExperienceBullet(
                                  index,
                                  bulletIndex,
                                  e.target.value
                                )
                              }
                            />

                            <button
                              onClick={() =>
                                setResume((prev) => {
                                  const copy = [...prev.experience];

                                  copy[index] = {
                                    ...copy[index],

                                    description: copy[index].description.filter(
                                      (_, i) => i !== bulletIndex
                                    ),
                                  };

                                  return {
                                    ...prev,
                                    experience: copy,
                                  };
                                })
                              }
                            >
                              ×
                            </button>
                          </div>
                        ))}

                        <button
                          className="add-small-button"
                          onClick={() =>
                            setResume((prev) => {
                              const copy = [...prev.experience];

                              copy[index] = {
                                ...copy[index],

                                description: [...copy[index].description, ""],
                              };

                              return {
                                ...prev,
                                experience: copy,
                              };
                            })
                          }
                        >
                          + Achievement
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* =========================================
                PROJECTS
            ========================================= */}

            {activeTab === "projects" && (
              <div className="form-view">
                <div className="form-heading-row">
                  <div>
                    <p className="form-eyebrow">PROJECTS</p>

                    <h2>Projects</h2>

                    <p>Highlight your most important projects.</p>
                  </div>

                  <button
                    className="add-main-button"
                    onClick={() =>
                      setResume((prev) => ({
                        ...prev,

                        projects: [
                          ...prev.projects,

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
                      }))
                    }
                  >
                    + Add Project
                  </button>
                </div>

                {resume.projects.length === 0 ? (
                  <EmptyState
                    title="No projects added"
                    description="Add projects that demonstrate your skills."
                  />
                ) : (
                  resume.projects.map((project, index) => (
                    <div className="form-card" key={project.id}>
                      <div className="card-header">
                        <strong>Project #{index + 1}</strong>

                        <button
                          className="remove-link"
                          onClick={() => {
                            const confirmed = window.confirm("Xóa mục này?");
                            if (!confirmed) return;
                            setResume((prev) => ({
                              ...prev,

                              projects: prev.projects.filter(
                                (_, i) => i !== index
                              ),
                            }));
                          }}
                        >
                          Remove
                        </button>
                      </div>

                      <div className="form-grid">
                        <Input
                          label="Project Name"
                          value={project.name}
                          onChange={(value) =>
                            updateProject(index, "name", value)
                          }
                        />

                        <Input
                          label="Role"
                          value={project.role}
                          onChange={(value) =>
                            updateProject(index, "role", value)
                          }
                        />

                        <Input
                          label="Project URL"
                          value={project.url}
                          onChange={(value) =>
                            updateProject(index, "url", value)
                          }
                        />

                        <Input
                          label="Location"
                          value={project.location}
                          onChange={(value) =>
                            updateProject(index, "location", value)
                          }
                        />

                        <Input
                          label="Start Date"
                          value={project.startDate}
                          onChange={(value) =>
                            updateProject(index, "startDate", value)
                          }
                        />

                        <Input
                          label="End Date"
                          value={project.endDate}
                          onChange={(value) =>
                            updateProject(index, "endDate", value)
                          }
                        />
                      </div>

                      <div className="achievement-section">
                        <label>Achievements</label>

                        {project.description.map((item, bulletIndex) => (
                          <div className="bullet-input" key={bulletIndex}>
                            <span>•</span>

                            <input
                              value={item}
                              placeholder="Describe your contribution..."
                              onChange={(e) =>
                                updateProjectBullet(
                                  index,
                                  bulletIndex,
                                  e.target.value
                                )
                              }
                            />

                            <button
                              onClick={() =>
                                setResume((prev) => {
                                  const copy = [...prev.projects];

                                  copy[index] = {
                                    ...copy[index],

                                    description: copy[index].description.filter(
                                      (_, i) => i !== bulletIndex
                                    ),
                                  };

                                  return {
                                    ...prev,
                                    projects: copy,
                                  };
                                })
                              }
                            >
                              ×
                            </button>
                          </div>
                        ))}

                        <button
                          className="add-small-button"
                          onClick={() =>
                            setResume((prev) => {
                              const copy = [...prev.projects];

                              copy[index] = {
                                ...copy[index],

                                description: [...copy[index].description, ""],
                              };

                              return {
                                ...prev,
                                projects: copy,
                              };
                            })
                          }
                        >
                          + Achievement
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* =========================================
                SKILLS
            ========================================= */}

            {activeTab === "skills" && (
              <div className="form-view">
                <div className="form-heading">
                  <p className="form-eyebrow">SKILLS</p>

                  <h2>Technical Skills</h2>

                  <p>Add technologies and tools you are comfortable with.</p>
                </div>

                <div className="skills-grid">
                  <Input
                    label="Languages"
                    placeholder="Java, JavaScript, Python"
                    value={resume.skills.languages}
                    onChange={(value) => updateSkill("languages", value)}
                  />

                  <Input
                    label="Frameworks"
                    placeholder="React, Next.js, Spring Boot"
                    value={resume.skills.frameworks}
                    onChange={(value) => updateSkill("frameworks", value)}
                  />

                  <Input
                    label="Tools"
                    placeholder="Git, Docker, Postman"
                    value={resume.skills.tools}
                    onChange={(value) => updateSkill("tools", value)}
                  />

                  <Input
                    label="Databases"
                    placeholder="MySQL, MongoDB, SQL Server"
                    value={resume.skills.databases}
                    onChange={(value) => updateSkill("databases", value)}
                  />

                  <Input
                    label="Cloud"
                    placeholder="AWS, Azure, GCP"
                    value={resume.skills.cloud}
                    onChange={(value) => updateSkill("cloud", value)}
                  />
                </div>
              </div>
            )}
            {/* =========================================
                Certifications
            ========================================= */}
            {activeTab === "certifications" && (
              <div className="form-view">
                <div className="form-heading-row">
                  <div>
                    <p className="form-eyebrow">CERTIFICATIONS</p>
                    <h2>Certifications</h2>
                    <p>Add professional certifications and licenses.</p>
                  </div>

                  <button
                    className="add-main-button"
                    onClick={() =>
                      setResume((prev) => ({
                        ...prev,
                        certifications: [
                          ...prev.certifications,
                          {
                            id: crypto.randomUUID(),
                            name: "",
                            issuer: "",
                            year: "",
                          },
                        ],
                      }))
                    }
                  >
                    + Add Certification
                  </button>
                </div>

                {resume.certifications.length === 0 ? (
                  <EmptyState
                    title="No certifications added"
                    description="Add certifications that strengthen your profile."
                  />
                ) : (
                  resume.certifications.map((cert, index) => (
                    <div className="form-card" key={cert.id}>
                      <div className="card-header">
                        <strong>Certification #{index + 1}</strong>

                        <button
                          className="remove-link"
                          onClick={() => {
                            const confirmed = window.confirm("Xóa mục này?");
                            if (!confirmed) return;
                            setResume((prev) => ({
                              ...prev,
                              certifications: prev.certifications.filter(
                                (_, i) => i !== index
                              ),
                            }));
                          }}
                        >
                          Remove
                        </button>
                      </div>

                      <div className="form-grid">
                        <Input
                          label="Certification Name"
                          placeholder="AWS Certified Solutions Architect"
                          value={cert.name}
                          onChange={(value) =>
                            setResume((prev) => {
                              const copy = [...prev.certifications];
                              copy[index] = { ...copy[index], name: value };
                              return { ...prev, certifications: copy };
                            })
                          }
                        />

                        <Input
                          label="Issuer"
                          placeholder="Amazon Web Services"
                          value={cert.issuer}
                          onChange={(value) =>
                            setResume((prev) => {
                              const copy = [...prev.certifications];
                              copy[index] = { ...copy[index], issuer: value };
                              return { ...prev, certifications: copy };
                            })
                          }
                        />

                        <Input
                          label="Year"
                          placeholder="2025"
                          value={cert.year}
                          onChange={(value) =>
                            setResume((prev) => {
                              const copy = [...prev.certifications];
                              copy[index] = { ...copy[index], year: value };
                              return { ...prev, certifications: copy };
                            })
                          }
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </section>

        {/* =================================================
            RESIZER
        ================================================= */}

        <div
          className={`builder-resizer no-print ${isResizing ? "active" : ""}`}
          onMouseDown={startResizing}
        />
        {/* =================================================
            RIGHT 70% PREVIEW
        ================================================= */}

        <section className="builder-preview">
          <div className="preview-toolbar no-print">
            <div className="preview-toolbar-left">
              <button
                className={
                  previewMode === "web" ? "preview-mode active" : "preview-mode"
                }
                onClick={() => setPreviewMode("web")}
              >
                Web Preview
              </button>

              <button
                className={
                  previewMode === "pdf" ? "preview-mode active" : "preview-mode"
                }
                onClick={() => setPreviewMode("pdf")}
              >
                PDF View
              </button>
            </div>

            <span className="preview-status">Live Preview</span>
          </div>

          <div className="resume-preview-container">
            {previewMode === "web" ? (
              <ResumePreview resume={resume} />
            ) : (
              <div className="pdf-preview-wrapper">
                <PDFPreview resume={resume} />
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

/*
 * =========================================================
 * INPUT
 * =========================================================
 */

function Input({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="input-group">
      <label>{label}</label>

      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

/*
 * =========================================================
 * EMPTY STATE
 * =========================================================
 */

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">+</div>

      <strong>{title}</strong>

      <p>{description}</p>
    </div>
  );
}
/*
 * =========================================================
 * EXPORT DEFAULT — bọc Suspense vì dùng useSearchParams
 * =========================================================
 */

export default function BuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="builder-loading">
          <p>Đang tải CV...</p>
        </div>
      }
    >
      <ResumeBuilder />
    </Suspense>
  );
}
