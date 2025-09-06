import { useState, useEffect } from 'react';
import { CheckCircle, Sparkles, Camera, ArrowRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Submission {
  id: string;
  type: 'photo' | 'video';
  data: string;
  nickname: string;
  eventType: string;
  caption: string;
  timestamp: string;
}

interface SuccessScreenProps {
  submission: Submission;
  onCreateAnother: () => void;
  onViewGallery: () => void;
}

const SuccessScreen = ({ submission, onCreateAnother, onViewGallery }: SuccessScreenProps) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Trigger success animation
    setTimeout(() => setShowSuccess(true), 200);
    setTimeout(() => setShowContent(true), 800);
  }, []);

  return (
    <div className="min-h-screen sparkle-bg flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Success Animation */}
      <div className={`transform transition-all duration-700 ${
        showSuccess ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
      }`}>
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-success via-primary to-accent p-1 shadow-[0_0_60px_hsl(120_60%_50%/0.4)] success-bounce">
            <div className="w-full h-full rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-success" />
            </div>
          </div>
          
          {/* Floating sparkles */}
          <div className="absolute -top-2 -left-2 text-2xl animate-bounce animation-delay-300">✨</div>
          <div className="absolute -top-4 -right-1 text-xl animate-bounce animation-delay-700">🎉</div>
          <div className="absolute -bottom-1 -left-4 text-lg animate-bounce animation-delay-500">⭐</div>
          <div className="absolute -bottom-2 -right-3 text-xl animate-bounce animation-delay-900">🎊</div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`text-center max-w-md mx-auto transform transition-all duration-700 delay-300 ${
        showContent ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}>
        <h1 className="text-4xl font-black text-gradient-party mb-4">
          SingShot Submitted!
        </h1>
        
        <p className="text-lg text-muted-foreground mb-8">
          Your amazing moment is being reviewed by our team and will appear on the live gallery soon!
        </p>

        {/* Submission Preview */}
        <div className="card-neon p-4 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-primary/30">
              {submission.type === 'photo' ? (
                <img
                  src={submission.data}
                  alt="Your SingShot"
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={submission.data}
                  className="w-full h-full object-cover"
                  muted
                />
              )}
            </div>
            
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-foreground">{submission.nickname}</span>
                <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full">
                  {submission.eventType}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {submission.caption}
              </p>
            </div>
          </div>
        </div>

        {/* Status Info */}
        <div className="flex items-center justify-center gap-2 mb-8 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
          <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
          <span className="text-amber-600 font-medium">Under Review</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            onClick={onCreateAnother}
            size="lg"
            className="w-full btn-neon text-primary-foreground font-semibold py-6 text-lg group"
          >
            <Camera className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
            Create Another SingShot
            <Sparkles className="w-5 h-5 ml-3" />
          </Button>
          
          <Button
            onClick={onViewGallery}
            variant="outline"
            size="lg"
            className="w-full py-6 text-lg border-primary/30 hover:border-primary hover:bg-primary/10"
          >
            <Eye className="w-5 h-5 mr-3" />
            View Live Gallery
            <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <div className="mt-8 p-4 bg-muted/30 rounded-xl">
          <h3 className="font-semibold text-foreground mb-2">What happens next?</h3>
          <div className="text-sm text-muted-foreground space-y-1 text-left">
            <p>• Our team reviews your SingShot for quality and content</p>
            <p>• Approved moments appear on screens around the venue</p>
            <p>• Your SingShot may be shared on our social media (if you opted in)</p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground/60 mt-6">
          Review typically takes 1-2 minutes during busy periods
        </p>
      </div>

      {/* Background Effects */}
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-success/10 rounded-full blur-3xl animate-pulse opacity-40" />
      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse opacity-40 animation-delay-1000" />
    </div>
  );
};

export default SuccessScreen;