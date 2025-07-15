import { geminiService } from "@/lib/services/ai/gemini.service";
import {
  CourseExtractionRequest,
  CourseExtractionResponse,
  CourseInfoSchema,
} from "@/lib/types/AITypes";
import logger, { LogContext } from "@/lib/logger";

// PDF Parser type definitions
interface PDFTextItem {
  R: Array<{ T: string }>;
}

interface PDFPage {
  Texts: PDFTextItem[];
}

interface PDFData {
  Pages: PDFPage[];
}

function extractJSONFromText(text: string): unknown {
  let cleanText = text.trim();

  // Method 1: Look for JSON in markdown code blocks
  const markdownMatch = cleanText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
  if (markdownMatch && markdownMatch[1]) {
    try {
      return JSON.parse(markdownMatch[1].trim());
    } catch (e) {
      // Continue to next method
    }
  }

  // Method 2: Look for first JSON object in the text
  const jsonMatch = cleanText.match(/\{[\s\S]*?\}/);
  if (jsonMatch && jsonMatch[0]) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (e) {
      // Continue to next method
    }
  }

  // Method 3: Remove markdown markers manually
  const cleanedText = cleanText
    .replace(/^```(?:json)?/gm, "")
    .replace(/```$/gm, "")
    .trim();

  try {
    return JSON.parse(cleanedText);
  } catch (e) {
    throw new Error(
      `Failed to parse JSON from response: ${text.substring(0, 200)}...`,
    );
  }
}

/**
 * Extract course information from document content
 */
export async function extractCourseInfo(
  request: CourseExtractionRequest,
): Promise<CourseExtractionResponse> {
  try {
    logger.info(
      LogContext.ai("extract_course_info", "gemini", {
        fileUrl: request.fileUrl,
      }),
      "Starting course info extraction",
    );

    // Fetch and process file content
    const response = await fetch(request.fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "";

    let text = "";
    if (contentType.includes("application/pdf")) {
      // Use existing PDF parsing logic
      const PDFParser = require("pdf2json");
      const buffer = Buffer.from(arrayBuffer);
      text = await new Promise<string>((resolve, reject) => {
        const pdfParser = new PDFParser();
        pdfParser.on("pdfParser_dataReady", (pdfData: PDFData) => {
          try {
            const extractedText = pdfData.Pages
              .map((page: PDFPage) =>
                page.Texts
                  .map((text: PDFTextItem) => decodeURIComponent(text.R[0].T))
                  .join(" ")
              )
              .join("\n")
              .trim();
            resolve(extractedText);
          } catch (error) {
            reject(new Error("Failed to extract text from PDF structure"));
          }
        });
        pdfParser.on("pdfParser_dataError", (error: Error) => {
          reject(new Error(`PDF parsing error: ${error}`));
        });
        pdfParser.parseBuffer(buffer);
      });
    } else if (contentType.includes("text/")) {
      text = new TextDecoder().decode(arrayBuffer);
    } else {
      throw new Error(`Unsupported file type: ${contentType}`);
    }

    if (!text.trim()) {
      throw new Error("No text content found in file");
    }

    // Truncate very long text to avoid token limits
    if (text.length > 10000) {
      text = text.substring(0, 10000);
    }

    const prompt = `
        Extract course information from the following syllabus text. You must respond with ONLY valid JSON in this exact format:

        {
          "courseCode": "COURSE_CODE_HERE_OR_NULL",
          "courseTitle": "COURSE_TITLE_HERE_OR_NULL", 
          "schoolName": "SCHOOL_NAME_HERE_OR_NULL"
        }

        Rules:
        - Return null for any field that cannot be found or determined with confidence
        - Do not include any explanatory text, only the JSON object
        - Do not wrap the JSON in markdown code blocks
        - Ensure the JSON is valid and parseable

        Syllabus text:
        ${text}
      `;

    const geminiResponse = await geminiService.chat([
      { role: "user", content: prompt },
    ]);

    if (!geminiResponse.success || !geminiResponse.data) {
      throw new Error("Failed to get response from Gemini");
    }

    // Parse the structured response
    const parsedJSON = extractJSONFromText(geminiResponse.data);
    const courseInfo = CourseInfoSchema.parse(parsedJSON);

    // Normalize the response
    const normalizedResponse = {
      courseCode: courseInfo.courseCode || "",
      courseTitle: courseInfo.courseTitle || "",
      confidence: 0.8,
    };

    logger.info(
      LogContext.ai("extract_course_info", "gemini", {
        hasCode: !!normalizedResponse.courseCode,
        hasTitle: !!normalizedResponse.courseTitle,
      }),
      "Course info extraction completed",
    );

    return {
      success: true,
      data: courseInfo,
      provider: "gemini",
      confidence: 0.8,
    };
  } catch (error) {
    logger.error(
      LogContext.ai("extract_course_info", "gemini", {
        error: error instanceof Error ? error.message : "Unknown error",
        fileUrl: request.fileUrl,
      }),
      "Course info extraction failed",
    );

    return {
      success: false,
      error: error instanceof Error
        ? error.message
        : "Failed to extract course information",
      provider: "gemini",
      confidence: 0,
      data: {
        courseCode: null,
        courseTitle: null,
        schoolName: null,
      },
    };
  }
}

