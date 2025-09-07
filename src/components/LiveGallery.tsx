import { useState, useEffect, useCallback } from 'react';
import { Sparkles, Heart, Users, Share2 } from 'lucide-react';

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

  if (approvedSubmissions.length === 0) {
    return (
      <div className="min-h-screen bg-background sparkle-bg flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary via-secondary to-accent p-1 shadow-[0_0_60px_hsl(280_100%_60%/0.4)]">
            <div className="w-full h-full rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-primary animate-pulse" />
            </div>
          </div>
          
          <h1 className="text-4xl font-black text-gradient-party mb-4">
            SingShot Live
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Waiting for amazing karaoke moments...
          </p>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Users className="w-5 h-5" />
            <span>Create your first SingShot to get started!</span>
          </div>
        </div>
      </div>
    );
  }

  const currentSubmission = approvedSubmissions[currentIndex];

  return (
    <div className="min-h-screen bg-background sparkle-bg flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gradient">SingShot Live</h1>
              <p className="text-sm text-muted-foreground">London Karaoke Club</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
              <span>LIVE</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {approvedSubmissions.length} moments shared tonight
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex items-center justify-center p-6 pt-24 transition-all duration-500 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}>
        <div className="max-w-4xl w-full">
          {/* Media Display */}
          <div className="relative mb-8">
            <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_60px_hsl(280_100%_60%/0.3)] bg-card border border-primary/30">
              {currentSubmission.type === 'photo' ? (
                <img
                  src={currentSubmission.data}
                  alt={`${currentSubmission.nickname}'s karaoke moment`}
                  className="w-full h-screen object-cover"
                />
              ) : (
                <video
                  key={currentSubmission.id}
                  src={currentSubmission.data}
                  className="w-full h-screen object-cover"
                  autoPlay
                  muted
                  loop
                />
              )}
              
              {/* Overlay gradient for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-accent fill-current" />
                      <span className="font-bold text-xl text-white">{currentSubmission.nickname}</span>
                    </div>
                    <div className="px-3 py-1 bg-primary/80 backdrop-blur-sm rounded-full text-primary-foreground text-sm font-medium">
                      {currentSubmission.eventType}
                    </div>
                  </div>
                  
                  <p className="text-white text-lg font-medium leading-relaxed mb-4">
                    {currentSubmission.caption}
                  </p>
                  
                  <p className="text-white/70 text-sm">
                    {new Date(currentSubmission.timestamp).toLocaleTimeString()} • Tonight at LKC
                  </p>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-accent rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <Sparkles className="w-6 h-6 text-accent-foreground" />
            </div>
          </div>

          {/* Progress indicator */}
          {approvedSubmissions.length > 1 && (
            <div className="flex justify-center gap-2 mb-6">
              {approvedSubmissions.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'w-8 bg-primary' 
                      : 'w-2 bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer with prominent share button */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <div className="text-center">
          <div className="mb-4">
            <button
              onClick={() => {
                const shareText = "Check out SingShot Live at @londonkaraoke.club #londonkaraoke.club - AI-powered karaoke moments!";
                if (navigator.share) {
                  navigator.share({
                    title: 'SingShot Live - AI Karaoke Moments',
                    text: shareText,
                    url: window.location.href
                  });
                } else {
                  navigator.clipboard?.writeText(`${shareText} ${window.location.href}`);
                }
              }}
              className="bg-yellow-400 text-black hover:bg-yellow-300 font-bold py-4 px-8 rounded-full text-lg shadow-[0_0_30px_hsl(45_100%_50%/0.6)] hover:shadow-[0_0_40px_hsl(45_100%_50%/0.8)] transform hover:scale-105 transition-all duration-300 animate-pulse"
            >
              <Share2 className="w-6 h-6 mr-3 inline" />
              Share SingShot Live
            </button>
          </div>
          <p className="text-yellow-300 text-sm mb-2 font-semibold">
            Want to share your moment? Create a SingShot at the bar!
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-yellow-400/80">
            <span>• AI-Powered Captions</span>
            <span>• Instant Sharing</span>
            <span>• Live Gallery</span>
          </div>
        </div>
      </div>

      {/* Random ambient lighting effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl animate-bounce opacity-60" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-300/15 rounded-full blur-3xl animate-pulse opacity-60" />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-black/30 rounded-full blur-2xl animate-ping opacity-40" />
      <div className="absolute bottom-1/3 left-1/2 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl animate-spin opacity-50" style={{animationDuration: '20s'}} />
    </div>
  );
};

export default LiveGallery;