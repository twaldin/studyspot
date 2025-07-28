"use client";

import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { renderMarkdownWithLatex } from "@/lib/renderMarkdown";

interface QuizContentProps {
  content: string;
  className?: string;
  style?: React.CSSProperties;
}

export const QuizContent: React.FC<QuizContentProps> = ({
  content,
  className = "",
  style,
}) => {
  // Initialize with content as fallback for SSR
  const [html, setHtml] = useState(content);

  // Parse the displayed content as Markdown with LaTeX
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
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
      .catch((err) => {
        console.error("Error rendering markdown/LaTeX in quiz:", err);
        // Fallback to original content if rendering fails
        setHtml(content);
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
    };

    const sanitizedHtml = DOMPurify.sanitize(html, config);
    return { __html: sanitizedHtml };
  };

  return (
    <div
      className={`quiz-content leading-relaxed ${className}`}
      style={style}
      dangerouslySetInnerHTML={createMarkup()}
    />
  );
};