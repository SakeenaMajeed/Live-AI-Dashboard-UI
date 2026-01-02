'use client';

import { useEffect, useRef } from 'react';

type AgentState = 'idle' | 'listening' | 'processing' | 'speaking';

interface UseAgentSimulatorParams {
  isRunning: boolean;
  setAgentState: (state: AgentState) => void;
  setTranscript: React.Dispatch<React.SetStateAction<{id: number; text: string; isUser: boolean}[]>>;
  setIsRunning: (running: boolean) => void;
  optimisticState: AgentState;
}

const useAgentSimulator = ({
  isRunning,
  setAgentState,
  setTranscript,
  setIsRunning,
  optimisticState
}: UseAgentSimulatorParams) => {
  const cycleIndex = useRef(0);
  const messageCounter = useRef(1);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sample messages for the simulation
  const aiMessages = [
    "Hello! How can I assist you today?",
    "I understand your concern. Let me look into that for you.",
    "Based on the information you've provided, I recommend the following approach.",
    "I've processed your request and have the results ready for you.",
    "Is there anything else you'd like me to help with?",
    "I'm analyzing the data you've shared with me.",
    "I've found some relevant information that might help.",
    "Let me summarize what we've discussed so far.",
    "I'm retrieving the requested information for you.",
    "I've completed the task you assigned to me."
  ];

  const userMessages = [
    "Can you help me with this issue?",
    "What are my options?",
    "I need more information about this topic.",
    "How do I resolve this problem?",
    "Can you explain that in more detail?",
    "What's the next step?",
    "I'm not sure I understand.",
    "Can you provide an example?",
    "What would you recommend?",
    "That's helpful, thank you."
  ];

  // Function to run the simulation cycle
  const runSimulation = () => {
    if (!isRunning) return;

    // Cycle through states: speaking -> idle -> listening -> speaking
    if (cycleIndex.current === 0) { // Speaking state (5 seconds)
      setAgentState('speaking');

      // Add AI message to transcript
      const aiMessage = aiMessages[Math.floor(Math.random() * aiMessages.length)];
      setTranscript(prev => [
        ...prev,
        { id: messageCounter.current++, text: aiMessage, isUser: false }
      ]);

      timeoutRef.current = setTimeout(() => {
        if (isRunning) {
          setAgentState('idle'); // Idle state (1 second)

          timeoutRef.current = setTimeout(() => {
            if (isRunning) {
              setAgentState('listening'); // Listening state (3 seconds)

              // Add user message to transcript
              const userMessage = userMessages[Math.floor(Math.random() * userMessages.length)];
              setTranscript(prev => [
                ...prev,
                { id: messageCounter.current++, text: userMessage, isUser: true }
              ]);

              timeoutRef.current = setTimeout(() => {
                if (isRunning) {
                  cycleIndex.current = 0; // Back to speaking
                  runSimulation(); // Continue the cycle
                }
              }, 3000);
            }
          }, 1000);
        }
      }, 5000);
    } else { // Listening state (when cycleIndex is not 0)
      setAgentState('listening');

      // Add user message to transcript
      const userMessage = userMessages[Math.floor(Math.random() * userMessages.length)];
      setTranscript(prev => [
        ...prev,
        { id: messageCounter.current++, text: userMessage, isUser: true }
      ]);

      timeoutRef.current = setTimeout(() => {
        if (isRunning) {
          setAgentState('idle'); // Idle state (1 second)

          timeoutRef.current = setTimeout(() => {
            if (isRunning) {
              setAgentState('speaking'); // Speaking state (5 seconds)

              // Add AI message to transcript
              const aiMessage = aiMessages[Math.floor(Math.random() * aiMessages.length)];
              setTranscript(prev => [
                ...prev,
                { id: messageCounter.current++, text: aiMessage, isUser: false }
              ]);

              timeoutRef.current = setTimeout(() => {
                if (isRunning) {
                  setAgentState('idle'); // Idle state (1 second)

                  timeoutRef.current = setTimeout(() => {
                    if (isRunning) {
                      cycleIndex.current = 0; // Back to speaking (was 2, changed to 0)
                      runSimulation(); // Continue the cycle
                    }
                  }, 1000);
                }
              }, 5000);
            }
          }, 1000);
        }
      }, 3000);
    }
  };

  useEffect(() => {
    if (!isRunning) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      // When call ends, set agent state to idle
      setAgentState('idle');
      return;
    }

    // Start the simulation cycle
    runSimulation();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isRunning, setAgentState]);

  // Handle interrupt state
  useEffect(() => {
    if (optimisticState === 'listening') {
      // When interrupted, immediately switch to listening state
      setAgentState('listening');
    }
  }, [optimisticState]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
};

export default useAgentSimulator;