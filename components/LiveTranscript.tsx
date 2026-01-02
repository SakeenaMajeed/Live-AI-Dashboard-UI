'use client';

import React, { useEffect, useRef } from 'react';

interface TranscriptMessage {
  id: number;
  text: string;
  isUser: boolean;
}

interface LiveTranscriptProps {
  transcript: TranscriptMessage[];
}

const LiveTranscript: React.FC<LiveTranscriptProps> = ({ transcript }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when transcript updates
  useEffect(() => {
    scrollToBottom();
  }, [transcript]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="h-full overflow-y-auto pr-2">
      <div className="space-y-5">
        {transcript.map((message) => (
          <div
            key={message.id}
            className={`max-w-4xl transition-all duration-300 ease-out ${
              message.isUser
                ? 'ml-auto p-5 rounded-2xl bg-gradient-to-r from-cyan-900/30 to-cyan-800/20 border border-cyan-500/30 backdrop-blur-sm shadow-lg shadow-cyan-500/10'
                : 'mr-auto p-5 rounded-2xl bg-gradient-to-r from-violet-900/30 to-violet-800/20 border border-violet-500/30 backdrop-blur-sm shadow-lg shadow-violet-500/10'
            }`}
          >
            <div className="flex items-start">
              <div className={`w-4 h-4 rounded-full mt-2 mr-4 flex-shrink-0 ${
                message.isUser ? 'bg-cyan-400' : 'bg-violet-400'
              }`}></div>
              <div>
                <p className={`font-bold ${
                  message.isUser ? 'text-cyan-300' : 'text-violet-300'
                }`}>
                  {message.isUser ? 'User:' : 'AI Agent:'}
                </p>
                <p className="mt-2 text-gray-200 leading-relaxed">{message.text}</p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default LiveTranscript;