import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun, LogOut, ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChapterCard } from "@/components/course/ChapterCard";
import { Flashcard } from "@/components/course/Flashcard";
import { Chapter, Course, Flashcard as FlashcardType } from "@/types/course";

export default function CourseContent() {
  const { setTheme, theme } = useTheme();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { courseId, chapterId } = useParams();
  const chapterIdNumber = chapterId ? parseInt(chapterId) : undefined;

  const { data: course } = useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();
      
      if (error) throw error;
      return data as Course;
    },
  });

  const { data: chapters } = useQuery({
    queryKey: ["chapters", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chapters")
        .select("*")
        .eq("course_id", courseId)
        .order("order_number");
      
      if (error) throw error;
      return data as Chapter[];
    },
  });

  const { data: flashcards } = useQuery({
    queryKey: ["flashcards", chapterIdNumber],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("flashcards")
        .select("*")
        .eq("chapter_id", chapterIdNumber)
        .order("order_number");
      
      if (error) throw error;
      return data as FlashcardType[];
    },
    enabled: !!chapterIdNumber,
  });

  const { data: currentChapter } = useQuery({
    queryKey: ["chapter", chapterIdNumber],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chapters")
        .select("*")
        .eq("id", chapterIdNumber)
        .single();
      
      if (error) throw error;
      return data as Chapter;
    },
    enabled: !!chapterIdNumber,
  });

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back
            </Button>
            <Button variant="ghost" onClick={() => navigate("/")}>
              Home
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" onClick={signOut}>
              <LogOut className="mr-2 h-5 w-5" />
              Log out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {course && (
          <h1 className="text-3xl font-bold mb-8">
            {course.title}
            {currentChapter && ` - ${currentChapter.title}`}
          </h1>
        )}

        {!chapterId && chapters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chapters.map((chapter) => (
              <ChapterCard key={chapter.id} chapter={chapter} />
            ))}
          </div>
        )}

        {chapterIdNumber && flashcards && (
          <Flashcard
            flashcards={flashcards}
            chapterId={chapterIdNumber}
            onComplete={() => navigate(`/${courseId}`)}
          />
        )}
      </main>
    </div>
  );
}