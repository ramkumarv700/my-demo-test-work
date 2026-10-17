
import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  Bot,
  Clock3,
  Mic,
  Plus,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import Breadcrumb from "../components/common/Breadcrumb";
import ChatHistory from "../components/chat/ChatHistory";
import JDResult from "../components/chat/JDResult";

const STORAGE_KEY = "workinfo-interview-history";
const SELECTED_JD_KEY = "workinfo-selected-jd";

function createGreeting() {
  return {
    id: "greeting",
    role: "assistant",
    type: "text",
    text: "Hi! 👋 Welcome to your AI Job Description Generator. Tell me about the role you're hiring for, and I'll help you create an interview-ready job description.",
  };
}

function createChat() {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: "New conversation",
    updatedAt: Date.now(),
    draft: "",
    messages: [createGreeting()],
  };
}

function loadChats() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) && parsed.length
      ? parsed
      : [createChat()];
  } catch {
    return [createChat()];
  }
}

/*
  Existing frontend JD preview generator.
  Connect your AI backend here when available.
*/
function generateJD(prompt) {
  const normalized = prompt.toLowerCase();

  const yearsMatch = prompt.match(/(\d+)\s*\+?\s*(?:years?|yrs?)/i);
  const experience = yearsMatch
    ? `${yearsMatch[1]}+ years of experience`
    : "relevant professional experience";

  const roles = [
    {
      keys: ["frontend", "front-end", "react", "web developer"],
      title: "Frontend Developer",
      primary: [
        "HTML5, CSS3, JavaScript",
        "React.js and reusable UI components",
        "Responsive design and REST API integration",
      ],
      secondary: [
        "TypeScript and Git",
        "Accessibility and web performance",
        "Unit testing and debugging",
      ],
      responsibilities: [
        "Build responsive, accessible web interfaces.",
        "Develop and maintain reusable components.",
        "Collaborate with UI/UX designers and backend developers.",
        "Optimize application performance and troubleshoot issues.",
      ],
    },
    {
      keys: ["backend", "back-end", "node.js", "nodejs", "python", "django"],
      title: "Backend Developer",
      primary: [
        "Backend development with relevant frameworks",
        "REST APIs and database design",
        "Authentication, validation and error handling",
      ],
      secondary: [
        "Git and CI/CD workflows",
        "Cloud deployment and monitoring",
        "Automated testing and documentation",
      ],
      responsibilities: [
        "Design and maintain reliable backend services.",
        "Build secure APIs and integrate databases.",
        "Improve performance, scalability and reliability.",
        "Collaborate with frontend and product teams.",
      ],
    },
    {
      keys: ["ui/ux", "ui ux", "product designer", "user experience"],
      title: "UI/UX Designer",
      primary: [
        "User research and interaction design",
        "Wireframes, prototypes and visual design",
        "Figma and design systems",
      ],
      secondary: [
        "Usability testing and accessibility",
        "Design handoff and developer collaboration",
        "Analytics and iterative improvement",
      ],
      responsibilities: [
        "Understand user needs and business goals.",
        "Create user flows, wireframes and interactive prototypes.",
        "Design consistent, accessible product experiences.",
        "Collaborate with product managers and developers.",
      ],
    },
    {
      keys: ["data analyst", "data scientist", "analytics"],
      title: "Data Analyst",
      primary: [
        "SQL and data analysis",
        "Python or spreadsheet-based analysis",
        "Dashboards and data visualization",
      ],
      secondary: [
        "Statistics and data quality",
        "Power BI or Tableau",
        "Stakeholder communication",
      ],
      responsibilities: [
        "Collect, clean and analyze relevant datasets.",
        "Build reports and dashboards for decision-making.",
        "Identify trends, patterns and actionable insights.",
        "Communicate findings to business stakeholders.",
      ],
    },
    {
      keys: ["hr", "human resources", "recruiter", "talent acquisition"],
      title: "HR / Talent Acquisition Specialist",
      primary: [
        "Recruitment and candidate screening",
        "Interview coordination and communication",
        "Applicant tracking systems",
      ],
      secondary: [
        "Employer branding and sourcing",
        "Recruitment metrics and reporting",
        "Stakeholder management",
      ],
      responsibilities: [
        "Manage candidate sourcing and screening.",
        "Coordinate interviews and hiring feedback.",
        "Maintain accurate candidate records.",
        "Partner with hiring managers to meet recruitment goals.",
      ],
    },
  ];

  const selectedRole = roles.find((role) =>
    role.keys.some((key) => normalized.includes(key))
  );

  const role = selectedRole || {
    title:
      prompt
        .replace(/\b(with|for|having|experience|years|year|yrs)\b/gi, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 70) || "Professional Role",
    primary: [
      "Role-specific technical or functional skills",
      "Relevant tools, systems and processes",
      "Problem-solving and domain knowledge",
    ],
    secondary: [
      "Communication and collaboration",
      "Planning, documentation and reporting",
      "Continuous learning and improvement",
    ],
    responsibilities: [
      "Deliver high-quality work aligned with business objectives.",
      "Collaborate with relevant teams and stakeholders.",
      "Follow established standards and best practices.",
      "Monitor outcomes, resolve issues and improve processes.",
    ],
  };

  return {
    title: `${role.title} · ${experience}`,
    summary: `We are seeking a motivated ${role.title} with ${experience} to join our team. The successful candidate will contribute to high-quality solutions, collaborate with stakeholders, and help achieve business and technical objectives.`,
    responsibilities: role.responsibilities,
    primarySkills: role.primary,
    secondarySkills: role.secondary,
    additionalInformation:
      "We offer a collaborative work environment with opportunities for continuous learning and career growth. Employment type, location, compensation and other role-specific details can be added before publishing.",
    sourcePrompt: prompt,
    createdAt: Date.now(),
  };
}

function CreateInterview() {
  // FIX: useNavigate must be called inside the component.
  const navigate = useNavigate();

  const [chats, setChats] = useState(loadChats);
  const [activeId, setActiveId] = useState(() => loadChats()[0].id);
  const [attachments, setAttachments] = useState([]);
  const [listening, setListening] = useState(false);
  const [mobileHistoryOpen, setMobileHistoryOpen] = useState(false);
  const [generating, setGenerating] = useState(false);

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  const activeChat =
    chats.find((chat) => chat.id === activeId) || chats[0];

  const draft = activeChat?.draft || "";

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
    } catch (error) {
      console.error("Unable to save chat history:", error);
    }
  }, [chats]);

  useEffect(() => {
    return () => recognitionRef.current?.stop();
  }, []);

  function updateActiveChat(updates) {
    if (!activeChat) return;

    setChats((previous) =>
      previous.map((chat) =>
        chat.id === activeChat.id
          ? { ...chat, ...updates, updatedAt: Date.now() }
          : chat
      )
    );
  }

  function handleNewChat() {
    recognitionRef.current?.stop();
    setListening(false);

    const chat = createChat();

    setChats((previous) => [chat, ...previous]);
    setActiveId(chat.id);
    setAttachments([]);
    setMobileHistoryOpen(false);
  }

  function handleSelectChat(chatId) {
    if (!chatId) {
      setMobileHistoryOpen(false);
      return;
    }

    recognitionRef.current?.stop();
    setListening(false);
    setActiveId(chatId);
    setAttachments([]);
    setMobileHistoryOpen(false);
  }

  function handleRenameChat(chatId, title) {
    setChats((previous) =>
      previous.map((chat) =>
        chat.id === chatId
          ? { ...chat, title: title.trim(), updatedAt: Date.now() }
          : chat
      )
    );
  }

  function handleDeleteChat(chatId) {
    const remaining = chats.filter((chat) => chat.id !== chatId);

    if (!remaining.length) {
      const fresh = createChat();
      setChats([fresh]);
      setActiveId(fresh.id);
    } else {
      setChats(remaining);

      if (activeId === chatId) {
        setActiveId(remaining[0].id);
      }
    }

    setAttachments([]);
  }

  function handleAttachment(event) {
    const files = Array.from(event.target.files || []);

    if (files.length) {
      setAttachments((previous) => [...previous, ...files]);
    }

    event.target.value = "";
  }

  function handleSpeak() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      window.alert(
        "Voice input is not supported in this browser. Try Chrome."
      );
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      let transcript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript;
        }
      }

      if (transcript) {
        const currentDraft = textareaRef.current?.value || "";

        updateActiveChat({
          draft: `${currentDraft} ${transcript}`.trim(),
        });
      }
    };

    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;

    try {
      recognition.start();
      setListening(true);
    } catch (error) {
      console.error("Unable to start voice input:", error);
      setListening(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    const text = draft.trim();

    if ((!text && !attachments.length) || !activeChat || generating) {
      return;
    }

    const firstUserMessage = !activeChat.messages.some(
      (message) => message.role === "user"
    );

    const names = attachments.map((file) => file.name);

    const userMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      type: "text",
      text:
        text ||
        `Please review the attached file(s): ${names.join(", ")}`,
      attachments: names,
    };

    setChats((previous) =>
      previous.map((chat) =>
        chat.id === activeChat.id
          ? {
            ...chat,
            title: firstUserMessage
              ? (text || names[0] || "New conversation").slice(0, 42)
              : chat.title,
            draft: "",
            updatedAt: Date.now(),
            messages: [...chat.messages, userMessage],
          }
          : chat
      )
    );

    setAttachments([]);

    if (!text) return;

    setGenerating(true);

    // Existing frontend demo generator.
    window.setTimeout(() => {
      const jd = generateJD(text);

      const resultMessage = {
        id: `${Date.now()}-jd`,
        role: "assistant",
        type: "jd",
        jd,
      };

      setChats((previous) =>
        previous.map((chat) =>
          chat.id === activeChat.id
            ? {
              ...chat,
              updatedAt: Date.now(),
              messages: [...chat.messages, resultMessage],
            }
            : chat
        )
      );

      setGenerating(false);
    }, 350);
  }

  function handleContinue(jd) {
    try {
      localStorage.setItem(SELECTED_JD_KEY, JSON.stringify(jd));
      navigate("/job-description-editor");
    } catch (error) {
      console.error("Unable to save selected JD:", error);
      window.alert("Unable to save this JD in browser storage.");
    }
  }

  function handleCreateMore(jd) {
    const refinement = `Please refine this job description for ${jd.title}. Add more relevant details and responsibilities.`;

    updateActiveChat({ draft: refinement });
    textareaRef.current?.focus();
  }

  return (
    <main className="flex min-h-0 min-w-0 flex-col bg-[#F5F6FF] p-3 sm:p-5 lg:h-[calc(100dvh-66px)] lg:overflow-hidden lg:p-6">

      <div className="shrink-0">
        <Breadcrumb
          items={[
            { label: "Dashboard", to: "/dashboard" },
            { label: "Create Interview", to: "/create-interview" },
            { label: "Job Description", to: "/job-description-editor" },
          ]}
        />
      </div>


      <header className="mb-4 flex shrink-0 items-center justify-between gap-3 sm:mb-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
            <Sparkles size={22} />
          </div>

          <div className="min-w-0">
            <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
              AI Job Description Generator
            </h1>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Create interview-ready job descriptions with AI
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileHistoryOpen((value) => !value)}
          className="flex h-10 shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 lg:hidden"
          aria-label="Toggle chat history"
        >
          {mobileHistoryOpen ? <X size={17} /> : <Clock3 size={17} />}
          <span className="hidden sm:inline">History</span>
        </button>
      </header>

      <section className="interview-workspace-enter grid min-h-0 min-w-0 flex-1 grid-cols-1 items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_268px]">
        <div className="flex min-h-[420px] min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white lg:h-full lg:min-h-0">
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                <Bot size={21} />
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-sm font-semibold text-slate-900">
                  AI Hiring Assistant
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Describe the role you want to hire for
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleNewChat}
              className="flex h-9 shrink-0 items-center gap-2 rounded-full border border-slate-300 px-3 text-xs font-medium text-slate-700 transition hover:bg-violet-600 hover:text-white sm:text-sm"
            >
              <Plus size={15} />
              New chat
            </button>
          </div>

          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
            {activeChat?.messages.map((message) => (
              <div key={message.id}>
                {message.role === "user" ? (
                  <div className="flex justify-end gap-3">
                    <div className="max-w-[85%] rounded-2xl rounded-br-md bg-violet-600 px-4 py-3 text-sm leading-6 text-white">
                      <p className="whitespace-pre-wrap">
                        {message.text}
                      </p>

                      {message.attachments?.map((name) => (
                        <p
                          key={name}
                          className="mt-1 text-xs opacity-80"
                        >
                          📎 {name}
                        </p>
                      ))}
                    </div>

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                      <UserRound size={17} />
                    </div>
                  </div>
                ) : (
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                      <Bot size={17} />
                    </div>

                    <div className="min-w-0 flex-1">
                      {message.type === "jd" ? (
                        <JDResult
                          jd={message.jd}
                          onContinue={handleContinue}
                          onCreateMore={handleCreateMore}
                        />
                      ) : (
                        <div className="rounded-2xl rounded-tl-md bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
                          {message.text}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {generating && (
              <div className="ml-11 flex items-center gap-2 text-sm text-slate-500">
                <span className="h-2 w-2 animate-pulse rounded-full bg-violet-500" />
                Preparing your job description...
              </div>
            )}

            {activeChat?.messages.length === 1 && (
              <div className="ml-11 pt-1">
                <p className="mb-3 text-xs font-medium text-slate-500">
                  Try an example
                </p>

                <div className="flex flex-wrap gap-2">
                  {[
                    "Frontend Developer with 3+ years of experience",
                    "Senior UI/UX Designer",
                    "Backend Developer with Node.js",
                  ].map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => updateActiveChat({ draft: prompt })}
                      className="rounded-xl border border-violet-100 bg-white px-3 py-2 text-left text-xs text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="shrink-0 bg-white p-3 pt-2 sm:p-5 sm:pt-2">
            <form
              onSubmit={handleSubmit}
              className="rounded-[28px] border border-violet-200 bg-white p-3 shadow-[0_8px_28px_rgba(124,58,237,0.12)] transition focus-within:border-violet-400 sm:p-4"
            >
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 pb-2">
                  {attachments.map((file, index) => (
                    <span
                      key={`${file.name}-${index}`}
                      className="inline-flex max-w-full items-center gap-2 rounded-lg bg-violet-50 px-2 py-1 text-xs text-violet-700"
                    >
                      <span className="max-w-44 truncate">
                        {file.name}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setAttachments((previous) =>
                            previous.filter((_, i) => i !== index)
                          )
                        }
                        aria-label={`Remove ${file.name}`}
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-700 hover:bg-violet-50 hover:text-violet-600 sm:h-11 sm:w-11"
                  aria-label="Attach file"
                >
                  <Plus size={22} />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleAttachment}
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                />

                <div className="min-w-0 flex-1">
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    value={draft}
                    onChange={(event) =>
                      updateActiveChat({ draft: event.target.value })
                    }
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" &&
                        !event.shiftKey
                      ) {
                        event.preventDefault();
                        event.currentTarget.form?.requestSubmit();
                      }
                    }}
                    placeholder="Describe the role you want to hire for..."
                    aria-label="Describe the role you want to hire for"
                    className="max-h-28 min-h-6 w-full resize-y bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-500"
                  />

                  <p className="mt-1 hidden truncate text-xs text-slate-400 sm:block">
                    Press Enter to send · Shift + Enter for a new line
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSpeak}
                  className={`flex h-10 w-8 shrink-0 items-center justify-center rounded-full ${listening
                    ? "bg-violet-100 text-violet-700"
                    : "text-slate-700 hover:bg-violet-50 hover:text-violet-600"
                    }`}
                  aria-label={listening ? "Stop voice input" : "Speak"}
                >
                  <Mic size={21} />
                </button>

                <button
                  type="submit"
                  disabled={
                    generating || (!draft.trim() && !attachments.length)
                  }
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white shadow-md transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50 sm:h-12 sm:w-12"
                  aria-label="Send message"
                >
                  <ArrowUp size={23} />
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="min-h-0 min-w-0 lg:h-full">
          <ChatHistory
            chats={chats}
            activeChatId={activeChat?.id}
            onSelectChat={handleSelectChat}
            onRenameChat={handleRenameChat}
            onDeleteChat={handleDeleteChat}
            mobileHistoryOpen={mobileHistoryOpen}
          />
        </div>
      </section>
    </main>
  );
}

export default CreateInterview;
