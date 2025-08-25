// Simple Document type definition for the landing page
export interface Document {
  id: string;
  file_url: string;
  file_name: string;
  file_type: string;
  course_id: string;
  created_at: string;
  report_count: number;
}