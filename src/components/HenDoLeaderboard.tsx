import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Trophy, Star } from 'lucide-react';

interface LeaderboardEntry {
  nickname: string;
  votes: number;
  songCount: number;
  rank: number;
}

const HenDoLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    { nickname: 'Jessica W.', votes: 15, songCount: 3, rank: 1 },
    { nickname: 'Danielle S.', votes: 12, songCount: 2, rank: 2 },
    { nickname: 'Chloe K.', votes: 10, songCount: 2, rank: 3 },
    { nickname: 'Sophie M.', votes: 8, songCount: 1, rank: 4 },
    { nickname: 'Emma R.', votes: 6, songCount: 1, rank: 5 },
  ]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Trophy className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Star className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-primary">#{rank}</span>;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 border-yellow-400/30";
      case 2:
        return "bg-gradient-to-r from-gray-300/20 to-gray-500/20 border-gray-400/30";
      case 3:
        return "bg-gradient-to-r from-amber-400/20 to-amber-600/20 border-amber-500/30";
      default:
        return "bg-primary/5 border-primary/20";
    }
  };

  return (
    <Card className="bg-gradient-to-br from-background via-background to-primary/5 border-2 border-primary/20">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold text-gradient bg-gradient-to-r from-primary to-yellow-400 bg-clip-text text-transparent flex items-center justify-center gap-2">
          <Crown className="w-6 h-6 text-yellow-400" />
          Hen Do Legend Leaderboard
          <Crown className="w-6 h-6 text-yellow-400" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {leaderboard.map((entry) => (
          <div
            key={entry.nickname}
            className={`flex items-center gap-4 p-3 rounded-lg border transition-all duration-300 hover:scale-105 ${getRankStyle(entry.rank)}`}
          >
            <div className="flex items-center gap-2 min-w-[60px]">
              {getRankIcon(entry.rank)}
              <span className="font-bold text-lg">#{entry.rank}</span>
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-lg">{entry.nickname}</h3>
              <p className="text-sm text-muted-foreground">
                {entry.songCount} SingShot{entry.songCount !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="text-right">
              <Badge variant="secondary" className="bg-primary/20 text-primary font-bold">
                🔥 {entry.votes} votes
              </Badge>
            </div>
          </div>
        ))}
        
        <div className="text-center pt-4 border-t border-primary/20">
          <p className="text-sm text-muted-foreground">
            Vote with emoji reactions! 🔥😂🎉😍
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HenDoLeaderboard;