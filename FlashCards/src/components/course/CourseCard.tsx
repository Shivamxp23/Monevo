import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Course, Chapter, UserProgress } from "@/types/course";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Link } from "react-router-dom";

interface CourseCardProps {
  course: Course;
}

export const CourseCard = ({ course }: CourseCardProps) => {
  const { user } = useAuth();

  const { data: chapters } = useQuery({
    queryKey: ["chapters", course.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chapters")
        .select("*")
        .eq("course_id", course.id)
        .order("order_number");
      
      if (error) throw error;
      return data as Chapter[];
    },
  });

  const { data: progress } = useQuery({
    queryKey: ["progress", course.id, user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.id);
      
      if (error) throw error;
      return data as UserProgress[];
    },
    enabled: !!user,
  });

  const isCompleted = chapters && progress && chapters.length > 0 && 
    chapters.every(chapter => 
      progress.some(p => p.chapter_id === chapter.id && p.completed_at)
    );

  return (
    <Link to={`/${course.id}`}>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {course.title}
            {isCompleted && (
              <Badge variant="success" className="bg-green-500 text-white">
                Completed
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {chapters?.length || 0} chapters
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};