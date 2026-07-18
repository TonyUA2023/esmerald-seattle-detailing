/* eslint-disable react-hooks/set-state-in-effect, react-hooks/purity */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";
import styles from "./ChatWidget.module.css";

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

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize and load state from localStorage (only on client mount to prevent SSR mismatch)
  useEffect(() => {
    setMounted(true);
    const savedUser = localStorage.getItem("esmerald_chat_user");
    const savedMessages = localStorage.getItem("esmerald_chat_messages");
    
    if (savedUser) {
      setUserInfo(JSON.parse(savedUser));
      setIsRegistered(true);
      setUnread(false); // already initiated in the past
    }
    
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
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

  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInfo.name.trim() || !userInfo.email.trim() || !userInfo.phone.trim()) return;

    localStorage.setItem("esmerald_chat_user", JSON.stringify(userInfo));
    setIsRegistered(true);
    setUnread(false);

    // Initial greeting from Agent
    const initialGreeting: Message = {
      id: "init-1",
      sender: "agent",
      text: `Hello ${userInfo.name}. Welcome to Esmerald Mobile Detailing. My name is Fernando. How can we help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages([initialGreeting]);
  };

  const getBotResponse = (userInput: string): { text: string; replies: string[] } => {
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
        text: `We offer three signature detailing packages brought directly to your location:

1. Full Mobile Detail (From $299): The ultimate package featuring deep interior sanitization & complete exterior wash.
2. Exterior Correction (From $149): Paint decontamination, swirl removal, and premium sealant.
3. Interior Deep Clean (From $179): Deep carpet steam cleaning, seat extraction, and leather conditioning.

Would you like a custom quote for one of these, ${userInfo.name}?`,
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
        text: `Great choice. To book, you can fill out our quick quote form on the website, or I can have Fernando contact you at **${userInfo.phone}** to schedule the date and time.

Would you like us to call you now?`,
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
        text: `We are a 100% mobile and self-contained detailing unit. We bring our own pure water and power. We service Seattle, Bellevue, Kirkland, Redmond, Renton, Tacoma, and surrounding areas.

Which city is your vehicle located in?`,
        replies: ["Seattle", "Bellevue / Eastside", "View Packages"]
      };
    }

    if (
      text.includes("seattle") || 
      text.includes("bellevue") || 
      text.includes("eastside")
    ) {
      return {
        text: `Excellent. We service your area with no travel fees. Which detailing package are you interested in booking at your location?`,
        replies: ["Full Mobile Detail", "Interior Deep Clean", "Get Custom Quote"]
      };
    }

    if (
      text.includes("specialist") || 
      text.includes("human") || 
      text.includes("person") || 
      text.includes("contact") || 
      text.includes("fernando") || 
      text.includes("talk") ||
      text.includes("chat")
    ) {
      return {
        text: `Got it, ${userInfo.name}. I have sent a priority alert to Fernando with your phone **${userInfo.phone}** and email **${userInfo.email}**.

He will call or text you in less than 10 minutes. Are there any vehicle details you'd like to share in the meantime? (e.g. Year, Make, Model, or condition)`,
        replies: ["Thank you", "Main Menu"]
      };
    }

    if (
      text.includes("yes, call me") || 
      text.includes("call me") || 
      text.includes("phone call")
    ) {
      return {
        text: `Perfect. Fernando has received your details. He will call you at **${userInfo.phone}** shortly. Thank you for choosing Esmerald Mobile Detailing!`,
        replies: ["Awesome", "Main Menu"]
      };
    }

    if (
      text.includes("thank you") || 
      text.includes("thanks") || 
      text.includes("ok") || 
      text.includes("perfect") || 
      text.includes("awesome")
    ) {
      return {
        text: `You are very welcome. If you need anything else, just let me know. Have a wonderful day and drive clean.`,
        replies: ["View Packages", "Main Menu"]
      };
    }

    if (
      text.includes("menu") || 
      text.includes("start") || 
      text.includes("home") || 
      text.includes("hello") || 
      text.includes("hi") || 
      text.includes("hey")
    ) {
      return {
        text: `Hello again, ${userInfo.name}. How can we help you today? Choose a quick option below or type your question.`,
        replies: ["View Prices", "Book Appointment", "Talk to Specialist", "Service Area"]
      };
    }

    // Default Fallback Response
    return {
      text: `I have received your message, ${userInfo.name}. I have forwarded your inquiry to our detailing team in Seattle. We will reply to your email **${userInfo.email}** or call you at **${userInfo.phone}** as soon as possible.

Would you like to try one of these quick options in the meantime?`,
      replies: ["View Prices", "Book Appointment", "Service Area"]
    };
  };

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    // 1. Add user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // 2. Simulate bot typing and responding
    setTimeout(() => {
      const botResult = getBotResponse(textToSend);
      const botMsg: Message = {
        id: `agent-${Date.now()}`,
        sender: "agent",
        text: botResult.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  // Helper to clear local storage and reset chat (for testing/easy restart)
  const handleResetChat = () => {
    localStorage.removeItem("esmerald_chat_user");
    localStorage.removeItem("esmerald_chat_messages");
    setUserInfo({ name: "", email: "", phone: "" });
    setMessages([]);
    setIsRegistered(false);
  };

  const currentQuickReplies = (): string[] => {
    if (messages.length === 0) return [];
    
    // Check the last message's sender and matches to provide context-appropriate quick replies
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.sender === "user" || isTyping) return [];

    const botResult = getBotResponse(lastMsg.text);
    return botResult.replies;
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
                  <div className={styles.avatar}>E</div>
                </div>
                <div className={styles.agentDetails}>
                  <h3>Fernando - Esmerald Detailing</h3>
                  <p>Online • Replies instantly</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className={styles.closeButton}
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
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
                        <span>{msg.sender === "user" ? "You" : "Fernando"}</span>
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

                {/* Reset button (visible but subtle) for debug/restart */}
                <div className={styles.resetContainer}>
                  <button 
                    onClick={handleResetChat} 
                    className={styles.resetBtn}
                  >
                    Reset chat session
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
