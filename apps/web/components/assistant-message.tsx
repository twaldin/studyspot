// This component renders a message from the assistant in the chat window.
import { marked } from "marked";
import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { renderMarkdownWithLatex } from "@/lib/renderMarkdown";
import { LinkedResourceCard } from "@/components/linked-resource-card";
import { LinkedResource } from "@/features/chat/chat.types";

interface AssistantMessageProps {
  content: string;
  linkedResources?: LinkedResource[];
  isStreaming?: boolean;
  isTextStreaming?: boolean;
  toolActivity?: string | null;
}

const AssistantMessage: React.FC<AssistantMessageProps> = ({
  content,
  linkedResources,
  isStreaming,
  isTextStreaming,
  toolActivity,
}) => {
  // Initialize with content as fallback for SSR
  const [html, setHtml] = useState(content);

  // Parse the displayed content as Markdown
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") {
      return;
    }

    // Normalize LaTeX delimiters
    const normalizedContent = content
      .replace(/\\\(/g, "$")
      .replace(/\\\)/g, "$");

    renderMarkdownWithLatex(normalizedContent)
      .then((renderedHtml) => {
        setHtml(renderedHtml);
      })
      .catch(async (err) => {
        console.error("Error rendering markdown/LaTeX:", err);
        // Fallback to basic markdown if LaTeX rendering fails
        const fallbackHtml = await marked(content);
        setHtml(fallbackHtml);
      });
  }, [content]);

  // Sanitize HTML to prevent XSS attacks
  const createMarkup = () => {
    // Only run DOMPurify on the client side
    if (typeof window === "undefined") {
      return { __html: html };
    }

    const config = {
      ALLOWED_TAGS: [
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "p",
        "br",
        "div",
        "span",
        "strong",
        "em",
        "u",
        "del",
        "s",
        "ul",
        "ol",
        "li",
        "a",
        "code",
        "pre",
        "blockquote",
        "table",
        "thead",
        "tbody",
        "tr",
        "th",
        "td",
        "svg",
        "path",
        "math",
        "semantics",
        "mrow",
        "msup",
        "mi",
        "mn",
        "mo",
        "mfrac",
        "msqrt",
        "mtext",
        "annotation",
        "mspace",
        "munder",
        "mover",
        "munderover",
        "mtable",
        "mtr",
        "mtd",
        "mfenced",
        "menclose",
        "maction",
        "mstyle",
        "merror",
        "mpadded",
        "mphantom",
      ],
      ALLOWED_ATTR: [
        "href",
        "target",
        "rel",
        "class",
        "id",
        "style",
        "xmlns",
        "width",
        "height",
        "viewBox",
        "fill",
        "stroke",
        "stroke-width",
        "stroke-linecap",
        "stroke-linejoin",
        "d",
        "mathvariant",
        "mathsize",
        "mathcolor",
        "mathbackground",
        "displaystyle",
        "scriptlevel",
        "dir",
      ],
      ALLOWED_URI_REGEXP:
        /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|#):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    };

    let rawHtml = html;

    // Show pencil inline only during active text streaming AND when there's actual content
    if (isTextStreaming && content.trim()) {
      const pencilSvg =
        `<svg class="inline-block h-5 w-5 animate-pulse" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path><path d="m15 5 4 4"></path></svg>`;

      if (content.trim()) {
        const lastP = rawHtml.lastIndexOf("</p>");
        if (lastP !== -1) {
          rawHtml = rawHtml.substring(0, lastP) + " " + pencilSvg + "</p>";
        } else {
          rawHtml = rawHtml + pencilSvg;
        }
      } else {
        rawHtml = pencilSvg;
      }
    }

    const sanitizedHtml = DOMPurify.sanitize(rawHtml, config);

    return { __html: sanitizedHtml };
  };

  return (
    <div className="mx-2.75 flex justify-start">
      <div className="py-0 max-w-xl">
        <div
          className="markdown-content leading-[1.8] select-text"
          dangerouslySetInnerHTML={createMarkup()}
        />

        {/* Show tool activity below the message when active and NOT actively receiving text */}
        {isStreaming && !isTextStreaming && (
          <div className="mt-2 flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
            </div>
            <span className="text-sm">
              StudySpot is {toolActivity || "thinking"}
            </span>
          </div>
        )}

        {/* Render linked resources - only show after streaming is complete */}
        {!isStreaming && linkedResources && linkedResources.length > 0 && (
          <div className="mt-3">
            <div className="grid gap-4 grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3">
              {linkedResources.map((resource) => (
                <LinkedResourceCard
                  key={`${resource.type}-${resource.id}`}
                  resource={resource}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssistantMessage;

