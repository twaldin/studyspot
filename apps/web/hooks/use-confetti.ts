import { useCallback } from 'react';
import confetti from 'canvas-confetti';

export function useConfetti() {
  const fireCorrectAnswer = useCallback(() => {
    // Small burst for correct answers
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#16a34a', '#15803d'], // Green colors
    });
  }, []);

  const fireQuizComplete = useCallback(() => {
    // Big celebration for quiz completion
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { 
      startVelocity: 30, 
      spread: 360, 
      ticks: 60, 
      zIndex: 0,
      colors: ['#22c55e', '#16a34a', '#f59e0b', '#eab308', '#3b82f6', '#1d4ed8']
    };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: NodeJS.Timeout = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  }, []);

  const fireFlashcardComplete = useCallback(() => {
    // Medium celebration for flashcard set completion
    confetti({
      particleCount: 100,
      spread: 120,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#1d4ed8', '#1e40af', '#22c55e', '#16a34a'], // Blue and green colors
    });
  }, []);

  return {
    fireCorrectAnswer,
    fireQuizComplete,
    fireFlashcardComplete,
  };
}