'use client';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/vs2015.css'; // or any other theme

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className='prose prose-sm dark:prose-invert max-w-none'>
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{content}</ReactMarkdown>
    </div>
  );
}
