import { Database } from "@/lib/database.types";

// Course type using the generated Supabase types
export type ICourse = Database["public"]["Tables"]["courses"]["Row"];

// If you need to define insert or update types (which might exclude id, created_at, updated_at)
export type ICourseInsert = Database["public"]["Tables"]["courses"]["Insert"];
export type ICourseUpdate = Database["public"]["Tables"]["courses"]["Update"];
