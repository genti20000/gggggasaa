import { useState, useCallback, useRef, useEffect } from 'react';
import { ArrowLeft, Sparkles, Send, RefreshCw, Heart, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface MediaData {
  type: 'photo' | 'video';
  data: string;
  overlay?: string;
}

interface MediaCustomizationProps {
  media: MediaData;
  onBack: () => void;
  onSubmit: (submission: any) => void;
}

const filters = [
  { id: 'none', name: 'Original' },
  { id: 'sparkle', name: 'Sparkle', effect: 'brightness(110%) contrast(120%) saturate(140%)' },
  { id: 'haze', name: 'Haze', effect: 'blur(0.5px) brightness(105%) contrast(95%)' },
  { id: 'glow', name: 'Glow', effect: 'brightness(120%) contrast(110%) drop-shadow(0 0 10px rgba(280, 100%, 60%, 0.3))' },
  { id: 'vintage', name: 'Vintage', effect: 'sepia(30%) contrast(120%) brightness(110%)' },
  { id: 'neon', name: 'Neon', effect: 'contrast(150%) saturate(200%) brightness(110%) hue-rotate(10deg)' }
];

const eventTypes = [
  'Birthday Bash',
  'Hen Do',
  'Stag Night', 
  'Corporate Event',
  'Date Night',
  'Friends Night Out',
  'Anniversary',
  'Celebration',
  'Just Because!'
];

const MediaCustomization = ({ media, onBack, onSubmit }: MediaCustomizationProps) => {
  const [nickname, setNickname] = useState('');
  const [eventType, setEventType] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [aiCaptions, setAiCaptions] = useState<string[]>([]);
  const [selectedCaption, setSelectedCaption] = useState('');
  const [isLoadingCaptions, setIsLoadingCaptions] = useState(false);
  const [socialConsent, setSocialConsent] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Apply filter to media preview
  const getFilterStyle = useCallback(() => {
    const filter = filters.find(f => f.id === selectedFilter);
    return filter?.effect ? { filter: filter.effect } : {};
  }, [selectedFilter]);

  // Generate AI captions using Gemini
  const generateCaptions = useCallback(async () => {
    if (!nickname.trim() || !eventType) {
      toast.error('Please enter your nickname and select event type first!');
      return;
    }

    setIsLoadingCaptions(true);
    
    try {
      // Mock AI caption generation - replace with actual Gemini API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockCaptions = [
        `${nickname} is absolutely crushing it at this ${eventType.toLowerCase()}! 🎤✨`,
        `When ${nickname} takes the mic, magic happens! Perfect ${eventType.toLowerCase()} vibes 🌟`,
        `${nickname}'s karaoke game is UNREAL! This ${eventType.toLowerCase()} just got legendary! 🔥`
      ];
      
      setAiCaptions(mockCaptions);
      setSelectedCaption(mockCaptions[0]);
      toast.success('AI captions generated! ✨');
    } catch (error) {
      console.error('Caption generation failed:', error);
      toast.error('Failed to generate captions. Try again!');
    } finally {
      setIsLoadingCaptions(false);
    }
  }, [nickname, eventType]);

  // Submit the final SingShot
  const handleSubmit = useCallback(() => {
    if (!nickname.trim()) {
      toast.error('Please enter your nickname!');
      return;
    }
    
    if (!selectedCaption) {
      toast.error('Please generate and select a caption!');
      return;
    }

    const submission = {
      id: Date.now().toString(),
      type: media.type,
      data: media.data,
      overlay: media.overlay,
      filter: selectedFilter !== 'none' ? selectedFilter : undefined,
      nickname: nickname.trim(),
      eventType,
      caption: selectedCaption,
      socialConsent,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    // Save to localStorage (simulating backend)
    const existingSubmissions = JSON.parse(localStorage.getItem('singshot_submissions') || '[]');
    existingSubmissions.push(submission);
    localStorage.setItem('singshot_submissions', JSON.stringify(existingSubmissions));

    onSubmit(submission);
    toast.success('SingShot submitted for review! 🚀');
  }, [media, nickname, eventType, selectedCaption, selectedFilter, socialConsent, onSubmit]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <h1 className="text-lg font-bold text-gradient">Customize Your SingShot</h1>
        
        <div className="w-10" /> {/* Spacer */}
      </div>

      <div className="flex-1 p-4 max-w-2xl mx-auto w-full">
        {/* Media Preview */}
        <div className="mb-6">
          <Label className="text-sm font-medium mb-3 block">Preview</Label>
          <div className="relative rounded-2xl overflow-hidden bg-card border">
            {media.type === 'photo' ? (
              <img
                src={media.data}
                alt="Captured moment"
                className="w-full h-64 object-cover"
                style={getFilterStyle()}
              />
            ) : (
              <video
                ref={videoRef}
                src={media.data}
                className="w-full h-64 object-cover"
                style={getFilterStyle()}
                controls
                muted
              />
            )}
            
            {/* Filter overlay indicator */}
            {selectedFilter !== 'none' && (
              <div className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs px-2 py-1 rounded-full">
                {filters.find(f => f.id === selectedFilter)?.name}
              </div>
            )}
          </div>
        </div>

        {/* Filter Selection */}
        <div className="mb-6">
          <Label className="text-sm font-medium mb-3 block">Choose a Filter</Label>
          <div className="grid grid-cols-3 gap-2">
            {filters.map((filter) => (
              <Button
                key={filter.id}
                variant={selectedFilter === filter.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(filter.id)}
                className={selectedFilter === filter.id ? 'btn-neon' : ''}
              >
                {filter.name}
              </Button>
            ))}
          </div>
        </div>

        {/* User Details */}
        <div className="space-y-4 mb-6">
          <div>
            <Label htmlFor="nickname" className="text-sm font-medium mb-2 block">
              Your Nickname
            </Label>
            <Input
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="e.g. Sarah, DJ Mike, The Voice..."
              className="bg-input/50 border-border"
            />
          </div>
          
          <div>
            <Label className="text-sm font-medium mb-2 block">
              What's the Occasion?
            </Label>
            <Select value={eventType} onValueChange={setEventType}>
              <SelectTrigger className="bg-input/50 border-border">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map((event) => (
                  <SelectItem key={event} value={event}>
                    {event}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* AI Caption Generation */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm font-medium">AI-Generated Captions</Label>
            <Button
              onClick={generateCaptions}
              disabled={isLoadingCaptions || !nickname.trim() || !eventType}
              size="sm"
              className="btn-secondary-neon"
            >
              {isLoadingCaptions ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get AI Captions
                </>
              )}
            </Button>
          </div>

          {aiCaptions.length > 0 && (
            <div className="space-y-2">
              {aiCaptions.map((caption, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-xl cursor-pointer border-2 transition-all ${
                    selectedCaption === caption
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedCaption(caption)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 ${selectedCaption === caption ? 'text-primary' : 'text-muted-foreground'}`}>
                      {index === 0 && <Heart className="w-4 h-4" />}
                      {index === 1 && <Star className="w-4 h-4" />}
                      {index === 2 && <Zap className="w-4 h-4" />}
                    </div>
                    <p className={`text-sm ${selectedCaption === caption ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Social Consent */}
        <div className="mb-8">
          <div className="flex items-start space-x-3 p-4 rounded-xl bg-muted/50">
            <Checkbox
              id="social-consent"
              checked={socialConsent}
              onCheckedChange={(checked) => setSocialConsent(checked as boolean)}
              className="mt-1"
            />
            <div>
              <Label htmlFor="social-consent" className="text-sm font-medium cursor-pointer">
                Social Media Consent
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                I give London Karaoke Club permission to share this SingShot on their social media channels
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!nickname.trim() || !selectedCaption}
          className="w-full btn-neon text-primary-foreground font-semibold py-6 text-lg"
          size="lg"
        >
          <Send className="w-5 h-5 mr-3" />
          Submit My SingShot
        </Button>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Your SingShot will be reviewed by our team before appearing on the live display
        </p>
      </div>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default MediaCustomization;