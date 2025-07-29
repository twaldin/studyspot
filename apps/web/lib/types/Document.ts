// Simplified Document type - only what's actually used
export interface Document {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  course_id: string;
  created_at: string;
  is_starred?: boolean;
  report_count: number;
  has_reported?: boolean;
}