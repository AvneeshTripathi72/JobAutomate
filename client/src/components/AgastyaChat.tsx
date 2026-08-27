import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  MessageCircle, X, Send, Bot, User, Sparkles, ChevronDown, BrainCircuit,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const STARTER_QUESTIONS = [
  "What positions are open? 💼",
  "I'm a company looking to hire 🏢",
  "How do I submit my resume? 📄",
  "Tell me about Tilcons 🚀",
  "Which industries do you cover? 🏭",
];

const WELCOME_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "Namaste! 🙏 I'm **Agastya**, your dedicated recruitment assistant at Tilcons.\n\nWhether you're a job seeker looking for your next opportunity or an employer searching for top talent — I'm here to help!\n\nHow can I assist you today?",
};

// ─── Typing animation ─────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <span className="flex items-center gap-0.5 py-0.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="inline-block w-1.5 h-1.5 rounded-full bg-current opacity-60"
          style={{ animation: `agastya-bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
        />
      ))}
    </span>
  );
}

// ─── Markdown-lite renderer ───────────────────────────────────────────────────
function MessageText({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, idx, arr) => (
        <span key={idx}>
          {line.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
            part.startsWith("**") && part.endsWith("**")
              ? <strong key={i}>{part.slice(2, -2)}</strong>
              : part
          )}
          {idx < arr.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AgastyaChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPop, setShowPop] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  // Listen for programmatic open
  useEffect(() => {
    const handler = () => { setIsOpen(true); setShowPop(false); };
    window.addEventListener("open-agastya-chat", handler);
    return () => window.removeEventListener("open-agastya-chat", handler);
  }, []);

  // Show pop-up bubble after 2.5 s, auto-hide after 8 s (once per session)
  useEffect(() => {
    const hasSeen = sessionStorage.getItem("agastya-popup-seen");
    if (hasSeen) return;
    const show = setTimeout(() => setShowPop(true), 2500);
    const hide = setTimeout(() => {
      setShowPop(false);
      sessionStorage.setItem("agastya-popup-seen", "1");
    }, 10500);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, []);

  const chatMutation = useMutation({
    mutationFn: async (userMessage: string) => {
      const newMessages = [...messages, { role: "user" as const, content: userMessage }];
      const res = await apiRequest("POST", "/api/chat", { messages: newMessages });
      return res.json();
    },
    onMutate: (userMessage: string) => {
      setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
      setInput("");
    },
    onSuccess: (data: { reply: string }) => {
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'm sorry, I'm having a momentary hiccup! 😅 Please try again — I'm here to help." },
      ]);
    },
  });

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || chatMutation.isPending) return;
    chatMutation.mutate(trimmed);
  };

  const handleStarterClick = (question: string) => {
    if (chatMutation.isPending) return;
    setIsOpen(true);
    setShowPop(false);
    chatMutation.mutate(question.replace(/[^\w\s?,!'-]/g, "").trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const toggleChat = () => {
    setIsOpen((v) => !v);
    setShowPop(false);
    sessionStorage.setItem("agastya-popup-seen", "1");
  };

  const showStarters = messages.length === 1;

  // ── Pop-up bubble (quick starters, shown before first open) ───────────────
  const popBubble = showPop && !isOpen ? (
    <div
      className="fixed flex flex-col items-end gap-2"
      style={{ bottom: "5.5rem", right: "1.25rem", zIndex: 2147483647 }}
    >
      {/* Quick starter chips */}
      <div className="flex flex-col items-end gap-1.5">
        {STARTER_QUESTIONS.map((q, i) => (
          <button
            key={q}
            onClick={() => handleStarterClick(q)}
            className="bg-white border border-border text-foreground text-xs font-medium px-3 py-1.5 rounded-full shadow-md hover:bg-sky-50 hover:border-sky-400 hover:text-sky-700 transition-all"
            style={{ animation: `agastya-slide-up 0.4s ease ${i * 0.07}s both` }}
            data-testid={`popup-starter-${i}`}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Main bubble */}
      <div
        className="relative bg-[#0d2137] text-white rounded-2xl rounded-br-sm px-4 py-3 shadow-xl max-w-[220px] text-sm font-medium cursor-pointer"
        style={{ animation: "agastya-slide-up 0.35s ease both" }}
        onClick={toggleChat}
        data-testid="agastya-popup-bubble"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-sky-400 shrink-0" />
          <span>How can I help you? 😊</span>
        </div>
        <p className="text-white/60 text-[10px] mt-0.5 font-normal">Tap to chat with Agastya</p>
        {/* Triangle tail */}
        <div
          className="absolute -bottom-2 right-3 w-0 h-0"
          style={{
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            borderTop: "9px solid #0d2137",
          }}
        />
        {/* Dismiss */}
        <button
          className="absolute -top-2 -right-2 bg-muted border border-border rounded-full w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-foreground"
          onClick={(e) => { e.stopPropagation(); setShowPop(false); sessionStorage.setItem("agastya-popup-seen", "1"); }}
          aria-label="Dismiss"
          data-testid="button-dismiss-popup"
        >
          <X className="h-2.5 w-2.5" />
        </button>
      </div>
    </div>
  ) : null;

  // ── Chat panel (slides in above the FAB) ──────────────────────────────────
  const chatPanel = isOpen ? (
    <div
      className="fixed"
      style={{
        bottom: "5.5rem",   // sits just above the FAB
        right: "1rem",
        zIndex: 2147483646,
        animation: "agastya-slide-up 0.25s ease both",
      }}
      data-testid="chat-panel"
    >
      <Card
        className="w-[390px] max-w-[calc(100vw-2rem)] flex flex-col shadow-2xl border-0 overflow-hidden"
        style={{
          height: "min(560px, calc(100dvh - 7.5rem))",
          boxShadow: "0 20px 60px rgba(13,33,55,0.28), 0 0 0 1px rgba(14,165,233,0.18)",
        }}
      >
        {/* Header */}
        <CardHeader
          className="flex flex-row items-center justify-between gap-2 px-4 py-3 border-b shrink-0"
          style={{ background: "linear-gradient(135deg, #0d2137 0%, #0c3555 100%)" }}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-400 to-indigo-500 shadow-md">
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0d2137]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight" data-testid="text-chat-title">Agastya</h3>
              <p className="text-[10px] text-sky-300/80 flex items-center gap-1">
                <span className="inline-block w-1 h-1 bg-emerald-400 rounded-full" />
                Tilcons AI · Online now
              </p>
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleChat}
            aria-label="Close chat"
            data-testid="button-close-chat"
            className="text-white/60 hover:text-white hover:bg-white/10 h-8 w-8 shrink-0"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CardHeader>

        {/* Messages */}
        <CardContent
          className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-muted/20"
          ref={scrollRef}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn("flex gap-2 items-end", msg.role === "user" ? "justify-end" : "justify-start")}
              data-testid={`chat-message-${msg.role}-${i}`}
            >
              {msg.role === "assistant" && (
                <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-gradient-to-tr from-sky-400 to-indigo-500 shadow-sm flex items-center justify-center mb-0.5">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              )}
              <div
                className={cn(
                  "rounded-2xl px-3.5 py-2.5 text-sm max-w-[82%] leading-relaxed",
                  msg.role === "user"
                    ? "bg-[#0ea5e9] text-white rounded-br-sm"
                    : "bg-white dark:bg-card border border-border text-foreground shadow-sm rounded-bl-sm"
                )}
              >
                <MessageText text={msg.content} />
              </div>
              {msg.role === "user" && (
                <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center mb-0.5">
                  <User className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {chatMutation.isPending && (
            <div className="flex gap-2 items-end justify-start" data-testid="chat-typing-indicator">
              <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-gradient-to-tr from-sky-400 to-indigo-500 shadow-sm flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white animate-pulse" />
              </div>
              <div className="bg-white dark:bg-card border border-border rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-sm text-muted-foreground shadow-sm flex items-center gap-1.5">
                <TypingDots />
                <span className="text-xs">Agastya is typing…</span>
              </div>
            </div>
          )}

          {/* Starter chips */}
          {showStarters && (
            <div className="flex flex-col gap-2 pt-1" data-testid="chat-starter-questions">
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Quick questions</p>
              <div className="flex flex-wrap gap-1.5">
                {STARTER_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    className="text-xs font-medium px-3 py-1.5 rounded-full border border-border bg-white dark:bg-card hover:border-sky-400 hover:text-sky-600 hover:bg-sky-50 transition-all disabled:opacity-50"
                    onClick={() => handleStarterClick(q)}
                    disabled={chatMutation.isPending}
                    data-testid={`button-starter-${q.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>

        {/* Input */}
        <CardFooter className="p-3 border-t bg-background shrink-0">
          <div className="flex w-full gap-2 items-center">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Agastya anything…"
              disabled={chatMutation.isPending}
              data-testid="input-chat-message"
              className="rounded-full text-sm border-muted-foreground/20 focus-visible:ring-sky-400"
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!input.trim() || chatMutation.isPending}
              aria-label="Send message"
              data-testid="button-send-message"
              className="rounded-full shrink-0 bg-[#0ea5e9] hover:bg-[#0284c7] text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  ) : null;

  // ── Floating Action Button — ALWAYS visible ───────────────────────────────
  const fab = (
    <button
      className="fixed flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 transition-all"
      style={{
        bottom: "1.25rem",
        right: "1.25rem",
        width: "3.5rem",
        height: "3.5rem",
        borderRadius: "50%",
        background: isOpen
          ? "linear-gradient(135deg, #0c3555 0%, #0d2137 100%)"
          : "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
        boxShadow: isOpen
          ? "0 4px 20px rgba(13,33,55,0.4)"
          : showPop
            ? "0 0 0 0 rgba(168,85,247,0.5)"
            : "0 8px 32px rgba(168,85,247,0.4), inset 0 1px 0 rgba(255,255,255,0.25)",
        border: isOpen ? "none" : "1px solid rgba(255,255,255,0.2)",
        animation: showPop && !isOpen ? "agastya-pulse 2s ease-in-out infinite" : undefined,
        zIndex: 2147483647,
        color: "#fff",
        cursor: "pointer",
        transform: "translateZ(0)",   // GPU layer — prevents clipping by overflow:hidden parents
        willChange: "transform",
      }}
      onClick={toggleChat}
      aria-label={isOpen ? "Minimize chat" : "Open chat with Agastya"}
      data-testid="button-open-chat"
    >
      {/* Icon flips between open/close with CSS transition */}
      <span
        style={{
          display: "inline-flex",
          transition: "transform 0.25s ease, opacity 0.2s ease",
          transform: isOpen ? "rotate(180deg) scale(0.9)" : "rotate(0deg) scale(1)",
        }}
      >
        {isOpen ? <ChevronDown className="w-6 h-6" /> : <Bot className="w-6 h-6 text-white animate-pulse" />}
      </span>

      {/* Notification dot */}
      {showPop && !isOpen && (
        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
          <span className="text-[8px] font-bold text-white">1</span>
        </span>
      )}
    </button>
  );

  return createPortal(
    <>
      <style>{`
        @keyframes agastya-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-4px); opacity: 1; }
        }
        @keyframes agastya-slide-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes agastya-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(168,85,247,0.55); }
          50%       { box-shadow: 0 0 0 14px rgba(168,85,247,0); }
        }
      `}</style>
      {popBubble}
      {chatPanel}
      {fab}
    </>,
    document.body
  );
}
