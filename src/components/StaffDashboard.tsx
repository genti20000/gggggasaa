import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Check, X, Share, Eye, Clock, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { localDb, type Submission } from '@/lib/localDb';

interface StaffDashboardProps {
  onBack: () => void;
}

const StaffDashboard = ({ onBack }: StaffDashboardProps) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [activeTab, setActiveTab] = useState('pending');

  // Load submissions from localStorage
  const loadSubmissions = useCallback(() => {
    setSubmissions(localDb.getSubmissions());
  }, []);

  // Save submissions to localStorage and sync with gallery
  const saveSubmissions = useCallback((updatedSubmissions: Submission[]) => {
    localDb.saveSubmissions(updatedSubmissions);
    setSubmissions(updatedSubmissions);
  }, []);

  // Approve submission
  const approveSubmission = useCallback((id: string) => {
    const updatedSubmissions = submissions.map(submission => {
      if (submission.id === id) {
        return {
          ...submission,
          status: 'approved' as const,
          reviewedBy: 'Staff', // In real app, use actual staff ID
          reviewedAt: new Date().toISOString()
        };
      }
      return submission;
    });
    
    saveSubmissions(updatedSubmissions);
    toast.success('Submission approved! Now live in gallery 🎉');
  }, [submissions, saveSubmissions]);

  // Reject submission
  const rejectSubmission = useCallback((id: string) => {
    const updatedSubmissions = submissions.map(submission => {
      if (submission.id === id) {
        return {
          ...submission,
          status: 'rejected' as const,
          reviewedBy: 'Staff',
          reviewedAt: new Date().toISOString()
        };
      }
      return submission;
    });
    
    saveSubmissions(updatedSubmissions);
    toast.success('Submission rejected');
  }, [submissions, saveSubmissions]);

  // Mock social media share
  const shareToSocial = useCallback((submission: Submission) => {
    // Mock implementation - replace with real social media API
    toast.success('Posted to social media! 📱✨');
    console.log('Sharing to social media:', submission);
  }, []);

  // Format timestamp
  const formatTime = useCallback((timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  }, []);

  // Get submissions by status
  const getSubmissionsByStatus = useCallback((status: string) => {
    return submissions.filter(s => s.status === status);
  }, [submissions]);

  useEffect(() => {
    loadSubmissions();
    // Refresh every 5 seconds to check for new submissions
    const interval = setInterval(loadSubmissions, 5000);
    return () => clearInterval(interval);
  }, [loadSubmissions]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gradient">Staff Dashboard</h1>
              <p className="text-sm text-muted-foreground">Review and moderate SingShots</p>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('/gallery', '_blank')}
            className="gap-2"
          >
            <Eye className="w-4 h-4" />
            View Live Gallery
            <ExternalLink className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <div className="p-4 max-w-6xl mx-auto">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">{getSubmissionsByStatus('pending').length}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">{getSubmissionsByStatus('approved').length}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/20 rounded-lg">
                <XCircle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold">{getSubmissionsByStatus('rejected').length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs for different views */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">
              Pending Review ({getSubmissionsByStatus('pending').length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({getSubmissionsByStatus('approved').length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({getSubmissionsByStatus('rejected').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            <div className="grid gap-4">
              {getSubmissionsByStatus('pending').length === 0 ? (
                <Card className="p-8 text-center">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Pending Submissions</h3>
                  <p className="text-muted-foreground">New submissions will appear here for review</p>
                </Card>
              ) : (
                getSubmissionsByStatus('pending').map((submission) => (
                  <SubmissionCard
                    key={submission.id}
                    submission={submission}
                    onApprove={() => approveSubmission(submission.id)}
                    onReject={() => rejectSubmission(submission.id)}
                    onShare={() => shareToSocial(submission)}
                    formatTime={formatTime}
                    showActions
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="approved" className="mt-6">
            <div className="grid gap-4">
              {getSubmissionsByStatus('approved').map((submission) => (
                <SubmissionCard
                  key={submission.id}
                  submission={submission}
                  onApprove={() => {}}
                  onReject={() => {}}
                  onShare={() => shareToSocial(submission)}
                  formatTime={formatTime}
                  showShareOnly
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rejected" className="mt-6">
            <div className="grid gap-4">
              {getSubmissionsByStatus('rejected').map((submission) => (
                <SubmissionCard
                  key={submission.id}
                  submission={submission}
                  onApprove={() => {}}
                  onReject={() => {}}
                  onShare={() => {}}
                  formatTime={formatTime}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Submission Card Component
interface SubmissionCardProps {
  submission: Submission;
  onApprove: () => void;
  onReject: () => void;
  onShare: () => void;
  formatTime: (timestamp: string) => string;
  showActions?: boolean;
  showShareOnly?: boolean;
}

const SubmissionCard = ({ 
  submission, 
  onApprove, 
  onReject, 
  onShare, 
  formatTime, 
  showActions = false,
  showShareOnly = false
}: SubmissionCardProps) => {
  return (
    <Card className="p-4">
      <div className="flex gap-4">
        {/* Media Preview */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted">
            {submission.type === 'photo' ? (
              <img
                src={submission.data}
                alt="Submission"
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
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground">{submission.nickname}</h3>
                <Badge variant="secondary" className="text-xs">
                  {submission.eventType}
                </Badge>
                {submission.socialConsent && (
                  <Badge variant="outline" className="text-xs text-success border-success">
                    Social OK
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {submission.caption}
              </p>
            </div>
            
            <Badge 
              variant={submission.status === 'approved' ? 'default' : 
                      submission.status === 'rejected' ? 'destructive' : 'secondary'}
            >
              {submission.status}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              <p>{formatTime(submission.timestamp)}</p>
              {submission.reviewedBy && (
                <p>Reviewed by {submission.reviewedBy}</p>
              )}
            </div>

            {/* Action Buttons */}
            {showActions && (
              <div className="flex gap-2">
                <Button
                  onClick={onReject}
                  variant="outline"
                  size="sm"
                  className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="w-4 h-4 mr-1" />
                  Reject
                </Button>
                <Button
                  onClick={onApprove}
                  size="sm"
                  className="btn-neon"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Approve
                </Button>
              </div>
            )}

            {showShareOnly && submission.socialConsent && (
              <Button
                onClick={onShare}
                variant="outline"
                size="sm"
                className="btn-secondary-neon"
              >
                <Share className="w-4 h-4 mr-1" />
                Share
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StaffDashboard;
