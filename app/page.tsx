'use client';

import React, { useState, useOptimistic } from 'react';
import AudioVisualizer from '@/components/AudioVisualizer';
import LiveTranscript from '@/components/LiveTranscript';
import ControlPanel from '@/components/ControlPanel';
import useAgentSimulator from '@/hooks/useAgentSimulator';

export type AgentState = 'idle' | 'listening' | 'processing' | 'speaking';

export default function LiveAIDashboard() {
  const [agentState, setAgentState] = useState<AgentState>('idle');
  const [transcript, setTranscript] = useState<{ id: number; text: string; isUser: boolean }[]>([]);
  const [isRunning, setIsRunning] = useState(true);
  const [optimisticState, setOptimisticState] = useOptimistic<AgentState, AgentState>(
    agentState,
    (state, newState) => newState
  );

  useAgentSimulator({
    isRunning,
    setAgentState,
    setTranscript,
    setIsRunning,
    optimisticState: agentState // Pass the actual agent state, not the optimistic one
  });

  const handleInterrupt = () => {
    setOptimisticState('listening');
    setAgentState('listening');

    // Add user message to transcript when interrupted
    setTranscript(prev => [
      ...prev,
      { id: Date.now(), text: "I need to interrupt you for a moment.", isUser: true }
    ]);
  };


  const handleEndCall = () => {
    setIsRunning(false);
    setAgentState('idle');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center">
          <div className="inline-block relative">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-violet-500 to-cyan-400 bg-clip-text text-transparent mb-4 py-2 relative z-10">
              Live AI Dashboard
            </h1>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-violet-500 to-cyan-400 blur-xl opacity-30 -z-10 rounded-full"></div>
          </div>
          <p className="text-gray-400 text-xl mt-4">Real-time AI agent interaction interface</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Visualizer Section */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl transition-all duration-300 ease-out hover:shadow-2xl hover:shadow-cyan-500/10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl md:text-2xl font-semibold">Audio Visualizer</h2>
              <span className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ease-out ${
                agentState === 'idle' ? 'bg-gray-800/50 text-gray-300' :
                agentState === 'listening' ? 'bg-cyan-900/50 text-cyan-300' :
                agentState === 'processing' ? 'bg-violet-900/50 text-violet-300' :
                'bg-cyan-900/50 text-cyan-300'
              }`}>
                {agentState.charAt(0).toUpperCase() + agentState.slice(1)}
              </span>
            </div>
            <div className="h-64 md:h-80 flex items-center justify-center">
              <AudioVisualizer state={agentState} />
            </div>
          </div>

          {/* Control Panel */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl transition-all duration-300 ease-out hover:shadow-2xl hover:shadow-violet-500/10">
            <h2 className="text-xl md:text-2xl font-semibold mb-4">Controls</h2>
            <ControlPanel
              onInterrupt={handleInterrupt}
              onEndCall={handleEndCall}
              agentState={agentState}
              optimisticState={optimisticState}
            />
          </div>

          {/* Transcript Section */}
          <div className="lg:col-span-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl transition-all duration-300 ease-out hover:shadow-2xl hover:shadow-cyan-500/10">
            <h2 className="text-xl md:text-2xl font-semibold mb-4">Live Transcript</h2>
            <div className="h-64 md:h-80 overflow-y-auto">
              <LiveTranscript transcript={transcript} />
            </div>
          </div>
        </div>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>Voice AI Platform • Secure & Encrypted Communication</p>
        </footer>
      </div>
    </div>
  );
}