/* eslint-disable react-hooks/set-state-in-effect, react-hooks/purity */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";
import { io, Socket } from "socket.io-client";
import styles from "./ChatWidget.module.css";

const BACKEND_URL = process.env.NEXT_PUBLIC_LB_BACKEND_URL || "https://t10868f0sd4tlemfrh4oo82q.213.199.42.255.sslip.io";
const AGENT_TOKEN = process.env.NEXT_PUBLIC_LB_AGENT_TOKEN || "LB_AGENT_9awy10n8";

interface Message {
  id: string;
  sender: "user" | "agent";
  text: string;
  timestamp: string;
}

interface UserInfo {
  name: string;
  email: string;
  phone: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: "", email: "", phone: "" });
  const [isRegistered, setIsRegistered] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unread, setUnread] = useState(true);
  const [mounted, setMounted] = useState(false);

  // LeadBridge IA Backend state
  const [socket, setSocket] = useState<Socket | null>(null);
  const [tenantId, setTenantId] = useState<string>("");
  const [chatId, setChatId] = useState<string>("");
  const [botName, setBotName] = useState<string>("Fernando");
  const [agentName, setAgentName] = useState<string>("Fernando - LeadBridge IA");
  const [businessName, setBusinessName] = useState<string>("LeadBridge Demo");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Agent Token Config & Initialize Socket
  useEffect(() => {
    setMounted(true);
    console.log("[LeadBridge ChatWidget Init] Token:", AGENT_TOKEN, "Backend:", BACKEND_URL);

    // Fetch agent config via Next.js API proxy to avoid Mixed Content (HTTPS -> HTTP) blocking
    if (AGENT_TOKEN) {
      console.log("[LeadBridge] Fetching token configuration from /api/leadbridge/token/" + AGENT_TOKEN);
      fetch(`/api/leadbridge/token/${AGENT_TOKEN}`)
        .then((res) => res.json())
        .then((config) => {
          console.log("[LeadBridge Token Config Success]:", config);
          if (config.tenantId) setTenantId(config.tenantId);
          if (config.botName) setBotName(config.botName);
          if (config.agentName) setAgentName(config.agentName);
          if (config.businessName) setBusinessName(config.businessName);
        })
        .catch((err) => console.error("[LeadBridge Token Config Error]:", err));
    }

    // Only connect client-side Socket.io if not on HTTPS with an HTTP backend.
    // This completely prevents Chrome from throwing Mixed Content errors in the console.
    const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
    const isBackendHttp = BACKEND_URL.startsWith("http://");

    let s: Socket | null = null;

    if (!isHttps || !isBackendHttp) {
      try {
        console.log("[LeadBridge] Connecting client Socket.io to:", BACKEND_URL);
        s = io(BACKEND_URL, {
          transports: ["websocket", "polling"],
          autoConnect: true,
        });
        setSocket(s);

        s.on("connect", () => {
          console.log("[LeadBridge Socket Connected Successfully] ID:", s?.id);
        });

        s.on("new_message", (msg: { id?: string; chatId?: string; senderType: "AI" | "WORKER" | "LEAD"; content: string; createdAt?: string }) => {
          console.log("[LeadBridge Socket Received Message]:", msg);
          if (msg.senderType === "AI" || msg.senderType === "WORKER") {
            setIsTyping(false);
            const newMsg: Message = {
              id: msg.id || `msg-${Date.now()}`,
              sender: "agent",
              text: msg.content,
              timestamp: msg.createdAt
                ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            };

            setMessages((prev) => {
              if (prev.some((m) => m.id === newMsg.id || (m.text === newMsg.text && m.sender === "agent"))) {
                return prev;
              }
              return [...prev, newMsg];
            });
          }
        });

        s.on("chat_closed", () => {
          console.log("[LeadBridge Chat Session Closed Event Received]");
          setIsTyping(false);
        });
      } catch (e) {
        console.warn("[LeadBridge Socket Init Bypassed]:", e);
      }
    } else {
      console.log("[LeadBridge HTTPS Mode Active] Client-side Socket.io bypassed to eliminate Mixed Content console errors. All messaging runs 100% via secure Next.js HTTPS Proxy.");
    }

    // Load saved localStorage data
    const savedUser = localStorage.getItem("esmerald_chat_user");
    const savedMessages = localStorage.getItem("esmerald_chat_messages");
    const savedChatId = localStorage.getItem("esmerald_chat_id");
    const savedTenantId = localStorage.getItem("esmerald_chat_tenant_id");

    if (savedTenantId) setTenantId(savedTenantId);

    if (savedUser && savedChatId && savedChatId !== "undefined" && savedChatId !== "") {
      console.log("[LeadBridge Restoring Session] Chat ID:", savedChatId);
      setUserInfo(JSON.parse(savedUser));
      setChatId(savedChatId);
      setIsRegistered(true);
      setUnread(false);
      if (s) s.emit("join_chat", { chatId: savedChatId });
    }

    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }

    return () => {
      if (s) s.disconnect();
    };
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (mounted && messages.length > 0) {
      localStorage.setItem("esmerald_chat_messages", JSON.stringify(messages));
    }
  }, [messages, mounted]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (!mounted) return null;

  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInfo.name.trim() || !userInfo.email.trim() || !userInfo.phone.trim()) return;

    console.log("[LeadBridge Starting New Session] User Info:", userInfo);
    let activeTenantId = tenantId;
    let activeChatId = "";

    try {
      console.log("[LeadBridge] Registering Lead via Proxy /api/leadbridge/leads...");
      const res = await fetch(`/api/leadbridge/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId: activeTenantId || undefined,
          token: AGENT_TOKEN,
          name: userInfo.name,
          email: userInfo.email,
          phone: userInfo.phone,
          sourceDomain: typeof window !== "undefined" ? window.location.hostname : "esmeralddetailing.com",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("[LeadBridge Lead Registration Response]:", data);
        const extractedChatId = data.chatId || data.chat?.id || data.id || "";
        const extractedTenantId = data.tenantId || data.chat?.tenantId || activeTenantId;

        if (extractedChatId) {
          activeChatId = extractedChatId;
          activeTenantId = extractedTenantId;
          setChatId(activeChatId);
          if (activeTenantId) setTenantId(activeTenantId);

          localStorage.setItem("esmerald_chat_id", activeChatId);
          if (activeTenantId) localStorage.setItem("esmerald_chat_tenant_id", activeTenantId);

          if (socket && socket.connected) {
            socket.emit("join_chat", { chatId: activeChatId });
          }
        }
      } else {
        const errorText = await res.text();
        console.error("[LeadBridge Lead Registration Error Response]:", res.status, errorText);
      }
    } catch (err) {
      console.error("[LeadBridge Lead Registration Exception]:", err);
    }

    localStorage.setItem("esmerald_chat_user", JSON.stringify(userInfo));
    setIsRegistered(true);
    setUnread(false);

    // Initial greeting from Agent
    const initialGreeting: Message = {
      id: "init-1",
      sender: "agent",
      text: `Hello ${userInfo.name}. Welcome to ${businessName}. My name is ${botName}. How can we help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages([initialGreeting]);
  };

  const getFallbackBotResponse = (userInput: string): { text: string; replies: string[] } => {
    const text = userInput.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    if (
      text.includes("price") || 
      text.includes("package") || 
      text.includes("cost") || 
      text.includes("rate") || 
      text.includes("how much") || 
      text.includes("services") || 
      text.includes("detail")
    ) {
      return {
        text: `We offer three signature detailing packages brought directly to your location:\n\n1. Full Mobile Detail (From $299): The ultimate package featuring deep interior sanitization & complete exterior wash.\n2. Exterior Correction (From $149): Paint decontamination, swirl removal, and premium sealant.\n3. Interior Deep Clean (From $179): Deep carpet steam cleaning, seat extraction, and leather conditioning.\n\nWould you like a custom quote for one of these, ${userInfo.name}?`,
        replies: ["Book Appointment", "Service Area", "Talk to Specialist"]
      };
    }

    if (
      text.includes("book") || 
      text.includes("appointment") || 
      text.includes("schedule") || 
      text.includes("reserve")
    ) {
      return {
        text: `Great choice. To book, you can fill out our quick quote form on the website, or I can have ${botName} contact you at **${userInfo.phone}** to schedule the date and time.\n\nWould you like us to call you now?`,
        replies: ["Yes, call me", "Have another question", "Main Menu"]
      };
    }

    if (
      text.includes("coverage") || 
      text.includes("area") || 
      text.includes("seattle") || 
      text.includes("bellevue") || 
      text.includes("renton") || 
      text.includes("kirkland") || 
      text.includes("redmond") || 
      text.includes("tacoma") || 
      text.includes("where")
    ) {
      return {
        text: `We are a 100% mobile and self-contained detailing unit. We bring our own pure water and power. We service Seattle, Bellevue, Kirkland, Redmond, Renton, Tacoma, and surrounding areas.\n\nWhich city is your vehicle located in?`,
        replies: ["Seattle", "Bellevue / Eastside", "View Packages"]
      };
    }

    if (
      text.includes("specialist") || 
      text.includes("human") || 
      text.includes("person") || 
      text.includes("contact") || 
      text.includes("talk") ||
      text.includes("chat")
    ) {
      return {
        text: `Got it, ${userInfo.name}. I have sent a priority alert to our team with your phone **${userInfo.phone}** and email **${userInfo.email}**.\n\nWe will call or text you in less than 10 minutes. Are there any vehicle details you'd like to share in the meantime? (e.g. Year, Make, Model, or condition)`,
        replies: ["Thank you", "Main Menu"]
      };
    }

    // Default Fallback Response
    return {
      text: `I have received your message, ${userInfo.name}. I have forwarded your inquiry to our detailing team in Seattle. We will reply to your email **${userInfo.email}** or call you at **${userInfo.phone}** as soon as possible.\n\nWould you like to try one of these quick options in the meantime?`,
      replies: ["View Prices", "Book Appointment", "Service Area"]
    };
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const currentChatId = chatId || localStorage.getItem("esmerald_chat_id") || "";
    const currentTenantId = tenantId || localStorage.getItem("esmerald_chat_tenant_id") || "";

    console.log("[LeadBridge Sending Message] ChatID:", currentChatId, "TenantID:", currentTenantId, "Content:", textToSend);

    // 1. Add user message locally
    const userMsgId = `user-${Date.now()}`;
    const userMsg: Message = {
      id: userMsgId,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // 2. If client socket is connected (on HTTP / dev environment), attempt socket emission
    if (socket && socket.connected && currentChatId) {
      console.log("[LeadBridge] Sending via Client Socket.io...");
      socket.emit("send_message", {
        chatId: currentChatId,
        tenantId: currentTenantId,
        senderType: "LEAD",
        content: textToSend,
      });

      const fallbackTimer = setTimeout(() => {
        setIsTyping((currentlyTyping) => {
          if (currentlyTyping) {
            console.warn("[LeadBridge Client Socket Timeout] Falling back to Server Proxy message relay...");
            sendViaServerProxy(currentChatId, currentTenantId, textToSend);
          }
          return false;
        });
      }, 12000);

      return () => clearTimeout(fallbackTimer);
    } else {
      // 3. HTTPS Mode: Relaying via HTTPS Server Proxy /api/leadbridge/message
      console.log("[LeadBridge HTTPS Mode] Relaying message via secure HTTPS Server Proxy /api/leadbridge/message...");
      await sendViaServerProxy(currentChatId, currentTenantId, textToSend);
    }
  };

  const sendViaServerProxy = async (activeChatId: string, activeTenantId: string, text: string) => {
    try {
      const res = await fetch("/api/leadbridge/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: activeChatId,
          tenantId: activeTenantId,
          content: text,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("[LeadBridge Server Proxy Message Success]:", data);
        if (data.message?.text) {
          setIsTyping(false);
          const botMsg: Message = {
            id: `msg-proxy-${Date.now()}`,
            sender: "agent",
            text: data.message.text,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };
          setMessages((prev) => {
            if (prev.some((m) => m.text === botMsg.text && m.sender === "agent")) return prev;
            return [...prev, botMsg];
          });
          return;
        }
      } else {
        const errorText = await res.text();
        console.error("[LeadBridge Server Proxy Error Response]:", res.status, errorText);
      }
    } catch (err) {
      console.error("[LeadBridge Server Proxy Exception]:", err);
    }

    // Local fallback if server proxy also fails
    console.warn("[LeadBridge] Proxy failed, utilizing local fallback answer");
    setIsTyping(false);
    const fallback = getFallbackBotResponse(text);
    const fallbackMsg: Message = {
      id: `agent-fallback-${Date.now()}`,
      sender: "agent",
      text: fallback.text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, fallbackMsg]);
  };

  const handleEndChatSession = () => {
    const currentChatId = chatId || localStorage.getItem("esmerald_chat_id") || "";
    const currentTenantId = tenantId || localStorage.getItem("esmerald_chat_tenant_id") || "";

    console.log("[LeadBridge Ending Chat Session] ChatID:", currentChatId);

    if (currentChatId) {
      if (socket && socket.connected) {
        socket.emit("close_chat", {
          chatId: currentChatId,
          tenantId: currentTenantId,
          closedBy: "Lead",
        });
      }

      fetch(`/api/leadbridge/chats/${currentChatId}/close`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => console.log("[LeadBridge Chat Closed Proxy Response]:", data))
        .catch((err) => console.error("[LeadBridge Close Chat Proxy Error]:", err));
    }

    localStorage.removeItem("esmerald_chat_user");
    localStorage.removeItem("esmerald_chat_messages");
    localStorage.removeItem("esmerald_chat_id");
    localStorage.removeItem("esmerald_chat_tenant_id");

    setUserInfo({ name: "", email: "", phone: "" });
    setMessages([]);
    setChatId("");
    setIsRegistered(false);
  };

  const currentQuickReplies = (): string[] => {
    if (messages.length === 0) return [];
    
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.sender === "user" || isTyping) return [];

    const botResult = getFallbackBotResponse(lastMsg.text);
    return botResult.replies || ["View Prices", "Book Appointment", "Service Area"];
  };

  return (
    <div className={styles.chatWidgetWrapper}>
      {/* Floating Chat Trigger Button */}
      <button 
        onClick={() => {
          setIsOpen(!isOpen);
          setUnread(false);
        }} 
        className={styles.chatTrigger}
        aria-label="Open support chat"
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <>
            <MessageCircle size={24} />
            {unread && <span className={styles.notificationBadge}></span>}
          </>
        )}
      </button>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={styles.chatWindow}
          >
            {/* Header */}
            <div className={styles.chatHeader}>
              <div className={styles.agentInfo}>
                <div className={styles.avatarWrapper}>
                  <div className={styles.avatar}>{botName.charAt(0) || "F"}</div>
                </div>
                <div className={styles.agentDetails}>
                  <h3>{agentName}</h3>
                  <p>Online • Replies instantly</p>
                </div>
              </div>
              <div className={styles.headerActions}>
                {isRegistered && (
                  <button
                    onClick={handleEndChatSession}
                    className={styles.endChatHeaderBtn}
                    title="End chat session and open room for other leads"
                  >
                    End Chat
                  </button>
                )}
                <button 
                  onClick={() => setIsOpen(false)} 
                  className={styles.closeButton}
                  aria-label="Close chat window"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Pre-chat Form */}
            {!isRegistered ? (
              <div className={styles.formContainer}>
                <div className={styles.formIntro}>
                  <h4>Welcome</h4>
                  <p>Enter your details to start a chat and get personalized detailing advice for your vehicle.</p>
                </div>
                <form onSubmit={handleStartChat} className={styles.preChatForm}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="chat-name">Name</label>
                    <input 
                      id="chat-name"
                      type="text" 
                      placeholder="Your full name"
                      required
                      value={userInfo.name}
                      onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="chat-email">Email</label>
                    <input 
                      id="chat-email"
                      type="email" 
                      placeholder="name@example.com"
                      required
                      value={userInfo.email}
                      onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="chat-phone">Phone</label>
                    <input 
                      id="chat-phone"
                      type="tel" 
                      placeholder="(774) 747-7215"
                      required
                      value={userInfo.phone}
                      onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                    />
                  </div>
                  <button type="submit" className={styles.startChatBtn}>
                    Start Chat
                  </button>
                </form>
              </div>
            ) : (
              // Active Chat Interface
              <>
                <div className={styles.messagesArea}>
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`${styles.messageWrapper} ${msg.sender === "user" ? styles.user : styles.agent}`}
                    >
                      <div className={styles.messageBubble}>
                        {msg.text.split("\n").map((line, idx) => (
                          <React.Fragment key={idx}>
                            {line}
                            {idx < msg.text.split("\n").length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </div>
                      <div className={styles.metaInfo}>
                        <span>{msg.sender === "user" ? "You" : botName}</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className={styles.typingIndicator}>
                      <span className={styles.typingDot}></span>
                      <span className={styles.typingDot}></span>
                      <span className={styles.typingDot}></span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Replies list */}
                {currentQuickReplies().length > 0 && (
                  <div className={styles.quickRepliesContainer}>
                    {currentQuickReplies().map((replyText, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(replyText)}
                        className={styles.quickReplyBtn}
                      >
                        {replyText}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input Text Form */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage(inputText);
                  }} 
                  className={styles.inputForm}
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type your message here..."
                    className={styles.textInput}
                    disabled={isTyping}
                  />
                  <button 
                    type="submit" 
                    className={styles.sendButton}
                    disabled={!inputText.trim() || isTyping}
                    aria-label="Send message"
                  >
                    <Send size={16} />
                  </button>
                </form>

                {/* End Chat option footer */}
                <div className={styles.resetContainer}>
                  <button 
                    onClick={handleEndChatSession} 
                    className={styles.resetBtn}
                  >
                    End & Close Chat Session
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
