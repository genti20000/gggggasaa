import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import ScrollingTicker from '@/components/ScrollingTicker';
import HenDoLeaderboard from '@/components/HenDoLeaderboard';
import EmojiReactions from '@/components/EmojiReactions';
import { Share2, Sparkles, Zap } from 'lucide-react';
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

const LiveGallery = () => {
  const [approvedSubmissions, setApprovedSubmissions] = useState<Submission[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [showSpotlight, setShowSpotlight] = useState(false);
  const { toast } = useToast();

  // Load approved submissions from localStorage
  const loadApprovedSubmissions = useCallback(() => {
    const stored = localStorage.getItem('singshot_gallery');
    if (stored) {
      const parsed = JSON.parse(stored);
      setApprovedSubmissions(parsed);
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
      }, 500);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [approvedSubmissions.length]);

  // Poll for new submissions every 5 seconds
  useEffect(() => {
    loadApprovedSubmissions();
    const interval = setInterval(loadApprovedSubmissions, 5000);
    return () => clearInterval(interval);
  }, [loadApprovedSubmissions]);

  // Random spotlight effect
  useEffect(() => {
    const spotlightInterval = setInterval(() => {
      if (approvedSubmissions.length > 0) {
        setShowSpotlight(true);
        setTimeout(() => setShowSpotlight(false), 5000);
      }
    }, 60000); // Every minute

    return () => clearInterval(spotlightInterval);
  }, [approvedSubmissions.length]);

  const handleShare = useCallback(async () => {
    try {
      await navigator.share({
        title: 'SingShot Live - Hen Party Magic! 🎤',
        text: 'Check out this amazing karaoke hen party at @LondonKaraokeClub! #HenDoLegends #SingShot',
        url: window.location.href,
      });
    } catch (error) {
      await navigator.clipboard.writeText(`SingShot Live - Amazing hen party karaoke! Check it out: ${window.location.href} #HenDoLegends @LondonKaraokeClub`);
      toast({
        title: "Link copied! 📋",
        description: "Share it on Instagram & tag us for prizes!",
      });
    }
  }, [toast]);

  if (approvedSubmissions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-primary/20 to-yellow-400/20 flex flex-col">
        <ScrollingTicker />
        
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="text-center space-y-6 max-w-md">
            <div className="animate-pulse">
              <Sparkles className="w-24 h-24 text-yellow-400 mx-auto mb-4" />
            </div>
            <h1 className="text-6xl font-bold text-white mb-4 animate-bounce">
              SingShot Live
            </h1>
            <p className="text-xl text-yellow-400 font-semibold animate-pulse">
              🎤 Hen Party Magic Coming Soon! 🎤
            </p>
            <p className="text-white/80">
              Capture your karaoke moments & they'll appear here instantly!
            </p>
            
            <div className="mt-8">
              <HenDoLeaderboard />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentSubmission = approvedSubmissions[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-primary/10 to-yellow-400/10 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="animate-pulse absolute top-10 left-10 w-32 h-32 bg-yellow-400/30 rounded-full blur-xl"></div>
        <div className="animate-pulse absolute bottom-20 right-20 w-48 h-48 bg-primary/30 rounded-full blur-2xl animation-delay-2000"></div>
        <div className="animate-bounce absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-400/40 rounded-full blur-lg animation-delay-4000"></div>
      </div>

      <ScrollingTicker />

      {/* Main content */}
      <div className="relative z-10 flex flex-col lg:flex-row min-h-[calc(100vh-3rem)]">
        {/* Left side - Gallery */}
        <div className="flex-1 lg:w-2/3 relative">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">SingShot Live</h1>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-400 font-semibold">LIVE</span>
                  <span className="text-white/70">•</span>
                  <span className="text-white/70">{approvedSubmissions.length} moments</span>
                </div>
              </div>
            </div>
          </div>

          {/* Current submission with spotlight effect */}
          <div className={`relative w-full h-screen transition-all duration-500 ${showSpotlight ? 'scale-105 brightness-125' : ''}`}>
            <div className={`absolute inset-0 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              {currentSubmission.type === 'photo' ? (
                <img
                  src={currentSubmission.data}
                  alt="SingShot moment"
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={currentSubmission.data}
                  autoPlay
                  muted
                  loop
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="mb-6">
                  <EmojiReactions 
                    submissionId={currentSubmission.id}
                    onReaction={(emoji, id) => {
                      toast({
                        title: `${emoji} reaction added!`,
                        description: `You reacted to ${currentSubmission.nickname}'s SingShot`,
                      });
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold animate-bounce">{currentSubmission.nickname}</h2>
                  <p className="text-xl text-yellow-400 font-semibold">{currentSubmission.eventType}</p>
                  {currentSubmission.caption && (
                    <p className="text-lg text-white/90 bg-black/30 rounded-lg p-3 backdrop-blur-sm">
                      "{currentSubmission.caption}"
                    </p>
                  )}
                </div>
              </div>

              {/* Confetti effect for new submissions */}
              {showSpotlight && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="animate-pulse absolute top-1/4 left-1/4 text-6xl">🎉</div>
                  <div className="animate-bounce absolute top-1/3 right-1/4 text-4xl animation-delay-1000">✨</div>
                  <div className="animate-pulse absolute bottom-1/4 left-1/3 text-5xl animation-delay-2000">🎊</div>
                </div>
              )}
            </div>
          </div>

          {/* Progress indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
            {approvedSubmissions.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'w-8 bg-yellow-400' : 'w-2 bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right side - Leaderboard */}
        <div className="lg:w-1/3 p-6 bg-black/50 backdrop-blur-lg">
          <HenDoLeaderboard />
          
          {/* Share button prominently placed */}
          <div className="mt-8 space-y-4">
            <Button
              onClick={handleShare}
              className="w-full bg-gradient-to-r from-primary via-yellow-400 to-primary text-black font-bold text-lg py-6 hover:scale-105 transition-all duration-300 animate-pulse"
            >
              <Share2 className="w-6 h-6 mr-2" />
              Share SingShot Live & Win Prizes! 🏆
            </Button>
            
            <p className="text-center text-xs text-white/70">
              Tag @LondonKaraokeClub & #HenDoLegends for FREE SHOTS! 🥃
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveGallery;