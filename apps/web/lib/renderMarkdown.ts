import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

export async function renderMarkdownWithLatex(markdown: string) {
  // Only run on client side to avoid DOMMatrix errors during SSR
  if (typeof window === 'undefined') {
    // Return basic markdown processing without LaTeX on server side
    try {
      const file = await unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeStringify)
        .process(markdown);
      return String(file);
    } catch (error) {
      console.error('Error rendering basic markdown:', error);
      return markdown;
    }
  }

  try {
    // Dynamically import KaTeX only on client side
    const { default: rehypeKatex } = await import('rehype-katex');
    
    const file = await unified()
      .use(remarkParse)
      .use(remarkMath)
      .use(remarkRehype)
      .use(rehypeKatex)
      .use(rehypeStringify)
      .process(markdown);
    return String(file);
  } catch (error) {
    console.error('Error rendering markdown with LaTeX:', error);
    // Fallback to basic markdown processing
    try {
      const file = await unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeStringify)
        .process(markdown);
      return String(file);
    } catch (fallbackError) {
      console.error('Error rendering fallback markdown:', fallbackError);
      return markdown;
    }
  }
}