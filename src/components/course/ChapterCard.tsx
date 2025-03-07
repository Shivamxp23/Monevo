import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Chapter } from "@/types/course";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Link, useParams } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

interface ChapterCardProps {
  chapter: Chapter;
}

export const ChapterCard = ({ chapter }: ChapterCardProps) => {
  const { user } = useAuth();
  const { courseId } = useParams();

  const { data: flashcards } = useQuery({
    queryKey: ["flashcards", chapter.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("flashcards")
        .select("*")
        .eq("chapter_id", chapter.id)
        .order("order_number");
      
      if (error) throw error;
      return data;
    },
  });

  const { data: progress } = useQuery({
    queryKey: ["progress", chapter.id, user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("user_progress")
        .select("*")
        .eq("chapter_id", chapter.id)
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const progressPercentage = progress?.completed_at ? 100 : 0;

  return (
    <Link to={`/${courseId}/${chapter.id}`}>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>{chapter.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {flashcards?.length || 0} flashcards
            </p>
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-sm text-muted-foreground text-right">
              {progressPercentage}% completed
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};