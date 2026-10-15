
import { useEffect, useRef, useState } from "react";
import {
  Clock3,
  MessageSquare,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  X,
  Check,
} from "lucide-react";

function formatDate(timestamp) {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

export default function ChatHistory({
  chats = [],
  activeChatId,
  onSelectChat,
  onRenameChat,
  onDeleteChat,
  mobileHistoryOpen = false,
}) {
  const [search, setSearch] = useState("");
  const [menuId, setMenuId] = useState(null);
  const [renameTarget, setRenameTarget] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const renameInputRef = useRef(null);

  useEffect(() => {
    if (renameTarget) {
      renameInputRef.current?.focus();
      renameInputRef.current?.select();
    }
  }, [renameTarget]);

  useEffect(() => {
    function closeMenu(event) {
      if (!event.target.closest("[data-chat-menu]")) {
        setMenuId(null);
      }
    }

    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  const filteredChats = [...chats]
    .filter((chat) => {
      const query = search.trim().toLowerCase();
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
    setRenameTarget(chat);
    setRenameValue(chat.title || "");
    setMenuId(null);
  }

  function saveRename(event) {
    event.preventDefault();

    const title = renameValue.trim();
    if (!title || !renameTarget) return;

    onRenameChat?.(renameTarget.id, title);
    setRenameTarget(null);
    setRenameValue("");
  }

  function confirmDelete() {
    if (!deleteTarget) return;

    const id = deleteTarget.id;
    setDeletingId(id);
    setMenuId(null);

    // Allow the exit animation to finish before removing the chat.
    window.setTimeout(() => {
      onDeleteChat?.(id);
      setDeleteTarget(null);
      setDeletingId(null);
    }, 220);
  }

  return (
    <>
      {/* Desktop history panel */}
      <aside className="hidden min-h-[620px] min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-4 lg:flex">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
            <Clock3 size={18} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Chat History
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Your conversations
            </p>
          </div>
        </div>

        <div className="relative mb-4">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search chats..."
            aria-label="Search chats"
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs outline-none transition focus:border-violet-300 focus:bg-white"
          />
        </div>

        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">
            RECENT CHATS
          </span>
          <span className="rounded-full bg-violet-50 px-2 py-1 text-[10px] font-medium text-violet-600">
            {filteredChats.length}
          </span>
        </div>

        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
          {filteredChats.map((chat) => (
            <ChatRow
              key={chat.id}
              chat={chat}
              active={chat.id === activeChatId}
              menuOpen={menuId === chat.id}
              deleting={deletingId === chat.id}
              onSelect={() => onSelectChat?.(chat.id)}
              onMenu={() =>
                setMenuId((current) =>
                  current === chat.id ? null : chat.id
                )
              }
              onRename={() => openRename(chat)}
              onDelete={() => {
                setDeleteTarget(chat);
                setMenuId(null);
              }}
            />
          ))}

          {filteredChats.length === 0 && (
            <div className="px-3 py-10 text-center">
              <MessageSquare
                size={22}
                className="mx-auto mb-2 text-slate-300"
              />
              <p className="text-xs font-medium text-slate-600">
                No conversations found
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Try another search term.
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 border-t border-slate-100 pt-3">
          <p className="text-center text-[10px] text-slate-400">
            Conversations are saved on this device
          </p>
        </div>
      </aside>

      {/* Mobile history drawer */}
      {mobileHistoryOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close chat history"
            onClick={() => onSelectChat?.(activeChatId)}
            className="absolute inset-0 bg-slate-950/30 backdrop-blur-[2px]"
          />

          <aside className="absolute bottom-0 right-0 top-0 flex w-[min(88vw,340px)] flex-col bg-white p-4 shadow-2xl animate-[historySlideIn_180ms_ease-out]">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                  <Clock3 size={18} />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Chat History
                  </h2>
                  <p className="text-xs text-slate-500">
                    Your conversations
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onSelectChat?.(activeChatId)}
                aria-label="Close history"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={19} />
              </button>
            </div>

            <div className="relative mb-4">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search chats..."
                aria-label="Search chats"
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs outline-none focus:border-violet-300 focus:bg-white"
              />
            </div>

            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto">
              {filteredChats.map((chat) => (
                <ChatRow
                  key={chat.id}
                  chat={chat}
                  active={chat.id === activeChatId}
                  menuOpen={menuId === chat.id}
                  deleting={deletingId === chat.id}
                  onSelect={() => onSelectChat?.(chat.id)}
                  onMenu={() =>
                    setMenuId((current) =>
                      current === chat.id ? null : chat.id
                    )
                  }
                  onRename={() => openRename(chat)}
                  onDelete={() => {
                    setDeleteTarget(chat);
                    setMenuId(null);
                  }}
                />
              ))}

              {filteredChats.length === 0 && (
                <p className="py-10 text-center text-xs text-slate-500">
                  No conversations found.
                </p>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* Rename modal */}
      {renameTarget && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[3px] animate-[historyFadeIn_160ms_ease-out]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setRenameTarget(null);
            }
          }}
        >
          <form
            onSubmit={saveRename}
            className="w-full max-w-md rounded-2xl border border-violet-100 bg-white p-5 shadow-2xl animate-[historyModalIn_180ms_ease-out] sm:p-6"
          >
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Rename chat
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Choose a clear name for this conversation.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRenameTarget(null)}
                aria-label="Close rename dialog"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <label
              htmlFor="rename-chat-input"
              className="mb-2 block text-xs font-medium text-slate-700"
            >
              Chat name
            </label>
            <input
              ref={renameInputRef}
              id="rename-chat-input"
              value={renameValue}
              onChange={(event) => setRenameValue(event.target.value)}
              maxLength={100}
              required
              className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-800 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              placeholder="Enter chat name"
            />

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRenameTarget(null)}
                className="h-10 rounded-xl border border-slate-200 px-4 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!renameValue.trim()}
                className="flex h-10 items-center gap-2 rounded-xl bg-violet-600 px-4 text-xs font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Check size={15} />
                Save changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[3px] animate-[historyFadeIn_160ms_ease-out]">
          <div className="w-full max-w-sm rounded-2xl border border-slate-100 bg-white p-5 shadow-2xl animate-[historyModalIn_180ms_ease-out] sm:p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <Trash2 size={20} />
            </div>
            <h3 className="text-base font-semibold text-slate-900">
              Delete this chat?
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-medium text-slate-700">
                “{deleteTarget.title || "Untitled chat"}”
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deletingId !== null}
                className="h-10 rounded-xl border border-slate-200 px-4 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deletingId !== null}
                className="flex h-10 items-center gap-2 rounded-xl bg-rose-600 px-4 text-xs font-medium text-white transition hover:bg-rose-700 disabled:opacity-60"
              >
                <Trash2 size={14} />
                {deletingId ? "Deleting..." : "Delete chat"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes historyFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes historyModalIn {
          from { opacity: 0; transform: translateY(10px) scale(.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes historySlideIn {
          from { transform: translateX(20px); opacity: .7; }
          to { transform: translateX(0); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: .01ms !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>
    </>
  );
}

function ChatRow({
  chat,
  active,
  menuOpen,
  deleting,
  onSelect,
  onMenu,
  onRename,
  onDelete,
}) {
  const lastUserMessage = [...(chat.messages || [])]
    .reverse()
    .find((message) => message.role === "user");

  return (
    <div
      className={`group relative rounded-xl transition-all duration-200 ${
        deleting
          ? "translate-x-3 scale-95 opacity-0"
          : "translate-x-0 scale-100 opacity-100"
      } ${
        active
          ? "border border-violet-200 bg-violet-50"
          : "border border-transparent hover:border-slate-100 hover:bg-slate-50"
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        className="w-full min-w-0 rounded-xl py-3 pl-3 pr-10 text-left"
      >
        <div className="flex min-w-0 items-start gap-2">
          <MessageSquare
            size={15}
            className={`mt-0.5 shrink-0 ${
              active ? "text-violet-600" : "text-slate-400"
            }`}
          />
          <div className="min-w-0 flex-1">
            <p
              className={`truncate text-xs font-semibold ${
                active ? "text-violet-800" : "text-slate-700"
              }`}
            >
              {chat.title || "New conversation"}
            </p>
            <p className="mt-1 truncate text-[11px] leading-4 text-slate-500">
              {lastUserMessage?.text || "No messages yet"}
            </p>
            <p className="mt-2 text-[10px] text-slate-400">
              {formatDate(chat.updatedAt)}
            </p>
          </div>
        </div>
      </button>

      <div
        data-chat-menu
        className={`absolute right-2 top-2 z-20 ${
          menuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        } transition-opacity`}
      >
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onMenu();
          }}
          aria-label={`Options for ${chat.title || "chat"}`}
          aria-expanded={menuOpen}
          className={`flex h-7 w-7 items-center justify-center rounded-lg transition ${
            menuOpen
              ? "bg-violet-100 text-violet-700"
              : "text-slate-400 hover:bg-white hover:text-slate-700"
          }`}
        >
          <MoreVertical size={17} />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-8 z-30 w-40 overflow-hidden rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl animate-[historyFadeIn_120ms_ease-out]">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onRename();
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs text-slate-700 transition hover:bg-violet-50 hover:text-violet-700"
            >
              <Pencil size={14} />
              Rename chat
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onDelete();
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs text-rose-600 transition hover:bg-rose-50"
            >
              <Trash2 size={14} />
              Delete chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
