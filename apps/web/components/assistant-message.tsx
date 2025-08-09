// This component renders a message from the assistant in the chat window.
import { marked } from "marked";
import React, { useEffect, useState, useRef } from "react";
import DOMPurify from "dompurify";
import { renderMarkdownWithLatex } from "@/lib/renderMarkdown";
import { LinkedResourceCard } from "@/components/linked-resource-card";
import { ShareModal } from "@/components/share-modal";
import { LinkedResource } from "@/features/chat/chat.types";
import { Button } from "@studyspot/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@studyspot/ui/components/dropdown-menu";
import { ChevronDown, ChevronUp, Copy, Share } from "lucide-react";
import toast from "react-hot-toast";

interface AssistantMessageProps {
  content: string;
  linkedResources?: LinkedResource[];
  isStreaming?: boolean;
  isTextStreaming?: boolean;
  toolActivity?: string | null;
  chatId?: string;
  chatTitle?: string;
}

const AssistantMessage: React.FC<AssistantMessageProps> = ({
  content,
  linkedResources,
  isStreaming,
  isTextStreaming,
  toolActivity,
  chatId,
  chatTitle,
}) => {
  // Initialize with content as fallback for SSR
  const [html, setHtml] = useState(content);
  const [resourcesOpen, setResourcesOpen] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Message copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy message");
    }
  };

  const isFinished = !isStreaming;

  return (
    <div className="mx-2.75 flex justify-start">
      <div className="py-0 max-w-xl relative">
        <div
          className="markdown-content leading-[1.8] select-text"
          dangerouslySetInnerHTML={createMarkup()}
        />

        {/* Show tool activity below the message when active and NOT actively receiving text */}
        {isStreaming && !isTextStreaming && (
          <div className="mt-2 flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]">
              </div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]">
              </div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce">
              </div>
            </div>
            <span className="text-sm">
              StudySpot is {toolActivity || "thinking"}
            </span>
          </div>
        )}

        {/* Bottom controls for finished messages */}
        {isFinished && (
          <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
            {/* Left: Resources dropdown */}
            <div className="flex items-center">
              {linkedResources && linkedResources.length > 0
                ? (
                  <DropdownMenu
                    open={resourcesOpen}
                    onOpenChange={() => {
                      // Completely ignore all automatic open/close events
                      // Only manual setState calls will change the dropdown
                    }}
                    modal={false}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs gap-1 cursor-pointer"
                        onClick={() => {
                          setResourcesOpen(!resourcesOpen);
                        }}
                      >
                        Resources
                        {resourcesOpen
                          ? <ChevronUp className="h-3 w-3" />
                          : <ChevronDown className="h-3 w-3" />}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="p-0 w-auto max-w-xl border-none shadow-none bg-transparent"
                    >
                      <div className="grid gap-4 grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3">
                        {linkedResources.map((resource) => (
                          <LinkedResourceCard
                            key={`${resource.type}-${resource.id}`}
                            resource={resource}
                          />
                        ))}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )
                : (
                  <div className="h-7" /> // Spacer when no resources
                )}
            </div>

            {/* Right: Share and Copy buttons */}
            <div className="flex items-center gap-1">
              <Button
                onClick={handleCopy}
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 cursor-pointer"
              >
                <Copy className="h-3 w-3" />
              </Button>
              {chatId && (
                <Button
                  onClick={() => setIsShareModalOpen(true)}
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 cursor-pointer"
                >
                  <Share className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {chatId && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          url={`/chat/${chatId}`}
          title={chatTitle || "Chat"}
          type="chat"
          resourceId={chatId}
        />
      )}
    </div>
  );
};

export default AssistantMessage;
