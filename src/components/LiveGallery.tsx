import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import ScrollingTicker from '@/components/ScrollingTicker';
import EmojiReactions from '@/components/EmojiReactions';
import { Share2, Sparkles, Music, Mic, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Submission {
  id: string;
  type: 'photo' | 'video';
  data: string;
  overlay?: string;
  filter?: string;
  nickname: string;
  eventType: string;
  caption: string;
  socialConsent: boolean;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
}

const floatingEmojis = ['🎤', '🎶', '✨', '💃', '🎉', '🔥', '💖', '⭐', '🌟', '🥳'];

const LiveGallery = () => {
  const [approvedSubmissions, setApprovedSubmissions] = useState<Submission[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [showSpotlight, setShowSpotlight] = useState(false);
  const [confettiEmojis, setConfettiEmojis] = useState<{ emoji: string; x: number; delay: number; id: number }[]>([]);
  const { toast } = useToast();

  const loadApprovedSubmissions = useCallback(() => {
    const stored = localStorage.getItem('singshot_gallery');
    if (stored) {
      setApprovedSubmissions(JSON.parse(stored));
    }
  }, []);

  // Auto-advance slideshow
  useEffect(() => {
    if (approvedSubmissions.length === 0) return;
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % approvedSubmissions.length);
        setIsVisible(true);
        // Burst confetti on each slide
        burstConfetti();
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, [approvedSubmissions.length]);

  useEffect(() => {
    loadApprovedSubmissions();
    const interval = setInterval(loadApprovedSubmissions, 5000);
    return () => clearInterval(interval);
  }, [loadApprovedSubmissions]);

  useEffect(() => {
    const spotlightInterval = setInterval(() => {
      if (approvedSubmissions.length > 0) {
        setShowSpotlight(true);
        setTimeout(() => setShowSpotlight(false), 5000);
      }
    }, 30000);
    return () => clearInterval(spotlightInterval);
  }, [approvedSubmissions.length]);

  const burstConfetti = () => {
    const newEmojis = Array.from({ length: 12 }, (_, i) => ({
      emoji: floatingEmojis[Math.floor(Math.random() * floatingEmojis.length)],
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      id: Date.now() + i,
    }));
    setConfettiEmojis(newEmojis);
    setTimeout(() => setConfettiEmojis([]), 3000);
  };

  const handleShare = useCallback(async () => {
    try {
      await navigator.share({
        title: 'SingShot Live - Hen Party Magic! 🎤',
        text: 'Check out this amazing karaoke hen party at @LondonKaraokeClub! #HenDoLegends #SingShot',
        url: window.location.href,
      });
    } catch {
      await navigator.clipboard.writeText(`SingShot Live - Amazing hen party karaoke! ${window.location.href} #HenDoLegends @LondonKaraokeClub`);
      toast({ title: "Link copied! 📋", description: "Share it on Instagram & tag us for prizes!" });
    }
  }, [toast]);

  if (approvedSubmissions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
        {/* Floating background emojis */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {floatingEmojis.map((emoji, i) => (
            <span
              key={i}
              className="absolute text-4xl opacity-20 animate-bounce"
              style={{
                left: `${(i * 10) % 100}%`,
                top: `${(i * 13 + 10) % 90}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${2 + (i % 3)}s`,
              }}
            >
              {emoji}
            </span>
          ))}
        </div>

        <ScrollingTicker />
        
        <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
          <div className="text-center space-y-6 max-w-md">
            <div className="relative inline-block">
              <Mic className="w-24 h-24 text-primary mx-auto animate-bounce" />
              <Sparkles className="w-10 h-10 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
              <Star className="w-8 h-8 text-accent absolute -bottom-1 -left-3 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tight">
              SingShot <span className="text-primary">Live</span>
            </h1>
            <p className="text-2xl text-primary font-bold animate-pulse">
              🎤 Hen Party Magic Coming Soon! 🎤
            </p>
            <p className="text-muted-foreground text-lg">
              Capture your karaoke moments & they'll appear here instantly!
            </p>
            <Button
              onClick={handleShare}
              className="btn-neon text-primary-foreground font-bold text-lg py-6 px-8 mt-4"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share & Win Prizes! 🏆
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentSubmission = approvedSubmissions[currentIndex];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Confetti burst */}
      {confettiEmojis.map(({ emoji, x, delay, id }) => (
        <span
          key={id}
          className="absolute text-3xl md:text-5xl pointer-events-none z-50 animate-confetti-fall"
          style={{
            left: `${x}%`,
            top: '-5%',
            animationDelay: `${delay}s`,
          }}
        >
          {emoji}
        </span>
      ))}

      <ScrollingTicker />

      {/* Fullscreen gallery */}
      <div className="relative z-10 flex flex-col min-h-[calc(100vh-3rem)]">
        {/* Header overlay */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-background/90 to-transparent p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-foreground">
                SingShot <span className="text-primary">Live</span>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
                <span className="text-destructive font-bold text-sm">LIVE</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground text-sm">{approvedSubmissions.length} moments</span>
              </div>
            </div>
            <Button onClick={handleShare} variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <Share2 className="w-4 h-4 mr-1" /> Share
            </Button>
          </div>
        </div>

        {/* Main media */}
        <div className={`relative w-full flex-1 transition-all duration-700 ease-out ${showSpotlight ? 'scale-[1.02]' : ''}`}>
          <div className={`absolute inset-0 transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            {currentSubmission.type === 'photo' ? (
              <img src={currentSubmission.data} alt="SingShot moment" className="w-full h-full object-cover" />
            ) : (
              <video src={currentSubmission.data} autoPlay muted loop className="w-full h-full object-cover" />
            )}
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            
            {/* Bottom content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <div className="mb-4">
                <EmojiReactions 
                  submissionId={currentSubmission.id}
                  onReaction={(emoji) => {
                    toast({ title: `${emoji} reaction added!`, description: `You reacted to ${currentSubmission.nickname}'s SingShot` });
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Music className="w-6 h-6 text-primary animate-pulse" />
                  <h2 className="text-3xl md:text-5xl font-black text-foreground">{currentSubmission.nickname}</h2>
                </div>
                <p className="text-xl md:text-2xl text-primary font-bold">{currentSubmission.eventType}</p>
                {currentSubmission.caption && (
                  <p className="text-base md:text-lg text-foreground/90 bg-card/60 rounded-xl p-3 backdrop-blur-md border border-primary/20 max-w-lg">
                    "{currentSubmission.caption}"
                  </p>
                )}
              </div>
            </div>

            {/* Spotlight party effects */}
            {showSpotlight && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 text-6xl md:text-8xl animate-ping">🎉</div>
                <div className="absolute top-1/3 right-1/4 text-5xl md:text-7xl animate-bounce" style={{ animationDelay: '0.3s' }}>✨</div>
                <div className="absolute bottom-1/3 left-1/3 text-5xl md:text-7xl animate-ping" style={{ animationDelay: '0.6s' }}>🎊</div>
                <div className="absolute top-1/2 right-1/3 text-4xl md:text-6xl animate-bounce" style={{ animationDelay: '0.9s' }}>💃</div>
              </div>
            )}
          </div>
        </div>

        {/* Progress dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {approvedSubmissions.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-500 ${
                index === currentIndex ? 'w-10 bg-primary shadow-[0_0_10px_hsl(var(--primary))]' : 'w-2 bg-muted-foreground/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveGallery;
