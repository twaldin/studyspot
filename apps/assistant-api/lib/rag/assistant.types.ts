import { z } from 'zod';

export const AssistantResponseSchema = z.object({
  message: z.string().describe("The text content of the assistant's response to the user."),
  linkedDocumentIds: z
    .array(z.string())
    .optional()
    .describe("An optional list of document IDs relevant to the response."),
});

export type AssistantResponse = z.infer<typeof AssistantResponseSchema>;