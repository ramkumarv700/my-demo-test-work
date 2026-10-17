
import { CheckCircle2, FileText, Sparkles } from "lucide-react";
import Button from "../ui/Button";

function JDResult({ jd, onContinue, onCreateMore }) {
  if (!jd) return null;

  const sections = [
    { title: "Job Summary", content: jd.summary },
    {
      title: "Roles & Responsibilities",
      content: jd.responsibilities,
      list: true,
    },
    { title: "Primary Skills", content: jd.primarySkills, list: true },
    { title: "Secondary Skills", content: jd.secondarySkills, list: true },
    {
      title: "Additional Information",
      content: jd.additionalInformation,
    },
  ];

  return (
    <article className="w-full min-w-0 rounded-tl-md bg-slate-50 overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-4 sm:px-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-red text-violet-600">
          <FileText size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-slate-900">
            Job Description
          </h3>
          <p className="mt-1 break-words text-xs text-slate-500">
            {jd.title}
          </p>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-medium text-violet-700">
          <Sparkles size={12} />
          JD Preview
        </span>
      </div>

      <div className="space-y-5 p-4 sm:p-6">
        {sections.map((section) => (
          <section key={section.title}>
            <h4 className="mb-1.5 text-sm font-semibold text-slate-800">
              {section.title}
            </h4>

            {section.list ? (
              <ul className="list-disc space-y-1 pl-4 text-[13px] leading-5 text-slate-700 marker:text-slate-700">
                {(Array.isArray(section.content)
                  ? section.content
                  : []
                ).map((item, index) => (
                  <li key={`${section.title}-${index}`}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="whitespace-pre-line text-[13px] leading-5 text-slate-500">
                {section.content}
              </p>
            )}
          </section>
        ))}
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-xs text-slate-500">
          Review the details before continuing.
        </p>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="secondary"
            onClick={onCreateMore}
            className="w-full sm:w-auto"
          >
            Create More
          </Button>

          <Button
            onClick={() => onContinue?.(jd)}
            className="w-full sm:w-auto"
          >
            <CheckCircle2 size={15} />
            Continue with this JD
          </Button>
        </div>
      </div>
    </article>
  );
}

export default JDResult;
