// This component renders a message from the assistant in the chat window.
import { marked } from "marked";
import React, { useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";
import { renderMarkdownWithLatex } from "@/lib/renderMarkdown";
import { LinkedResourceCard } from "@/components/linked-resource-card";
import { ShareModal } from "@/components/share-modal";
import { LinkedResource } from "@/features/chat/chat.types";
import { Button } from "@studyspot/ui/components/button";
import { ChevronDown, ChevronUp, Copy, Share } from "lucide-react";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";

interface AssistantMessageProps {
  content: string;
  linkedResources?: LinkedResource[];
  isStreaming?: boolean;
  isTextStreaming?: boolean;
  toolActivity?: string | null;
  chatId?: string;
  chatTitle?: string;
  chatContainerRef?: React.RefObject<HTMLDivElement>;
  isPublicShare?: boolean; // When true, use share URLs for linkedResources
}

const AssistantMessage: React.FC<AssistantMessageProps> = ({
  content,
  linkedResources,
  isStreaming,
  isTextStreaming,
  toolActivity,
  chatId,
  chatTitle,
  chatContainerRef,
  isPublicShare = false,
}) => {
  // Initialize with content as fallback for SSR
  const [html, setHtml] = useState(content);
  const [resourcesOpen, setResourcesOpen] = useState(false); // Start collapsed
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const resourcesSectionRef = useRef<HTMLDivElement>(null);

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

  // Handle auto-scroll when resources animation completes
  const handleResourcesAnimationComplete = () => {
    console.log('🔍 Resources animation completed, checking scroll...');
    
    if (resourcesSectionRef.current && chatContainerRef?.current) {
      const resourcesRect = resourcesSectionRef.current.getBoundingClientRect();
      const chatContainerRect = chatContainerRef.current.getBoundingClientRect();
      
      // Find the input bar by looking for the form or textarea in the chat area
      const inputBar = chatContainerRef.current.parentElement?.querySelector('form, [role="textbox"], textarea') as HTMLElement;
      let inputBarHeight = 0;
      
      if (inputBar) {
        const inputBarRect = inputBar.getBoundingClientRect();
        inputBarHeight = inputBarRect.height + 32; // Add some padding for the container
        console.log('📱 Input bar found:', { height: inputBarHeight, element: inputBar.tagName });
      } else {
        // Fallback estimate for input bar height (form + padding)
        inputBarHeight = 100; // Conservative estimate
        console.log('📱 Input bar not found, using fallback height:', inputBarHeight);
      }
      
      // The effective bottom of the visible area is reduced by the input bar height
      const effectiveBottom = chatContainerRect.bottom - inputBarHeight;
      
      console.log('📏 Dimensions:', {
        resourcesTop: resourcesRect.top,
        resourcesBottom: resourcesRect.bottom,
        resourcesHeight: resourcesRect.height,
        chatContainerTop: chatContainerRect.top,
        chatContainerBottom: chatContainerRect.bottom,
        inputBarHeight,
        effectiveBottom,
        isResourcesBelowEffectiveBottom: resourcesRect.bottom > effectiveBottom
      });
      
      // Check if the bottom of resources is below the effective visible area (accounting for input bar)
      if (resourcesRect.bottom > effectiveBottom) {
        console.log('📜 Resources below effective bottom (accounting for input bar), scrolling...');
        
        // Calculate how much to scroll - need to bring resources above the input bar
        const scrollOffset = resourcesRect.bottom - effectiveBottom + 20; // 20px padding
        const currentScroll = chatContainerRef.current.scrollTop;
        
        console.log('📍 Scroll calculation:', {
          scrollOffset,
          currentScroll,
          newScrollPosition: currentScroll + scrollOffset
        });
        
        chatContainerRef.current.scrollTo({
          top: currentScroll + scrollOffset,
          behavior: "smooth"
        });
      } else {
        console.log('✅ Resources already visible above input bar, no scroll needed');
      }
    } else {
      console.log('❌ Resources ref or chat container ref not found', {
        resourcesRef: !!resourcesSectionRef.current,
        chatContainerRef: !!chatContainerRef?.current
      });
    }
  };

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
          className="markdown-content leading-[1.8] select-text [&>*:last-child]:mb-0"
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
          <>
            {/* Separator line */}
            <div className="mt-2 mb-2 border-t border-border/60"></div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              {/* Left: Resources toggle button */}
              <div className="flex items-center">
                {linkedResources && linkedResources.length > 0
                  ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs gap-1 cursor-pointer"
                      onClick={() => setResourcesOpen(!resourcesOpen)}
                    >
                      Resources ({linkedResources.length})
                      {resourcesOpen
                        ? <ChevronUp className="h-3 w-3" />
                        : <ChevronDown className="h-3 w-3" />}
                    </Button>
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

            {/* Collapsible Resources Section */}
            {linkedResources && linkedResources.length > 0 && (
              <motion.div
                layout
                className="mt-2"
              >
                <AnimatePresence initial={false}>
                  {resourcesOpen && (
                    <motion.div
                      ref={resourcesSectionRef}
                      initial={{ opacity: 0, scaleY: 0 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      exit={{ opacity: 0, scaleY: 0 }}
                      transition={{ 
                        duration: 0.15, 
                        ease: "easeOut",
                        opacity: { duration: 0.1 }
                      }}
                      style={{ originY: 0 }}
                      onAnimationComplete={handleResourcesAnimationComplete}
                      className="overflow-hidden"
                    >
                      <div
                        className={`grid gap-3 ${linkedResources.length === 1
                            ? "grid-cols-1"
                            : "grid-cols-2"
                          }`}
                      >
                        {linkedResources.map((resource) => (
                          <LinkedResourceCard
                            key={`${resource.type}-${resource.id}`}
                            resource={resource}
                            useShareUrls={isPublicShare}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </>
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
