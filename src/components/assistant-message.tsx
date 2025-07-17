// This component renders a message from the assistant in the chat window.
import { marked } from 'marked';
import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { useDocumentsByIds } from '@/hooks/api/documents';
import { Document } from '@/features/document/document.service';
import { renderMarkdownWithLatex } from '@/lib/renderMarkdown';
import { DocumentCard } from '@/components/document-card';

interface AssistantMessageProps {
  content: string;
  linkedDocumentIds?: string[];
  isStreaming?: boolean;
}

const AssistantMessage: React.FC<AssistantMessageProps> = ({
  content,
  linkedDocumentIds,
  isStreaming,
}) => {
  const [html, setHtml] = useState('');
  
  // Fetch linked documents
  const { data: linkedDocuments = [], isLoading: isLoadingDocuments } = useDocumentsByIds(linkedDocumentIds || []);

  // Parse the displayed content as Markdown
  useEffect(() => {
    // Normalize LaTeX delimiters
    const normalizedContent = content
      .replace(/\\\(/g, '$')
      .replace(/\\\)/g, '$');

    renderMarkdownWithLatex(normalizedContent)
      .then(renderedHtml => {
        setHtml(renderedHtml);
      })
      .catch(async err => {
        console.error('Error rendering markdown/LaTeX:', err);
        // Fallback to basic markdown if LaTeX rendering fails
        const fallbackHtml = await marked(content);
        setHtml(fallbackHtml);
      });
  }, [content]);

  // Sanitize HTML to prevent XSS attacks
  const createMarkup = () => {
    // Only run DOMPurify on the client side
    if (typeof window === 'undefined') {
      return { __html: html };
    }

    const config = {
      ALLOWED_TAGS: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'br', 'div', 'span', 'strong', 'em', 'u', 'del', 's',
        'ul', 'ol', 'li',
        'a', 'code', 'pre', 'blockquote',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'svg', 'path',
        'math', 'semantics', 'mrow', 'msup', 'mi', 'mn', 'mo', 'mfrac', 'msqrt', 'mtext',
        'annotation', 'mspace', 'munder', 'mover', 'munderover', 'mtable', 'mtr', 'mtd',
        'mfenced', 'menclose', 'maction', 'mstyle', 'merror', 'mpadded', 'mphantom'
      ],
      ALLOWED_ATTR: [
        'href', 'target', 'rel', 'class', 'id', 'style',
        'xmlns', 'width', 'height', 'viewBox', 'fill', 'stroke', 'stroke-width', 
        'stroke-linecap', 'stroke-linejoin', 'd',
        'mathvariant', 'mathsize', 'mathcolor', 'mathbackground',
        'displaystyle', 'scriptlevel', 'dir'
      ],
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|#):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
    };

    let rawHtml = html;
    
    if (isStreaming) {
      const pencilSvg = `<svg class="inline-block h-5 w-5 animate-pulse" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path><path d="m15 5 4 4"></path></svg>`;

      if (content.trim()) {
        const lastP = rawHtml.lastIndexOf('</p>');
        if (lastP !== -1) {
          rawHtml = rawHtml.substring(0, lastP) + ' ' + pencilSvg + '</p>';
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
        
        {/* Render linked documents - only show after streaming is complete */}
        {!isStreaming && linkedDocuments.length > 0 && (
          <div className="mt-3">
            <div className="grid gap-4 grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3">
              {linkedDocuments.map((document) => (
                <DocumentCard
                  key={document.id}
                  url={document.file_url}
                  file={document}
                  fileType={document.file_type === 'application/pdf' ? 'pdf' : 'Unknown'}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Show loading state for documents */}
        {!isStreaming && isLoadingDocuments && linkedDocumentIds && linkedDocumentIds.length > 0 && (
          <div className="mt-3 text-sm text-gray-500">
            Loading sources...
          </div>
        )}
      </div>
    </div>
  );
};

export default AssistantMessage;
