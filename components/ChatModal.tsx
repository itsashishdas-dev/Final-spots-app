
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Send, Hash, Users, MessageSquare } from 'lucide-react';
import { backend } from '../services/mockBackend';
import { useAppStore } from '../store';
import { ChatMessage } from '../types';
import { playSound } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

interface ChatModalProps {
  onClose: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ onClose }) => {
  const { chatChannel, user } = useAppStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatChannel) {
        loadMessages();
        // Polling for new messages (simulate live)
        const interval = setInterval(loadMessages, 3000);
        return () => clearInterval(interval);
    }
  }, [chatChannel]);

  useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async () => {
      if (!chatChannel) return;
      const msgs = await backend.getChatMessages(chatChannel.id);
      setMessages(msgs);
      setIsLoading(false);
  };

  const handleSend = async () => {
      if (!inputText.trim() || !chatChannel) return;
      
      const text = inputText;
      setInputText('');
      triggerHaptic('light');
      playSound('click');

      await backend.sendChatMessage(chatChannel.id, text);
      await loadMessages();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
          handleSend();
      }
  };

  if (!chatChannel) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-view" onClick={(e) => e.stopPropagation()}>
      
      {/* Container */}
      <div className="w-full max-w-lg h-[80vh] bg-[#080a0f] border-[4px] border-[#1e293b] rounded-[2rem] shadow-2xl relative flex flex-col overflow-hidden font-mono ring-1 ring-black/50">
        
        {/* Screws */}
        <div className="absolute top-3 left-3 w-2 h-2 bg-[#334155] rounded-full z-20"><div className="w-1.5 h-0.5 bg-[#0f172a] rotate-45 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" /></div>
        <div className="absolute top-3 right-3 w-2 h-2 bg-[#334155] rounded-full z-20"><div className="w-1.5 h-0.5 bg-[#0f172a] rotate-45 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" /></div>
        <div className="absolute bottom-3 left-3 w-2 h-2 bg-[#334155] rounded-full z-20"><div className="w-1.5 h-0.5 bg-[#0f172a] rotate-45 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" /></div>
        <div className="absolute bottom-3 right-3 w-2 h-2 bg-[#334155] rounded-full z-20"><div className="w-1.5 h-0.5 bg-[#0f172a] rotate-45 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" /></div>

        {/* Header */}
        <div className="p-4 pt-6 border-b-2 border-[#1e293b] flex items-center justify-between shrink-0 bg-[#080a0f] relative z-10">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#1e293b] border border-[#334155] flex items-center justify-center text-indigo-400 shadow-inner">
                    <Hash size={20} />
                </div>
                <div>
                    <h3 className="text-sm font-black uppercase italic text-white tracking-wide font-sans">{chatChannel.title}</h3>
                    <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"/> Live Comms
                    </p>
                </div>
            </div>
            <button 
                onClick={onClose} 
                className="w-10 h-10 rounded-lg bg-[#1e293b] text-slate-400 border border-[#334155] flex items-center justify-center hover:text-white transition-colors active:scale-95 shadow-md"
            >
                <X size={20} />
            </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#080a0f] relative z-10">
            {messages.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center h-full text-slate-600 space-y-2 opacity-50">
                    <MessageSquare size={32} />
                    <span className="text-[10px] font-mono uppercase tracking-widest">No transmissions yet.</span>
                </div>
            )}
            
            {messages.map((msg) => {
                const isMe = msg.userId === user?.id;
                return (
                    <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%] ${isMe ? 'ml-auto' : 'mr-auto'}`}>
                        <div className="flex items-center gap-2 mb-1">
                            {!isMe && <span className="text-[9px] font-bold text-slate-400 uppercase">{msg.userName}</span>}
                            <span className="text-[8px] font-mono text-slate-600">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <div className={`p-3 rounded-2xl text-xs font-medium leading-relaxed shadow-lg border ${
                            isMe 
                            ? 'bg-indigo-600 text-white border-indigo-500 rounded-tr-sm' 
                            : 'bg-[#1e293b] text-slate-200 border-[#334155] rounded-tl-sm'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                );
            })}
            <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-[#080a0f] border-t-2 border-[#1e293b] shrink-0 relative z-10">
            <div className="flex gap-2 items-center bg-[#0f1218] rounded-xl px-4 py-1 border border-[#1e293b] focus-within:border-indigo-500/50 transition-colors shadow-inner">
                <span className="text-indigo-500 font-mono text-xs">{'>'}</span>
                <input 
                    className="flex-1 bg-transparent text-sm text-white focus:outline-none py-3 placeholder:text-slate-600 font-mono" 
                    placeholder="ENTER MESSAGE..." 
                    value={inputText} 
                    onChange={e => setInputText(e.target.value)} 
                    onKeyDown={handleKeyDown} 
                />
                <button 
                    onClick={handleSend} 
                    disabled={!inputText.trim()} 
                    className="p-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 active:scale-95 transition-transform"
                >
                    <Send size={14} />
                </button>
            </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ChatModal;
