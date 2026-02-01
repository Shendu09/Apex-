import { useState, useEffect, useCallback } from 'react';

const useWakeWord = (transcript, wakeWords = ['hey tomme', 'hey tommy', 'hey tom']) => {
  const [isWakeWordDetected, setIsWakeWordDetected] = useState(false);
  const [lastDetectionTime, setLastDetectionTime] = useState(null);

  const detectWakeWord = useCallback((text) => {
    const normalizedText = text.toLowerCase().trim();
    
    return wakeWords.some(wakeWord => {
      const wakeWordNormalized = wakeWord.toLowerCase();
      return normalizedText.includes(wakeWordNormalized);
    });
  }, [wakeWords]);

  useEffect(() => {
    if (transcript) {
      const detected = detectWakeWord(transcript);
      
      if (detected) {
        setIsWakeWordDetected(true);
        setLastDetectionTime(Date.now());
      }
    }
  }, [transcript, detectWakeWord]);

  const resetWakeWord = useCallback(() => {
    setIsWakeWordDetected(false);
  }, []);

  const extractCommandAfterWakeWord = useCallback((text) => {
    const normalizedText = text.toLowerCase().trim();
    
    for (const wakeWord of wakeWords) {
      const wakeWordNormalized = wakeWord.toLowerCase();
      const index = normalizedText.indexOf(wakeWordNormalized);
      
      if (index !== -1) {
        const command = text.substring(index + wakeWord.length).trim();
        return command;
      }
    }
    
    return text;
  }, [wakeWords]);

  return {
    isWakeWordDetected,
    lastDetectionTime,
    resetWakeWord,
    extractCommandAfterWakeWord
  };
};

export default useWakeWord;
