import React, { useState, useRef, useEffect } from 'react';
import {
  BotMessageSquare,
  Send,
  Trash2,
  Camera,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  User,
} from 'lucide-react';
import { ActiveTab, ChatMessage, LanguageCode } from '../types';
import { LANGUAGES, t } from '../utils/translations';

interface ChatViewProps {
  currentLang: LanguageCode;
  onNavigate: (tab: ActiveTab) => void;
  initialContext?: string;
}

export const ChatView: React.FC<ChatViewProps> = ({
  currentLang,
  onNavigate,
  initialContext,
}) => {
  const currentLangMeta = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      role: 'doctor',
      text: `Namaste! I am Agri Defence AI, your official digital Plant Doctor.
How can I assist your crop today? You can ask me about:
• Disease identification, blight remedies, and pest control
• Safe organic sprays (Neem oil, bio-fungicides)
• Chemical fungicide dosages and safety guidelines
• Balanced N-P-K fertilization schedules for any crop.

I am ready to help you in ${currentLangMeta.native}!`,
      timestamp: '10:00 AM',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialContext) {
      handleSendMessage(initialContext);
    }
  }, [initialContext]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationHistory: messages.slice(-6),
          language: currentLang,
        }),
      });

      const data = await response.json();

      const doctorMsg: ChatMessage = {
        id: `d-${Date.now()}`,
        role: 'doctor',
        text: data.success ? data.answer : 'Sorry, could not connect to Plant Doctor. Please retry.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, doctorMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `d-${Date.now()}`,
          role: 'doctor',
          text: 'Network issue. Please check connection.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestionChips = [
    { label: 'Tomato Blight remedy', q: 'How do I cure and prevent Tomato Early Blight naturally?' },
    { label: 'Rice yellow leaves solution', q: 'What causes yellow leaves in Rice crops and how to fix it?' },
    { label: 'Organic Neem spray recipe', q: 'How can I prepare organic neem oil spray for aphid control?' },
    { label: 'Potato NPK fertilizer plan', q: 'What is the recommended NPK fertilizer schedule for Potato?' },
  ];

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col rounded-3xl bg-white dark:bg-[#142218] border border-emerald-900/10 dark:border-emerald-800/30 shadow-md overflow-hidden animate-in fade-in duration-200">
      {/* Chat Top Bar */}
      <div className="px-5 py-3.5 border-b border-emerald-900/10 dark:border-emerald-800/30 flex items-center justify-between bg-emerald-50/50 dark:bg-emerald-950/40">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              👨‍⚕️
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#142218]"></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-extrabold text-sm text-emerald-950 dark:text-white">
                Agri Defence AI Plant Doctor
              </h2>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200">
                {currentLangMeta.native}
              </span>
            </div>
            <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400 font-medium">
              Agricultural Pathology, Nutrition & Organic Care
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('scanner')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#121c15] border border-emerald-900/10 dark:border-emerald-800/30 text-xs font-semibold text-emerald-900 dark:text-emerald-200 hover:bg-emerald-50"
          >
            <Camera className="w-3.5 h-3.5 text-emerald-600" />
            <span>Scan Leaf</span>
          </button>

          <button
            onClick={() =>
              setMessages([
                {
                  id: 'm-1',
                  role: 'doctor',
                  text: `Chat cleared. Ask me any plant or crop health question in ${currentLangMeta.native}!`,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ])
            }
            className="p-2 rounded-xl text-emerald-700/80 hover:text-emerald-950 dark:text-emerald-400 hover:bg-emerald-100/50"
            title="Clear Chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Message Feed Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isDoc = msg.role === 'doctor';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isDoc ? 'justify-start' : 'justify-end'}`}
            >
              {isDoc && (
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs shrink-0 font-bold mt-1 shadow-sm">
                  🌱
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-xl rounded-2xl p-4 text-xs sm:text-[13px] leading-relaxed shadow-sm ${
                  isDoc
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-50 border border-emerald-900/10 dark:border-emerald-800/30'
                    : 'bg-emerald-600 text-white font-medium'
                }`}
              >
                <div className="whitespace-pre-line font-normal">{msg.text}</div>
                <div
                  className={`text-[10px] mt-2 font-medium ${
                    isDoc
                      ? 'text-emerald-700/60 dark:text-emerald-400/60 text-right'
                      : 'text-emerald-100/80 text-right'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {!isDoc && (
                <div className="w-8 h-8 rounded-xl bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 flex items-center justify-center text-xs shrink-0 font-bold mt-1">
                  👨‍🌾
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs shrink-0 font-bold">
              🌱
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/50 border border-emerald-900/10 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Plant Doctor is thinking in {currentLangMeta.native}...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Consultation Chips */}
      <div className="px-4 py-2 border-t border-emerald-900/10 dark:border-emerald-800/20 bg-white/50 dark:bg-[#142218]/50 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800/70 dark:text-emerald-400 shrink-0">
          Suggestions:
        </span>
        {suggestionChips.map((chip) => (
          <button
            key={chip.label}
            onClick={() => handleSendMessage(chip.q)}
            className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-900 dark:text-emerald-200 text-[11px] font-medium whitespace-nowrap border border-emerald-900/10 dark:border-emerald-800/30 transition-colors cursor-pointer"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Composer Input Area */}
      <div className="p-3 sm:p-4 border-t border-emerald-900/10 dark:border-emerald-800/30 bg-emerald-50/30 dark:bg-emerald-950/20">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('scanner')}
            className="p-3 rounded-2xl bg-white dark:bg-[#121c15] border border-emerald-900/15 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 shrink-0"
            title="Open Camera Scanner"
          >
            <Camera className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder={`${t('typeMessage', currentLang)} (${currentLangMeta.native})...`}
            className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-2xl bg-white dark:bg-[#121c15] border border-emerald-900/15 dark:border-emerald-800/40 text-emerald-950 dark:text-emerald-50 placeholder:text-emerald-900/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
            className={`p-3 rounded-2xl font-bold flex items-center justify-center shrink-0 transition-all ${
              !inputText.trim() || isLoading
                ? 'bg-emerald-900/20 text-emerald-400/40 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-700/20 cursor-pointer'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
