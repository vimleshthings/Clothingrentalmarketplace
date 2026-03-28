import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Plus } from "lucide-react";
import { StoryViewer } from "./StoryViewer";
import { currentUser } from "../data/mockData";

export interface Story {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  video: string;
  thumbnail: string;
  itemId?: string;
  itemTitle?: string;
  createdAt: string;
  viewed?: boolean;
}

interface StoriesProps {
  stories: Story[];
  onAddStory?: () => void;
}

export function Stories({ stories, onAddStory }: StoriesProps) {
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  // Group stories by user
  const groupedStories = stories.reduce((acc, story) => {
    const userId = story.user.id;
    if (!acc[userId]) {
      acc[userId] = {
        user: story.user,
        stories: [],
        hasUnviewed: false,
      };
    }
    acc[userId].stories.push(story);
    if (!story.viewed) {
      acc[userId].hasUnviewed = true;
    }
    return acc;
  }, {} as Record<string, { user: Story['user']; stories: Story[]; hasUnviewed: boolean }>);

  const userStories = Object.values(groupedStories);

  const handleStoryClick = (userIndex: number) => {
    setSelectedStoryIndex(userIndex);
    setViewerOpen(true);
  };

  const handleClose = () => {
    setViewerOpen(false);
    setSelectedStoryIndex(null);
  };

  const handleNext = () => {
    if (selectedStoryIndex !== null && selectedStoryIndex < userStories.length - 1) {
      setSelectedStoryIndex(selectedStoryIndex + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (selectedStoryIndex !== null && selectedStoryIndex > 0) {
      setSelectedStoryIndex(selectedStoryIndex - 1);
    }
  };

  return (
    <>
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            {/* Add Story Button */}
            <button
              onClick={onAddStory}
              className="flex flex-col items-center gap-2 flex-shrink-0 group"
            >
              <div className="relative">
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-2 border-gray-200">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                  <Plus className="h-4 w-4 text-white" />
                </div>
              </div>
              <span className="text-xs text-gray-600 max-w-[80px] truncate">Add Story</span>
            </button>

            {/* User Stories */}
            {userStories.map((userStory, index) => (
              <button
                key={userStory.user.id}
                onClick={() => handleStoryClick(index)}
                className="flex flex-col items-center gap-2 flex-shrink-0"
              >
                <div className={`rounded-full p-[2px] ${userStory.hasUnviewed ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-pink-500' : 'bg-gray-300'}`}>
                  <div className="bg-white rounded-full p-[2px]">
                    <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                      <AvatarImage src={userStory.user.avatar} alt={userStory.user.name} />
                      <AvatarFallback>{userStory.user.name[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                <span className="text-xs text-gray-600 max-w-[80px] truncate">
                  {userStory.user.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Story Viewer */}
      {viewerOpen && selectedStoryIndex !== null && (
        <StoryViewer
          stories={userStories[selectedStoryIndex].stories}
          user={userStories[selectedStoryIndex].user}
          onClose={handleClose}
          onNext={handleNext}
          onPrevious={handlePrevious}
          hasNext={selectedStoryIndex < userStories.length - 1}
          hasPrevious={selectedStoryIndex > 0}
        />
      )}
    </>
  );
}
