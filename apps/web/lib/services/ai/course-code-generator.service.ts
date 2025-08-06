
import { Gemini, GEMINI_MODEL } from "@/lib/llamaindex-imports";
import logger from "@/lib/logger";

class CourseCodeGeneratorService {
  private static instance: CourseCodeGeneratorService;
  private gemini: Gemini;

  private constructor() {
    this.gemini = new Gemini({
      apiKey: process.env.GEMINI_API_KEY,
      model: GEMINI_MODEL.GEMINI_PRO_FLASH_LATEST,
    });
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
      const response = await this.gemini.chat({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      let content = "";
      const messageContent = response.message?.content;
      if (typeof messageContent === "string") {
        content = messageContent;
      } else if (Array.isArray(messageContent)) {
        const textContent = messageContent.find(
          (item) => item.type === "text",
        );
        content = textContent?.text || "";
      }

      let courseCode = content.trim();

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
