import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmojiReactionsProps {
  submissionId: string;
  onReaction?: (emoji: string, submissionId: string) => void;
}

const EmojiReactions = ({ submissionId, onReaction }: EmojiReactionsProps) => {
  const [reactions, setReactions] = useState<Record<string, number>>({
    '🔥': 0,
    '😂': 0,
    '🎉': 0,
    '😍': 0,
  });
  
  const [userReaction, setUserReaction] = useState<string | null>(null);

  const handleReaction = (emoji: string) => {
    const newReactions = { ...reactions };
    
    // Remove previous reaction
    if (userReaction) {
      newReactions[userReaction] = Math.max(0, newReactions[userReaction] - 1);
    }
    
    // Add new reaction
    if (userReaction !== emoji) {
      newReactions[emoji] = newReactions[emoji] + 1;
      setUserReaction(emoji);
    } else {
      setUserReaction(null);
    }
    
    setReactions(newReactions);
    onReaction?.(emoji, submissionId);
  };

  return (
    <div className="flex justify-center items-center gap-2 p-2 bg-black/20 rounded-lg backdrop-blur-sm">
      {Object.entries(reactions).map(([emoji, count]) => (
        <Button
          key={emoji}
          variant="ghost"
          size="sm"
          onClick={() => handleReaction(emoji)}
          className={cn(
            "text-2xl hover:scale-125 transition-all duration-300 hover:bg-yellow-400/20",
            userReaction === emoji && "bg-yellow-400/30 scale-110"
          )}
        >
          <span className="mr-1">{emoji}</span>
          {count > 0 && (
            <span className="text-xs bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 min-w-[20px]">
              {count}
            </span>
          )}
        </Button>
      ))}
    </div>
  );
};

export default EmojiReactions;