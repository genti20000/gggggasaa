import { useState, useCallback } from 'react';
import SingShotLanding from '@/components/SingShotLanding';
import CameraCapture from '@/components/CameraCapture';
import MediaCustomization from '@/components/MediaCustomization';
import SuccessScreen from '@/components/SuccessScreen';
import StaffDashboard from '@/components/StaffDashboard';

type AppState = 'landing' | 'camera' | 'customize' | 'success' | 'admin';

interface MediaData {
  type: 'photo' | 'video';
  data: string;
  overlay?: string;
}

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('landing');
  const [capturedMedia, setCapturedMedia] = useState<MediaData | null>(null);
  const [submission, setSubmission] = useState<any>(null);

  // Navigate to camera capture
  const handleStartCapture = useCallback(() => {
    setCurrentState('camera');
  }, []);

  // Navigate to admin dashboard
  const handleAdminAccess = useCallback(() => {
    setCurrentState('admin');
  }, []);

  // Handle media capture from camera
  const handleMediaCapture = useCallback((media: MediaData) => {
    setCapturedMedia(media);
    setCurrentState('customize');
  }, []);

  // Handle final submission
  const handleSubmission = useCallback((submissionData: any) => {
    setSubmission(submissionData);
    setCurrentState('success');
  }, []);

  // Navigate back to landing
  const handleBackToLanding = useCallback(() => {
    setCurrentState('landing');
    setCapturedMedia(null);
    setSubmission(null);
  }, []);

  // Navigate back from camera
  const handleBackFromCamera = useCallback(() => {
    setCurrentState('landing');
    setCapturedMedia(null);
  }, []);

  // Navigate back from customize
  const handleBackFromCustomize = useCallback(() => {
    setCurrentState('camera');
  }, []);

  // Create another SingShot
  const handleCreateAnother = useCallback(() => {
    setCapturedMedia(null);
    setSubmission(null);
    setCurrentState('camera');
  }, []);

  // View live gallery
  const handleViewGallery = useCallback(() => {
    window.open('/gallery', '_blank');
  }, []);

  // Render current screen based on state
  switch (currentState) {
    case 'camera':
      return (
        <CameraCapture
          onCapture={handleMediaCapture}
          onBack={handleBackFromCamera}
        />
      );
      
    case 'customize':
      return capturedMedia ? (
        <MediaCustomization
          media={capturedMedia}
          onBack={handleBackFromCustomize}
          onSubmit={handleSubmission}
        />
      ) : null;
      
    case 'success':
      return submission ? (
        <SuccessScreen
          submission={submission}
          onCreateAnother={handleCreateAnother}
          onViewGallery={handleViewGallery}
        />
      ) : null;
      
    case 'admin':
      return (
        <StaffDashboard
          onBack={handleBackToLanding}
        />
      );
      
    default:
      return (
        <SingShotLanding
          onStartCapture={handleStartCapture}
          onAdminAccess={handleAdminAccess}
        />
      );
  }
};

export default Index;
