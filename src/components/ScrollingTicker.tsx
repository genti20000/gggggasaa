import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface TickerMessage {
  id: string;
  text: string;
  priority?: 'normal' | 'high';
}

const ScrollingTicker = () => {
  const [messages] = useState<TickerMessage[]>([
    { id: '1', text: '🎉 Jessica is crushing "Wannabe"! Absolute legend!' },
    { id: '2', text: '📸 New SingShot from Chloe - check it out!' },
    { id: '3', text: '🏆 Tag @LondonKaraokeClub & win FREE SHOTS!' },
    { id: '4', text: '💫 Next up: More hen party magic!' },
    { id: '5', text: '🎤 #HenDoLegends trending tonight!' },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="w-full bg-gradient-to-r from-primary via-yellow-400 to-primary overflow-hidden h-12 flex items-center">
      <div className="animate-marquee whitespace-nowrap">
        <span className="text-black font-bold text-lg px-8 animate-pulse">
          {messages[currentIndex]?.text}
        </span>
      </div>
    </div>
  );
};

export default ScrollingTicker;