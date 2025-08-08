
import { geminiService } from "./gemini.service";
import logger from "@/lib/logger";

class CourseCodeGeneratorService {
  private static instance: CourseCodeGeneratorService;

  private constructor() {
    // Use existing gemini service instead of direct LlamaIndex integration
  }

  public static getInstance(): CourseCodeGeneratorService {
    if (!CourseCodeGeneratorService.instance) {
      CourseCodeGeneratorService.instance = new CourseCodeGeneratorService();
    }
    return CourseCodeGeneratorService.instance;
  }

  async generateCourseCode(courseTitle: string): Promise<string> {
    try {
      const prompt = 
`You are an expert in creating concise and informative course codes. Based on the following course title, if it already contains a pre-existing course code, simply return that code. Otherwise, generate a short, alphanumeric course code that is easy to remember and clearly represents the course content. The course code should be between 4 and 10 characters long. Try to aim for a maximum of 8 characters.

Course Title: "${courseTitle}"

Generated Course Code:
For example, if the course title is MATH301 - An Introduction to Calculus, the correct course code could be "CALC301". If the course title is "Introduction to Machine Learning", a suitable course code could be "ML101". If the course title is "Advanced Quantum Physics", a suitable course code could be "PHY300".`;
      const result = await geminiService.chat([
        {
          role: "user",
          content: prompt,
        }
      ], {
        disableThinking: true, // Disable thinking for simple generation tasks
        temperature: 0.3, // Lower temperature for more consistent output
        maxTokens: 50 // Short response needed
      });

      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to get response from Gemini");
      }

      let courseCode = result.data.trim();

      // Fallback to a simpler method if the generated code is invalid
      if (!courseCode || courseCode.length > 8 || courseCode.length < 4) {
        logger.warn({ courseTitle, generatedCode: courseCode }, "Generated course code is invalid, falling back to manual generation.");
        courseCode = courseTitle.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8).toUpperCase();
      }

      return courseCode;
    } catch (error) {
      logger.error({ error, courseTitle }, "Failed to generate course code using Gemini. Falling back to manual generation.");
      // Fallback to a simpler method in case of API error
      return courseTitle.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8).toUpperCase();
    }
  }
}

export const courseCodeGeneratorService = CourseCodeGeneratorService.getInstance();
