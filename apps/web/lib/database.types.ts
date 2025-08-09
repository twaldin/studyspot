export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      courses: {
        Row: {
          id: string;
          code: string | null;
          title: string | null;
          school_id: string;
          icon: string | null;
          created_at: string;
          updated_at: string;
          canvas_course_id: number | null;
        };
        Insert: {
          id?: string;
          code?: string | null;
          title?: string | null;
          school_id: string;
          icon?: string | null;
          created_at?: string;
          updated_at?: string;
          canvas_course_id?: number | null;
        };
        Update: {
          id?: string;
          code?: string | null;
          title?: string | null;
          school_id?: string;
          icon?: string | null;
          created_at?: string;
          updated_at?: string;
          canvas_course_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "courses_school_id_fkey";
            columns: ["school_id"];
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
        ];
      };
      docs: {
        Row: {
          id: string;
          file_name: string;
          file_url: string;
          file_type: string;
          course_id: string;
          created_at: string;
          file_hash: string | null;
          course_provided: boolean | null;
        };
        Insert: {
          id?: string;
          file_name: string;
          file_url: string;
          file_type: string;
          course_id: string;
          created_at?: string;
          file_hash?: string | null;
          course_provided: boolean | null;
        };
        Update: {
          id?: string;
          file_name?: string;
          file_url?: string;
          file_type?: string;
          course_id?: string;
          created_at?: string;
          file_hash?: string | null;
          course_provided: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: "docs_course_id_fkey";
            columns: ["course_id"];
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
        ];
      };
      schools: {
        Row: {
          id: string;
          name: string;
          city: string | null;
          state: string | null;
          domain: string | null;
          logo_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          city?: string | null;
          state?: string | null;
          domain?: string | null;
          logo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          city?: string | null;
          state?: string | null;
          domain?: string | null;
          logo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      chunks: {
        Row: {
          id: string;
          doc_id: string;
          content: string;
          embedding: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          doc_id: string;
          content: string;
          embedding?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          doc_id?: string;
          content?: string;
          embedding?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chunks_doc_id_fkey";
            columns: ["doc_id"];
            referencedRelation: "docs";
            referencedColumns: ["id"];
          },
        ];
      };
      chats: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          title: string;
          chats: Json;
          created_at: string;
          is_public: boolean;
          share_token: string;
          visibility_mode: 'private' | 'link-only' | 'course';
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          title: string;
          chats: Json;
          created_at?: string;
          is_public?: boolean;
          share_token?: string;
          visibility_mode?: 'private' | 'link-only' | 'course';
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          title?: string;
          chats?: Json;
          created_at?: string;
          is_public?: boolean;
          share_token?: string;
          visibility_mode?: 'private' | 'link-only' | 'course';
        };
        Relationships: [
          {
            foreignKeyName: "chats_course_id_fkey";
            columns: ["course_id"];
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
        ];
      };
      lecture_chat_sessions: {
        Row: {
          id: string;
          course_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lecture_chat_sessions_course_id_fkey";
            columns: ["course_id"];
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
        ];
      };
      lecture_chat_messages: {
        Row: {
          id: string;
          session_id: string;
          user_id: string;
          username: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          user_id: string;
          username: string;
          message: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          user_id?: string;
          username?: string;
          message?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lecture_chat_messages_session_id_fkey";
            columns: ["session_id"];
            referencedRelation: "lecture_chat_sessions";
            referencedColumns: ["id"];
          },
        ];
      };
      flashcard_sets: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          title: string;
          description: string | null;
          created_at: string;
          updated_at: string;
          is_public: boolean;
          share_token: string;
          visibility_mode: 'private' | 'link-only' | 'course';
          creator_name: string | null;
          course_code: string | null;
          course_name: string | null;
          edited_from: string | null;
          original_title: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          title: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
          is_public?: boolean;
          share_token?: string;
          visibility_mode?: 'private' | 'link-only' | 'course';
          creator_name?: string | null;
          course_code?: string | null;
          course_name?: string | null;
          edited_from?: string | null;
          original_title?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          title?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
          is_public?: boolean;
          share_token?: string;
          visibility_mode?: 'private' | 'link-only' | 'course';
          creator_name?: string | null;
          course_code?: string | null;
          course_name?: string | null;
          edited_from?: string | null;
          original_title?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "flashcard_sets_course_id_fkey";
            columns: ["course_id"];
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
        ];
      };
      flashcards: {
        Row: {
          id: string;
          set_id: string;
          side1: string;
          side2: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          set_id: string;
          side1: string;
          side2: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          set_id?: string;
          side1?: string;
          side2?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "flashcards_set_id_fkey";
            columns: ["set_id"];
            referencedRelation: "flashcard_sets";
            referencedColumns: ["id"];
          },
        ];
      };
      quizzes: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          title: string;
          description: string | null;
          difficulty_level: string | null;
          question_count: number;
          created_at: string;
          updated_at: string;
          is_public: boolean;
          share_token: string;
          visibility_mode: 'private' | 'link-only' | 'course';
          creator_name: string | null;
          course_code: string | null;
          course_name: string | null;
          edited_from: string | null;
          original_title: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          title: string;
          description?: string | null;
          difficulty_level?: string | null;
          question_count?: number;
          created_at?: string;
          updated_at?: string;
          is_public?: boolean;
          share_token?: string;
          visibility_mode?: 'private' | 'link-only' | 'course';
          creator_name?: string | null;
          course_code?: string | null;
          course_name?: string | null;
          edited_from?: string | null;
          original_title?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          title?: string;
          description?: string | null;
          difficulty_level?: string | null;
          question_count?: number;
          created_at?: string;
          updated_at?: string;
          is_public?: boolean;
          share_token?: string;
          visibility_mode?: 'private' | 'link-only' | 'course';
          creator_name?: string | null;
          course_code?: string | null;
          course_name?: string | null;
          edited_from?: string | null;
          original_title?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "quizzes_course_id_fkey";
            columns: ["course_id"];
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
        ];
      };
      quiz_questions: {
        Row: {
          id: string;
          quiz_id: string;
          question: string;
          option_a: string;
          option_b: string;
          option_c: string | null;
          option_d: string | null;
          correct_answer: string;
          explanation: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          quiz_id: string;
          question: string;
          option_a: string;
          option_b: string;
          option_c?: string | null;
          option_d?: string | null;
          correct_answer: string;
          explanation?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          quiz_id?: string;
          question?: string;
          option_a?: string;
          option_b?: string;
          option_c?: string | null;
          option_d?: string | null;
          correct_answer?: string;
          explanation?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey";
            columns: ["quiz_id"];
            referencedRelation: "quizzes";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      match_chunks: {
        Args: {
          query_embedding: string;
          match_threshold: number;
          match_count: number;
          min_content_length: number;
        };
        Returns: {
          id: string;
          doc_id: string;
          content: string;
          similarity: number;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  } ? keyof (
      & Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
      & Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"]
    )
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database } ? (
    & Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    & Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"]
  )[TableName] extends {
    Row: infer R;
  } ? R
  : never
  : DefaultSchemaTableNameOrOptions extends keyof (
    & DefaultSchema["Tables"]
    & DefaultSchema["Views"]
  ) ? (
      & DefaultSchema["Tables"]
      & DefaultSchema["Views"]
    )[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    } ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  } ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][
    TableName
  ] extends {
    Insert: infer I;
  } ? I
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    } ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  } ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][
    TableName
  ] extends {
    Update: infer U;
  } ? U
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    } ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  } ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]][
      "CompositeTypes"
    ]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][
    CompositeTypeName
  ]
  : PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
