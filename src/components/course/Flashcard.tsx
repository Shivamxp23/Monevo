import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Flashcard as FlashcardType } from "@/types/course";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface FlashcardProps {
  flashcards: FlashcardType[];
  chapterId: number;
  onComplete: () => void;
}

export const Flashcard = ({ flashcards, chapterId, onComplete }: FlashcardProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleNext = async () => {
    if (currentIndex === flashcards.length - 1) {
      try {
        if (user) {
          await supabase
            .from("user_progress")
            .upsert({
              user_id: user.id,
              chapter_id: chapterId,
              completed_at: new Date().toISOString(),
            });
          onComplete();
          toast({
            title: "Chapter completed!",
            description: "Your progress has been saved.",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to save progress.",
          variant: "destructive",
        });
      }
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  if (!flashcards.length) return null;

  const currentFlashcard = flashcards[currentIndex];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="min-h-[400px] flex flex-col">
        <CardContent className="flex-grow flex flex-col justify-between p-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{currentFlashcard.title}</h3>
            <p className="whitespace-pre-wrap">{currentFlashcard.content}</p>
          </div>
          
          <div className="flex justify-between items-center mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} of {flashcards.length}
            </span>
            
            <Button onClick={handleNext}>
              {currentIndex === flashcards.length - 1 ? (
                "Complete"
              ) : (
                <>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};