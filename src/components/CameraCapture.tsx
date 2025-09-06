import { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, Video, RotateCcw, X, Sparkles, Crown, Glasses, PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CameraCaptureProps {
  onCapture: (mediaData: { type: 'photo' | 'video'; data: string; overlay?: string }) => void;
  onBack: () => void;
}

const overlays = [
  { id: 'none', name: 'None', icon: null },
  { id: 'crown', name: 'Crown', icon: Crown, position: 'top-[10%]' },
  { id: 'glasses', name: 'Glasses', icon: Glasses, position: 'top-[35%]' },
  { id: 'sparkles', name: 'Sparkles', icon: Sparkles, position: 'top-[20%] right-[20%]' },
  { id: 'party', name: 'Party', icon: PartyPopper, position: 'top-[15%] left-[15%]' },
];

const CameraCapture = ({ onCapture, onBack }: CameraCaptureProps) => {
  const [mode, setMode] = useState<'photo' | 'video'>('photo');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedOverlay, setSelectedOverlay] = useState('none');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Initialize camera
  const initializeCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: mode === 'video'
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      
      setIsInitialized(true);
    } catch (error) {
      console.error('Camera initialization failed:', error);
      toast.error('Unable to access camera. Please check permissions.');
    }
  }, [mode]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsInitialized(false);
  }, [stream]);

  // Initialize on mount and mode change
  useEffect(() => {
    initializeCamera();
    return cleanup;
  }, [mode]);

  // Take photo
  const takePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Apply overlay if selected
    if (selectedOverlay !== 'none') {
      const overlayData = overlays.find(o => o.id === selectedOverlay);
      if (overlayData?.icon) {
        // This is a simplified overlay - in a real app, you'd use proper AR or canvas drawing
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('✨', canvas.width / 2, canvas.height / 4);
      }
    }

    // Convert to data URL
    const photoData = canvas.toDataURL('image/jpeg', 0.9);
    onCapture({ 
      type: 'photo', 
      data: photoData, 
      overlay: selectedOverlay !== 'none' ? selectedOverlay : undefined 
    });
    
    toast.success('Photo captured! ✨');
  }, [selectedOverlay, onCapture]);

  // Start recording video
  const startRecording = useCallback(() => {
    if (!stream) return;

    recordedChunksRef.current = [];
    
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm'
    });
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const videoUrl = URL.createObjectURL(blob);
      onCapture({ type: 'video', data: videoUrl });
      toast.success('Video captured! 🎬');
    };
    
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
    
    // Auto-stop after 10 seconds
    setTimeout(() => {
      if (mediaRecorderRef.current?.state === 'recording') {
        stopRecording();
      }
    }, 10000);
  }, [stream, onCapture]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  }, []);

  // Handle capture button click
  const handleCapture = useCallback(() => {
    if (mode === 'photo') {
      takePhoto();
    } else if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [mode, isRecording, takePhoto, startRecording, stopRecording]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen sparkle-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
            <Camera className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <h2 className="text-xl font-semibold text-gradient mb-2">Initializing Camera</h2>
          <p className="text-muted-foreground">Please allow camera access to continue</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm relative z-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-white hover:bg-white/20"
        >
          <X className="w-5 h-5" />
        </Button>
        
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-white">Capture Mode</h1>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={initializeCamera}
          className="text-white hover:bg-white/20"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
        />
        
        {/* Overlay Preview */}
        {selectedOverlay !== 'none' && (
          <div className={`absolute ${overlays.find(o => o.id === selectedOverlay)?.position} transform -translate-x-1/2 -translate-y-1/2 pointer-events-none`}>
            <div className="text-6xl opacity-80">
              {selectedOverlay === 'crown' && '👑'}
              {selectedOverlay === 'glasses' && '🕶️'}
              {selectedOverlay === 'sparkles' && '✨'}
              {selectedOverlay === 'party' && '🎉'}
            </div>
          </div>
        )}
        
        {/* Recording indicator */}
        {isRecording && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-sm font-medium">Recording...</span>
          </div>
        )}
      </div>

      {/* Overlay Selection */}
      <div className="absolute bottom-32 left-0 right-0 px-4 z-10">
        <div className="flex gap-2 justify-center mb-4">
          {overlays.map((overlay) => {
            const IconComponent = overlay.icon;
            return (
              <Button
                key={overlay.id}
                variant={selectedOverlay === overlay.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedOverlay(overlay.id)}
                className={`${
                  selectedOverlay === overlay.id 
                    ? 'btn-neon text-primary-foreground' 
                    : 'bg-black/50 border-white/30 text-white hover:bg-white/20'
                }`}
              >
                {IconComponent ? <IconComponent className="w-4 h-4 mr-1" /> : null}
                {overlay.name}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-black/80 backdrop-blur-sm p-6 relative z-10">
        {/* Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-black/50 rounded-full p-1">
            <Button
              variant={mode === 'photo' ? "default" : "ghost"}
              onClick={() => setMode('photo')}
              className={`rounded-full ${mode === 'photo' ? 'btn-neon' : 'text-white hover:bg-white/20'}`}
            >
              <Camera className="w-4 h-4 mr-2" />
              Photo
            </Button>
            <Button
              variant={mode === 'video' ? "default" : "ghost"}
              onClick={() => setMode('video')}
              className={`rounded-full ${mode === 'video' ? 'btn-neon' : 'text-white hover:bg-white/20'}`}
            >
              <Video className="w-4 h-4 mr-2" />
              Video
            </Button>
          </div>
        </div>

        {/* Capture Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleCapture}
            className={`capture-btn ${isRecording ? 'bg-red-500 border-red-300' : ''}`}
          >
            <span className="sr-only">
              {mode === 'photo' ? 'Take photo' : isRecording ? 'Stop recording' : 'Start recording'}
            </span>
          </Button>
        </div>

        {mode === 'video' && (
          <p className="text-center text-white/70 text-sm mt-4">
            {isRecording ? 'Tap to stop (max 10s)' : 'Tap to start recording'}
          </p>
        )}
      </div>

      {/* Hidden canvas for photo processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraCapture;