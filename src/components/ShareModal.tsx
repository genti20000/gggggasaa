import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Download, Instagram, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission?: {
    id: string;
    nickname: string;
    eventType: string;
  };
}

const ShareModal = ({ isOpen, onClose, submission }: ShareModalProps) => {
  const { toast } = useToast();

  const caption = `Hen party magic at @LondonKaraokeClub! 🎤✨ ${submission?.nickname} absolutely smashed it! #HenDoLegends #SingShot #KaraokeQueen`;
  const hashtags = "#HenDoLegends #SingShot #KaraokeQueen #LondonKaraokeClub";

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${type} copied! 📋`,
      description: "Ready to paste on Instagram!",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gradient-to-br from-background via-background to-primary/5 border-2 border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-gradient bg-gradient-to-r from-primary to-yellow-400 bg-clip-text text-transparent">
            🎉 Get Your SingShot & Share! 🎤
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 p-4">
          {/* Instructions */}
          <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
            <h3 className="font-bold text-primary mb-3">📱 Share & Win Instructions:</h3>
            <ol className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">1</span>
                <span><strong>Scan QR:</strong> Use your phone to download your SingShot</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">2</span>
                <span><strong>Share on Instagram:</strong> Tag <span className="text-primary font-bold">@LondonKaraokeClub</span></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">3</span>
                <span><strong>Show staff & win a FREE SHOT!</strong> 🥃</span>
              </li>
            </ol>
          </div>

          {/* QR Code Placeholder */}
          <div className="text-center">
            <div className="bg-white p-4 rounded-lg border-4 border-primary inline-block">
              <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-yellow-400/20 rounded-lg flex items-center justify-center">
                <Download className="w-12 h-12 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Scan with phone camera</p>
            </div>
          </div>

          {/* Copy Buttons */}
          <div className="space-y-3">
            <div>
              <Button
                onClick={() => copyToClipboard(caption, 'Caption')}
                className="w-full bg-gradient-to-r from-primary to-yellow-400 hover:from-primary/80 hover:to-yellow-400/80 mb-2"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Instagram Caption
              </Button>
              <Input
                value={caption}
                readOnly
                className="text-xs bg-muted"
              />
            </div>

            <div>
              <Button
                onClick={() => copyToClipboard(hashtags, 'Hashtags')}
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary/10 mb-2"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Hashtags
              </Button>
              <Input
                value={hashtags}
                readOnly
                className="text-xs bg-muted"
              />
            </div>
          </div>

          {/* Prize Info */}
          <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-3 text-center">
            <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
              Having trouble? Ask our staff for help!
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Show your post to staff for your FREE SHOT! 🥃
            </p>
          </div>

          <Button onClick={onClose} variant="outline" className="w-full">
            Continue to Gallery
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;