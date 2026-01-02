'use client';

import React from 'react';

type AgentState = 'idle' | 'listening' | 'processing' | 'speaking';

interface ControlPanelProps {
  onInterrupt: () => void;
  onEndCall: () => void;
  agentState: AgentState;
  optimisticState: AgentState;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ onInterrupt, onEndCall, agentState, optimisticState }) => {

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-sm p-5 rounded-2xl border border-white/10">
        <h3 className="font-medium text-gray-300 mb-3 text-lg">Current Status</h3>
        <div className="flex items-center">
          <div className={`w-4 h-4 rounded-full mr-3 ${
            agentState === 'idle' ? 'bg-gray-500' :
            agentState === 'listening' ? 'bg-cyan-500' :
            agentState === 'processing' ? 'bg-violet-500' :
            'bg-cyan-500'
          }`}></div>
          <span className="capitalize text-lg font-medium">
            {optimisticState === 'listening' ? 'Listening (interrupted)' : agentState}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={onInterrupt}
          disabled={agentState === 'listening'}
          className={`w-full py-5 px-6 rounded-2xl font-bold transition-all duration-300 ease-out ${
            agentState === 'listening'
              ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/40 transform hover:-translate-y-0.5'
          }`}
        >
          Interrupt Agent
        </button>

        <button
          onClick={onEndCall}
          className="w-full py-5 px-6 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white rounded-2xl font-bold transition-all duration-300 ease-out shadow-lg shadow-red-500/30 hover:shadow-red-500/40 transform hover:-translate-y-0.5"
        >
          End Call
        </button>
      </div>

      <div className="text-sm text-gray-300 mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
        <p className="mb-3 font-medium">Agent State Durations:</p>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-cyan-900/30 rounded-lg">
            <div className="text-cyan-400 font-bold text-lg">5s</div>
            <div className="text-xs mt-1">Speaking</div>
          </div>
          <div className="text-center p-3 bg-gray-700/30 rounded-lg">
            <div className="text-gray-400 font-bold text-lg">1s</div>
            <div className="text-xs mt-1">Idle</div>
          </div>
          <div className="text-center p-3 bg-violet-900/30 rounded-lg">
            <div className="text-violet-400 font-bold text-lg">3s</div>
            <div className="text-xs mt-1">Listening</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;