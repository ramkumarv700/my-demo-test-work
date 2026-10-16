
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Clock3,
  MessageSquare,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

function formatDate(timestamp) {
  if (!timestamp) return "";

  return new Date(timestamp).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

function ChatHistory({
  chats = [],
  activeChatId,
  onSelectChat,
  onRenameChat,
  onDeleteChat,
  mobileHistoryOpen = false,
}) {
  const [search, setSearch] = useState("");
  const [menuChatId, setMenuChatId] = useState(null);
  const [renameChat, setRenameChat] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteChat, setDeleteChat] = useState(null);

  const menuRef = useRef(null);
  const renameInputRef = useRef(null);

  const modalOpen = Boolean(renameChat || deleteChat);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuChatId(null);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (renameChat) {
      renameInputRef.current?.focus();
      renameInputRef.current?.select();
    }
  }, [renameChat]);

  useEffect(() => {
    if (!modalOpen) return;

    function handleEscape(event) {
      if (event.key === "Escape") {
        setRenameChat(null);
        setDeleteChat(null);
      }
    }

    const previousOverflow = document.body.style.overflow;

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [modalOpen]);

  const filteredChats = chats
    .filter((chat) => {
      const query = search.toLowerCase().trim();

      if (!query) return true;

      return (
        (chat.title || "").toLowerCase().includes(query) ||
        (chat.messages || []).some((message) =>
          (message.text || "").toLowerCase().includes(query)
        )
      );
    })
    .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

  function openRename(chat) {
    setRenameChat(chat);
    setRenameValue(chat.title || "");
    setMenuChatId(null);
  }

  function submitRename(event) {
    event.preventDefault();

    const title = renameValue.trim();

    if (!title || !renameChat) return;

    onRenameChat?.(renameChat.id, title);
    setRenameChat(null);
    setRenameValue("");
  }

  function confirmDelete() {
    if (!deleteChat) return;

    onDeleteChat?.(deleteChat.id);
    setDeleteChat(null);
    setMenuChatId(null);
  }

  return (
    <>
      <aside
        className={`chat-history-panel flex min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white ${
          mobileHistoryOpen
            ? "fixed inset-3 z-40 h-[calc(100dvh-24px)] shadow-xl lg:static lg:inset-auto lg:z-auto lg:h-full lg:shadow-none"
            : "hidden lg:flex lg:h-full"
        }`}
      >
        {/* Fixed header and search */}
        <div className="shrink-0 border-b border-slate-100 p-4">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Clock3 size={18} className="text-violet-600" />
              <h2 className="text-sm font-semibold text-slate-900">
                Chat History
              </h2>
            </div>

            <button
              type="button"
              onClick={() => onSelectChat?.(null)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 lg:hidden"
              aria-label="Close chat history"
            >
              <X size={18} />
            </button>
          </div>

          <label className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 transition focus-within:border-violet-400">
            <Search size={16} className="shrink-0 text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search chats..."
              aria-label="Search chat history"
              className="min-w-0 flex-1 bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={14} />
              </button>
            )}
          </label>
        </div>

        {/* Only this list scrolls */}
        <div className="min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain p-3">
          <div className="mb-2 flex items-center justify-between px-1 py-1">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Recent chats
            </p>

            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-50 px-1.5 text-[10px] font-medium text-violet-600">
              {filteredChats.length}
            </span>
          </div>

          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => {
              const lastUserMessage = [...(chat.messages || [])]
                .reverse()
                .find((message) => message.role === "user");

              const isActive = chat.id === activeChatId;
              const isMenuOpen = menuChatId === chat.id;

              return (
                <div
                  key={chat.id}
                  className={`group relative flex min-w-0 items-start gap-2 rounded-xl border p-2.5 transition ${
                    isActive
                      ? "border-violet-200 bg-violet-50"
                      : "border-transparent hover:bg-slate-50"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSelectChat?.(chat.id)}
                    className="flex min-w-0 flex-1 items-start gap-2.5 text-left"
                  >
                    <span
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        isActive
                          ? "bg-violet-100 text-violet-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <MessageSquare size={15} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span
                        className={`block truncate text-xs font-medium ${
                          isActive ? "text-violet-700" : "text-slate-800"
                        }`}
                      >
                        {chat.title || "New conversation"}
                      </span>

                      <span className="mt-1 block truncate text-[11px] text-slate-500">
                        {lastUserMessage?.text || "No messages yet"}
                      </span>

                      <span className="mt-2 block text-[10px] text-slate-400">
                        {formatDate(chat.updatedAt)}
                      </span>
                    </span>
                  </button>

                  <div
                    ref={isMenuOpen ? menuRef : null}
                    className="relative shrink-0"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setMenuChatId(isMenuOpen ? null : chat.id)
                      }
                      className={`flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white hover:text-violet-600 ${
                        isMenuOpen
                          ? "visible"
                          : "invisible group-hover:visible focus:visible"
                      }`}
                      aria-label={`Actions for ${chat.title || "conversation"}`}
                      aria-expanded={isMenuOpen}
                    >
                      <MoreVertical size={16} />
                    </button>

                    {isMenuOpen && (
                      <div className="absolute right-0 top-8 z-30 w-36 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                        <button
                          type="button"
                          onClick={() => openRename(chat)}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-slate-700 hover:bg-violet-50 hover:text-violet-700"
                        >
                          <Pencil size={14} />
                          Rename
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setDeleteChat(chat);
                            setMenuChatId(null);
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="px-3 py-8 text-center">
              <Search size={22} className="mx-auto mb-2 text-slate-300" />
              <p className="text-xs font-medium text-slate-600">
                No conversations found
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Try another search term.
              </p>
            </div>
          )}
        </div>

        {/* Fixed footer */}
        <div className="shrink-0 border-t border-slate-100 px-3 py-3 text-center">
          <p className="text-[10px] text-slate-400">
            Conversations are saved on this device
          </p>
        </div>
      </aside>

      {/* Rename modal */}
      {renameChat &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setRenameChat(null);
              }
            }}
          >
            <form
              onSubmit={submitRename}
              className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl"
            >
              <h3 className="text-base font-semibold text-slate-900">
                Rename conversation
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Enter a new name for this conversation.
              </p>

              <input
                ref={renameInputRef}
                value={renameValue}
                onChange={(event) => setRenameValue(event.target.value)}
                maxLength={80}
                className="mt-4 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400"
                placeholder="Conversation name"
                required
              />

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRenameChat(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-violet-600 px-4 py-2 text-xs font-medium text-white hover:bg-violet-700"
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>,
          document.body
        )}

      {/* Delete confirmation modal */}
      {deleteChat &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setDeleteChat(null);
              }
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-conversation-title"
              className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <Trash2 size={19} />
              </div>

              <h3
                id="delete-conversation-title"
                className="mt-3 text-base font-semibold text-slate-900"
              >
                Delete conversation?
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                This will delete &quot;
                {deleteChat.title || "New conversation"}&quot; from your chat
                history. This action cannot be undone.
              </p>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteChat(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={confirmDelete}
                  className="rounded-xl bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

export default ChatHistory;
