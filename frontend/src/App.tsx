/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Sun, 
  Moon, 
  Sparkles, 
  Cpu, 
  Settings, 
  Send, 
  Terminal, 
  Sliders, 
  Globe, 
  HelpCircle, 
  RefreshCw, 
  Check, 
  ChevronRight, 
  ChevronDown,
  ArrowRight, 
  ShieldAlert,
  MessageSquareCode,
  Layers,
  Search,
  BookOpen,
  Info,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Message, AgentConfig, AgentPreset } from "./types";
import { AGENT_PRESETS } from "./data";

// Custom Google Gemini Official Sparkle Logo Components
const GeminiFlashLogo = ({ className = "w-5 h-5", size = 20 }: { className?: string; size?: number }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    style={{ width: size, height: size }}
  >
    <defs>
      <linearGradient id="gemini-flash-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#9BC5FF" />
        <stop offset="60%" stopColor="#2478FF" />
        <stop offset="100%" stopColor="#185ABC" />
      </linearGradient>
    </defs>
    {/* Large Sparkle */}
    <path 
      d="M12 3c0 4.97-4.03 9-9 9c4.97 0 9 4.03 9 9c0-4.97 4.03-9 9-9c-4.97 0-9-4.03-9-9z" 
      fill="url(#gemini-flash-grad)" 
    />
    {/* Small Sparkle */}
    <path 
      d="M19 2c0 1.66-1.34 3-3 3c1.66 0 3 1.34 3 3c0-1.66 1.34-3 3-3c-1.66 0-3-1.34-3-3z" 
      fill="url(#gemini-flash-grad)" 
    />
  </svg>
);

const GeminiProLogo = ({ className = "w-5 h-5", size = 20 }: { className?: string; size?: number }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    style={{ width: size, height: size }}
  >
    <defs>
      <linearGradient id="gemini-pro-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#CF9BFF" />
        <stop offset="60%" stopColor="#8F24FF" />
        <stop offset="100%" stopColor="#5500BC" />
      </linearGradient>
    </defs>
    {/* Large Sparkle */}
    <path 
      d="M12 3c0 4.97-4.03 9-9 9c4.97 0 9 4.03 9 9c0-4.97 4.03-9 9-9c-4.97 0-9-4.03-9-9z" 
      fill="url(#gemini-pro-grad)" 
    />
    {/* Small Sparkle */}
    <path 
      d="M19 2c0 1.66-1.34 3-3 3c1.66 0 3 1.34 3 3c0-1.66 1.34-3 3-3c-1.66 0-3-1.34-3-3z" 
      fill="url(#gemini-pro-grad)" 
    />
  </svg>
);

export default function App() {
  // Preset Selection & Agent Configuration States
  const [activePresetId, setActivePresetId] = useState<string>("zen");
  const [config, setConfig] = useState<AgentConfig>({
    name: AGENT_PRESETS[0].name,
    role: AGENT_PRESETS[0].role,
    temperature: AGENT_PRESETS[0].temperature,
    model: AGENT_PRESETS[0].model,
    grounding: AGENT_PRESETS[0].grounding,
    avatarSeed: AGENT_PRESETS[0].avatarSeed,
  });

  // App Layout & Interaction States
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-msg",
      role: "assistant",
      content: "您好，智能体指挥中心已对接。我是您的专属助理。请在左侧选择不同的模版，或在中央调整我的底层人格与运行机制。有什么我可以协助您的吗？",
      timestamp: new Date().toISOString(),
    }
  ]);
  const [inputText, setInputText] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null);
  const [showConfigTips, setShowConfigTips] = useState<boolean>(false);
  const [isConfigExpanded, setIsConfigExpanded] = useState<boolean>(true);
  const [modelDropdownOpen, setModelDropdownOpen] = useState<boolean>(false);
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const [presetDropdownOpen, setPresetDropdownOpen] = useState<boolean>(false);
  const presetDropdownRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const lastWheelTime = useRef<number>(0);

  // Throttled mouse wheel scroll handler to cycle presets circularly
  useEffect(() => {
    const carouselEl = carouselRef.current;
    if (!carouselEl) return;

    const handleWheelEvent = (e: WheelEvent) => {
      // Prevent the default scroll (avoids sidebar/page scrolling)
      e.preventDefault();

      const now = Date.now();
      if (now - lastWheelTime.current < 250) return; // 250ms throttle for smooth interactive scroll
      lastWheelTime.current = now;

      const activeIdx = AGENT_PRESETS.findIndex(p => p.id === activePresetId);
      if (e.deltaY > 0) {
        // Scroll down -> next preset
        const nextIdx = (activeIdx + 1) % AGENT_PRESETS.length;
        handleSelectPreset(AGENT_PRESETS[nextIdx]);
      } else if (e.deltaY < 0) {
        // Scroll up -> previous preset
        const prevIdx = (activeIdx - 1 + AGENT_PRESETS.length) % AGENT_PRESETS.length;
        handleSelectPreset(AGENT_PRESETS[prevIdx]);
      }
    };

    carouselEl.addEventListener("wheel", handleWheelEvent, { passive: false });
    return () => {
      carouselEl.removeEventListener("wheel", handleWheelEvent);
    };
  }, [activePresetId]);

  // MySQL Database States
  const [conversations, setConversations] = useState<any[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);

  // Helper function to create a new persistent conversation
  const createNewConversation = async (presetId: string, customConfig?: AgentConfig) => {
    const preset = AGENT_PRESETS.find(p => p.id === presetId) || AGENT_PRESETS[0];
    const newId = `chat-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const activeConfig = customConfig || {
      name: preset.name,
      role: preset.role,
      temperature: preset.temperature,
      model: preset.model,
      grounding: preset.grounding,
      avatarSeed: preset.avatarSeed,
    };

    const welcomeMsg: Message = {
      id: `welcome-${preset.id}-${Date.now()}`,
      role: "assistant",
      content: `「${preset.title}」已载入内核状态。指令配置如下：\n- 运行温度：${activeConfig.temperature}\n- 模型架构：${activeConfig.model}\n- 探针状态：${activeConfig.grounding ? "实时搜索已开启" : "离线决策模式"}\n\n请指示，我已就绪！`,
      timestamp: new Date().toISOString(),
    };

    try {
      // Save new conversation to DB
      await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: newId,
          preset_id: presetId,
          agent_name: activeConfig.name,
          agent_role: activeConfig.role,
          temperature: activeConfig.temperature,
          model: activeConfig.model,
          grounding: activeConfig.grounding,
        }),
      });

      // Save welcome message to DB
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [welcomeMsg],
          systemInstruction: activeConfig.role,
          temperature: activeConfig.temperature,
          model: activeConfig.model,
          grounding: activeConfig.grounding,
          conversationId: newId,
          userMessageId: null,
          assistantMessageId: welcomeMsg.id,
        }),
      });

      // Update React states
      setCurrentConversationId(newId);
      setMessages([welcomeMsg]);
      
      // Reload conversations list to show in sidebar
      const res = await fetch("/api/conversations");
      const list = await res.json();
      setConversations(list);
    } catch (err) {
      console.error("Failed to create new conversation in DB:", err);
      // Fallback to local state if database fails
      setCurrentConversationId(newId);
      setMessages([welcomeMsg]);
    }
  };

  // Helper function to load an existing conversation
  const handleSelectConversation = async (conversationId: string, currentList?: any[]) => {
    setIsLoadingHistory(true);
    setCurrentConversationId(conversationId);
    
    try {
      // Fetch messages for this conversation
      const res = await fetch(`/api/conversations/${conversationId}/messages`);
      const history = await res.json();
      
      if (history && history.length > 0) {
        setMessages(history);
      }
      
      // Find the conversation details to restore the active preset and config
      const listToSearch = currentList || conversations;
      const conversation = listToSearch.find(c => c.id === conversationId);
      if (conversation) {
        setActivePresetId(conversation.preset_id);
        setConfig({
          name: conversation.agent_name,
          role: conversation.agent_role,
          temperature: conversation.temperature,
          model: conversation.model,
          grounding: !!conversation.grounding,
          avatarSeed: AGENT_PRESETS.find(p => p.id === conversation.preset_id)?.avatarSeed || "zen",
        });
      }
    } catch (err) {
      console.error("Failed to load message history:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Helper function to delete a conversation session
  const handleDeleteConversation = async (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation();
    
    try {
      await fetch(`/api/conversations/${conversationId}`, {
        method: "DELETE"
      });
      
      // Update list
      const updatedList = conversations.filter(c => c.id !== conversationId);
      setConversations(updatedList);
      
      // If we deleted the active conversation
      if (currentConversationId === conversationId) {
        if (updatedList.length > 0) {
          handleSelectConversation(updatedList[0].id, updatedList);
        } else {
          // No conversations left, create a fresh one!
          createNewConversation(activePresetId);
        }
      }
    } catch (err) {
      console.error("Failed to delete conversation:", err);
    }
  };

  const handleDropdownSelectPreset = (preset: AgentPreset) => {
    if (activePresetId !== preset.id) {
      handleSelectPreset(preset);
    }
    setPresetDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
        setModelDropdownOpen(false);
      }
      if (presetDropdownRef.current && !presetDropdownRef.current.contains(event.target as Node)) {
        setPresetDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Responsive view focus for small screens ('presets' | 'config' | 'chat')
  const [activeMobileView, setActiveMobileView] = useState<"presets" | "config" | "chat">("chat");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Synchronize system dark mode and theme classes
  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark" || 
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Check backend API details
    fetch("/api/config")
      .then((res) => res.json())
      .then((data) => {
        setApiAvailable(data.hasApiKey);
      })
      .catch((err) => {
        console.warn("Could not check local API Config status:", err);
        setApiAvailable(false);
      });

    // Fetch conversations list from database on startup
    fetch("/api/conversations")
      .then((res) => res.json())
      .then((data) => {
        setConversations(data);
        if (data && data.length > 0) {
          handleSelectConversation(data[0].id, data);
        } else {
          createNewConversation(activePresetId);
        }
      })
      .catch((err) => {
        console.warn("Could not load conversations from database:", err);
      });
  }, []);

  const toggleDarkMode = () => {
    const currentTheme = !darkMode;
    setDarkMode(currentTheme);
    if (currentTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Sync selected preset values into config
  const handleSelectPreset = (preset: AgentPreset) => {
    const isSamePreset = activePresetId === preset.id;
    
    if (isSamePreset) {
      setIsConfigExpanded(!isConfigExpanded);
    } else {
      setActivePresetId(preset.id);
      setIsConfigExpanded(true);
      
      const newConfig = {
        name: preset.name,
        role: preset.role,
        temperature: preset.temperature,
        model: preset.model,
        grounding: preset.grounding,
        avatarSeed: preset.avatarSeed,
      };
      setConfig(newConfig);
      
      // Create a new persistent conversation session for this preset
      createNewConversation(preset.id, newConfig);
    }

    // On mobile, automatically show the chat space when a preset is picked
    setActiveMobileView("chat");
  };

  const resetCurrentChat = () => {
    // Creating a fresh new conversation for the active preset
    createNewConversation(activePresetId);
  };

  // Fallback simulator for offline or missing-key modes (Generates intelligent rich responses)
  const generateSimulatedResponse = (userQuery: string, currentConfig: AgentConfig): { content: string; sources?: any[] } => {
    const q = userQuery.trim().toLowerCase();
    
    if (activePresetId === "zen") {
      return {
        content: `听到了你的声音。你提到的「${userQuery}」切中了思考的重点。

在我们追求确定性的世界里，或许可以试着退后一步。就像秋叶回归土壤，很多看似繁杂的声音，静置一段时间后，沙泥便会自然沉淀。这也是一种宝贵的自发性。

你对这个状态有什么特别的自我知觉吗？随时可以与我倾诉。`,
      };
    } else if (activePresetId === "coder") {
      return {
        content: `// Unified Command Center Kernel Simulation
export interface SimulationContext {
  query: string;
  temperature: number;
  model: string;
}

export function processQuery(ctx: SimulationContext): string {
  // Configured system system role: "${currentConfig.name}"
  const status = \`ACK: Simulated processing for "${userQuery}"\`;
  console.log("[Kernel] " + status);
  return status;
}

// Performance rating: 0.1ms execution. Satisfies border-radius constraints.`,
      };
    } else if (activePresetId === "explorer") {
      return {
        content: `📢 **前沿动态简报**：针对您检索的「${userQuery}」，聚合搜索探针反馈如下：

1. **底层机制变革**：分析表明全球对于高效指令交互与平滑圆角（Squircle）材质框架的采纳度上升了 34%；
2. **边缘设备增长**：超低延迟的轻量化模型 (如 gemini-3.5-flash) 使得本地实时推理成本降低近半；
3. **架构推荐**：建议在复杂代码编译、STEM 科学分析时启用 *gemini-3.1-pro-preview*，并结合 API 搜索强化结果精度。`,
        sources: [
          { title: "W3C Tech Interface Brief 2026", uri: "https://example.com/w3c-sq" },
          { title: "Apple HIG Fluid Geometry Principles", uri: "https://developer.apple.com/design" }
        ]
      };
    } else {
      // creative
      return {
        content: `风掠过数字网络的边缘，将「${userQuery}」打碎成漫天的星屑。

在此刻的构想里，我们不需要在逻辑的格子里亦步亦趋。想象一个由极简发光矩阵构成的小岛，周围翻涌着由深色极光铺设的潮汐。

在这里，你的直感即是落笔最深的重音。在高达 ${currentConfig.temperature} 的思维跃迁下，万物都在流淌融合。`,
      };
    }
  };

  // Chat Submission Handler
  const handleSendMessage = React.useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isTyping) return;

    const userMessageId = `user-${Date.now()}`;
    const assistantMessageId = `ai-${Date.now()}`;

    const userMessage: Message = {
      id: userMessageId,
      role: "user",
      content: inputText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      const historyPayload = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // Fire to server side Gemini proxy API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: historyPayload,
          systemInstruction: config.role,
          temperature: config.temperature,
          model: config.model,
          grounding: config.grounding,
          conversationId: currentConversationId,
          userMessageId,
          assistantMessageId,
        }),
      });

      if (!response.ok) {
        throw new Error("API call returned non-200 state");
      }

      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          role: "assistant",
          content: data.content || "生成式架构返回空数据。请检查配置参数。",
          timestamp: new Date().toISOString(),
          sources: data.sources || [],
        },
      ]);
      
      // Refresh list to show updated timestamp in sidebar
      fetch("/api/conversations")
        .then((res) => res.json())
        .then((data) => setConversations(data))
        .catch(() => {});
    } catch (error) {
      console.warn("Backend Gemini API unreachable or key error. Falling back to design-vibe local engine simulator.", error);
      
      // Delay response slightly for natural feel
      setTimeout(async () => {
        const simulated = generateSimulatedResponse(userMessage.content, config);
        const simulatedResponseMsg = {
          id: `ai-simulated-${Date.now()}`,
          role: "assistant",
          content: `⚠️ [本地模拟引擎] ${simulated.content}`,
          timestamp: new Date().toISOString(),
          sources: simulated.sources,
        };
        
        setMessages((prev) => [...prev, simulatedResponseMsg]);
        setIsTyping(false);

        // Save simulated response to DB if available
        if (currentConversationId) {
          try {
            await fetch("/api/chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                messages: [...messages, userMessage, simulatedResponseMsg],
                systemInstruction: config.role,
                temperature: config.temperature,
                model: config.model,
                grounding: config.grounding,
                conversationId: currentConversationId,
                userMessageId: null, // User message is already recorded on first post
                assistantMessageId: simulatedResponseMsg.id,
              }),
            });
            
            // Refresh list to show updated timestamp in sidebar
            const res = await fetch("/api/conversations");
            const data = await res.json();
            setConversations(data);
          } catch (dbErr) {
            console.warn("Could not save simulated response to DB:", dbErr);
          }
        }
      }, 800);
      return;
    }

    setIsTyping(false);
  }, [messages, inputText, config, isTyping, activePresetId, currentConversationId]);

  // Fast starter prompt helper
  const handleApplyPresetPrompt = (txt: string) => {
    setInputText(txt);
  };

  return (
    <div className="h-screen w-full bg-[#f5f5f7] dark:bg-[#09090b] text-[#1d1d1f] dark:text-[#fafafa] flex flex-col antialiased transition-colors duration-300 overflow-hidden">
      
      {/* Dynamic API status overlay banner */}
      {apiAvailable === false && (
        <div id="banner-api" className="bg-[#5856D6]/10 dark:bg-white/5 backdrop-blur-md text-xs text-[#5856D6] dark:text-zinc-300 px-4 py-2 text-center flex items-center justify-center gap-2 transition-all border-b border-[#5856D6]/10 dark:border-white/5">
          <ShieldAlert size={14} className="shrink-0 text-[#5856D6] dark:text-white" />
          <span>
            <strong>模拟渲染中</strong> — 当前尚未检测到 <strong>GEMINI_API_KEY</strong>。程序已自动激活备用对话引擎，提供流畅交互。配制密钥后自动激活硬件加速。
          </span>
        </div>
      )}

      {/* Main Grid structure Container */}
      <div className="flex-grow flex flex-col md:flex-row min-h-0 max-w-[1700px] w-full mx-auto md:p-6 lg:p-8 gap-6 overflow-hidden">
        
        {/* MOBILE VIEW TOGGLE RAIL: consistent operational logic on pocket screens */}
        <div className="md:hidden flex justify-between items-center bg-white/90 dark:bg-[#09090b]/90 backdrop-blur-lg px-4 py-3 sticky top-0 z-50 shadow-sm border-b border-black/5 dark:border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#5856D6] dark:bg-white shadow-[#5856D6]/35 dark:shadow-white/35"></div>
            <span className="font-semibold tracking-tight text-sm text-zinc-900 dark:text-white">Command Center</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#e5e5ea] dark:bg-zinc-900 p-0.5 rounded-xl">
            <button
              onClick={() => setActiveMobileView("presets")}
              className={`px-3 py-1 text-xs rounded-lg transition-all ${
                activeMobileView === "presets" 
                  ? "bg-white dark:bg-zinc-850 shadow-sm font-medium text-[#5856D6] dark:text-white" 
                  : "text-zinc-500"
              }`}
            >
              模版
            </button>
            <button
              onClick={() => setActiveMobileView("config")}
              className={`px-3 py-1 text-xs rounded-lg transition-all ${
                activeMobileView === "config" 
                  ? "bg-white dark:bg-zinc-850 shadow-sm font-medium text-[#5856D6] dark:text-white" 
                  : "text-zinc-500"
              }`}
            >
              参数
            </button>
            <button
              onClick={() => setActiveMobileView("chat")}
              className={`px-3 py-1 text-xs rounded-lg transition-all ${
                activeMobileView === "chat" 
                  ? "bg-white dark:bg-zinc-850 shadow-sm font-medium text-[#5856D6] dark:text-white" 
                  : "text-zinc-500"
              }`}
            >
              对话
            </button>
          </div>
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all"
            id="mobile-dark-mode"
          >
            {darkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>

        {/* =======================================================
            1. LEFT PANEL: Sidebar / Preset Navigator (20% or w-80)
            Glassmorphic Frost effect (毛玻璃磨砂效果)
           ======================================================= */}
        <aside 
          id="left-sidebar"
          className={`
            relative z-30 md:flex flex-col w-full md:w-76 shrink-0 rounded-[28px] 
            backdrop-blur-lg bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10
            p-5 justify-between shadow-[0_20px_50px_rgba(0,0,0,0.02)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-all overflow-y-auto
            ${activeMobileView === "presets" ? "flex" : "hidden"}
          `}
        >
          {/* Logo Heading and subtle tracker */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white flex items-center justify-center rounded-[18px] shadow-lg shadow-[#5856D6]/10 dark:shadow-white/15 border border-black/5 dark:border-white/10">
                  <div className="w-5 h-5 bg-[#5856D6] dark:bg-[#09090b] rounded-sm rotate-45 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                </div>
                <div>
                  <h1 className="font-bold text-sm tracking-widest text-zinc-900 dark:text-white flex items-center gap-1.5 font-mono">
                    AIGENT
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5856D6] dark:bg-white inline-block animate-pulse shadow-sm shadow-[#5856D6] dark:shadow-white"></span>
                  </h1>
                  <p className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 dark:text-zinc-500 mt-0.5">
                    CMD CENTER V1.0
                  </p>
                </div>
              </div>
              <button 
                onClick={toggleDarkMode} 
                className="hidden md:flex p-2.5 rounded-xl bg-white dark:bg-zinc-900/60 hover:scale-105 active:scale-95 text-[#5856D6] dark:text-white/80 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800 shadow-sm border border-black/5 dark:border-white/10"
                title={darkMode ? "切换亮色" : "切换暗色"}
                id="sidebar-theme-toggle"
              >
                {darkMode ? <Sun size={14} /> : <Moon size={14} />}
              </button>
            </div>

            {/* Sub-Header: Presets */}
            <div className="space-y-4 flex flex-col min-h-0">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                <Layers size={11} className="text-zinc-400" />
                <span>智能内核预设 (Presets)</span>
              </div>
              
              {/* Vertical Cylinder Preset Carousel */}
              <div 
                ref={carouselRef}
                className="relative flex flex-col items-center select-none w-full justify-center cursor-ns-resize"
                title="使用鼠标滚轮上下切换智能体"
              >
                {/* Visible 3 Items Container */}
                <div className="flex flex-col gap-3.5 relative w-full items-center justify-center py-2">
                  {(() => {
                    const activeIdx = AGENT_PRESETS.findIndex(p => p.id === activePresetId);
                    const topIdx = (activeIdx - 1 + 4) % 4;
                    const bottomIdx = (activeIdx + 1) % 4;
                    
                    const visibleIndices = [topIdx, activeIdx, bottomIdx];
                    
                    return visibleIndices.map((idx, pos) => {
                      const preset = AGENT_PRESETS[idx];
                      const isMiddle = pos === 1;
                      const isTop = pos === 0;
                      
                      // Calculate premium 3D styles based on position
                      const positionClass = isMiddle
                        ? "scale-100 z-20 opacity-100 translate-x-0 rotate-0 shadow-lg border-[#5856D6]/30 dark:border-white/20 bg-white dark:bg-white/10"
                        : isTop
                          ? "scale-[0.88] z-10 opacity-45 -translate-x-5 rotate-[-3deg] hover:opacity-75 hover:scale-[0.90] bg-white/40 dark:bg-white/5 border-transparent cursor-pointer"
                          : "scale-[0.88] z-10 opacity-45 translate-x-5 rotate-[3deg] hover:opacity-75 hover:scale-[0.90] bg-white/40 dark:bg-white/5 border-transparent cursor-pointer";
                          
                      return (
                        <div
                          key={preset.id}
                          onClick={() => {
                            handleSelectPreset(preset);
                          }}
                          className={`
                            w-full text-left p-3.5 rounded-[22px] border transition-all duration-500 ease-out flex flex-col gap-1 group relative transform
                            ${positionClass}
                          `}
                          id={`preset-btn-${preset.id}`}
                        >
                          {/* Active indicator dot */}
                          {isMiddle && (
                            <div className="absolute right-4 top-4.5 flex items-center gap-1.5">
                              {isConfigExpanded ? (
                                <div className="w-1.5 h-1.5 rounded-full bg-[#5856D6] dark:bg-white shadow-sm shadow-[#5856D6] dark:shadow-white"></div>
                              ) : (
                                <Sliders size={12} className="text-[#5856D6] dark:text-white/80 shrink-0" />
                              )}
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2">
                            <span className={`text-[8.5px] font-bold px-2 py-0.5 rounded-lg font-mono tracking-wider ${
                              isMiddle 
                                ? "bg-[#5856D6] dark:bg-white text-white dark:text-zinc-950 font-semibold" 
                                : "bg-slate-200/50 dark:bg-zinc-800/50 text-zinc-500"
                            }`}>
                              {preset.name.toUpperCase()}
                            </span>
                          </div>
                          
                          <h3 className={`font-semibold text-xs tracking-tight transition-colors ${isMiddle ? "text-[#5856D6] dark:text-white" : "text-zinc-700 dark:text-zinc-400"}`}>
                            {preset.title}
                          </h3>
                          
                          {/* Show description in full for middle card, truncated for others */}
                          <p className={`text-[10px] leading-relaxed transition-all duration-300 ${
                            isMiddle 
                              ? "text-zinc-500 dark:text-zinc-400 line-clamp-none" 
                              : "text-zinc-400 dark:text-zinc-500 line-clamp-1"
                          }`}>
                            {preset.description}
                          </p>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>

            {/* Sub-Header: Chat History */}
            <div className="space-y-3 pt-4 border-t border-black/5 dark:border-white/5 flex flex-col min-h-0">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                <MessageSquareCode size={11} className="text-zinc-400" />
                <span>历史对话记录 (Chat History)</span>
              </div>
              
              {/* Conversations List */}
              <div className="space-y-2 overflow-y-auto pr-1 max-h-[160px] md:max-h-[220px]">
                {conversations.length === 0 ? (
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 italic p-2 text-center">暂无历史对话记录</p>
                ) : (
                  conversations.map((conv) => {
                    const isSelected = currentConversationId === conv.id;
                    return (
                      <div
                        key={conv.id}
                        onClick={() => handleSelectConversation(conv.id)}
                        className={`
                          group w-full flex items-center justify-between p-3 rounded-[16px] transition-all cursor-pointer text-left border text-xs
                          ${isSelected
                            ? "bg-[#5856D6]/10 dark:bg-white/10 border-[#5856D6]/20 dark:border-white/15 text-[#5856D6] dark:text-white shadow-sm font-medium"
                            : "bg-transparent hover:bg-black/5 dark:hover:bg-white/5 border-transparent text-zinc-500 dark:text-zinc-400"
                          }
                        `}
                      >
                        <div className="flex flex-col min-w-0 pr-2">
                          <span className="truncate font-semibold text-[11px] leading-tight group-hover:text-[#5856D6] dark:group-hover:text-white">
                            {conv.agent_name}
                          </span>
                          <span className="text-[8.5px] text-zinc-400 dark:text-zinc-500 mt-0.5 truncate font-mono">
                            {new Date(conv.updated_at).toLocaleDateString([], { month: "2-digit", day: "2-digit" })} • {new Date(conv.updated_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteConversation(e, conv.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-400 dark:text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-all shrink-0 cursor-pointer"
                          title="删除对话"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>

          {/* Quick status information footer */}
          <div className="mt-8 space-y-4 pt-4 border-t border-black/5 dark:border-white/5 font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
            <div className="flex items-center justify-between">
              <span>环境就绪:</span>
              <span className="text-emerald-600 dark:text-emerald-500 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/55"></span>
                ACTIVE
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>网络通信协议:</span>
              <span className="text-zinc-600 dark:text-zinc-400">HTTPS PROXY</span>
            </div>
            <div className="flex items-center justify-between">
              <span>同步时轴(UTC):</span>
              <span className="text-zinc-650 dark:text-zinc-400">08:47</span>
            </div>
          </div>

        </aside>

        {/* =======================================================
            2. MIDDLE PANEL: Parameter Configuration Form (40%)
            Premium Squircle Card, Borderless, Ambient shadows
           ======================================================= */}
        <AnimatePresence initial={false}>
          {(isConfigExpanded || activeMobileView === "config") && (
            <motion.section 
              id="middle-config"
              initial={{ width: 0, opacity: 0, rotateY: -90, scale: 0.9 }}
              animate={{ 
                width: activeMobileView === "config" ? "100%" : 420, 
                opacity: 1,
                rotateY: 0,
                scale: 1,
              }}
              exit={{ 
                width: 0, 
                opacity: 0,
                rotateY: -90,
                scale: 0.9,
              }}
              style={{ transformPerspective: 1200, originX: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className={`
                relative z-10 shrink-0 flex flex-col gap-4 overflow-hidden
                ${activeMobileView === "config" ? "flex" : "hidden md:flex"}
              `}
            >
              <div className="squircle-card p-6 flex flex-col h-full overflow-y-auto gap-6 border border-black/5 dark:border-white/5 min-w-[320px] md:min-w-[420px]">
            
            {/* Panel Title & Reset Button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 text-[#5856D6] dark:text-white shadow-inner">
                  <Sliders size={15} />
                </div>
                <div>
                  <h2 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white font-mono uppercase">底座架构核心</h2>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">调控智能体核心语义约束</p>
                </div>
              </div>
              <button 
                onClick={resetCurrentChat}
                className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-[#5856D6] dark:hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 transition-all font-mono border border-black/5 dark:border-white/5 shadow-sm"
                title="清除所有上下文，强制重新实例化"
                id="btn-reboot"
              >
                <RefreshCw size={11} className="text-zinc-400 dark:text-zinc-550" />
                <span>初始化</span>
              </button>
            </div>

            {/* Form Inputs Container */}
            <div className="space-y-5">
              
              {/* Preset Choice: Custom premium dropdown selector */}
              <div className="space-y-2 relative" ref={presetDropdownRef}>
                <label className="text-[11px] font-bold text-zinc-550 dark:text-zinc-400 uppercase tracking-wider font-mono">
                  智能内核预设 (Presets)
                </label>
                
                {/* Selector Trigger Button */}
                <button
                  type="button"
                  onClick={() => setPresetDropdownOpen(!presetDropdownOpen)}
                  className="w-full bg-slate-50 dark:bg-zinc-900/90 text-left px-4 py-3.5 rounded-[18px] focus:outline-none focus:ring-1 focus:ring-[#5856D6] dark:focus:ring-zinc-650 text-zinc-900 dark:text-white border border-black/5 dark:border-white/5 shadow-inner transition-all flex items-center justify-between group cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-850"
                  id="preset-dropdown-trigger"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#5856D6]/10 dark:bg-white/10 flex items-center justify-center text-[#5856D6] dark:text-white font-bold text-xs">
                      {config.name.substring(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-semibold font-mono">
                        {AGENT_PRESETS.find(p => p.id === activePresetId)?.title || "智愈温暖陪伴"}
                      </div>
                      <p className="text-[9px] text-zinc-400 dark:text-zinc-500 mt-0.5 font-sans truncate max-w-[240px]">
                        {AGENT_PRESETS.find(p => p.id === activePresetId)?.description || "专注心理关怀、启发思考"}
                      </p>
                    </div>
                  </div>
                  <ChevronDown size={15} className={`text-zinc-400 dark:text-zinc-500 transition-transform duration-300 group-hover:text-zinc-700 group-hover:dark:text-zinc-350 ${presetDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {presetDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute left-0 right-0 z-50 mt-1 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-[20px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6)] overflow-hidden p-1.5"
                    >
                      {AGENT_PRESETS.map((preset) => {
                        const isSelected = activePresetId === preset.id;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => handleDropdownSelectPreset(preset)}
                            className={`w-full text-left p-3 rounded-[16px] transition-all flex items-center gap-3 cursor-pointer ${
                              isSelected
                                ? "bg-[#5856D6]/10 dark:bg-white/10 text-[#5856D6] dark:text-white"
                                : "hover:bg-slate-50 dark:hover:bg-white/5 text-zinc-650 dark:text-zinc-400"
                            }`}
                          >
                            <div className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center font-bold text-xs ${
                              isSelected
                                ? "bg-[#5856D6] dark:bg-white text-white dark:text-zinc-950 shadow-sm"
                                : "bg-slate-100 dark:bg-zinc-800 text-zinc-500"
                            }`}>
                              {preset.name.substring(0, 1).toUpperCase()}
                            </div>
                            <div className="flex-grow min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold font-mono truncate pr-2">{preset.title}</span>
                                {isSelected && <Check size={12} className="text-[#5856D6] dark:text-white" />}
                              </div>
                              <p className="text-[9.5px] text-zinc-400 dark:text-zinc-550 mt-0.5 font-sans leading-tight truncate">{preset.description}</p>
                            </div>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Agent Title & Name Input */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-zinc-550 dark:text-zinc-400 uppercase tracking-wider flex items-center justify-between font-mono">
                  <span>呼号 (Call Sign Name)</span>
                  <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-mono select-none">Instance String</span>
                </label>
                <input
                  type="text"
                  value={config.name}
                  onChange={(e) => setConfig({ ...config, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-zinc-900/90 text-sm font-medium px-4 py-3.5 rounded-[18px] focus:outline-none focus:ring-1 focus:ring-[#5856D6] dark:focus:ring-zinc-650 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-650 transition-all border border-black/5 dark:border-white/5 shadow-inner"
                  placeholder="请输入智能体专属代号"
                  id="input-agent-name"
                />
              </div>

              {/* Core System Prompts Instruction */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-zinc-550 dark:text-zinc-400 uppercase tracking-wider font-mono flex items-center gap-1">
                    <span>系统支配协议 (System Instruction)</span>
                  </label>
                  <button 
                    onClick={() => setShowConfigTips(!showConfigTips)}
                    className="text-zinc-400 dark:text-zinc-500 hover:text-white transition-all p-1"
                  >
                    <Info size={12} />
                  </button>
                </div>

                <AnimatePresence>
                  {showConfigTips && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-[#5856D6]/5 dark:bg-white/5 text-[10.5px] p-3 rounded-xl text-[#5856D6] dark:text-zinc-300 leading-relaxed font-sans overflow-hidden border border-[#5856D6]/10 dark:border-white/5"
                    >
                      💡 <strong>设计建议</strong>：系统指令是智能体的“灵魂支配协议”。在这里设定语气（如：精简、技术极客、诗意等），设定严密的前提假设以限制幻觉，或者预设某种特定的输出模板。
                    </motion.div>
                  )}
                </AnimatePresence>

                <textarea
                  value={config.role}
                  rows={6}
                  onChange={(e) => setConfig({ ...config, role: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-zinc-900/90 text-xs leading-relaxed px-4 py-3.5 rounded-[18px] focus:outline-none focus:ring-1 focus:ring-[#5856D6] dark:focus:ring-zinc-600 text-zinc-800 dark:text-zinc-300 transition-all font-sans border border-black/5 dark:border-white/5 shadow-inner resize-none"
                  placeholder="设定该智能体的底层限制机制或人设系统指令..."
                  id="textarea-agent-role"
                />
              </div>

              {/* Model Choice: Custom premium dropdown selector */}
              <div className="space-y-2 relative" ref={modelDropdownRef}>
                <label className="text-[11px] font-bold text-zinc-550 dark:text-zinc-400 uppercase tracking-wider font-mono">
                  模型硬件架构驱动 (Model Driver)
                </label>
                
                {/* Selector Trigger Button */}
                <button
                  type="button"
                  onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                  className="w-full bg-slate-50 dark:bg-zinc-900/90 text-left px-4 py-3.5 rounded-[18px] focus:outline-none focus:ring-1 focus:ring-[#5856D6] dark:focus:ring-zinc-650 text-zinc-900 dark:text-white border border-black/5 dark:border-white/5 shadow-inner transition-all flex items-center justify-between group cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-850"
                  id="model-dropdown-trigger"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-[#5856D6]/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/10 shrink-0">
                      {config.model === "gemini-3.5-flash" ? (
                        <GeminiFlashLogo className="w-5 h-5" />
                      ) : (
                        <GeminiProLogo className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-semibold font-mono">
                        {config.model === "gemini-3.5-flash" ? "Gemini 3.5" : "Gemini 3.1 Pro"}
                      </div>
                      <p className="text-[9px] text-zinc-400 dark:text-zinc-500 mt-0.5 font-sans">
                        {config.model === "gemini-3.5-flash" ? "平衡低损，疾速推理，首选通用" : "深层逻辑、复杂代码工程与推理"}
                      </p>
                    </div>
                  </div>
                  <ChevronDown size={15} className={`text-zinc-400 dark:text-zinc-500 transition-transform duration-300 group-hover:text-zinc-700 dark:group-hover:text-zinc-350 ${modelDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {modelDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute left-0 right-0 z-50 mt-1 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-[20px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6)] overflow-hidden p-1.5"
                    >
                      {/* Option 1 */}
                      <button
                        type="button"
                        onClick={() => {
                          setConfig({ ...config, model: "gemini-3.5-flash" });
                          setModelDropdownOpen(false);
                        }}
                        className={`w-full text-left p-3.5 rounded-[16px] transition-all flex items-center gap-3 cursor-pointer ${
                          config.model === "gemini-3.5-flash"
                            ? "bg-[#5856D6]/10 dark:bg-white/10 text-[#5856D6] dark:text-white"
                            : "hover:bg-slate-50 dark:hover:bg-white/5 text-zinc-650 dark:text-zinc-400"
                        }`}
                      >
                        <div className="p-1.5 bg-slate-100 dark:bg-zinc-800 rounded-xl shrink-0 border border-black/5 dark:border-white/5">
                          <GeminiFlashLogo className="w-5 h-5" />
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold font-mono">Gemini 3.5</span>
                            {config.model === "gemini-3.5-flash" && <Check size={12} className="text-[#5856D6] dark:text-white" />}
                          </div>
                          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5 font-sans leading-tight">平衡低损，疾速推理，首选通用</p>
                        </div>
                      </button>

                      {/* Option 2 */}
                      <button
                        type="button"
                        onClick={() => {
                          setConfig({ ...config, model: "gemini-3.1-pro-preview" });
                          setModelDropdownOpen(false);
                        }}
                        className={`w-full text-left p-3.5 rounded-[16px] transition-all flex items-center gap-3 cursor-pointer ${
                          config.model === "gemini-3.1-pro-preview"
                            ? "bg-[#5856D6]/10 dark:bg-white/10 text-[#5856D6] dark:text-white"
                            : "hover:bg-slate-50 dark:hover:bg-white/5 text-zinc-650 dark:text-zinc-400"
                        }`}
                      >
                        <div className="p-1.5 bg-slate-100 dark:bg-zinc-800 rounded-xl shrink-0 border border-black/5 dark:border-white/5">
                          <GeminiProLogo className="w-5 h-5" />
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold font-mono">Gemini 3.1 Pro</span>
                            {config.model === "gemini-3.1-pro-preview" && <Check size={12} className="text-[#5856D6] dark:text-white" />}
                          </div>
                          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5 font-sans leading-tight">深层逻辑、复杂代码工程与推理</p>
                        </div>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Temperature Selector */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-zinc-550 dark:text-zinc-400 uppercase tracking-wider font-mono">
                  <span>热度熵值 (Temperature)</span>
                  <span className="text-[#5856D6] dark:text-white bg-[#5856D6]/10 dark:bg-zinc-800 px-2 py-0.5 rounded-lg text-[10px] font-mono">{config.temperature}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.1"
                  value={config.temperature}
                  onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                  className="w-full accent-[#5856D6] dark:accent-white cursor-pointer h-1 rounded-full outline-none bg-slate-200 dark:bg-zinc-800"
                  id="input-slider-temp"
                />
                <div className="flex justify-between text-[9px] font-mono text-zinc-400 dark:text-zinc-500">
                  <span>精确极简 (0.0)</span>
                  <span>平衡陪伴 (0.5)</span>
                  <span>发散创意 (1.0)</span>
                </div>
              </div>

              {/* Feature Switchers: Google search grounding */}
              <div className="space-y-3 pt-3 border-t border-black/5 dark:border-white/5">
                <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-zinc-900/40 border border-black/5 dark:border-white/5 rounded-[20px] transition-all font-sans">
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 bg-[#5856D6]/10 dark:bg-zinc-900 text-[#5856D6] dark:text-white rounded-xl shadow-inner mt-0.5">
                      <Globe size={12} />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-zinc-800 dark:text-white">Google Search 联网探针</h4>
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 leading-tight mt-0.5">联动搜索引擎获取高时效信息流</p>
                    </div>
                  </div>
                  
                  {/* Styled Switch checkbox */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={config.grounding}
                      onChange={(e) => setConfig({ ...config, grounding: e.target.checked })}
                      className="sr-only peer"
                      id="checkbox-grounding"
                    />
                    <div className="w-9 h-5 bg-slate-200 dark:bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 dark:after:bg-zinc-400 peer-checked:after:bg-[#5856D6] dark:peer-checked:after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#5856D6]/20 dark:peer-checked:bg-white/20"></div>
                  </label>
                </div>
              </div>

            </div>

            {/* Agent Overview Status */}
            <div className="mt-auto pt-4 border-t border-black/5 dark:border-white/5 space-y-2 text-[11px] text-zinc-400 dark:text-zinc-500">
              <span className="font-semibold block text-[9px] uppercase font-mono tracking-wider">实时执行态 (Core Engine)</span>
              <div className="flex justify-between font-mono bg-slate-50 dark:bg-zinc-900/50 border border-black/5 dark:border-white/5 p-2.5 rounded-xl text-[10px] text-[#5856D6] dark:text-zinc-400">
                <span>SYSTEM REGISTRY:</span>
                <span className="text-[#5856D6] dark:text-white font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5856D6] dark:bg-white animate-pulse"></span>
                  READY
                </span>
              </div>
            </div>

          </div>
        </motion.section>
      )}
    </AnimatePresence>

        {/* =======================================================
            3. RIGHT PANEL: AI Dialogue Feed (40% or flexible)
            Clean Chat, Squircle cards, Diffuse Shadows
           ======================================================= */}
        <section 
          id="right-chat"
          className={`
            relative z-20 flex-grow flex flex-col h-full min-w-0 md:min-w-[420px]
            ${activeMobileView === "chat" ? "flex" : "hidden md:flex"}
          `}
        >
          <div className="squircle-card p-6 flex flex-col h-full justify-between gap-4 overflow-hidden relative border border-black/5 dark:border-white/5">
            
            {/* Chat top info block */}
            <div className="flex items-center justify-between pb-3.5 border-b border-black/5 dark:border-white/5 font-sans">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#5856D6] dark:bg-white flex items-center justify-center text-white dark:text-zinc-950 font-mono font-bold shadow-md shadow-[#5856D6]/5 dark:shadow-white/5 border border-black/5 dark:border-white/10">
                  {config.name.substring(0, 1).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-zinc-900 dark:text-white leading-none">{config.name}</span>
                    <span className="text-[9px] tracking-widest font-mono font-bold uppercase px-2 py-0.5 bg-[#5856D6]/10 dark:bg-white/10 text-[#5856D6] dark:text-white rounded">
                      CORE INTELLIGENCE
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono mt-1.5 uppercase">
                    {config.model} • TEMP {config.temperature}
                  </p>
                </div>
              </div>
              
              {/* Reset Helper prompt handler */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500"></span>
                  指令桥接正常
                </span>
              </div>
            </div>

            {/* Bubble Message Stream Container */}
            <div className="flex-grow overflow-y-auto space-y-4 px-1 pr-2 py-2">
              <AnimatePresence initial={false}>
                {messages.map((msg) => {
                  const isAssistant = msg.role === "assistant";
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex flex-col ${isAssistant ? "items-start" : "items-end"}`}
                    >
                      {/* Sub message wrapper */}
                      <div className={`max-w-[85%] rounded-[20px] px-4.5 py-3.5 leading-relaxed text-sm shadow-[0_10px_30px_rgba(0,0,0,0.015)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all ${
                        isAssistant
                          ? "bg-slate-100 dark:bg-zinc-900/90 text-zinc-805 dark:text-zinc-200 rounded-tl-[4px] border border-black/5 dark:border-white/5 shadow-inner"
                          : "bg-[#5856D6] dark:bg-white text-white dark:text-zinc-950 font-normal rounded-tr-[4px] shadow-[0_4px_12px_rgba(88,86,214,0.15)] dark:shadow-[0_4px_12px_rgba(255,255,255,0.05)]"
                      }`}>
                        
                        {/* Text rendering */}
                        <div className="whitespace-pre-line font-sans leading-relaxed text-xs">
                          {msg.content}
                        </div>

                        {/* Rendering Grounding Citations */}
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="mt-3.5 pt-3 border-t border-black/5 dark:border-white/5 space-y-1.5">
                            <span className="text-[9px] uppercase font-mono tracking-wider flex items-center gap-1.5 font-bold text-zinc-400 dark:text-zinc-500">
                              <Globe size={11} className="text-zinc-400" /> 
                              参考检索网页 (Citations):
                            </span>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {msg.sources.map((src, idx) => (
                                <a
                                  key={idx}
                                  href={src.uri}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[10px] font-mono bg-[#dedede]/60 dark:bg-zinc-800 hover:bg-[#cecece]/60 dark:hover:bg-zinc-750 text-[#5856D6] dark:text-white px-2 py-0.5 rounded-lg transition-all border border-black/5 dark:border-white/5"
                                >
                                  <span>{src.title}</span>
                                  <ArrowRight size={8} className="text-[#5856D6]/80 dark:text-zinc-400" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Msg bottom timestamp */}
                      <span className="text-[9px] font-mono text-zinc-400 dark:text-zinc-500 px-2 py-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </motion.div>
                  );
                })}

                {/* Animated Typing Status Placeholder */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-start"
                  >
                    <div className="bg-slate-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-[20px] rounded-tl-[4px] px-4.5 py-3 shadow-md flex items-center gap-2">
                      <span className="text-xs text-zinc-505 dark:text-zinc-400 flex items-center gap-2 font-sans">
                        <Terminal size={12} className="animate-spin text-[#5856D6] dark:text-white" />
                        <span>数据包反馈中...</span>
                      </span>
                      <div className="flex gap-0.5">
                        <div className="w-1 h-1 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce delay-100"></div>
                        <div className="w-1 h-1 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce delay-200"></div>
                        <div className="w-1 h-1 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce delay-300"></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Helper dynamic recommendation chips */}
            <div className="space-y-2.5 font-sans">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase font-mono tracking-wider">
                <MessageSquareCode size={11} className="text-[#5856D6] dark:text-white" /> 
                <span>推荐指令 (Prompts)</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activePresetId === "zen" && (
                  <>
                    <button onClick={() => handleApplyPresetPrompt("最近觉得工作压力有些迷茫，感觉焦虑怎么办？")} className="text-[10px] text-zinc-600 dark:text-zinc-400 hover:text-[#5856D6] dark:hover:text-white bg-slate-100 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-zinc-900 px-3 py-1.5 rounded-xl transition-all">最近很焦虑怎么破</button>
                    <button onClick={() => handleApplyPresetPrompt("安静时常常觉得不安，这是一种什么状态呢？")} className="text-[10px] text-zinc-600 dark:text-zinc-400 hover:text-[#5856D6] dark:hover:text-white bg-slate-100 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-zinc-900 px-3 py-1.5 rounded-xl transition-all">不安是什么感受</button>
                  </>
                )}
                {activePresetId === "coder" && (
                  <>
                    <button onClick={() => handleApplyPresetPrompt("Explain reactive state debounce hook in full typescript.")} className="text-[10px] text-zinc-650 dark:text-zinc-400 hover:text-[#5856D6] dark:hover:text-white bg-slate-100 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-zinc-900 px-3 py-1.5 rounded-xl transition-all">Debounce Hook</button>
                    <button onClick={() => handleApplyPresetPrompt("Write a fast Squircle boundary calculator in CSS variables.")} className="text-[10px] text-zinc-650 dark:text-zinc-400 hover:text-[#5856D6] dark:hover:text-white bg-slate-100 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-zinc-900 px-3 py-1.5 rounded-xl transition-all">Squircle Calculations</button>
                  </>
                )}
                {activePresetId === "explorer" && (
                  <>
                    <button onClick={() => handleApplyPresetPrompt("检索并报告 2026 年最新大语言模型多模态能力突破。")} className="text-[10px] text-zinc-650 dark:text-zinc-400 hover:text-[#5856D6] dark:hover:text-white bg-slate-100 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-zinc-900 px-3 py-1.5 rounded-xl transition-all font-sans">2026多模态突破</button>
                    <button onClick={() => handleApplyPresetPrompt("整理一份关于 Apple 人类界面指南(HIG)中材质与毛玻璃的最佳实践简报。")} className="text-[10px] text-zinc-650 dark:text-zinc-400 hover:text-[#5856D6] dark:hover:text-white bg-slate-100 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-zinc-900 px-3 py-1.5 rounded-xl transition-all font-sans">Apple HIG 毛玻璃实践</button>
                  </>
                )}
                {activePresetId === "alchemist" && (
                  <>
                    <button onClick={() => handleApplyPresetPrompt("为一款融合了极简科技与侘寂风的咖啡杯撰写概念文案。")} className="text-[10px] text-zinc-650 dark:text-zinc-400 hover:text-[#5856D6] dark:hover:text-white bg-slate-100 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-zinc-900 px-3 py-1.5 rounded-xl transition-all font-sans">侘寂科技杯概念文案</button>
                    <button onClick={() => handleApplyPresetPrompt("创作一首描写数字矩阵中诞生了灵性意识的当代先锋现代诗。")} className="text-[10px] text-zinc-650 dark:text-zinc-400 hover:text-[#5856D6] dark:hover:text-white bg-slate-100 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-zinc-900 px-3 py-1.5 rounded-xl transition-all font-sans">数字灵性意识现代诗</button>
                  </>
                )}
              </div>
            </div>

            {/* Bottom Form Typing Dock */}
            <form onSubmit={handleSendMessage} className="relative mt-1 font-sans">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="发送指令以控制内核决策..."
                className="w-full bg-slate-50 dark:bg-zinc-900/90 text-sm pl-4 pr-14 py-4 rounded-[18px] focus:outline-none focus:ring-1 focus:ring-[#5856D6] dark:focus:ring-zinc-600 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 transition-all border border-black/5 dark:border-white/5 shadow-inner"
                id="input-user-chat"
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className={`absolute right-2 top-2 bottom-2 aspect-square rounded-[14px] flex items-center justify-center transition-all ${
                  inputText.trim() && !isTyping
                    ? "bg-[#5856D6] dark:bg-white text-white dark:text-zinc-950 hover:bg-opacity-95 cursor-pointer shadow-sm"
                    : "bg-slate-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed border border-black/5 dark:border-white/5"
                }`}
                id="btn-send-chat"
              >
                <Send size={14} />
              </button>
            </form>

          </div>
        </section>

      </div>
    </div>
  );
}
