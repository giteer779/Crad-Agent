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
  ChevronLeft,
  ChevronRight, 
  ChevronDown,
  ArrowRight, 
  ShieldAlert,
  MessageSquareCode,
  Layers,
  Search,
  BookOpen,
  Info,
  Trash2,
  Plus,
  X,
  Upload,
  Image,
  User,
  Coins,
  CreditCard
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

const modelMetadata: Record<string, { name: string; desc: string; isPro: boolean }> = {
  "gemini-2.5-flash": { name: "Gemini 2.5 Flash", desc: "速度最快，疾速推理，首选通用", isPro: false },
  "gemini-2.5-pro": { name: "Gemini 2.5 Pro", desc: "强逻辑，深层推理与复杂任务", isPro: true },
  "gemini-2.0-flash": { name: "Gemini 2.0 Flash", desc: "极速响应，实时低时延交互", isPro: false },
  "gemini-1.5-pro": { name: "Gemini 1.5 Pro", desc: "经典高精，超长上下文理解", isPro: true },
  "gemini-1.5-flash": { name: "Gemini 1.5 Flash", desc: "经典通用，平衡高效率与低成本", isPro: false },
  "gemini-3.5-flash": { name: "Gemini 3.5 Flash", desc: "平衡低损，疾速推理，首选通用", isPro: false },
};

const getModelInfo = (modelId: string) => {
  const normId = modelId ? modelId.trim() : "";
  if (modelMetadata[normId]) {
    return {
      ...modelMetadata[normId],
      isCustom: false
    };
  }
  return {
    name: normId || "自定义模型",
    desc: "自定义模型 ID 配置驱动引擎",
    isPro: normId.toLowerCase().includes("pro"),
    isCustom: true
  };
};


const AgentAvatar: React.FC<{
  name: string;
  role: string;
  avatarUrl?: string;
  sizeClass?: string;
  className?: string;
  onClick?: () => void;
  editable?: boolean;
}> = ({ name, role, avatarUrl, sizeClass = "w-10 h-10", className = "", onClick, editable = false }) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [avatarUrl]);

  // Fallback prompt for pollinations AI image generation based on name & role
  const fallbackPrompt = `minimalist abstract geometry visual avatar concept icon for AI agent, name: ${name || "AI Agent"}, role: ${role || "assistant"}, vector art, digital interface branding, dark clean background, neon accents, centering composition`;
  const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fallbackPrompt)}?width=150&height=150&nologo=true&seed=${encodeURIComponent(name || "agent")}`;

  const src = imageError || !avatarUrl ? pollinationsUrl : avatarUrl;

  return (
    <div 
      onClick={onClick}
      className={`relative rounded-[16px] overflow-hidden bg-slate-100 dark:bg-zinc-900 border border-black/5 dark:border-white/10 shrink-0 flex items-center justify-center cursor-pointer transition-all duration-300 ${sizeClass} ${className} ${
        editable ? "group hover:ring-2 hover:ring-[#5856D6] dark:hover:ring-white" : ""
      }`}
    >
      <img 
        src={src} 
        alt={name} 
        onError={() => setImageError(true)}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        loading="lazy"
      />
      {editable && (
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-white text-[9px] font-semibold uppercase tracking-wider select-none text-center px-1">
          编辑
        </div>
      )}
    </div>
  );
};

const PermissionRequestCard: React.FC<{
  messageId: string;
  actions: { id: string; action: string; value: any; label: string }[];
  status?: "pending" | "approved" | "rejected";
  onApprove: (messageId: string, selectedIds: string[]) => void;
  onReject: (messageId: string) => void;
}> = ({ messageId, actions, status = "pending", onApprove, onReject }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(actions.map(a => a.id));

  const toggleSelect = (id: string) => {
    if (status !== "pending") return;
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  if (status === "approved") {
    return (
      <div className="mt-3 p-3.5 bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-600 dark:text-emerald-400 font-sans w-full max-w-[380px]">
        <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/30">
          <Check size={11} strokeWidth={3} />
        </div>
        <div>
          <span className="font-semibold block text-left">授权已执行</span>
          <span className="text-[10px] text-emerald-650/80 block text-left">系统底层架构参数已同步更新完毕。</span>
        </div>
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="mt-3 p-3.5 bg-red-500/10 dark:bg-red-500/5 border border-red-500/20 rounded-2xl flex items-center gap-2.5 text-xs text-red-650 dark:text-red-400 font-sans w-full max-w-[380px]">
        <div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-red-500/30">
          <X size={11} strokeWidth={3} />
        </div>
        <div>
          <span className="font-semibold block text-left">授权已拒绝</span>
          <span className="text-[10px] text-red-500/85 block text-left">指令桥接操作已被用户终止。</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 p-4 bg-white/95 dark:bg-zinc-950/95 border border-black/5 dark:border-white/10 rounded-2xl shadow-lg flex flex-col gap-3 font-sans w-full max-w-[380px] text-left">
      <div className="flex items-center gap-2 text-xs font-semibold text-[#5856D6] dark:text-white pb-1.5 border-b border-black/5 dark:border-white/5">
        <ShieldAlert size={14} className="text-[#5856D6] dark:text-white shrink-0" />
        <span>智能体外部操作授权请求</span>
      </div>
      
      <div className="space-y-2">
        {actions.map((act) => {
          const isChecked = selectedIds.includes(act.id);
          return (
            <div 
              key={act.id} 
              onClick={() => toggleSelect(act.id)}
              className={`flex items-start gap-2.5 p-2 rounded-xl border text-[11px] cursor-pointer transition-all ${
                isChecked 
                  ? "bg-[#5856D6]/5 dark:bg-white/5 border-[#5856D6]/20 dark:border-white/10 text-zinc-805 dark:text-zinc-200" 
                  : "bg-transparent border-transparent text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900/50"
              }`}
            >
              <input 
                type="checkbox" 
                checked={isChecked}
                onChange={() => {}} // handled by div click
                className="mt-0.5 rounded border-slate-300 text-[#5856D6] focus:ring-[#5856D6] dark:border-zinc-700 w-3.5 h-3.5 shrink-0 cursor-pointer"
              />
              <div className="leading-tight text-left">
                <span className="font-medium block">{act.label}</span>
                <span className="text-[9px] font-mono text-zinc-400 dark:text-zinc-500 mt-0.5 block">
                  Action: {act.action} ({String(act.value)})
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 pt-1.5 border-t border-black/5 dark:border-white/5">
        <button
          type="button"
          onClick={() => onReject(messageId)}
          className="flex-1 py-1.5 text-[10.5px] font-semibold rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-300 transition-all border border-black/5 dark:border-white/5 cursor-pointer"
        >
          拒绝
        </button>
        <button
          type="button"
          disabled={selectedIds.length === 0}
          onClick={() => onApprove(messageId, selectedIds)}
          className="flex-1 py-1.5 text-[10.5px] font-semibold rounded-xl bg-[#5856D6] dark:bg-white text-white dark:text-zinc-950 hover:bg-opacity-90 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          授权并执行
        </button>
      </div>
    </div>
  );
};

export default function App() {
  // Preset Selection & Agent Configuration States
  const [activePresetId, setActivePresetId] = useState<string>("zen");

  const [presets, setPresets] = useState<AgentPreset[]>(() => {
    const saved = localStorage.getItem("agent_presets");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {}
    }
    return AGENT_PRESETS;
  });

  useEffect(() => {
    localStorage.setItem("agent_presets", JSON.stringify(presets));
  }, [presets]);

  const updateActivePresetField = (key: keyof AgentPreset, value: any) => {
    setPresets(prev => prev.map(p => {
      if (p.id === activePresetId) {
        return { ...p, [key]: value };
      }
      return p;
    }));
  };

  const [config, setConfig] = useState<AgentConfig>(() => {
    const initialPreset = presets.find(p => p.id === "zen") || presets[0];
    return {
      name: initialPreset.name,
      role: initialPreset.role,
      temperature: initialPreset.temperature,
      model: initialPreset.model,
      grounding: initialPreset.grounding,
      avatarSeed: initialPreset.avatarSeed,
      avatarUrl: initialPreset.avatarUrl,
    };
  });

  // Sidebar presets carousel toggle state
  const [isPresetsExpanded, setIsPresetsExpanded] = useState<boolean>(true);

  // User Profile Dropdown Menu States
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Avatar Modal States
  const [showAvatarModal, setShowAvatarModal] = useState<boolean>(false);
  const [avatarTab, setAvatarTab] = useState<"upload" | "ai" | "url">("upload");
  const [tempAvatarUrl, setTempAvatarUrl] = useState("");
  const [aiAvatarPrompt, setAiAvatarPrompt] = useState("");

  // System Settings Modal States
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [settingsTab, setSettingsTab] = useState<"model" | "ui" | "system" | "logs">("model");
  const [globalApiKey, setGlobalApiKey] = useState<string>(() => localStorage.getItem("gemini_api_key") || "");
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [backendLogs, setBackendLogs] = useState<{ timestamp: string; type: "info" | "warn" | "error"; message: string }[]>([]);
  const [autoScrollLogs, setAutoScrollLogs] = useState<boolean>(true);
  const logsContainerRef = useRef<HTMLDivElement>(null);

  // User Account Modal & Profile States
  const [showAccountModal, setShowAccountModal] = useState<boolean>(false);
  const [showAccountSwitcher, setShowAccountSwitcher] = useState<boolean>(false);
  const [showPointsModal, setShowPointsModal] = useState<boolean>(false);
  const [showCardsModal, setShowCardsModal] = useState<boolean>(false);
  const [rechargeAmount, setRechargeAmount] = useState<{ points: number; price: number } | null>(null);
  const [userPoints, setUserPoints] = useState<number>(() => {
    const saved = localStorage.getItem("user_points");
    return saved ? Number(saved) : 1500;
  });
  const [cabinetCards, setCabinetCards] = useState<{
    spark: { level: number; progress: number };
    credits: { level: number; progress: number };
    decisions: { level: number; progress: number };
  }>(() => {
    const saved = localStorage.getItem("cabinet_cards");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      spark: { level: 1, progress: 12 },
      credits: { level: 1, progress: 1500 },
      decisions: { level: 1, progress: 3 }
    };
  });
  const [isLoggedOut, setIsLoggedOut] = useState<boolean>(() => localStorage.getItem("is_logged_out") === "true");
  const [userProfile, setUserProfile] = useState<{
    avatarUrl: string;
    nickname: string;
    phone: string;
    gender: "male" | "female" | "secret";
    birthday: string;
  }>(() => {
    const saved = localStorage.getItem("user_profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      avatarUrl: "",
      nickname: "Command Pilot",
      phone: "18612345678",
      gender: "secret",
      birthday: "1998-08-08",
    };
  });

  useEffect(() => {
    localStorage.setItem("gemini_api_key", globalApiKey);
  }, [globalApiKey]);

  useEffect(() => {
    localStorage.setItem("user_profile", JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem("is_logged_out", String(isLoggedOut));
  }, [isLoggedOut]);

  useEffect(() => {
    localStorage.setItem("user_points", String(userPoints));
  }, [userPoints]);

  useEffect(() => {
    localStorage.setItem("cabinet_cards", JSON.stringify(cabinetCards));
  }, [cabinetCards]);

  useEffect(() => {
    setCabinetCards(prev => ({
      ...prev,
      credits: { ...prev.credits, progress: userPoints }
    }));
  }, [userPoints]);

  useEffect(() => {
    if (!showSettingsModal || settingsTab !== "logs") return;

    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/logs");
        if (res.ok) {
          const data = await res.json();
          setBackendLogs(data);
        }
      } catch (err) {
        console.error("Failed to fetch backend logs:", err);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 2000);
    return () => clearInterval(interval);
  }, [showSettingsModal, settingsTab]);

  useEffect(() => {
    if (autoScrollLogs && logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [backendLogs, autoScrollLogs]);

  const handleClearLogs = async () => {
    try {
      const res = await fetch("/api/logs", { method: "DELETE" });
      if (res.ok) {
        setBackendLogs([]);
      }
    } catch (err) {
      console.error("Failed to clear backend logs:", err);
    }
  };

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

      const len = presets.length;
      if (len === 0) return;
      const activeIdx = presets.findIndex(p => p.id === activePresetId);
      if (activeIdx === -1) return;

      if (e.deltaY > 0) {
        // Scroll down -> next preset
        const nextIdx = (activeIdx + 1) % len;
        handleSelectPreset(presets[nextIdx]);
      } else if (e.deltaY < 0) {
        // Scroll up -> previous preset
        const prevIdx = (activeIdx - 1 + len) % len;
        handleSelectPreset(presets[prevIdx]);
      }
    };

    carouselEl.addEventListener("wheel", handleWheelEvent, { passive: false });
    return () => {
      carouselEl.removeEventListener("wheel", handleWheelEvent);
    };
  }, [activePresetId, presets]);

  // MySQL Database States
  const [conversations, setConversations] = useState<any[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);

  // Helper function to create a new persistent conversation
  const createNewConversation = async (presetId: string, customConfig?: AgentConfig) => {
    const preset = presets.find(p => p.id === presetId) || presets[0];
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
          apiKey: globalApiKey,
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
          avatarSeed: presets.find(p => p.id === conversation.preset_id)?.avatarSeed || "zen",
          avatarUrl: presets.find(p => p.id === conversation.preset_id)?.avatarUrl,
        });
      }
    } catch (err) {
      console.error("Failed to load message history:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Helper function to delete a conversation session
  const handleDeleteConversation = async (e: React.MouseEvent | null, conversationId: string) => {
    if (e) e.stopPropagation();
    
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

  const syncConversationConfig = async (nextCfg: AgentConfig) => {
    if (!currentConversationId) return;
    try {
      await fetch(`/api/conversations/${currentConversationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent_name: nextCfg.name,
          agent_role: nextCfg.role,
          temperature: nextCfg.temperature,
          model: nextCfg.model,
          grounding: nextCfg.grounding ? 1 : 0,
        }),
      });
      
      // Refresh conversations list in sidebar
      fetch("/api/conversations")
        .then((res) => res.json())
        .then((data) => setConversations(data))
        .catch(() => {});
    } catch (e) {
      console.warn("Could not sync conversation config to database:", e);
    }
  };

  const handleUpdateConfig = (updates: Partial<AgentConfig>) => {
    setConfig(prev => {
      const next = { ...prev, ...updates };
      // Sync to database
      syncConversationConfig(next);
      return next;
    });
    // Sync to presets
    Object.entries(updates).forEach(([key, val]) => {
      updateActivePresetField(key as keyof AgentPreset, val);
    });
  };

  const handleApproveActions = async (messageId: string, selectedActionIds: string[]) => {
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;
    
    const message = messages[messageIndex];
    if (!message.pendingActions) return;
    
    const approvedActions = message.pendingActions.filter(action => selectedActionIds.includes(action.id));
    const newConfigUpdates: Partial<AgentConfig> = {};
    
    for (const act of approvedActions) {
      const { action, value } = act;
      if (action === "set_temperature") {
        newConfigUpdates.temperature = Number(value);
      } else if (action === "toggle_grounding") {
        newConfigUpdates.grounding = !!value;
      } else if (action === "set_model") {
        newConfigUpdates.model = value;
      } else if (action === "toggle_dark_mode") {
        const targetDarkMode = !!value;
        if (darkMode !== targetDarkMode) {
          toggleDarkMode();
        }
      } else if (action === "delete_conversation") {
        await handleDeleteConversation(null, value);
      }
    }
    
    setCabinetCards(prev => ({
      ...prev,
      decisions: { ...prev.decisions, progress: prev.decisions.progress + selectedActionIds.length }
    }));
    
    if (Object.keys(newConfigUpdates).length > 0) {
      handleUpdateConfig(newConfigUpdates);
    }
    
    setMessages(prev => prev.map(m => {
      if (m.id === messageId) {
        return { ...m, actionStatus: "approved" };
      }
      return m;
    }));
  };

  const handleRejectActions = (messageId: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id === messageId) {
        return { ...m, actionStatus: "rejected" };
      }
      return m;
    }));
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
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
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
    setCabinetCards(prev => ({
      ...prev,
      spark: { ...prev.spark, progress: prev.spark.progress + 1 }
    }));
    setInputText("");
    setIsTyping(true);

    try {
      const historyPayload = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const systemPromptAddendum = `\n\n[SYSTEM BRIEF - COMMAND BRIDGE TAKE-OVER AUTHORIZATION]\nYou have the capability to take over and update the system control panel parameters when the user requests it. \nHowever, before executing out-of-dialog settings modifications, you MUST request authorization from the user.\nTo request permission for one or more actions, append a XML block at the very end of your message in this exact format:\n<request_permission>[\n  {"id": "action-1", "action": "set_temperature", "value": 0.9, "label": "调整控制台温度熵值为 0.9"},\n  {"id": "action-2", "action": "toggle_grounding", "value": true, "label": "开启 Google Search 联网探针"},\n  {"id": "action-3", "action": "toggle_dark_mode", "value": true, "label": "开启系统全息暗色主题模式"}\n]</request_permission>\n\nSupported Action Types:\n1. "set_temperature": value is a float between 0.0 and 1.0.\n2. "toggle_grounding": value is a boolean.\n3. "set_model": value is "gemini-3.5-flash" or "gemini-3.1-pro-preview".\n4. "toggle_dark_mode": value is a boolean.\n5. "delete_conversation": value is the conversation ID "${currentConversationId}".\n\nGenerate realistic labels in Chinese explaining each action. Only request permissions for settings the user explicitly asked you to change. Do not output raw JSON outside of the <request_permission> tag.`;

      // Fire to server side Gemini proxy API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: historyPayload,
          systemInstruction: config.role + systemPromptAddendum,
          temperature: config.temperature,
          model: config.model,
          grounding: config.grounding,
          conversationId: currentConversationId,
          userMessageId,
          assistantMessageId,
          apiKey: globalApiKey,
        }),
      });

      if (!response.ok) {
        throw new Error("API call returned non-200 state");
      }

      const data = await response.json();
      let responseText = data.content || "生成式架构返回空数据。请检查配置参数。";
      let pendingActions: any[] = [];
      let actionStatus: "pending" | "approved" | "rejected" | undefined = undefined;

      const permissionRegex = /<request_permission>([\s\S]*?)<\/request_permission>/;
      const match = responseText.match(permissionRegex);
      if (match) {
        try {
          const parsed = JSON.parse(match[1].trim());
          if (Array.isArray(parsed) && parsed.length > 0) {
            pendingActions = parsed;
            actionStatus = "pending";
          }
        } catch (e) {
          console.warn("Failed to parse permission request JSON:", e);
        }
        responseText = responseText.replace(permissionRegex, "").trim();
      }
      
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          role: "assistant",
          content: responseText,
          timestamp: new Date().toISOString(),
          sources: data.sources || [],
          pendingActions,
          actionStatus,
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
        
        let simulatedXml = "";
        const uText = userMessage.content;
        if (uText.includes("温度") || uText.includes("搜索") || uText.includes("暗色") || uText.includes("主题") || uText.includes("设置")) {
          const simulatedActions: any[] = [];
          if (uText.includes("温度")) {
            const tempMatch = uText.match(/(\d+\.\d+|\d+)/);
            const val = tempMatch ? parseFloat(tempMatch[0]) : 0.9;
            simulatedActions.push({
              id: "sim-act-temp",
              action: "set_temperature",
              value: val,
              label: `调整控制台温度熵值为 ${val}`,
            });
          }
          if (uText.includes("搜索")) {
            simulatedActions.push({
              id: "sim-act-grounding",
              action: "toggle_grounding",
              value: true,
              label: "开启 Google Search 联网探针",
            });
          }
          if (uText.includes("暗色") || uText.includes("主题")) {
            simulatedActions.push({
              id: "sim-act-dark",
              action: "toggle_dark_mode",
              value: true,
              label: "开启系统全息暗色主题模式",
            });
          }
          if (simulatedActions.length > 0) {
            simulatedXml = `\n\n<request_permission>${JSON.stringify(simulatedActions)}</request_permission>`;
          }
        }

        let responseText = simulated.content + simulatedXml;
        let pendingActions: any[] = [];
        let actionStatus: "pending" | "approved" | "rejected" | undefined = undefined;

        const permissionRegex = /<request_permission>([\s\S]*?)<\/request_permission>/;
        const match = responseText.match(permissionRegex);
        if (match) {
          try {
            const parsed = JSON.parse(match[1].trim());
            if (Array.isArray(parsed) && parsed.length > 0) {
              pendingActions = parsed;
              actionStatus = "pending";
            }
          } catch (e) {
            console.warn("Failed to parse simulated permission request JSON:", e);
          }
          responseText = responseText.replace(permissionRegex, "").trim();
        }

        const simulatedResponseId = `ai-simulated-${Date.now()}`;
        const simulatedResponseMsg = {
          id: simulatedResponseId,
          role: "assistant" as const,
          content: `⚠️ [本地模拟引擎] ${responseText}`,
          timestamp: new Date().toISOString(),
          sources: simulated.sources,
          pendingActions,
          actionStatus,
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
                assistantMessageId: simulatedResponseId,
                apiKey: globalApiKey,
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

  const handleUpgradeCard = (
    cardId: "spark" | "credits" | "decisions", 
    thresholds: number[], 
    levelNames: string[], 
    currentLevel: number, 
    currentProgress: number, 
    cardName: string
  ) => {
    if (currentLevel >= 5) {
      alert("该卡片已达到至尊满级，无法继续进阶！");
      return;
    }
    
    const nextThreshold = thresholds[currentLevel - 1];
    if (currentProgress >= nextThreshold) {
      setCabinetCards(prev => ({
        ...prev,
        [cardId]: { ...prev[cardId], level: currentLevel + 1 }
      }));
      alert(`🎉 恭喜！卡片【${cardName}】成功进阶为【${levelNames[currentLevel]}】！`);
    } else {
      const cost = 200;
      if (confirm(`当前成就进度尚未满足要求（进阶需要 ${nextThreshold}，当前进度为 ${currentProgress}）。\n是否消耗 ${cost} 积分，通过算力注入强行升级该卡片？`)) {
        if (userPoints >= cost) {
          setUserPoints(prev => prev - cost);
          setCabinetCards(prev => ({
            ...prev,
            [cardId]: { ...prev[cardId], level: currentLevel + 1 }
          }));
          alert(`🎉 算力注入升级成功！已扣除 ${cost} 积分，卡片【${cardName}】成功升级为【${levelNames[currentLevel]}】！`);
        } else {
          alert("可用算力积分不足，无法强制解锁。请继续进行日常指令交互以积累进度！");
        }
      }
    }
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
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                <div className="flex items-center gap-2">
                  <Layers size={11} className="text-zinc-400" />
                  <span>智能内核预设 (Presets)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPresetsExpanded(!isPresetsExpanded)}
                  className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-350 transition-all cursor-pointer flex items-center justify-center border-none bg-transparent"
                  title={isPresetsExpanded ? "收起预设" : "展开预设"}
                >
                  <ChevronDown
                    size={14}
                    className={`transform transition-transform duration-300 ${
                      isPresetsExpanded ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>
              </div>
              
              {/* Vertical Cylinder Preset Carousel */}
              <AnimatePresence initial={false}>
                {isPresetsExpanded && (
                  <motion.div 
                    ref={carouselRef}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="relative flex flex-col items-center select-none w-full justify-center cursor-ns-resize overflow-hidden"
                    title="使用鼠标滚轮上下切换智能体"
                  >
                    {/* Visible Items Container */}
                    <div className="flex flex-col gap-3.5 relative w-full items-center justify-center py-2">
                      {(() => {
                        const len = presets.length;
                        if (len === 0) return null;
                        const activeIdx = presets.findIndex(p => p.id === activePresetId);
                        if (activeIdx === -1) return null;

                        const topIdx = (activeIdx - 1 + len) % len;
                        const bottomIdx = (activeIdx + 1) % len;
                        
                        const visibleIndices = len >= 3 
                          ? [topIdx, activeIdx, bottomIdx]
                          : len === 2
                            ? [topIdx, activeIdx]
                            : [activeIdx];
                        
                        return visibleIndices.map((idx, pos) => {
                          const preset = presets[idx];
                          if (!preset) return null;
                          const isMiddle = len >= 3 ? pos === 1 : (len === 2 ? pos === 1 : pos === 0);
                          const isTop = len >= 3 ? pos === 0 : (len === 2 ? pos === 0 : false);
                          
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
                                  : "text-zinc-400 dark:text-zinc-550 line-clamp-1"
                              }`}>
                                {preset.description}
                              </p>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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

          {/* Fixed User Profile Footer Block */}
          <div className="relative mt-8 pt-4 border-t border-black/5 dark:border-white/5 shrink-0" ref={userMenuRef}>
            <div 
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-100/80 dark:hover:bg-zinc-900/60 border border-transparent hover:border-black/5 dark:hover:border-white/5 transition-all duration-300 cursor-pointer shadow-sm active:scale-98"
            >
              {userProfile.avatarUrl ? (
                <img 
                  src={userProfile.avatarUrl} 
                  alt="user avatar" 
                  className="w-9 h-9 rounded-xl object-cover shadow-sm shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-[#5856D6] dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-bold shadow-sm shadow-[#5856D6]/20 dark:shadow-white/20 shrink-0">
                  <User size={16} />
                </div>
              )}
              <div className="flex-grow min-w-0 text-left">
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block truncate">{userProfile.nickname}</span>
                <span className="text-[9px] font-mono text-zinc-400 dark:text-zinc-550 block mt-0.5">ADMIN SECURITY LEVEL</span>
              </div>
              <ChevronDown size={14} className={`text-zinc-400 transition-transform duration-300 ${userMenuOpen ? "rotate-180" : ""}`} />
            </div>

            {/* Glassmorphic Dropdown User Menu */}
            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute bottom-full left-0 right-0 z-50 mb-2.5 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.18)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.6)] p-1.5 overflow-hidden flex flex-col gap-1 font-sans"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setShowSettingsModal(true);
                      setUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-900/60 text-zinc-750 dark:text-zinc-350 text-xs font-semibold tracking-wide transition-all text-left cursor-pointer border-none bg-transparent"
                  >
                    <Settings size={13} className="text-zinc-400 dark:text-zinc-500" />
                    <span>系统设置</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAccountModal(true);
                      setUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-900/60 text-zinc-750 dark:text-zinc-350 text-xs font-semibold tracking-wide transition-all text-left cursor-pointer border-none bg-transparent"
                  >
                    <User size={13} className="text-zinc-400 dark:text-zinc-500" />
                    <span>账号</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPointsModal(true);
                      setUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-900/60 text-zinc-750 dark:text-zinc-350 text-xs font-semibold tracking-wide transition-all text-left cursor-pointer border-none bg-transparent"
                  >
                    <Coins size={13} className="text-[#5856D6] dark:text-white" />
                    <span>积分</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCardsModal(true);
                      setUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-900/60 text-zinc-750 dark:text-zinc-350 text-xs font-semibold tracking-wide transition-all text-left cursor-pointer border-none bg-transparent"
                  >
                    <CreditCard size={13} className="text-zinc-400 dark:text-zinc-500" />
                    <span>卡片</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
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
                    <AgentAvatar 
                      name={config.name} 
                      role={config.role} 
                      avatarUrl={config.avatarUrl} 
                      sizeClass="w-8 h-8 rounded-xl" 
                    />
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
                            <AgentAvatar 
                              name={preset.name} 
                              role={preset.role} 
                              avatarUrl={preset.avatarUrl} 
                              sizeClass="w-7 h-7 rounded-lg" 
                            />
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
                  {(() => {
                    const info = getModelInfo(config.model);
                    return (
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-[#5856D6]/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/10 shrink-0">
                          {info.isPro ? (
                            <GeminiProLogo className="w-5 h-5" />
                          ) : (
                            <GeminiFlashLogo className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <div className="text-xs font-semibold font-mono">
                            {info.name}
                          </div>
                          <p className="text-[9px] text-zinc-400 dark:text-zinc-500 mt-0.5 font-sans">
                            {info.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })()}
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
                      className="absolute left-0 right-0 z-50 mt-1 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-[20px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6)] overflow-hidden p-1.5 max-h-[300px] overflow-y-auto"
                    >
                      {Object.entries(modelMetadata).map(([id, info]) => {
                        const isSelected = config.model === id;
                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => {
                              handleUpdateConfig({ model: id });
                              setModelDropdownOpen(false);
                            }}
                            className={`w-full text-left p-3.5 rounded-[16px] transition-all flex items-center gap-3 cursor-pointer ${
                              isSelected
                                ? "bg-[#5856D6]/10 dark:bg-white/10 text-[#5856D6] dark:text-white"
                                : "hover:bg-slate-50 dark:hover:bg-white/5 text-zinc-650 dark:text-zinc-400"
                            }`}
                          >
                            <div className="p-1.5 bg-slate-100 dark:bg-zinc-800 rounded-xl shrink-0 border border-black/5 dark:border-white/5">
                              {info.isPro ? (
                                <GeminiProLogo className="w-5 h-5" />
                              ) : (
                                <GeminiFlashLogo className="w-5 h-5" />
                              )}
                            </div>
                            <div className="flex-grow">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold font-mono">{info.name}</span>
                                {isSelected && <Check size={12} className="text-[#5856D6] dark:text-white" />}
                              </div>
                              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5 font-sans leading-tight">{info.desc}</p>
                            </div>
                          </button>
                        );
                      })}

                      {(() => {
                        const info = getModelInfo(config.model);
                        if (info.isCustom) {
                          return (
                            <div className="border-t border-black/5 dark:border-white/5 mt-1 pt-1">
                              <button
                                type="button"
                                className="w-full text-left p-3.5 rounded-[16px] bg-[#5856D6]/10 dark:bg-white/10 text-[#5856D6] dark:text-white font-sans"
                              >
                                <div className="p-1.5 bg-slate-100 dark:bg-zinc-800 rounded-xl shrink-0 border border-black/5 dark:border-white/5">
                                  {info.isPro ? (
                                    <GeminiProLogo className="w-5 h-5" />
                                  ) : (
                                    <GeminiFlashLogo className="w-5 h-5" />
                                  )}
                                </div>
                                <div className="flex-grow">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold font-mono">自定义: {info.name}</span>
                                    <Check size={12} className="text-[#5856D6] dark:text-white" />
                                  </div>
                                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5 font-sans leading-tight">在系统设置中手动填写的自定义版本</p>
                                </div>
                              </button>
                            </div>
                          );
                        }
                        return null;
                      })()}

                      <div className="border-t border-black/5 dark:border-white/5 mt-1 pt-1.5 px-2 pb-1 flex justify-between items-center text-[10px] text-zinc-400 font-sans">
                        <span>需要配置其它模型？</span>
                        <button
                          type="button"
                          onClick={() => {
                            setSettingsTab("model");
                            setShowSettingsModal(true);
                            setModelDropdownOpen(false);
                          }}
                          className="text-[#5856D6] dark:text-white font-semibold hover:underline cursor-pointer bg-transparent border-none p-0"
                        >
                          打开系统设置
                        </button>
                      </div>
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
                <AgentAvatar 
                  name={config.name} 
                  role={config.role} 
                  avatarUrl={config.avatarUrl} 
                  sizeClass="w-10 h-10 rounded-2xl" 
                  className="shadow-md border border-black/5 dark:border-white/10"
                  onClick={() => setShowAvatarModal(true)} 
                  editable={true} 
                />
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

      {/* System Settings Modal */}
      <AnimatePresence>
        {showSettingsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-950 border border-black/5 dark:border-white/10 rounded-3xl p-6 w-[780px] h-[460px] max-w-[780px] max-h-[460px] shadow-2xl relative flex flex-col md:flex-row gap-6 overflow-hidden select-none"
            >
              <button 
                type="button" 
                onClick={() => setShowSettingsModal(false)}
                className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-900 text-zinc-400 hover:text-zinc-650 transition-all cursor-pointer border-none bg-transparent"
              >
                <X size={16} />
              </button>

              {/* Sidebar Tabs */}
              <div className="w-full md:w-[160px] shrink-0 flex flex-row md:flex-col gap-1 border-b md:border-b-0 md:border-r border-black/5 dark:border-white/5 pb-4 md:pb-0 md:pr-4 h-full">
                <div className="hidden md:block mb-4">
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider font-mono">系统控制面板</h3>
                  <p className="text-[9px] text-zinc-400 dark:text-zinc-550 mt-0.5">System Dashboard</p>
                </div>
                {(["model", "ui", "system", "logs"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setSettingsTab(tab)}
                    className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer border-none text-left w-full ${
                      settingsTab === tab 
                        ? "bg-slate-100 dark:bg-zinc-900 text-[#5856D6] dark:text-white shadow-sm" 
                        : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-350 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900/30"
                    }`}
                  >
                    {tab === "model" && <Cpu size={13} />}
                    {tab === "ui" && <Sliders size={13} />}
                    {tab === "system" && <Settings size={13} />}
                    {tab === "logs" && <Terminal size={13} />}
                    <span>
                      {tab === "model" ? "AI 模型设置" : tab === "ui" ? "界面偏好" : tab === "system" ? "系统状态" : "后台日志"}
                    </span>
                  </button>
                ))}
              </div>

              {/* Tab Contents */}
              <div className="flex-grow space-y-4 overflow-y-auto h-full pr-1">
                {settingsTab === "model" && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-white">AI 模型设置</h4>
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">配置当前会话使用的 AI 推理引擎、连接密钥与模型版本 ID</p>
                    </div>

                    <div className="space-y-4 font-sans text-left">
                      {/* API Key configuration */}
                      <div className="space-y-1.5 text-left relative">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-550 uppercase tracking-wider font-mono">
                            Gemini API 密钥 (Gemini API Key)
                          </label>
                          <span className="text-[9px] text-zinc-400 dark:text-zinc-555">
                            {globalApiKey ? "已保存自定义密钥" : "未配置密钥 (使用默认环境变量)"}
                          </span>
                        </div>
                        <div className="relative">
                          <input 
                            type={showApiKey ? "text" : "password"}
                            value={globalApiKey}
                            onChange={(e) => setGlobalApiKey(e.target.value)}
                            placeholder="输入 API Key (如 AIzaSy...)"
                            className="w-full bg-slate-50 dark:bg-zinc-900 text-xs px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5856D6] border border-black/5 dark:border-white/5 text-zinc-900 dark:text-white pr-14 font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => setShowApiKey(!showApiKey)}
                            className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-650 cursor-pointer border-none bg-transparent"
                          >
                            <span className="text-[10px] font-bold select-none">{showApiKey ? "隐藏" : "显示"}</span>
                          </button>
                        </div>
                        <p className="text-[9px] text-zinc-400 dark:text-zinc-500">
                          若留空，系统将默认使用后端 <code>.env</code> 文件中配置的 <code>GEMINI_API_KEY</code>。
                        </p>
                      </div>

                      {/* Model choices selection */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider font-mono">
                          快速绑定模型版本 (Model Preset)
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", desc: "速度最快" },
                            { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", desc: "强逻辑" },
                            { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", desc: "低时延首选" },
                            { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", desc: "经典高精" },
                            { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", desc: "经典通用" },
                            { id: "custom", name: "自定义模型", desc: "手动配置 ID" },
                          ].map((item) => {
                            const isSelected = item.id === "custom" 
                              ? !["gemini-2.5-flash", "gemini-2.5-pro", "gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash"].includes(config.model)
                              : config.model === item.id;
                            
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                  if (item.id !== "custom") {
                                    handleUpdateConfig({ model: item.id });
                                  }
                                }}
                                className={`p-2.5 rounded-xl border transition-all text-left flex flex-col justify-between cursor-pointer ${
                                  isSelected
                                    ? "bg-[#5856D6]/10 dark:bg-white/10 text-[#5856D6] dark:text-white border-[#5856D6] dark:border-white/20"
                                    : "bg-slate-50/50 dark:bg-zinc-900/30 hover:bg-slate-100 dark:hover:bg-zinc-900 border-black/5 dark:border-white/5"
                                }`}
                              >
                                <span className="text-[11px] font-bold block">{item.name}</span>
                                <span className="text-[9px] text-zinc-400 dark:text-zinc-555 block mt-0.5">{item.desc}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Custom Model ID Text Box */}
                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] font-bold text-zinc-455 dark:text-zinc-500 uppercase tracking-wider font-mono">
                          当前生效的模型版本 ID (Model ID)
                        </label>
                        <input 
                          type="text"
                          value={config.model}
                          onChange={(e) => handleUpdateConfig({ model: e.target.value })}
                          placeholder="自定义模型版本名称 (例如 gemini-2.0-flash-exp)"
                          className="w-full bg-slate-50 dark:bg-zinc-900 text-xs px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5856D6] border border-black/5 dark:border-white/5 text-zinc-900 dark:text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {settingsTab === "ui" && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-white">界面偏好</h4>
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">个性化配置当前工作区的外观 and 视觉表现形式</p>
                    </div>

                    <div className="space-y-4 font-sans text-left">
                      {/* Dark mode switch */}
                      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/50 dark:bg-zinc-900/30 border border-black/5 dark:border-white/5">
                        <div>
                          <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block">主题色彩模式</span>
                          <span className="text-[9px] text-zinc-400 dark:text-zinc-500 block mt-0.5">切换浅色与深色设计语言</span>
                        </div>
                        <button
                          type="button"
                          onClick={toggleDarkMode}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 hover:text-[#5856D6] hover:bg-slate-200 dark:hover:bg-zinc-800 transition-all border border-black/5 dark:border-white/5 cursor-pointer shadow-sm"
                        >
                          {darkMode ? <Sun size={15} /> : <Moon size={15} />}
                        </button>
                      </div>

                      {/* Config display settings */}
                      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/50 dark:bg-zinc-900/30 border border-black/5 dark:border-white/5">
                        <div>
                          <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block">侧边核心底座配置面板</span>
                          <span className="text-[9px] text-zinc-400 dark:text-zinc-500 block mt-0.5">在中控台右侧/中间显示参数控制区域</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer select-none">
                          <input 
                            type="checkbox" 
                            checked={isConfigExpanded}
                            onChange={(e) => setIsConfigExpanded(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-200 dark:bg-zinc-800 rounded-full peer peer-focus:ring-1 peer-focus:ring-[#5856D6] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-zinc-300 dark:after:bg-zinc-400 peer-checked:after:bg-white peer-checked:after:dark:bg-zinc-950 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#5856D6]"></div>
                        </label>
                      </div>

                      {/* Preset expansion */}
                      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/50 dark:bg-zinc-900/30 border border-black/5 dark:border-white/5">
                        <div>
                          <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block">智能体侧边卡片列表状态</span>
                          <span className="text-[9px] text-zinc-400 dark:text-zinc-555 block mt-0.5">控制最左侧的智能体快捷滚轮展示</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer select-none">
                          <input 
                            type="checkbox" 
                            checked={isPresetsExpanded}
                            onChange={(e) => setIsPresetsExpanded(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-200 dark:bg-zinc-800 rounded-full peer peer-focus:ring-1 peer-focus:ring-[#5856D6] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-zinc-300 dark:after:bg-zinc-400 peer-checked:after:bg-white peer-checked:after:dark:bg-zinc-950 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#5856D6]"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {settingsTab === "system" && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-white">系统状态面板</h4>
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">系统底层状态诊断与服务端驱动连接数据监控</p>
                    </div>

                    <div className="space-y-3 font-mono text-[10px] text-left">
                      {/* Connection details */}
                      <div className="p-3.5 rounded-2xl bg-slate-50/50 dark:bg-zinc-900/30 border border-black/5 dark:border-white/5 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-400 dark:text-zinc-500">API 连接状态</span>
                          {apiAvailable === null ? (
                            <span className="text-amber-500 font-semibold flex items-center gap-1"><RefreshCw size={10} className="animate-spin" /> 检测中</span>
                          ) : apiAvailable ? (
                            <span className="text-emerald-500 font-semibold flex items-center gap-1">● 在线可用 (ACTIVE)</span>
                          ) : (
                            <span className="text-rose-500 font-semibold flex items-center gap-1">▲ 连接受限 (OFFLINE)</span>
                          )}
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400 dark:text-zinc-500">主服务入口</span>
                          <span className="text-zinc-700 dark:text-zinc-350">localhost:3001/api</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400 dark:text-zinc-500">底层数据库驱动</span>
                          <span className="text-zinc-700 dark:text-zinc-350">IndexedDB (card-agent-db)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400 dark:text-zinc-500">微内核总数</span>
                          <span className="text-zinc-700 dark:text-zinc-350">{presets.length} Presets</span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#5856D6]/5 dark:bg-white/5 border border-[#5856D6]/10 dark:border-white/10 space-y-1.5 text-zinc-650 dark:text-zinc-400">
                        <div className="font-bold text-zinc-900 dark:text-white mb-1 flex items-center gap-1.5">
                          <Info size={11} className="text-[#5856D6] dark:text-white" />
                          <span>关于 Card Agent 指挥中心</span>
                        </div>
                        <p className="leading-relaxed text-sans font-sans">
                          本控制台作为“智能卡片交互系统”的语义控制中枢，负责卡片行为的实时规划、代码沙箱拦截、以及AI工作流的监督与分派。
                        </p>
                        <p className="text-[9px] mt-2 block font-mono text-zinc-400 dark:text-zinc-555">
                          Build Version: 1.2.0-stable (Release @ 2026)
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {settingsTab === "logs" && (
                  <div className="space-y-3 flex flex-col h-full overflow-hidden">
                    <div className="flex justify-between items-center shrink-0">
                      <div>
                        <h4 className="text-sm font-bold text-zinc-900 dark:text-white">后台运行日志</h4>
                        <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">实时诊断服务端驱动核心日志与底层网络连接事件</p>
                      </div>
                      
                      {/* Control bar */}
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1.5 cursor-pointer select-none text-[10px] font-bold text-zinc-450 dark:text-zinc-500 font-sans">
                          <input 
                            type="checkbox" 
                            checked={autoScrollLogs} 
                            onChange={(e) => setAutoScrollLogs(e.target.checked)}
                            className="rounded border-black/10 dark:border-white/10 text-[#5856D6] focus:ring-0 focus:ring-offset-0 w-3 h-3"
                          />
                          <span>自动滚动</span>
                        </label>
                        <button
                          type="button"
                          onClick={handleClearLogs}
                          className="text-[10px] font-bold text-rose-500 hover:text-rose-600 transition-all border border-rose-500/20 hover:border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10 px-2.5 py-1 rounded-lg cursor-pointer"
                        >
                          清除日志
                        </button>
                      </div>
                    </div>

                    <div 
                      ref={logsContainerRef}
                      className="flex-grow bg-slate-950 text-zinc-150 font-mono text-[10.5px] p-4 rounded-2xl border border-black/5 dark:border-white/5 overflow-y-auto space-y-1.5 h-[275px] text-left"
                    >
                      {backendLogs.length === 0 ? (
                        <div className="text-zinc-500 h-full flex items-center justify-center italic text-[11px] font-sans">
                          暂无运行日志 (No Logs Available)
                        </div>
                      ) : (
                        backendLogs.map((log, idx) => (
                          <div key={idx} className="leading-relaxed flex gap-2 break-all">
                            <span className="text-zinc-500 shrink-0">
                              [{new Date(log.timestamp).toLocaleTimeString()}]
                            </span>
                            <span className={`shrink-0 font-bold select-none ${
                              log.type === "error" ? "text-rose-500" : log.type === "warn" ? "text-amber-500" : "text-emerald-500"
                            }`}>
                              [{log.type.toUpperCase()}]
                            </span>
                            <span className={
                              log.type === "error" ? "text-rose-200" : log.type === "warn" ? "text-amber-200" : "text-zinc-300"
                            }>
                              {log.message}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Avatar Edit Modal */}
      <AnimatePresence>
        {showAvatarModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-950 border border-black/5 dark:border-white/10 rounded-3xl p-6 w-full max-w-[420px] shadow-2xl relative"
            >
              <button 
                type="button" 
                onClick={() => setShowAvatarModal(false)}
                className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-900 text-zinc-400 hover:text-zinc-650 transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
              
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1.5">编辑智能体头像</h3>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mb-4 font-sans">编辑当前角色「{config.name}」的视觉头像</p>
              
              {/* Tabs */}
              <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-zinc-900/80 rounded-2xl mb-4">
                {(["upload", "ai", "url"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setAvatarTab(tab)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer border-none \${
                      avatarTab === tab 
                        ? "bg-white dark:bg-zinc-800 text-[#5856D6] dark:text-white shadow-sm" 
                        : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-350"
                    }`}
                  >
                    {tab === "upload" ? "本地上传" : tab === "ai" ? "AI 智能生成" : "网络链接"}
                  </button>
                ))}
              </div>
              
              {/* Tab contents */}
              <div className="space-y-4 min-h-[140px] flex flex-col justify-center font-sans">
                {avatarTab === "upload" && (
                  <div className="flex flex-col items-center justify-center p-6 border border-dashed border-black/10 dark:border-white/10 rounded-2xl bg-slate-50/50 dark:bg-zinc-900/30 hover:bg-slate-100/50 hover:dark:bg-zinc-900/50 transition-all cursor-pointer relative group">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const base64 = reader.result as string;
                            handleUpdateConfig({ avatarUrl: base64 });
                            setShowAvatarModal(false);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload className="text-zinc-400 group-hover:text-[#5856D6] dark:group-hover:text-white mb-2 transition-colors" size={24} />
                    <span className="text-xs text-zinc-550 dark:text-zinc-400 font-semibold">选择本地图像</span>
                    <span className="text-[9px] text-zinc-400 dark:text-zinc-500 mt-1">支持 PNG, JPG, WEBP (最大 2MB)</span>
                  </div>
                )}
                
                {avatarTab === "ai" && (
                  <div className="space-y-3 text-left">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
                        AI 创意提示词 (Image Prompt)
                      </label>
                      <input 
                        type="text"
                        value={aiAvatarPrompt}
                        onChange={(e) => setAiAvatarPrompt(e.target.value)}
                        placeholder="输入提示词以生成极简现代几何头像..."
                        className="w-full bg-slate-50 dark:bg-zinc-900 text-xs px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5856D6] border border-black/5 dark:border-white/5 text-zinc-900 dark:text-white"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const seed = Math.random().toString(36).substring(7);
                        const prompt = aiAvatarPrompt.trim() 
                          ? aiAvatarPrompt.trim() 
                          : `minimalist abstract geometry concept icon for \${config.name}, role \${config.role}, vector art, neon accent`;
                        const url = `https://image.pollinations.ai/prompt/\${encodeURIComponent(prompt)}?width=150&height=150&nologo=true&seed=\${seed}`;
                        handleUpdateConfig({ avatarUrl: url });
                        setShowAvatarModal(false);
                      }}
                      className="w-full py-2.5 bg-[#5856D6] dark:bg-white text-white dark:text-zinc-950 font-bold text-xs rounded-xl hover:opacity-95 transition-all shadow-md shadow-[#5856D6]/15 dark:shadow-white/10 cursor-pointer flex items-center justify-center gap-1.5 border-none"
                    >
                      <Sparkles size={13} />
                      <span>立即生成并应用</span>
                    </button>
                  </div>
                )}
                
                {avatarTab === "url" && (
                  <div className="space-y-3 text-left">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
                        图片网络直链 (Image URL)
                      </label>
                      <input 
                        type="text"
                        value={tempAvatarUrl}
                        onChange={(e) => setTempAvatarUrl(e.target.value)}
                        placeholder="粘贴以 https:// 开头的网络图片直链..."
                        className="w-full bg-slate-50 dark:bg-zinc-900 text-xs px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5856D6] border border-black/5 dark:border-white/5 text-zinc-900 dark:text-white"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (tempAvatarUrl.trim()) {
                          handleUpdateConfig({ avatarUrl: tempAvatarUrl.trim() });
                          setShowAvatarModal(false);
                        }
                      }}
                      className="w-full py-2.5 bg-[#5856D6] dark:bg-white text-white dark:text-zinc-950 font-bold text-xs rounded-xl hover:opacity-95 transition-all shadow-md cursor-pointer border-none"
                    >
                      绑定链接
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Account Settings Modal */}
      <AnimatePresence>
        {showAccountModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-950 border border-black/5 dark:border-white/10 rounded-3xl p-6 w-[480px] h-[520px] max-w-[480px] max-h-[520px] shadow-2xl relative flex flex-col justify-between overflow-hidden select-none font-sans"
            >
              <button 
                type="button" 
                onClick={() => {
                  setShowAccountModal(false);
                  setShowAccountSwitcher(false);
                }}
                className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-900 text-zinc-400 hover:text-zinc-650 transition-all cursor-pointer border-none bg-transparent"
              >
                <X size={16} />
              </button>

              <div className="flex flex-col h-full overflow-hidden">
                <div className="shrink-0 mb-3 text-left">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">个人账号设置</h3>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">管理您的指挥舱基本档案、安全密匙与身份卡片</p>
                </div>

                <div className="flex-grow overflow-y-auto space-y-4 pr-1 text-left">
                  {/* Avatar Upload Selection */}
                  <div className="flex items-center gap-4 p-3 bg-slate-50/50 dark:bg-zinc-900/30 border border-black/5 dark:border-white/5 rounded-2xl">
                    <div className="relative group shrink-0 w-16 h-16 rounded-2xl overflow-hidden bg-slate-150 dark:bg-zinc-800 border border-black/5 dark:border-white/10 flex items-center justify-center">
                      {userProfile.avatarUrl ? (
                        <img src={userProfile.avatarUrl} alt="User Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User size={24} className="text-zinc-400" />
                      )}
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setUserProfile(prev => ({ ...prev, avatarUrl: reader.result as string }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block">点击头像框上传图像</span>
                      <div className="text-[9px] text-zinc-400 dark:text-zinc-550 leading-normal">
                        建议上传 1:1 的正方形图片。或者
                        <button
                          type="button"
                          onClick={() => {
                            const seed = Math.random().toString(36).substring(7);
                            const url = `https://image.pollinations.ai/prompt/premium%20artistic%20avatar%20for%20aistudio%20commander%20called%20${encodeURIComponent(userProfile.nickname)}?width=150&height=150&nologo=true&seed=${seed}`;
                            setUserProfile(prev => ({ ...prev, avatarUrl: url }));
                          }}
                          className="text-[#5856D6] dark:text-white font-bold ml-1 hover:underline cursor-pointer bg-transparent border-none p-0 inline"
                        >
                          随机生成 AI 创意头像
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Form Details Grid */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider font-mono">用户昵称 (Nickname)</label>
                      <input 
                        type="text"
                        value={userProfile.nickname}
                        onChange={(e) => setUserProfile({ ...userProfile, nickname: e.target.value })}
                        placeholder="请输入昵称"
                        className="w-full bg-slate-50 dark:bg-zinc-900 text-xs px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5856D6] border border-black/5 dark:border-white/5 text-zinc-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider font-mono">绑定手机号 (Phone Number)</label>
                      <input 
                        type="tel"
                        value={userProfile.phone}
                        onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                        placeholder="请输入手机号"
                        className="w-full bg-slate-50 dark:bg-zinc-900 text-xs px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5856D6] border border-black/5 dark:border-white/5 text-zinc-900 dark:text-white font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider font-mono">性别 (Gender)</label>
                        <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-zinc-900/60 p-1 rounded-xl">
                          {(["male", "female", "secret"] as const).map((g) => (
                            <button
                              key={g}
                              type="button"
                              onClick={() => setUserProfile({ ...userProfile, gender: g })}
                              className={`py-1.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer border-none ${
                                userProfile.gender === g
                                  ? "bg-white dark:bg-zinc-800 text-[#5856D6] dark:text-white shadow-sm"
                                  : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-400"
                              }`}
                            >
                              {g === "male" ? "男" : g === "female" ? "女" : "保密"}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-455 dark:text-zinc-500 uppercase tracking-wider font-mono">生日 (Birthday)</label>
                        <input 
                          type="date"
                          value={userProfile.birthday}
                          onChange={(e) => setUserProfile({ ...userProfile, birthday: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-zinc-900 text-xs px-4 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5856D6] border border-black/5 dark:border-white/5 text-zinc-900 dark:text-white h-[31px] font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Collapsible Switch Account subpanel */}
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setShowAccountSwitcher(!showAccountSwitcher)}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50/50 dark:bg-zinc-900/30 border border-black/5 dark:border-white/5 text-xs font-semibold text-zinc-750 dark:text-zinc-350 hover:bg-slate-100 transition-all cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5"><RefreshCw size={12} /> 快速切换账号通道...</span>
                      <ChevronDown size={13} className={`text-zinc-400 transition-transform ${showAccountSwitcher ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                      {showAccountSwitcher && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-slate-100/50 dark:bg-zinc-900/50 rounded-2xl p-2 space-y-1 border border-black/5 dark:border-white/5 overflow-hidden text-left"
                        >
                          {[
                            { nickname: "Command Pilot", phone: "18612345678", gender: "secret", birthday: "1998-08-08", role: "超级指挥官" },
                            { nickname: "Co-Pilot", phone: "18987654321", gender: "male", birthday: "1995-05-15", role: "副驾驶支持" },
                            { nickname: "Guest Pilot", phone: "13800000000", birthday: "2000-01-01", gender: "female", role: "访客审计卡" }
                          ].map((presetUser, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setUserProfile({
                                  avatarUrl: "",
                                  nickname: presetUser.nickname,
                                  phone: presetUser.phone,
                                  gender: presetUser.gender as any,
                                  birthday: presetUser.birthday
                                });
                                setShowAccountSwitcher(false);
                              }}
                              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-zinc-650 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-[#5856D6] dark:hover:text-white transition-all text-left border-none bg-transparent cursor-pointer"
                            >
                              <div className="flex flex-col text-left">
                                <span>{presetUser.nickname}</span>
                                <span className="text-[9px] text-zinc-400 dark:text-zinc-550 font-mono mt-0.5">{presetUser.phone}</span>
                              </div>
                              <span className="text-[9px] text-zinc-400 font-mono bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded-lg">{presetUser.role}</span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="shrink-0 pt-4 border-t border-black/5 dark:border-white/5 flex gap-3 mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLoggedOut(true);
                      setShowAccountModal(false);
                      setShowAccountSwitcher(false);
                    }}
                    className="flex-1 py-3 border border-rose-500/20 hover:border-rose-500/30 text-rose-500 bg-rose-500/5 hover:bg-rose-500/10 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
                  >
                    退出登录 (Logout)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAccountModal(false);
                      setShowAccountSwitcher(false);
                    }}
                    className="flex-grow py-3 bg-[#5856D6] text-white hover:bg-opacity-95 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer border-none"
                  >
                    保存并关闭
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Glassmorphic Simulated Login Overlay */}
      {isLoggedOut && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-955/80 dark:bg-zinc-955/90 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 rounded-3xl p-8 w-full max-w-[400px] shadow-2xl relative font-sans text-center"
          >
            <div className="w-16 h-16 rounded-3xl bg-[#5856D6]/10 dark:bg-white/10 text-[#5856D6] dark:text-white flex items-center justify-center font-bold mx-auto mb-4">
              <User size={32} />
            </div>
            
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-1.5">智能中枢授权登录</h2>
            <p className="text-xs text-zinc-450 dark:text-zinc-550 mb-6">请输入您的凭证或选择默认通道登录控制中心</p>

            <form onSubmit={(e) => {
              e.preventDefault();
              setIsLoggedOut(false);
            }} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-mono">手机号 (Phone Number)</label>
                <input 
                  type="tel"
                  required
                  value={userProfile.phone}
                  onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                  placeholder="请输入绑定的手机号"
                  className="w-full bg-slate-50 dark:bg-zinc-950 text-xs px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5856D6] border border-black/5 dark:border-white/5 text-zinc-900 dark:text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-mono">访问密钥 / 密码 (Password)</label>
                <input 
                  type="password"
                  required
                  placeholder="输入访问通行码"
                  className="w-full bg-slate-50 dark:bg-zinc-950 text-xs px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5856D6] border border-black/5 dark:border-white/5 text-zinc-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#5856D6] text-white hover:bg-opacity-95 py-3 rounded-xl text-xs font-bold transition-all shadow-md mt-6 cursor-pointer border-none"
              >
                授权并开启中控台
              </button>
            </form>

            <div className="border-t border-black/5 dark:border-white/5 mt-6 pt-4 text-left">
              <p className="text-[10.5px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">快速测试通道</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setUserProfile({
                      avatarUrl: "",
                      nickname: "Command Pilot",
                      phone: "18612345678",
                      gender: "secret",
                      birthday: "1998-08-08"
                    });
                    setIsLoggedOut(false);
                  }}
                  className="flex-1 py-1.5 bg-slate-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] rounded-lg border border-black/5 hover:bg-slate-200 hover:dark:bg-zinc-700 transition-all font-bold cursor-pointer"
                >
                  超级指挥官
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUserProfile({
                      avatarUrl: "",
                      nickname: "Co-Pilot",
                      phone: "18987654321",
                      gender: "male",
                      birthday: "1995-05-15"
                    });
                    setIsLoggedOut(false);
                  }}
                  className="flex-1 py-1.5 bg-slate-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] rounded-lg border border-black/5 hover:bg-slate-200 hover:dark:bg-zinc-700 transition-all font-bold cursor-pointer"
                >
                  副驾驶员
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Points Wallet Modal */}
      <AnimatePresence>
        {showPointsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-950 border border-black/5 dark:border-white/10 rounded-3xl p-6 w-[520px] h-[520px] max-w-[520px] max-h-[520px] shadow-2xl relative flex flex-col justify-between overflow-hidden select-none font-sans"
            >
              <button 
                type="button" 
                onClick={() => {
                  setShowPointsModal(false);
                  setRechargeAmount(null);
                }}
                className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-900 text-zinc-400 hover:text-zinc-650 transition-all cursor-pointer border-none bg-transparent"
              >
                <X size={16} />
              </button>

              <div className="flex flex-col h-full overflow-hidden relative">
                {/* Header */}
                <div className="shrink-0 mb-3 text-left">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">积分中枢钱包</h3>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">查询余额、快速充值算力额度并兑换增值特权</p>
                </div>

                <div className="flex-grow overflow-y-auto space-y-4 pr-1 text-left">
                  {/* Balance Inquiry Card */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-[#5856D6] to-[#403ebb] dark:from-zinc-900 dark:to-zinc-950 p-5 rounded-2xl border border-black/5 dark:border-white/5 text-white flex items-center justify-between shadow-lg">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">可用算力积分余额</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-black font-mono tracking-tight">{userPoints.toLocaleString()}</span>
                        <span className="text-xs font-semibold text-white/80">Credits</span>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => {
                        const btn = document.getElementById("points-refresh-icon");
                        if (btn) {
                          btn.classList.add("animate-spin");
                          setTimeout(() => btn.classList.remove("animate-spin"), 600);
                        }
                      }}
                      className="p-2.5 rounded-xl bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10 text-white transition-all cursor-pointer border-none"
                    >
                      <RefreshCw size={15} id="points-refresh-icon" />
                    </button>
                  </div>

                  {/* Points Recharge Presets */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider font-mono">算力积分充值 (Recharge)</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { points: 100, price: 1.00, desc: "标准充值" },
                        { points: 505, price: 5.00, desc: "超值赠送" },
                        { points: 1000, price: 9.90, desc: "推荐限购" },
                        { points: 5000, price: 45.00, desc: "团购优选" }
                      ].map((pkg, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setRechargeAmount(pkg)}
                          className="p-2.5 rounded-xl border border-black/5 dark:border-white/5 bg-slate-50/50 dark:bg-zinc-900/30 hover:bg-slate-100/80 dark:hover:bg-zinc-800 transition-all flex flex-col justify-between text-left cursor-pointer group hover:border-[#5856D6]/30 dark:hover:border-white/20"
                        >
                          <div>
                            <span className="text-xs font-black font-mono text-zinc-800 dark:text-zinc-200 block">+{pkg.points}</span>
                            <span className="text-[9px] text-zinc-400 dark:text-zinc-555 block mt-0.5">{pkg.desc}</span>
                          </div>
                          <span className="text-[10px] font-bold text-[#5856D6] dark:text-white mt-3 block">¥{pkg.price.toFixed(2)}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Points Exchange benefits list */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider font-mono">特权兑换通道 (Redeem Benefits)</label>
                    <div className="space-y-2">
                      {[
                        { id: "vip_30", name: "VIP 尊享卡 30 天", cost: 1000, desc: "获得更长上下文并享有优先响应通道" },
                        { id: "queries_50", name: "50 次 API 特权算力包", cost: 500, desc: "获得 50 次超高速并发多模态查询特权" },
                        { id: "db_expand", name: "数据库无限扩容支持", cost: 800, desc: "解锁云端存储大小限制，全量备份历史对话" }
                      ].map((item, idx) => {
                        const canRedeem = userPoints >= item.cost;
                        return (
                          <div 
                            key={idx}
                            className="p-3 bg-slate-50/50 dark:bg-zinc-900/30 border border-black/5 dark:border-white/5 rounded-2xl flex items-center justify-between gap-3 text-left"
                          >
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block">{item.name}</span>
                              <span className="text-[9px] text-zinc-400 dark:text-zinc-555 block mt-0.5 leading-normal">{item.desc}</span>
                            </div>
                            
                            <div className="shrink-0 flex items-center gap-2">
                              <span className="text-xs font-bold font-mono text-zinc-500 dark:text-zinc-400">{item.cost} 积分</span>
                              <button
                                type="button"
                                disabled={!canRedeem}
                                onClick={() => {
                                  setUserPoints(prev => prev - item.cost);
                                  alert(`兑换成功！已扣除 ${item.cost} 积分，【${item.name}】已激活并绑定当前账号。`);
                                }}
                                className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                                  canRedeem
                                    ? "bg-[#5856D6] text-white hover:bg-opacity-95 shadow-sm border-none"
                                    : "bg-slate-100 dark:bg-zinc-850 text-zinc-400 dark:text-zinc-550 border border-black/5 cursor-not-allowed"
                                }`}
                              >
                                兑换
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Future Expansion Placeholder */}
                  <div className="p-3.5 rounded-2xl bg-slate-50/20 dark:bg-zinc-950/30 border border-dashed border-black/10 dark:border-white/10 text-center text-zinc-400 dark:text-zinc-555">
                    <span className="text-[10px] font-bold block">更多特权正在扩充中...</span>
                    <span className="text-[9px] mt-0.5 block">（即将支持兑换物理交互智能卡片、算力节点代理、实体硬件外壳等，敬请期待）</span>
                  </div>

                </div>
              </div>

              {/* Simulated Payment Modal Overlay (Inside Modal) */}
              <AnimatePresence>
                {rechargeAmount && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#5856D6]/10 dark:bg-white/10 text-[#5856D6] dark:text-white flex items-center justify-center font-bold">
                      <CreditCard size={22} />
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-white">收银台模拟支付</h4>
                      <p className="text-[10px] text-zinc-400 mt-0.5">请扫描下方模拟二维码完成测试支付交易</p>
                    </div>

                    {/* Tech styled Mock QR code box */}
                    <div className="w-36 h-36 bg-slate-50 dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center p-2 relative group overflow-hidden">
                      <div className="w-32 h-32 border-2 border-dashed border-[#5856D6]/40 dark:border-white/30 rounded-xl flex flex-col items-center justify-center p-2 text-zinc-400">
                        {/* Simulation QR Code Pattern */}
                        <div className="grid grid-cols-4 gap-1.5 opacity-60">
                          {Array.from({ length: 16 }).map((_, i) => (
                            <div 
                              key={i} 
                              className={`w-4.5 h-4.5 rounded ${
                                (i * 7 + 13) % 5 === 0 || (i * 3 + 2) % 4 === 0 
                                  ? "bg-[#5856D6] dark:bg-white" 
                                  : "bg-transparent border border-black/5 dark:border-white/5"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[8px] font-bold text-[#5856D6] dark:text-white uppercase tracking-wider font-mono mt-3 select-none">MOCK QR PAY</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">应付金额：¥{rechargeAmount.price.toFixed(2)}</span>
                      <p className="text-[9px] text-zinc-400">购买项目: 充值算力积分 {rechargeAmount.points} Credits</p>
                    </div>

                    <div className="flex gap-3 w-full max-w-[280px] pt-2">
                      <button
                        type="button"
                        onClick={() => setRechargeAmount(null)}
                        className="flex-1 py-2.5 border border-black/10 dark:border-white/10 text-zinc-500 hover:text-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-900 rounded-xl text-[10.5px] font-bold transition-all cursor-pointer bg-transparent"
                      >
                        取消支付
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUserPoints(prev => prev + rechargeAmount.points);
                          setRechargeAmount(null);
                          alert(`充值成功！已成功为当前账号充值 ${rechargeAmount.points} 积分。`);
                        }}
                        className="flex-1 py-2.5 bg-[#5856D6] text-white hover:bg-opacity-95 rounded-xl text-[10.5px] font-bold transition-all shadow-md cursor-pointer border-none"
                      >
                        确认模拟付款
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Card Cabinet Modal */}
      <AnimatePresence>
        {showCardsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-950 border border-black/5 dark:border-white/10 rounded-3xl p-6 w-[760px] h-[480px] max-w-[760px] max-h-[480px] shadow-2xl relative flex flex-col justify-between overflow-hidden select-none font-sans"
            >
              <button 
                type="button" 
                onClick={() => setShowCardsModal(false)}
                className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-900 text-zinc-400 hover:text-zinc-650 transition-all cursor-pointer border-none bg-transparent"
              >
                <X size={16} />
              </button>

              <div className="flex flex-col h-full overflow-hidden">
                {/* Header */}
                <div className="shrink-0 mb-3 text-left">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">智能卡片展示柜</h3>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">管理并查看您在控制中枢达成的各项核心操作成就与等级进阶卡</p>
                </div>

                {/* Display Shelves Area */}
                <div className="flex-grow grid grid-cols-3 gap-5 items-stretch overflow-hidden py-2 text-left">
                  {[
                    {
                      id: "spark",
                      name: "灵识火花",
                      desc: "累积与微内核的对话交互频次",
                      progress: cabinetCards.spark.progress,
                      level: cabinetCards.spark.level,
                      thresholds: [10, 30, 80, 150, 300],
                      levelNames: ["铁皮卡 · 语义余火", "青铜卡 · 逻辑流光", "白银卡 · 智慧潮汐", "黄金卡 · 意识风暴", "陨铁卡 · 混沌晶核"],
                      icon: <Sparkles size={18} />,
                      colors: [
                        "from-zinc-400 to-zinc-600 border-zinc-350 text-zinc-100 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]", // Lv 1
                        "from-amber-600 to-amber-800 border-amber-500 text-amber-50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]", // Lv 2
                        "from-slate-200 to-slate-450 border-slate-200 text-slate-900 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]", // Lv 3
                        "from-yellow-400 via-amber-400 to-yellow-600 border-yellow-350 text-yellow-950 shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)] font-semibold", // Lv 4
                        "from-indigo-600 via-purple-600 to-pink-500 border-indigo-400 text-white shadow-[0_4px_20px_rgba(139,92,246,0.35)]" // Lv 5
                      ]
                    },
                    {
                      id: "credits",
                      name: "金币算力",
                      desc: "当前钱包累计持有的积分算力",
                      progress: cabinetCards.credits.progress,
                      level: cabinetCards.credits.level,
                      thresholds: [1000, 3000, 6000, 10000, 20000],
                      levelNames: ["铁皮卡 · 算力微光", "青铜卡 · 燃料熔炉", "白银卡 · 金色储备", "黄金卡 · 恒星矩阵", "陨铁卡 · 算力主宰"],
                      icon: <Coins size={18} />,
                      colors: [
                        "from-zinc-400 to-zinc-600 border-zinc-350 text-zinc-100 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]",
                        "from-amber-600 to-amber-800 border-amber-500 text-amber-50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]",
                        "from-slate-200 to-slate-450 border-slate-200 text-slate-900 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]",
                        "from-yellow-400 via-amber-400 to-yellow-600 border-yellow-350 text-yellow-950 shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)] font-semibold",
                        "from-cyan-600 via-teal-500 to-emerald-500 border-cyan-400 text-white shadow-[0_4px_20px_rgba(6,182,212,0.35)]"
                      ]
                    },
                    {
                      id: "decisions",
                      name: "决策秘钥",
                      desc: "授权安全沙箱执行指令决策数",
                      progress: cabinetCards.decisions.progress,
                      level: cabinetCards.decisions.level,
                      thresholds: [5, 15, 30, 60, 100],
                      levelNames: ["铁皮卡 · 指令学者", "青铜卡 · 观察专员", "白银卡 · 内核仲裁", "黄金卡 · 主权决断", "陨铁卡 · 内核主宰"],
                      icon: <CreditCard size={18} />,
                      colors: [
                        "from-zinc-400 to-zinc-600 border-zinc-350 text-zinc-100 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]",
                        "from-amber-600 to-amber-800 border-amber-500 text-amber-50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]",
                        "from-slate-200 to-slate-450 border-slate-200 text-slate-900 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]",
                        "from-yellow-400 via-amber-400 to-yellow-600 border-yellow-350 text-yellow-950 shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)] font-semibold",
                        "from-rose-600 via-orange-500 to-yellow-500 border-rose-400 text-white shadow-[0_4px_20px_rgba(244,63,94,0.35)]"
                      ]
                    }
                  ].map((card) => {
                    const currentThreshold = card.thresholds[card.level - 1];
                    const progressPercent = Math.min(100, (card.progress / currentThreshold) * 100);
                    const isMaxLevel = card.level >= 5;
                    const canUpgrade = !isMaxLevel && card.progress >= currentThreshold;
                    const bgClass = card.colors[card.level - 1];
                    const activeLevelName = card.levelNames[card.level - 1];

                    return (
                      <div 
                        key={card.id} 
                        className="bg-slate-50/50 dark:bg-zinc-900/30 border border-black/5 dark:border-white/5 rounded-2xl p-4 flex flex-col justify-between items-stretch hover:shadow-md transition-all duration-300"
                      >
                        {/* 3D-styled metallic Card Graphic */}
                        <motion.div 
                          whileHover={{ y: -8, rotateY: 8, scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 300, damping: 15 }}
                          className={`w-full aspect-[1.58/1] rounded-xl bg-gradient-to-br border p-3 flex flex-col justify-between relative overflow-hidden cursor-pointer select-none ${bgClass}`}
                          style={{ transformStyle: "preserve-3d", perspective: 1000 }}
                        >
                          {/* Inner reflective glare overlay */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/20 pointer-events-none" />
                          
                          {/* Card chip / logo layout */}
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-1.5">
                              <span className="opacity-80">{card.icon}</span>
                              <span className="text-[10px] font-bold tracking-wider font-mono">CC CORE</span>
                            </div>
                            <span className="text-[9px] font-black tracking-widest font-mono bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded">LV.{card.level}</span>
                          </div>

                          {/* Card Name */}
                          <div className="mt-4 text-left">
                            <span className="text-[9px] opacity-70 block font-mono">ACHIEVEMENT LEVEL</span>
                            <span className="text-xs font-black tracking-wide block truncate">{activeLevelName}</span>
                          </div>

                          {/* Card Footer */}
                          <div className="flex justify-between items-end mt-2 pt-2 border-t border-white/10">
                            <span className="text-[8px] font-bold opacity-60 font-mono tracking-wider">COMMAND PILOT</span>
                            <span className="text-[9px] font-mono font-bold tracking-tight">{card.progress.toLocaleString()}</span>
                          </div>
                        </motion.div>

                        {/* Title and details */}
                        <div className="mt-3 space-y-1 text-left flex-grow">
                          <h4 className="text-xs font-bold text-zinc-900 dark:text-white">{card.name}</h4>
                          <p className="text-[9.5px] text-zinc-400 dark:text-zinc-555 leading-relaxed font-sans">{card.desc}</p>
                        </div>

                        {/* Progress and Level Controls */}
                        <div className="mt-4 space-y-2.5">
                          {/* Progress bar */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[9px] font-bold text-zinc-450 dark:text-zinc-500 font-mono">
                              <span>当前进度</span>
                              <span>{card.progress.toLocaleString()} / {isMaxLevel ? "MAX" : currentThreshold.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-slate-200/60 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-[#5856D6] dark:bg-white h-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                            </div>
                          </div>

                          {/* Action Button */}
                          <button
                            type="button"
                            onClick={() => handleUpgradeCard(card.id as any, card.thresholds, card.levelNames, card.level, card.progress, card.name)}
                            className={`w-full py-2 text-[10.5px] font-bold rounded-xl transition-all cursor-pointer ${
                              isMaxLevel 
                                ? "bg-slate-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-555 cursor-not-allowed border border-black/5" 
                                : canUpgrade
                                  ? "bg-[#5856D6] text-white hover:bg-opacity-95 shadow-md border-none animate-pulse"
                                  : "bg-slate-100/60 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5 text-zinc-700 dark:text-zinc-350 hover:bg-[#5856D6]/5 dark:hover:bg-white/5"
                            }`}
                          >
                            {isMaxLevel 
                              ? "卡片已达最高阶" 
                              : canUpgrade 
                                ? "可升级卡片！" 
                                : "200 积分强制进阶"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
