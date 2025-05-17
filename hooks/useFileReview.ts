// hooks/useFileReview.ts
import { useEffect, useState } from 'react';

export function useFileReview(review: string) {
  const [highlightedLines, setHighlightedLines] = useState<number[]>([]);
  const [lineComments, setLineComments] = useState<Record<number, string>>({});

  useEffect(() => {
    if (!review) {
      setHighlightedLines([]);
      setLineComments({});
      return;
    }

    const lines = new Set<number>();
    const comments: Record<number, string> = {};

    const lineNumberPatterns = [
      /Line\s+(\d+)-(\d+):/g,
      /Line\s+(\d+):/g,
      /^\s*(\d+)\.\s+/gm,
      /^\s*(\d+)\)\s+/gm,
      /^\s*(\d+)\s+/gm,
      /line\s+(\d+)/gi,
      /lines?\s+(\d+)(?:\s*-\s*(\d+))?/gi,
    ];

    for (const pattern of lineNumberPatterns) {
      let match;
      while ((match = pattern.exec(review)) !== null) {
        if (match[1] && match[2]) {
          const start = parseInt(match[1]);
          const end = parseInt(match[2]);
          if (!isNaN(start) && !isNaN(end)) {
            for (let i = start; i <= end; i++) {
              lines.add(i);
              const commentStart = match.index + match[0].length;
              const sectionMatch = review
                .slice(commentStart)
                .match(
                  /^[^\n]+(?:\n(?!\d+\.|\d+\)|\d+\s|Line\s+\d|line\s+\d)[^\n]*)*/
                );
              if (sectionMatch) comments[i] = sectionMatch[0].trim();
            }
          }
        } else if (match[1]) {
          const line = parseInt(match[1]);
          if (!isNaN(line)) {
            lines.add(line);
            const commentStart = match.index + match[0].length;
            const sectionMatch = review
              .slice(commentStart)
              .match(
                /^[^\n]+(?:\n(?!\d+\.|\d+\)|\d+\s|Line\s+\d|line\s+\d)[^\n]*)*/
              );
            if (sectionMatch) comments[line] = sectionMatch[0].trim();
          }
        }
      }
    }

    setHighlightedLines(Array.from(lines).sort((a, b) => a - b));
    setLineComments(comments);
  }, [review]);

  return { highlightedLines, lineComments };
}
