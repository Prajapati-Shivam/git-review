'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { ReviewButton } from './review-button';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';
import { FileCode2 } from 'lucide-react';

interface FileContentProps {
  selectedFile: string;
  fileContent: string;
  highlightedLines: number[];
  lineComments: Record<number, string>;
  onLineClick: (lineNumber: number, e: React.MouseEvent) => void;
  setReview: (review: string) => void;
  showDialog: boolean;
  selectedLine: number | null;
  onCloseDialog: () => void;
}

export function FileContent({
  selectedFile,
  fileContent,
  highlightedLines,
  lineComments,
  onLineClick,
  setReview,
  showDialog,
  selectedLine,
  onCloseDialog,
}: FileContentProps) {
  const [reviewLen, setReviewLen] = useState(0);

  const MAX_REVIEWS_PER_DAY = 5;
  const STORAGE_KEY = 'codeReviewTracker';

  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    const now = new Date();

    if (data) {
      const parsed = JSON.parse(data);
      const lastReset = new Date(parsed.lastReset);

      const isSameDay =
        lastReset.getFullYear() === now.getFullYear() &&
        lastReset.getMonth() === now.getMonth() &&
        lastReset.getDate() === now.getDate();

      if (isSameDay) {
        setReviewLen(parsed.count);
      } else {
        // Reset for a new day
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ count: 0, lastReset: now.toISOString() })
        );
        setReviewLen(0);
      }
    } else {
      // First time setup
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ count: 0, lastReset: now.toISOString() })
      );
    }
  }, []);

  const incrementReviewCount = () => {
    const now = new Date();
    const newCount = reviewLen + 1;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ count: newCount, lastReset: now.toISOString() })
    );
    setReviewLen(newCount);
  };

  const getLanguageFromFileName = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'js':
      case 'jsx':
        return 'javascript';
      case 'css':
        return 'css';
      case 'html':
        return 'html';
      case 'json':
        return 'json';
      case 'md':
        return 'markdown';
      default:
        return 'text';
    }
  };

  const lineProps = (lineNumber: number) => {
    const isHighlighted = highlightedLines.includes(lineNumber);
    const comment = lineComments[lineNumber];

    return {
      style: {
        display: 'block',
        backgroundColor: isHighlighted
          ? 'rgba(255, 255, 0, 0.2)'
          : 'transparent',
        borderLeft: isHighlighted ? '3px solid #ffd700' : 'none',
        paddingLeft: isHighlighted ? '5px' : '0',
        transition: 'background-color 0.2s ease',
        cursor: isHighlighted ? 'pointer' : 'default',
      },
      onClick: (e: React.MouseEvent) => {
        if (isHighlighted && comment) {
          onLineClick(lineNumber, e);
        }
      },
    };
  };

  return (
    <>
      <Card className='border-2 hover:border-neutral-400 lg:col-span-3'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-xl'>🗂️ File Content</CardTitle>
            {selectedFile && (
              <div className='flex items-center gap-4'>
                <div>
                  <Progress value={(reviewLen / MAX_REVIEWS_PER_DAY) * 100} />
                  <p className='mt-1 text-gray-600 text-sm'>
                    <strong>{reviewLen}</strong> out of{' '}
                    <strong>{MAX_REVIEWS_PER_DAY}</strong> reviews used today
                  </p>
                </div>
                <ReviewButton
                  selectedFile={selectedFile}
                  fileContent={fileContent}
                  setReview={setReview}
                  isDisabled={reviewLen >= MAX_REVIEWS_PER_DAY}
                  onReviewComplete={incrementReviewCount}
                />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className='flex-1'>
          <ScrollArea className='h-[500px]'>
            {selectedFile ? (
              <div className='relative h-full'>
                <div className='rounded-md overflow-hidden h-full'>
                  <SyntaxHighlighter
                    language={getLanguageFromFileName(selectedFile)}
                    customStyle={{
                      margin: 0,
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      lineHeight: '1.5',
                    }}
                    showLineNumbers
                    wrapLines
                    lineProps={lineProps}
                  >
                    {fileContent}
                  </SyntaxHighlighter>
                </div>
              </div>
            ) : (
              <div className='h-full flex flex-col gap-8 md:gap-20 items-center justify-center text-muted-foreground'>
                <p>Select a file from the list to view its content</p>
                <FileCode2
                  className='animate-bounce text-muted-foreground'
                  size={80}
                  color='currentColor'
                />
              </div>
            )}
            <ScrollBar orientation='horizontal' />
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={onCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Line {selectedLine}</DialogTitle>
          </DialogHeader>
          <div className='prose dark:prose-invert max-w-none text-sm'>
            <span className='whitespace-pre-wrap'>
              {selectedLine && lineComments[selectedLine]
                ? lineComments[selectedLine]
                : ''}
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
