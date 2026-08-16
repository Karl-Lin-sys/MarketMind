import React, { useState, useRef, useEffect } from 'react';
import { Complexity, ChatMessage } from '../types';
import { Bot, Send, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function Chatbot() {
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [role, setRole] = useState('You are an expert marketing assistant.');
  const [complexity, setComplexity] = useState<Complexity>('general');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const send = async () => {
    if (!message.trim()) return;
    
    const userMessage = message;
    setMessage('');
    setHistory(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history,
          message: userMessage,
          role,
          complexity
        })
      });
      if (!res.ok) throw new Error('Chat failed');
      const data = await res.json();
      
      setHistory(prev => [...prev, { role: 'model', text: data.text }]);
    } catch (err: any) {
      console.error(err);
      setHistory(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-stone-200 bg-stone-50 flex flex-col gap-4">
        <h2 className="text-lg font-medium text-stone-900 flex items-center gap-2">
          <Bot className="w-5 h-5 text-emerald-500" />
          AI Assistant
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={role}
              onChange={e => setRole(e.target.value)}
              placeholder="System Role (e.g. Marketing Assistant)"
              className="w-full text-sm px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <select
            value={complexity}
            onChange={e => setComplexity(e.target.value as Complexity)}
            className="bg-white border border-stone-200 text-stone-700 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2 outline-none"
          >
            <option value="fast">Fast (Flash Lite)</option>
            <option value="general">General (Flash)</option>
            <option value="complex">Complex (Pro)</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {history.length === 0 && (
          <div className="h-full flex items-center justify-center text-stone-400 text-sm text-center px-4">
            Start a conversation with your customized AI assistant.
          </div>
        )}
        {history.map((msg, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-stone-900 text-white rounded-br-none' 
                : 'bg-stone-100 text-stone-800 rounded-bl-none'
            }`}>
              {msg.text.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i !== msg.text.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        ))}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-stone-100 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-stone-400" />
              <span className="text-sm text-stone-400">Thinking...</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-stone-200 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Ask a question..."
            className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-colors"
          />
          <button
            onClick={send}
            disabled={loading || !message.trim()}
            className="bg-emerald-500 text-white p-2.5 rounded-xl hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
