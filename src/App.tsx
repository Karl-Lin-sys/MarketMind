/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import CampaignGenerator from './components/CampaignGenerator';
import Chatbot from './components/Chatbot';

export default function App() {
  return (
    <div className="min-h-screen bg-stone-100 p-4 md:p-8 font-sans">
      <div className="max-w-[1600px] mx-auto h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)] flex flex-col">
        <header className="mb-6 flex-shrink-0">
          <h1 className="text-2xl md:text-3xl font-bold text-stone-900 tracking-tight">MarketMind</h1>
          <p className="text-stone-500 text-sm md:text-base">AI-Powered Email Marketing & Strategy</p>
        </header>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
          <div className="lg:col-span-2 h-full min-h-0">
            <CampaignGenerator />
          </div>
          <div className="h-full min-h-0">
            <Chatbot />
          </div>
        </div>
      </div>
    </div>
  );
}
