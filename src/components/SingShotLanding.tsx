import { useState } from 'react';
import { Camera, Sparkles, Zap, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SingShotLandingProps {
  onStartCapture: () => void;
  onAdminAccess: () => void;
}

const SingShotLanding = ({ onStartCapture, onAdminAccess }: SingShotLandingProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Trigger animation on component mount
  useState(() => {
    setTimeout(() => setIsLoaded(true), 100);
  });

  return (
    <div className="min-h-screen sparkle-bg flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="p-4 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-gradient">SingShot</span>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onAdminAccess}
          className="text-muted-foreground hover:text-foreground"
        >
          Admin Area
        </Button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12 relative z-10">
        {/* Logo and Title */}
        <div className={`text-center mb-8 transform transition-all duration-1000 ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="relative mb-6">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary via-secondary to-accent p-1 shadow-[0_0_40px_hsl(280_100%_60%/0.4)]">
              <div className="w-full h-full rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center">
                <Camera className="w-10 h-10 text-primary" />
              </div>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent animate-pulse">
              <Zap className="w-4 h-4 text-accent-foreground m-1" />
            </div>
          </div>
          
          <h1 className="text-5xl font-black text-gradient-party mb-4 tracking-tight">
            SingShot
          </h1>
          <p className="text-xl text-muted-foreground max-w-md">
            Capture your karaoke moment, let AI make it legendary
          </p>
        </div>

        {/* Features Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 max-w-2xl w-full transform transition-all duration-1000 delay-300 ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="card-neon p-6 text-center">
            <Camera className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Capture</h3>
            <p className="text-sm text-muted-foreground">
              Photos or videos with live overlays
            </p>
          </div>
          
          <div className="card-neon p-6 text-center">
            <Sparkles className="w-8 h-8 text-secondary mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">AI Captions</h3>
            <p className="text-sm text-muted-foreground">
              Witty, personalized captions
            </p>
          </div>
          
          <div className="card-neon p-6 text-center">
            <Users className="w-8 h-8 text-accent mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Share Live</h3>
            <p className="text-sm text-muted-foreground">
              Instantly on venue displays
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className={`text-center transform transition-all duration-1000 delay-500 ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <h2 className="text-2xl font-bold text-gradient mb-6">
            Ready to create your SingShot?
          </h2>
          
          <Button 
            onClick={onStartCapture}
            size="lg"
            className="btn-neon text-primary-foreground font-bold text-lg px-8 py-6 rounded-2xl group"
          >
            <Camera className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
            Start Capturing
            <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <p className="text-sm text-muted-foreground mt-4 max-w-sm">
            Takes less than 30 seconds • No signup required • Instant AI magic
          </p>
        </div>
      </div>

      {/* Venue Credit */}
      <div className="text-center pb-6 relative z-10">
        <p className="text-xs text-muted-foreground/60">
          Powered by London Karaoke Club
        </p>
      </div>
    </div>
  );
};

export default SingShotLanding;