import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import {
  MessageCircle, X, Send, Bot, User, Sparkles, ChevronDown, BrainCircuit,
  Trash2, HelpCircle, Paperclip, Mic, ArrowRight, BookOpen, AlertCircle,
  Briefcase, FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const STARTER_CARDS = [
  {
    icon: Briefcase,
    title: "Explore Open Positions",
    description: "Find active tech and engineering roles currently open.",
    prompt: "What positions are open? 💼"
  },
  {
    icon: FileText,
    title: "How to Submit Resume",
    description: "Learn where and how to upload your CV for scoring.",
    prompt: "How do I submit my resume? 📄"
  },
  {
    icon: Sparkles,
    title: "AI Recruiter Features",
    description: "Explore AI resume screening & JD-to-Test MCQ generation.",
    prompt: "Tell me about Tilcons AI Recruiter features 🚀"
  },
  {
    icon: BookOpen,
    title: "Tilcons CRM & ATS",
    description: "Learn how Tilcons helps staffing agencies in India.",
    prompt: "Tell me about Tilcons CRM & ATS platform 🏢"
  }
];

const WELCOME_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "Namaste! 🙏 I'm **Agastya**, your dedicated recruitment assistant at Tilcons.\n\nWhether you're a job seeker looking for your next opportunity or an employer searching for top talent — I'm here to help!\n\nHow can I assist you today?",
};

// ─── Formatting Helper for Inline styling ────────────────────────────────────
function parseInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="font-extrabold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={i} className="italic">{part.slice(1, -1)}</em>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return <code key={i} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-pink-600 dark:text-pink-400 rounded text-xs font-mono">{part.slice(1, -1)}</code>;
        }
        return part;
      })}
    </>
  );
}

// ─── Premium Markdown Renderer ───────────────────────────────────────────────
function MessageText({ text, isStreaming }: { text: string; isStreaming: boolean }) {
  if (!text && isStreaming) {
    return <span className="inline-block w-1.5 h-4 bg-purple-500 animate-pulse ml-0.5" style={{ verticalAlign: "middle" }} />;
  }

  // Split by code blocks
  const parts = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2">
      {parts.map((part, pIdx) => {
        if (part.startsWith("```") && part.endsWith("```")) {
          const code = part.slice(3, -3).trim();
          const codeLines = code.split("\n");
          const firstLine = codeLines[0];
          const hasLang = /^[a-zA-Z0-9+#-]+$/.test(firstLine);
          const lang = hasLang ? firstLine : "";
          const displayCode = hasLang ? codeLines.slice(1).join("\n") : code;

          return (
            <div key={pIdx} className="my-3 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-inner font-mono text-xs text-slate-200">
              <div className="flex items-center justify-between px-4 py-1.5 bg-slate-900 text-[10px] text-slate-400 font-semibold uppercase tracking-wider select-none">
                <span>{lang || "code"}</span>
                <span className="text-[9px]">syntax copy</span>
              </div>
              <pre className="p-3 overflow-x-auto leading-relaxed select-all">
                <code>{displayCode}</code>
              </pre>
            </div>
          );
        }

        return (
          <div key={pIdx} className="space-y-1.5">
            {part.split("\n").map((line, lIdx) => {
              if (line.startsWith("# ")) {
                return <h1 key={lIdx} className="text-base font-extrabold text-slate-900 dark:text-white mt-3 mb-1">{line.slice(2)}</h1>;
              }
              if (line.startsWith("## ")) {
                return <h2 key={lIdx} className="text-sm font-bold text-slate-900 dark:text-white mt-2.5 mb-1">{line.slice(3)}</h2>;
              }
              if (line.startsWith("### ")) {
                return <h3 key={lIdx} className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-2 mb-0.5">{line.slice(4)}</h3>;
              }

              // List items
              if (line.startsWith("- ") || line.startsWith("* ")) {
                return (
                  <div key={lIdx} className="flex items-start gap-2 pl-2 my-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-2 shrink-0 animate-pulse" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{parseInline(line.slice(2))}</span>
                  </div>
                );
              }

              // Numbered list items
              const numMatch = line.match(/^(\d+)\.\s(.*)/);
              if (numMatch) {
                return (
                  <div key={lIdx} className="flex items-start gap-2 pl-2 my-0.5">
                    <span className="text-xs font-bold text-purple-500 mt-0.5 shrink-0">{numMatch[1]}.</span>
                    <span className="text-sm text-slate-700 dark:text-slate-300">{parseInline(numMatch[2])}</span>
                  </div>
                );
              }

              // Blockquotes
              if (line.startsWith("> ")) {
                return (
                  <blockquote key={lIdx} className="pl-3 border-l-2 border-purple-500 italic text-slate-500 dark:text-slate-400 my-2">
                    {parseInline(line.slice(2))}
                  </blockquote>
                );
              }

              // Default paragraph
              return (
                <p key={lIdx} className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed break-words">
                  {parseInline(line)}
                </p>
              );
            })}
          </div>
        );
      })}
      {isStreaming && (
        <span className="inline-block w-1.5 h-4 bg-purple-500 animate-pulse ml-0.5" style={{ verticalAlign: "middle" }} />
      )}
    </div>
  );
}

// ─── Main Chat Component ─────────────────────────────────────────────────────
export default function AgastyaChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPop, setShowPop] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  
  // Streaming states
  const [streamingIndex, setStreamingIndex] = useState<number | null>(null);
  const [streamingText, setStreamingText] = useState("");
  
  // UI Status Indicator
  const [statusText, setStatusText] = useState<"Ready" | "Thinking" | "Reasoning" | "Typing">("Ready");

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingText]);

  // Focus textarea when open
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Listen for programmatic open
  useEffect(() => {
    const handler = () => { setIsOpen(true); setShowPop(false); };
    window.addEventListener("open-agastya-chat", handler);
    return () => window.removeEventListener("open-agastya-chat", handler);
  }, []);

  // Show pop-up bubble after 2.5s
  useEffect(() => {
    const hasSeen = sessionStorage.getItem("agastya-popup-seen");
    if (hasSeen) return;
    const show = setTimeout(() => setShowPop(true), 2500);
    const hide = setTimeout(() => {
      setShowPop(false);
      sessionStorage.setItem("agastya-popup-seen", "1");
    }, 12000);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, []);

  // Progressive client-side text streaming
  useEffect(() => {
    if (streamingIndex === null || !streamingText) return;

    setStatusText("Typing");
    let currentLength = 0;
    const increment = 2; // Stream 2 characters at a time
    const interval = setInterval(() => {
      currentLength += increment;
      if (currentLength >= streamingText.length) {
        setMessages((prev) => {
          const next = [...prev];
          next[streamingIndex] = { role: "assistant", content: streamingText };
          return next;
        });
        setStreamingIndex(null);
        setStreamingText("");
        setStatusText("Ready");
        clearInterval(interval);
      } else {
        const textSlice = streamingText.slice(0, currentLength);
        setMessages((prev) => {
          const next = [...prev];
          next[streamingIndex] = { role: "assistant", content: textSlice };
          return next;
        });
      }
    }, 20);

    return () => clearInterval(interval);
  }, [streamingIndex, streamingText]);

  const chatMutation = useMutation({
    mutationFn: async (userMessage: string) => {
      setStatusText("Thinking");
      const newMessages = [...messages, { role: "user" as const, content: userMessage }];
      const res = await apiRequest("POST", "/api/chat", { messages: newMessages });
      return res.json();
    },
    onMutate: (userMessage: string) => {
      setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
      setInput("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    },
    onSuccess: (data: { reply: string }) => {
      setStatusText("Reasoning");
      setTimeout(() => {
        setMessages((prev) => {
          const idx = prev.length;
          setStreamingIndex(idx);
          setStreamingText(data.reply);
          return [...prev, { role: "assistant", content: "" }];
        });
      }, 500);
    },
    onError: () => {
      setStatusText("Ready");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'm sorry, I encountered a minor hiccup in my neural net. Please try again! 😅" },
      ]);
    },
  });

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || chatMutation.isPending || streamingIndex !== null) return;
    chatMutation.mutate(trimmed);
  };

  const handleStarterClick = (question: string) => {
    if (chatMutation.isPending || streamingIndex !== null) return;
    setIsOpen(true);
    setShowPop(false);
    chatMutation.mutate(question.replace(/[^\w\s?,!'-]/g, "").trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    if (chatMutation.isPending || streamingIndex !== null) return;
    setMessages([WELCOME_MESSAGE]);
  };

  const toggleChat = () => {
    setIsOpen((v) => !v);
    setShowPop(false);
    sessionStorage.setItem("agastya-popup-seen", "1");
  };

  // Auto-expand textarea height
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const showEmptyState = messages.length === 1 && !chatMutation.isPending && streamingIndex === null;

  // ── Pop-up bubble (quick starters, shown before first open) ───────────────
  const popBubble = showPop && !isOpen ? (
    <div
      className="fixed flex flex-col items-end gap-2"
      style={{ bottom: "5.5rem", right: "1.25rem", zIndex: 2147483647 }}
    >
      <div className="flex flex-col items-end gap-1.5">
        {STARTER_CARDS.slice(0, 3).map((card, i) => (
          <button
            key={card.prompt}
            onClick={() => handleStarterClick(card.prompt)}
            className="bg-white border border-slate-200/80 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-all flex items-center gap-1.5"
            style={{ animation: `agastya-slide-up 0.4s ease ${i * 0.07}s both` }}
          >
            {card.prompt}
          </button>
        ))}
      </div>

      <div
        className="relative bg-slate-900 text-white rounded-2xl rounded-br-sm px-4 py-3 shadow-xl max-w-[220px] text-sm font-medium cursor-pointer border border-white/10"
        style={{ animation: "agastya-slide-up 0.35s ease both" }}
        onClick={toggleChat}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-purple-400 shrink-0" />
          <span>How can I help you? 😊</span>
        </div>
        <p className="text-white/60 text-[10px] mt-0.5 font-normal">Tap to chat with Agastya</p>
        <div
          className="absolute -bottom-2 right-3 w-0 h-0"
          style={{
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            borderTop: "9px solid #0f172a",
          }}
        />
        <button
          className="absolute -top-2 -right-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-full w-5 h-5 flex items-center justify-center text-slate-600"
          onClick={(e) => { e.stopPropagation(); setShowPop(false); sessionStorage.setItem("agastya-popup-seen", "1"); }}
          aria-label="Dismiss"
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
        bottom: "5.5rem",
        right: "1.25rem",
        zIndex: 2147483646,
        animation: "agastya-slide-up 0.25s cubic-bezier(0.16, 1, 0.3, 1) both",
      }}
      data-testid="chat-panel"
    >
      <Card
        className="w-[420px] max-w-[calc(100vw-2.5rem)] flex flex-col shadow-2xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md overflow-hidden rounded-2xl"
        style={{
          height: "min(600px, calc(100dvh - 7.5rem))",
          boxShadow: "0 20px 60px rgba(13,33,55,0.16), 0 0 0 1px rgba(139,92,246,0.12)",
        }}
      >
        {/* Header */}
        <CardHeader
          className="flex flex-row items-center justify-between gap-2 px-4 py-3 border-b border-slate-100 dark:border-slate-900 shrink-0"
          style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)" }}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-500 to-pink-500 shadow-md">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0f172a]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1 leading-tight">
                Agastya <Sparkles className="w-3.5 h-3.5 text-purple-300 fill-purple-300/30" />
              </h3>
              <p className="text-[10px] text-slate-300/85 flex items-center gap-1 font-semibold">
                <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                {statusText === "Ready" && "Tilcons AI · Ready"}
                {statusText === "Thinking" && "Thinking..."}
                {statusText === "Reasoning" && "Analyzing response..."}
                {statusText === "Typing" && "Formulating answer..."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleClearChat}
              disabled={messages.length <= 1 || chatMutation.isPending || streamingIndex !== null}
              title="Clear Conversation"
              className="text-white/60 hover:text-white hover:bg-white/10 h-8 w-8 rounded-lg shrink-0 disabled:opacity-30"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleChat}
              aria-label="Close chat"
              className="text-white/60 hover:text-white hover:bg-white/10 h-8 w-8 rounded-lg shrink-0"
            >
              <ChevronDown className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        {/* Messages */}
        <CardContent
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40 dark:bg-slate-900/10"
          ref={scrollRef}
        >
          {/* Custom empty welcome state */}
          {showEmptyState ? (
            <div className="flex flex-col items-center text-center py-6 px-2 space-y-4 animate-fade-in">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 via-indigo-500 to-pink-500 shadow-xl shadow-purple-500/10">
                <Bot className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-200">Namaste! I'm Agastya</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[280px]">
                  Your AI recruitment expert. Select a prompt below or ask me any question about hiring or roles.
                </p>
              </div>

              {/* Starter cards list */}
              <div className="grid grid-cols-2 gap-2 w-full pt-4">
                {STARTER_CARDS.map((card) => {
                  const Icon = card.icon;
                  return (
                    <button
                      key={card.prompt}
                      onClick={() => handleStarterClick(card.prompt)}
                      className="flex flex-col text-left p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-purple-400 hover:shadow-md hover:-translate-y-0.5 transition-all text-xs space-y-1 select-none"
                    >
                      <div className="h-6 w-6 rounded-lg bg-purple-50 dark:bg-purple-950/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{card.title}</span>
                      <span className="text-[10px] text-slate-400 leading-normal">{card.description}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            messages.map((msg, i) => {
              const isUser = msg.role === "user";
              const isStreamingThis = streamingIndex === i;
              return (
                <div
                  key={i}
                  className={cn("flex gap-3 items-start", isUser ? "justify-end" : "justify-start")}
                  style={{ animation: "agastya-slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) both" }}
                >
                  {!isUser && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 shadow-md flex items-center justify-center mt-0.5 select-none">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-3 text-sm max-w-[80%] leading-relaxed shadow-sm transition-all hover:shadow-md border",
                      isUser
                        ? "bg-gradient-to-tr from-purple-600 to-indigo-600 text-white rounded-tr-sm border-purple-500/30"
                        : "bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-900 text-slate-800 dark:text-slate-100 rounded-tl-sm"
                    )}
                  >
                    <MessageText text={msg.content} isStreaming={isStreamingThis} />
                  </div>
                  {isUser && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center mt-0.5 shadow-sm border border-purple-100 dark:border-purple-900/30 select-none">
                      <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Skeleton Shimmer Thinking Indicator */}
          {chatMutation.isPending && (
            <div className="flex gap-3 items-start justify-start animate-pulse">
              <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 shadow-md flex items-center justify-center">
                <Bot className="w-4 h-4 text-white animate-spin" />
              </div>
              <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl rounded-tl-sm p-4 w-[75%] space-y-2.5 shadow-sm">
                <div className="flex items-center gap-1.5 text-xs text-purple-500 font-bold tracking-wide uppercase select-none">
                  <AlertCircle className="w-3.5 h-3.5 animate-bounce" />
                  <span>Agastya is thinking...</span>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-slate-200/80 dark:bg-slate-800 rounded-full w-[90%] overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" style={{ backgroundSize: "200% 100%" }} />
                  </div>
                  <div className="h-3 bg-slate-200/80 dark:bg-slate-800 rounded-full w-[70%] overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" style={{ backgroundSize: "200% 100%" }} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        {/* Input area (Composer) */}
        <CardFooter className="p-3 border-t border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950 shrink-0">
          <div className="flex flex-col w-full space-y-1">
            <div className="flex items-end gap-2 p-1 border border-slate-200/80 dark:border-slate-800 rounded-xl focus-within:ring-2 focus-within:ring-purple-400 bg-slate-50/50 dark:bg-slate-900/30 transition-all">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Ask Agastya anything..."
                disabled={chatMutation.isPending || streamingIndex !== null}
                className="flex-1 max-h-[120px] bg-transparent text-sm p-2 resize-none border-0 focus:outline-none focus:ring-0 text-slate-800 dark:text-slate-100 placeholder-slate-400 overflow-y-auto leading-relaxed"
                style={{ height: "auto" }}
              />
              <div className="flex items-center gap-1 pb-1 pr-1">
                <button
                  type="button"
                  title="Attach file (mock)"
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition-all"
                >
                  <Paperclip className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  title="Voice command (mock)"
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition-all"
                >
                  <Mic className="h-4 w-4" />
                </button>
                <Button
                  size="icon"
                  onClick={handleSend}
                  disabled={!input.trim() || chatMutation.isPending || streamingIndex !== null}
                  className="rounded-xl h-8 w-8 shrink-0 bg-gradient-to-tr from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md hover:scale-105 active:scale-95 transition-all"
                >
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between px-1 text-[9px] text-slate-400 font-semibold select-none">
              <span>Shift+Enter for newline</span>
              <span>Llama 3.1 Recruiter</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  ) : null;

  // ── Floating Action Button (FAB) ──────────────────────────────────────────
  const fab = (
    <button
      className="fixed flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 transition-all"
      style={{
        bottom: "1.25rem",
        right: "1.25rem",
        width: "3.5rem",
        height: "3.5rem",
        borderRadius: "50%",
        background: isOpen
          ? "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)"
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
        transform: "translateZ(0)",
        willChange: "transform",
      }}
      onClick={toggleChat}
      aria-label={isOpen ? "Minimize chat" : "Open chat with Agastya"}
      data-testid="button-open-chat"
    >
      <span
        style={{
          display: "inline-flex",
          transition: "transform 0.25s ease, opacity 0.2s ease",
          transform: isOpen ? "rotate(180deg) scale(0.9)" : "rotate(0deg) scale(1)",
        }}
      >
        {isOpen ? <ChevronDown className="w-6 h-6" /> : <Bot className="w-6 h-6 text-white animate-pulse" />}
      </span>

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
        @keyframes agastya-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes agastya-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-shimmer {
          animation: agastya-shimmer 1.5s infinite;
        }
        .animate-fade-in {
          animation: agastya-fade-in 0.4s ease-out forwards;
        }
      `}</style>
      {popBubble}
      {chatPanel}
      {fab}
    </>,
    document.body
  );
}
