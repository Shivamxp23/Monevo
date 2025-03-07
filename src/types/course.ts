export interface Course {
  id: string;
  title: string;
}

export interface Chapter {
  id: number;
  course_id: string;
  title: string;
  order_number: number;
}

export interface Flashcard {
  id: number;
  chapter_id: number;
  title: string;
  content: string;
  order_number: number;
}

export interface UserProgress {
  id: number;
  user_id: string;
  chapter_id: number;
  completed_at: string | null;
}