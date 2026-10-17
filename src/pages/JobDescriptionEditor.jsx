
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  Code2,
  MapPin,
  Save,
  Sparkles,
} from "lucide-react";

import Breadcrumb from "../components/common/Breadcrumb";
import Button from "../components/ui/Button";
import TextField from "../components/ui/TextField";
import Dropdown from "../components/ui/Dropdown";

import "react-quill-new/dist/quill.snow.css";

const SELECTED_JD_KEY = "workinfo-selected-jd";
const EDITED_JD_KEY = "workinfo-edited-jd";

const toolbarOptions = [
  [{ header: [2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ align: [] }],
  ["link", "clean"],
];

function getStoredJD() {
  try {
    return JSON.parse(
      localStorage.getItem(EDITED_JD_KEY) ||
        localStorage.getItem(SELECTED_JD_KEY) ||
        "null"
    );
  } catch {
    return null;
  }
}

function escapeHTML(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function listToHTML(items = []) {
  if (!Array.isArray(items) || !items.length) {
    return "<p></p>";
  }

  return `<ul>${items
    .map((item) => `<li>${escapeHTML(item)}</li>`)
    .join("")}</ul>`;
}

function createJDHTML(jd) {
  if (!jd) return "";

  return `
    <h3>Job Summary</h3>
    <p>${escapeHTML(jd.summary || "")}</p>

    <h3>Roles &amp; Responsibilities</h3>
    ${listToHTML(jd.responsibilities)}

    <h3>Primary Skills</h3>
    ${listToHTML(jd.primarySkills)}

    <h3>Secondary Skills</h3>
    ${listToHTML(jd.secondarySkills)}

    <h3>Additional Information</h3>
    <p>${escapeHTML(jd.additionalInformation || "")}</p>
  `;
}

function getList(value) {
  if (Array.isArray(value)) return value;

  if (typeof value === "string" && value.trim()) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function getInitialDetails(jd) {
  const saved = jd?.jobDetails || {};
  const fullTitle = jd?.title || "";

  const experienceMatch = fullTitle.match(
    /(\d+)\s*\+?\s*(?:years?|yrs?)/i
  );

  return {
    jobTitle: saved.jobTitle || fullTitle.split(" · ")[0] || "",
    minExperience:
      saved.minExperience ||
      (experienceMatch ? `${experienceMatch[1]} Years` : ""),
    division: saved.division || "",
    workMode: saved.workMode || "Remote",
    department: saved.department || "Technology",
    industry: saved.industry || "Software",
    detailedLocation: saved.detailedLocation || "",
    country: saved.country || "India",
    state: saved.state || "Delhi",
    city: saved.city || "New Delhi",
    primarySkills: getList(
      saved.primarySkills ?? jd?.primarySkills
    ),
    secondarySkills: getList(
      saved.secondarySkills ?? jd?.secondarySkills
    ),
  };
}

function FieldLabel({ icon: Icon, children }) {
  return (
    <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-600">
      {Icon && (
        <Icon
          size={13}
          className="shrink-0 text-slate-400"
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </div>
  );
}

function SkillTags({ skills, onChange, placeholder }) {
  const [draft, setDraft] = useState("");

  function addSkill(event) {
    if (event.key !== "Enter" && event.key !== ",") return;

    event.preventDefault();

    const skill = draft.trim().replace(/,$/, "");

    if (
      skill &&
      !skills.some(
        (item) => item.toLowerCase() === skill.toLowerCase()
      )
    ) {
      onChange([...skills, skill]);
    }

    setDraft("");
  }

  function removeSkill(skillToRemove) {
    onChange(skills.filter((skill) => skill !== skillToRemove));
  }

  return (
    <div className="flex min-h-[44px] min-w-0 flex-wrap items-center gap-2 rounded-lg bg-white px-3 py-2 transition focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100">
      {skills.map((skill) => (
        <span
          key={skill}
          className="inline-flex max-w-full items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
        >
          <span className="max-w-56 truncate">{skill}</span>

          <button
            type="button"
            onClick={() => removeSkill(skill)}
            aria-label={`Remove ${skill}`}
            className="shrink-0 text-slate-500 transition hover:text-red-600"
          >
            ×
          </button>
        </span>
      ))}

      <input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={addSkill}
        placeholder={placeholder}
        className="h-6 min-w-[120px] flex-1 bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
      />
    </div>
  );
}

function JobDescriptionEditor() {
  const navigate = useNavigate();
  const initialJD = useMemo(() => getStoredJD(), []);

  const [jdHTML, setJdHTML] = useState(
    () => initialJD?.editedHTML || createJDHTML(initialJD)
  );

  const [details, setDetails] = useState(
    () => getInitialDetails(initialJD)
  );

  const [saved, setSaved] = useState(false);

  function updateDetail(key, value) {
    setDetails((previous) => ({
      ...previous,
      [key]: value,
    }));

    setSaved(false);
  }

  function handleSave() {
    const updatedJD = {
      ...initialJD,
      title: details.jobTitle,
      editedHTML: jdHTML,
      jobDetails: {
        ...details,
        primarySkills: details.primarySkills,
        secondarySkills: details.secondarySkills,
      },
      primarySkills: details.primarySkills,
      secondarySkills: details.secondarySkills,
      createdAt: initialJD?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };

    try {
      localStorage.setItem(
        SELECTED_JD_KEY,
        JSON.stringify(updatedJD)
      );

      localStorage.setItem(
        EDITED_JD_KEY,
        JSON.stringify(updatedJD)
      );

      setSaved(true);
    } catch (error) {
      console.error("Unable to save the job description:", error);
      window.alert("Unable to save the job description.");
    }
  }

  const previewTitle = details.jobTitle || "Job Title";

  return (
    <main className="interview-workspace-enter min-w-0 bg-[#F5F6FF] p-3 sm:p-5 lg:p-6">
      <style>{`
        @keyframes jdPageEnter {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .interview-workspace-enter {
          animation: jdPageEnter 350ms ease-out both;
        }

        @media (prefers-reduced-motion: reduce) {
          .interview-workspace-enter {
            animation: none;
          }
        }

        .jd-rich-editor .quill {
          display: flex;
          min-height: 100%;
          flex-direction: column;
        }

        .jd-rich-editor .ql-toolbar {
          flex-shrink: 0;
          border: 0;
          border-bottom: 1px solid #f1f5f9;
          padding: 12px 16px;
        }

        .jd-rich-editor .ql-container {
          min-height: 320px;
          flex: 1;
          border: 0;
          font-family: inherit;
          font-size: 13px;
        }

        .jd-rich-editor .ql-editor {
          min-height: 320px;
          padding: 24px 20px;
          line-height: 1.7;
          color: #475569;
        }

        .jd-rich-editor .ql-editor h3,
        .jd-preview-content h3 {
          margin-top: 20px;
          margin-bottom: 8px;
          color: #1e293b;
          font-size: 15px;
          font-weight: 700;
        }

        .jd-rich-editor .ql-editor p,
        .jd-preview-content p {
          margin-bottom: 10px;
        }

        .jd-rich-editor .ql-editor ul,
        .jd-rich-editor .ql-editor ol,
        .jd-preview-content ul,
        .jd-preview-content ol {
          margin-bottom: 12px;
          padding-left: 20px;
        }

        .jd-preview-content ul {
          list-style: disc;
        }

        .jd-preview-content ol {
          list-style: decimal;
        }

        .jd-preview-content li {
          margin-bottom: 4px;
          padding-left: 1px;
        }

        .jd-preview-content a {
          color: #7c3aed;
          text-decoration: underline;
          overflow-wrap: anywhere;
        }

        /* Basic Information field alignment */
        .job-basic-grid {
          align-items: start;
        }

        .job-basic-grid > div {
          min-width: 0;
          align-self: start;
        }

        .job-basic-grid label {
          display: block;
          margin-bottom: 6px;
          line-height: 20px;
        }

        .job-basic-grid input,
        .job-basic-grid select {
          box-sizing: border-box;
          width: 100%;
          min-width: 0;
          height: 44px;
          min-height: 44px;
        }

        @media (max-width: 639px) {
          .jd-rich-editor .ql-toolbar {
            padding: 10px 8px;
          }

          .jd-rich-editor .ql-editor {
            padding: 18px 14px;
          }
        }
      `}</style>

      <div className="shrink-0">
        <Breadcrumb
          items={[
            { label: "Dashboard", to: "/dashboard" },
            { label: "Create Interview", to: "/create-interview" },
            {
              label: "Job Description",
              to: "/job-description-editor",
            },
          ]}
        />
      </div>

      <header className="mb-5 flex flex-wrap items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
          <Sparkles size={21} />
        </div>

        <div className="min-w-0">
          <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
            Job Description
          </h1>

          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Review and customize your AI-generated job description.
          </p>
        </div>
      </header>

      {!initialJD && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          No saved JD was found. Go back to Create Interview and
          generate a job description first.

          <button
            type="button"
            onClick={() => navigate("/create-interview")}
            className="ml-2 font-semibold underline"
          >
            Go back
          </button>
        </div>
      )}

      {/* Editor and preview */}
      <section className="grid min-w-0 grid-cols-1 items-stretch gap-4 xl:auto-rows-fr xl:grid-cols-[minmax(0,1fr)_minmax(300px,0.42fr)]">
        {/* Left: Rich-text JD editor */}
        <section className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl bg-white xl:h-full">
          <div className="shrink-0 border-b border-slate-100 px-4 py-4 sm:px-5">
            <h2 className="text-sm font-semibold text-slate-800">
              Job description
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Write a clear, candidate-friendly overview
            </p>
          </div>

          <div className="jd-rich-editor min-h-0 flex-1">
            <ReactQuill
              theme="snow"
              value={jdHTML}
              onChange={(html) => {
                setJdHTML(html);
                setSaved(false);
              }}
              modules={{ toolbar: toolbarOptions }}
              placeholder="Write your job description..."
            />
          </div>

          <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-4 py-3 text-[11px] text-slate-400 sm:px-5">
            <span>Changes appear in the live preview.</span>

            <span>
              {jdHTML.replace(/<[^>]*>/g, "").trim().length} characters
            </span>
          </div>
        </section>

        {/* Right: Live preview */}
        <aside className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl bg-white xl:h-full">
          <div className="shrink-0 border-b border-slate-100 px-4 py-4">
            <h2 className="text-sm font-semibold text-slate-800">
              Live preview
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Preview updates while you edit.
            </p>
          </div>

          <article className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2 text-xs text-slate-400">
              <CalendarDays size={13} />

              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>

            <h2 className="mb-4 break-words text-base font-bold text-slate-900">
              {previewTitle}
            </h2>

            <div
              className="jd-preview-content min-w-0 break-words text-xs leading-5 text-slate-600"
              dangerouslySetInnerHTML={{ __html: jdHTML }}
            />

            <div className="mt-5 flex flex-wrap gap-2">
              {details.workMode && (
                <span className="rounded-full bg-violet-50 px-3 py-1 text-[11px] font-medium text-violet-700">
                  {details.workMode}
                </span>
              )}

              {details.city && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[11px] text-slate-600">
                  <MapPin size={11} />
                  {details.city}
                  {details.country ? `, ${details.country}` : ""}
                </span>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {details.primarySkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] text-blue-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </article>

          <div className="shrink-0 border-t border-slate-100 bg-violet-50/50 px-4 py-3 text-xs leading-5 text-slate-500">
            <Sparkles
              size={13}
              className="mr-1 inline text-violet-500"
            />
            Review the description and job details before continuing.
          </div>
        </aside>
      </section>

      {/* Job Details */}
      <section className="mt-5 min-w-0 rounded-2xl bg-white p-4 sm:p-5 lg:p-6">
        <h2 className="text-base font-bold text-slate-800">
          Job Details
        </h2>

        {/* Basic Information */}
        <div className="mt-5">
          <FieldLabel icon={BriefcaseBusiness}>
            Basic Information
          </FieldLabel>

          <div className="job-basic-grid mt-3 grid min-w-0 grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="min-w-0">
              <TextField
                label="Job Title"
                type="text"
                value={details.jobTitle}
                onChange={(event) =>
                  updateDetail("jobTitle", event.target.value)
                }
                placeholder="Enter job title"
                required
              />
            </div>

            <div className="min-w-0">
              <Dropdown
                label="Min Experience"
                name="minExperience"
                value={details.minExperience}
                onChange={(event) =>
                  updateDetail("minExperience", event.target.value)
                }
                options={[
                  "Fresher",
                  "1 Year",
                  "2 Years",
                  "3 Years",
                  "4 Years",
                  "5 Years",
                  "6 Years",
                  "7 Years",
                  "8 Years",
                  "10+ Years",
                ]}
                placeholder="Select experience"
              />
            </div>

            <div className="min-w-0">
              <TextField
                label="Division"
                type="text"
                value={details.division}
                onChange={(event) =>
                  updateDetail("division", event.target.value)
                }
                placeholder="Enter division"
              />
            </div>
          </div>
        </div>

        {/* Location and Department */}
        <div className="mt-6">
          <FieldLabel icon={MapPin}>
            Location &amp; Department
          </FieldLabel>

          <div className="mt-3 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Dropdown
              label="Work Mode"
              name="workMode"
              value={details.workMode}
              onChange={(event) =>
                updateDetail("workMode", event.target.value)
              }
              options={["Remote", "Hybrid", "On-site"]}
            />

            <Dropdown
              label="Department"
              name="department"
              value={details.department}
              onChange={(event) =>
                updateDetail("department", event.target.value)
              }
              options={[
                "Technology",
                "Design",
                "Engineering",
                "Marketing",
                "Sales",
                "Human Resources",
                "Finance",
                "Operations",
              ]}
            />

            <Dropdown
              label="Industry"
              name="industry"
              value={details.industry}
              onChange={(event) =>
                updateDetail("industry", event.target.value)
              }
              options={[
                "Software",
                "Information Technology",
                "E-commerce",
                "Finance",
                "Healthcare",
                "Education",
                "Consulting",
                "Other",
              ]}
            />

            <TextField
              label="Detailed Location"
              type="text"
              value={details.detailedLocation}
              onChange={(event) =>
                updateDetail("detailedLocation", event.target.value)
              }
              placeholder="Enter office address"
            />

            <Dropdown
              label="Country"
              name="country"
              value={details.country}
              onChange={(event) =>
                updateDetail("country", event.target.value)
              }
              options={[
                "India",
                "United States",
                "United Kingdom",
                "Canada",
                "Australia",
              ]}
            />

            <Dropdown
              label="State"
              name="state"
              value={details.state}
              onChange={(event) =>
                updateDetail("state", event.target.value)
              }
              options={[
                "Delhi",
                "Haryana",
                "Uttar Pradesh",
                "Maharashtra",
                "Karnataka",
                "Telangana",
                "Tamil Nadu",
                "Other",
              ]}
            />

            <Dropdown
              label="City"
              name="city"
              value={details.city}
              onChange={(event) =>
                updateDetail("city", event.target.value)
              }
              options={[
                "New Delhi",
                "Gurugram",
                "Faridabad",
                "Noida",
                "Bengaluru",
                "Mumbai",
                "Hyderabad",
                "Other",
              ]}
            />
          </div>
        </div>

        {/* Skills */}
        <div className="mt-6">
          <FieldLabel icon={Code2}>Skills</FieldLabel>

          <div className="mt-3 space-y-4">
            <div>
              <FieldLabel>Primary Skills</FieldLabel>

              <SkillTags
                skills={details.primarySkills}
                onChange={(value) =>
                  updateDetail("primarySkills", value)
                }
                placeholder="Type a skill and press Enter"
              />
            </div>

            <div>
              <FieldLabel>Secondary Skills</FieldLabel>

              <SkillTags
                skills={details.secondarySkills}
                onChange={(value) =>
                  updateDetail("secondarySkills", value)
                }
                placeholder="Type a skill and press Enter"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer actions */}
      <div className="mt-4 flex flex-col-reverse items-stretch justify-between gap-3 rounded-2xl p-3 sm:flex-row sm:items-center">
        <Button
          variant="secondary"
          onClick={() => navigate(-1)}
          className="w-full sm:w-auto"
        >
          <ArrowLeft size={15} />
          Back
        </Button>

        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          {saved && (
            <span
              role="status"
              className="text-center text-xs font-medium text-emerald-600 sm:text-left"
            >
              Job description saved.
            </span>
          )}

          <Button
            onClick={handleSave}
            className="w-full sm:w-auto"
          >
            <Save size={15} />
            Save &amp; Continue
          </Button>
        </div>
      </div>
    </main>
  );
}

export default JobDescriptionEditor;
