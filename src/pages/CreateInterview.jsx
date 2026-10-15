
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
import ChatHistory from "../components/chat/ChatHistory";

const STORAGE_KEY = "workinfo-interview-history";

const createGreeting = () => ({
  id: "greeting",
  role: "assistant",
  text: "Hi! Welcome to your AI Job Description Generator. Tell me about the role you're hiring for, and I'll help you create an interview-ready job description.",
});

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
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];

    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }

    return [createChat()];
  } catch (error) {
    console.error("Unable to load chat history:", error);
    return [createChat()];
  }
}

function CreateInterview() {
  const [initialChats] = useState(loadChats);
  const [chats, setChats] = useState(initialChats);
  const [activeId, setActiveId] = useState(initialChats[0].id);
  const [listening, setListening] = useState(false);
  const [mobileHistoryOpen, setMobileHistoryOpen] = useState(false);
  const [attachments, setAttachments] = useState([]);

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  const activeChat =
    chats.find((chat) => chat.id === activeId) || chats[0];

  const draft = activeChat?.draft || "";

  // Save chats to localStorage.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
    } catch (error) {
      console.error("Unable to save chat history:", error);
    }
  }, [chats]);

  // Stop voice recognition when the page unmounts.
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
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

  // Create a new conversation.
  function handleNewChat() {
    recognitionRef.current?.stop();
    setListening(false);

    const newChat = createChat();

    setChats((previous) => [newChat, ...previous]);
    setActiveId(newChat.id);
    setAttachments([]);
    setMobileHistoryOpen(false);
  }

  // Select an existing conversation.
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

  // Rename a conversation.
  function handleRenameChat(chatId, newTitle) {
    const cleanTitle = newTitle.trim();
    if (!cleanTitle) return;

    setChats((previous) =>
      previous.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              title: cleanTitle,
              updatedAt: Date.now(),
            }
          : chat
      )
    );
  }

  // Delete a conversation.
  function handleDeleteChat(chatId) {
    const remainingChats = chats.filter(
      (chat) => chat.id !== chatId
    );

    if (remainingChats.length === 0) {
      const freshChat = createChat();
      setChats([freshChat]);
      setActiveId(freshChat.id);
    } else {
      setChats(remainingChats);

      if (activeId === chatId) {
        setActiveId(remainingChats[0].id);
      }
    }

    setAttachments([]);
    setMobileHistoryOpen(false);
  }

  // Attach files.
  function handleAttachment(event) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setAttachments((previous) => [...previous, ...files]);
    event.target.value = "";
  }

  function removeAttachment(index) {
    setAttachments((previous) =>
      previous.filter((_, fileIndex) => fileIndex !== index)
    );
  }

  // Voice input.
  function handleSpeak() {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Try Chrome.");
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
        const updatedDraft = `${currentDraft} ${transcript}`.trim();

        updateActiveChat({ draft: updatedDraft });
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

  // Submit a chat message.
  function handleSubmit(event) {
    event.preventDefault();

    const text = draft.trim();

    if ((!text && attachments.length === 0) || !activeChat) {
      return;
    }

    const firstUserMessage = !activeChat.messages.some(
      (message) => message.role === "user"
    );

    const attachmentNames = attachments.map((file) => file.name);

    const newMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      role: "user",
      text: text || "Please review the attached file(s).",
      attachments: attachmentNames,
    };

    setChats((previous) =>
      previous.map((chat) =>
        chat.id === activeChat.id
          ? {
              ...chat,
              title: firstUserMessage
                ? (text || attachmentNames[0] || "New conversation")
                    .slice(0, 42)
                : chat.title,
              draft: "",
              updatedAt: Date.now(),
              messages: [...chat.messages, newMessage],
            }
          : chat
      )
    );

    setAttachments([]);

    // AI responses require backend/API integration.
  }

  return (
    <main className="min-w-0 bg-[#F5F6FF] p-3 sm:p-5 lg:p-6">
      {/* Page heading */}
      <header className="mb-6 flex items-center justify-between gap-3">
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
          onClick={() => setMobileHistoryOpen((previous) => !previous)}
          className="flex h-10 shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 lg:hidden"
          aria-label="Toggle chat history"
        >
          {mobileHistoryOpen ? <X size={17} /> : <Clock3 size={17} />}
          <span className="hidden sm:inline">History</span>
        </button>
      </header>

      <section className="grid min-w-0 grid-cols-1 items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_290px]">
        {/* AI Hiring Assistant: entrance animation added */}
        <div className="create-interview-panel flex min-h-[620px] min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-6">
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
              className="flex h-9 shrink-0 items-center gap-2 rounded-xl bg-violet-600 px-3 text-xs font-medium text-white transition hover:bg-violet-700"
            >
              <Plus size={15} />
              <span className="hidden sm:inline">New chat</span>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
            {activeChat?.messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                    <Bot size={17} />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.role === "user"
                      ? "rounded-br-md bg-violet-600 text-white"
                      : "rounded-tl-md bg-slate-50 text-slate-700"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>

                  {message.attachments?.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {message.attachments.map((name, index) => (
                        <p
                          key={`${name}-${index}`}
                          className="text-xs opacity-80"
                        >
                          📎 {name}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                {message.role === "user" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                    <UserRound size={17} />
                  </div>
                )}
              </div>
            ))}

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

          {/* Chat composer */}
          <div className="sticky bottom-0 bg-white p-3 pt-2 sm:p-5 sm:pt-2">
            <form
              onSubmit={handleSubmit}
              className="rounded-[32px] border border-violet-200 bg-white p-2 shadow-[0_8px_28px_rgba(124,58,237,0.12)] transition focus-within:border-violet-400"
            >
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 px-3 pb-2 pt-1">
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
                        onClick={() => removeAttachment(index)}
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
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600"
                  aria-label="Attach file"
                  title="Attach file"
                >
                  <Plus size={23} strokeWidth={1.8} />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleAttachment}
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                />

                <div className="min-w-0 flex-1 py-1">
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    value={draft}
                    onChange={(event) =>
                      updateActiveChat({ draft: event.target.value })
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        event.currentTarget.form?.requestSubmit();
                      }
                    }}
                    placeholder="Describe the role you want to hire for..."
                    aria-label="Describe the role you want to hire for"
                    className="max-h-28 min-h-6 w-full resize-y bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-500"
                  />

                  <p className="mt-1 hidden truncate text-xs text-slate-400 sm:block">
                    e.g. Create a job description for a Frontend Developer
                    with 3+ years of experience...
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSpeak}
                  className={`flex h-10 w-8 shrink-0 items-center justify-center rounded-full transition ${
                    listening
                      ? "bg-violet-100 text-violet-700"
                      : "text-slate-700 hover:bg-violet-50 hover:text-violet-600"
                  }`}
                  aria-label={listening ? "Stop voice input" : "Speak"}
                  title={listening ? "Stop voice input" : "Speak"}
                >
                  <Mic size={21} />
                </button>

                <button
                  type="submit"
                  disabled={!draft.trim() && attachments.length === 0}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white shadow-md transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Send message"
                  title="Send message"
                >
                  <ArrowUp size={23} />
                </button>
              </div>
            </form>

            <p className="mt-2 text-center text-[11px] text-slate-400">
              Press Enter to send · Shift + Enter for a new line
            </p>
          </div>
        </div>

        {/* Chat History: entrance animation added */}
        <div className="chat-history-panel min-w-0">
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