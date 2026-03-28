import { useEffect, useState, useRef } from "react";
import { X, ChevronLeft, ChevronRight, Heart, ShoppingBag } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Story } from "./Stories";
import { useNavigate } from "react-router";

interface StoryViewerProps {
  stories: Story[];
  user: Story['user'];
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

export function StoryViewer({
  stories,
  user,
  onClose,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
}: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

  const currentStory = stories[currentIndex];
  const duration = 15000; // 15 seconds

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / (duration / 100));
        if (newProgress >= 100) {
          handleNextStory();
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused]);

  useEffect(() => {
    setProgress(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      if (!isPaused) {
        videoRef.current.play().catch(console.error);
      }
    }
  }, [currentIndex]);

  const handleNextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else if (hasNext) {
      onNext();
    } else {
      onClose();
    }
  };

  const handlePreviousStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    } else if (hasPrevious) {
      onPrevious();
    }
  };

  const handleViewItem = () => {
    if (currentStory.itemId) {
      navigate(`/item/${currentStory.itemId}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Progress Bars */}
      <div className="absolute top-0 left-0 right-0 z-10 flex gap-1 p-2">
        {stories.map((_, index) => (
          <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-100"
              style={{
                width: index < currentIndex ? '100%' : index === currentIndex ? `${progress}%` : '0%',
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-4 left-0 right-0 z-10 flex items-center justify-between px-4 mt-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-white">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <div className="text-white">
            <p className="font-semibold text-sm">{user.name}</p>
            <p className="text-xs text-white/80">
              {new Date(currentStory.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      {/* Video Content */}
      <div className="relative h-full flex items-center justify-center">
        <video
          ref={videoRef}
          src={currentStory.video}
          className="max-h-full max-w-full object-contain"
          loop
          playsInline
          muted
          onEnded={handleNextStory}
        />

        {/* Navigation Areas */}
        <div className="absolute inset-0 flex">
          <button
            className="flex-1"
            onClick={handlePreviousStory}
            onMouseDown={() => setIsPaused(true)}
            onMouseUp={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          />
          <button
            className="flex-1"
            onClick={handleNextStory}
            onMouseDown={() => setIsPaused(true)}
            onMouseUp={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          />
        </div>

        {/* Navigation Arrows (Desktop) */}
        {hasPrevious && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 hidden md:flex"
            onClick={onPrevious}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
        )}
        {hasNext && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 hidden md:flex"
            onClick={onNext}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        )}
      </div>

      {/* Item Info & Actions */}
      {currentStory.itemTitle && (
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-6">
          <div className="flex items-end justify-between">
            <div className="text-white flex-1">
              <p className="text-lg font-semibold mb-1">{currentStory.itemTitle}</p>
              <p className="text-sm text-white/80">Tap to view details</p>
            </div>
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="text-white hover:bg-white/20 rounded-full"
              >
                <Heart className="h-6 w-6" />
              </Button>
              <Button
                size="sm"
                className="gap-2 rounded-full"
                onClick={handleViewItem}
              >
                <ShoppingBag className="h-4 w-4" />
                View Item
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
