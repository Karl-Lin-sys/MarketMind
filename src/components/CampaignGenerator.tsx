import React, { useState } from 'react';
import { ImageSize, EmailCampaign } from '../types';
import { Loader2, Image as ImageIcon, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CampaignGenerator() {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<ImageSize>('1K');
  const [loading, setLoading] = useState(false);
  const [campaign, setCampaign] = useState<EmailCampaign | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState('');

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');
    
    try {
      // 1. Generate text campaign
      const textRes = await fetch('/api/generate-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      if (!textRes.ok) throw new Error('Failed to generate text');
      const textData = await textRes.json();
      setCampaign(textData);

      // 2. Generate image
      const imgRes = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, size })
      });
      if (!imgRes.ok) throw new Error('Failed to generate image');
      const imgData = await imgRes.json();
      setImageUrl(imgData.imageUrl);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-stone-50 rounded-xl border border-stone-200">
      <div className="p-6 border-b border-stone-200 bg-white">
        <h2 className="text-xl font-medium text-stone-900 flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          Campaign Generator
        </h2>
        <div className="flex flex-col gap-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your email campaign (e.g., Summer sale for new sneakers, 20% off)"
            className="w-full h-24 p-4 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none transition-colors"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-stone-500 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4" /> Image Size
              </span>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value as ImageSize)}
                className="bg-white border border-stone-200 text-stone-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 outline-none"
              >
                <option value="1K">1K (Standard)</option>
                <option value="2K">2K (High Res)</option>
                <option value="4K">4K (Ultra Res)</option>
              </select>
            </div>
            <button
              onClick={generate}
              disabled={loading || !prompt.trim()}
              className="bg-stone-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all active:scale-95"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {loading ? 'Generating...' : 'Generate Campaign'}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          {!campaign && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex items-center justify-center text-stone-400"
            >
              Describe a campaign above to generate content and visuals.
            </motion.div>
          )}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center text-stone-400 gap-4"
            >
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              <p>Crafting your campaign...</p>
            </motion.div>
          )}
          {campaign && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-stone-100"
            >
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-400 block mb-2">Subject Line</label>
                <h3 className="text-2xl font-bold text-stone-900">{campaign.subject}</h3>
              </div>
              
              {imageUrl && (
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-400 block mb-3">Hero Image</label>
                  <img src={imageUrl} alt="Campaign Visual" className="w-full rounded-xl object-cover shadow-sm border border-stone-100" />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-400 block mb-2">Body Copy</label>
                <div className="prose prose-stone max-w-none">
                  {campaign.body.split('\n').map((paragraph, idx) => (
                    <p key={idx} className="text-stone-700 leading-relaxed min-h-[1.5rem]">{paragraph}</p>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
