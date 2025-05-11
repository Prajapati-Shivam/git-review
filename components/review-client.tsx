'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { CodeReview } from './code-review';
import { FileContent } from './file-content';
import { Badge } from './ui/badge';
import { Loader2 } from 'lucide-react';

interface GithubFile {
  name: string;
  path: string;
  type: string;
  url: string;
  html_url: string;
  git_url: string;
  [key: string]: any;
}

interface ReviewClientProps {
  owner: string;
  repo: string;
  path: string;
}

export const ReviewClient: React.FC<ReviewClientProps> = ({
  owner,
  repo,
  path,
}) => {
  const [review, setReview] = useState<string>('');
  const [highlightedLines, setHighlightedLines] = useState<number[]>([]);
  const [lineComments, setLineComments] = useState<Record<number, string>>({});
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const [files, setFiles] = useState<GithubFile[]>([]);
  const [currentFile, setCurrentFile] = useState<string>(path || '');
  const [fileContent, setFileContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Reset review state when file changes
  useEffect(() => {
    setReview('');
    setHighlightedLines([]);
    setLineComments({});
    setSelectedLine(null);
    setShowDialog(false);
  }, [currentFile]);

  // Fetch all files and selected file content
  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      const data = await getAllFilesFromGitHub(owner, repo);
      if (data.files) setFiles(data.files);

      if (path) {
        const selected = await getSelectedFile(owner, repo, path);
        if (selected.content) {
          setFileContent(selected.content);
          setCurrentFile(path);
        }
      }

      setLoading(false);
    };

    fetchFiles();
  }, [owner, repo, path]);

  // Parse review and extract lines/comments
  useEffect(() => {
    if (review) {
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
            const startLine = parseInt(match[1]);
            const endLine = parseInt(match[2]);
            if (!isNaN(startLine) && !isNaN(endLine)) {
              for (let i = startLine; i <= endLine; i++) {
                lines.add(i);
                const commentStart = match.index + match[0].length;
                const nextSectionMatch = review
                  .slice(commentStart)
                  .match(
                    /^[^\n]+(?:\n(?!\d+\.|\d+\)|\d+\s|Line\s+\d|line\s+\d)[^\n]*)*/
                  );
                if (nextSectionMatch) {
                  comments[i] = nextSectionMatch[0].trim();
                }
              }
            }
          } else if (match[1]) {
            const lineNumber = parseInt(match[1]);
            if (!isNaN(lineNumber)) {
              lines.add(lineNumber);
              const commentStart = match.index + match[0].length;
              const nextSectionMatch = review
                .slice(commentStart)
                .match(
                  /^[^\n]+(?:\n(?!\d+\.|\d+\)|\d+\s|Line\s+\d|line\s+\d)[^\n]*)*/
                );
              if (nextSectionMatch) {
                comments[lineNumber] = nextSectionMatch[0].trim();
              }
            }
          }
        }
      }

      setHighlightedLines(Array.from(lines).sort((a, b) => a - b));
      setLineComments(comments);
    }
  }, [review]);

  const getAllFilesFromGitHub = async (owner: string, repo: string) => {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents`,
        {
          headers: {
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }
      const files = await response.json();
      return { files };
    } catch (error) {
      console.error('Error fetching GitHub files:', error);
      return { error: 'Failed to fetch GitHub files' };
    }
  };

  const getSelectedFile = async (owner: string, repo: string, path: string) => {
    try {
      if (!path) return { error: 'File path is required' };

      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
        {
          headers: {
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }

      const fileData = await response.json();
      const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
      return { content };
    } catch (error) {
      console.error('Error fetching file content:', error);
      return { error: 'Failed to fetch file content' };
    }
  };

  const handleFileClick = async (filePath: string) => {
    setCurrentFile(filePath);
    const result = await getSelectedFile(owner, repo, filePath);
    if (result.content) {
      setFileContent(result.content);
    }
  };

  const handleLineClick = (lineNumber: number) => {
    setSelectedLine(lineNumber);
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setSelectedLine(null);
  };

  if (loading) {
    return (
      <div className='p-4 text-center flex items-center'>
        <Loader2 className='animate-spin h-6 w-6 mx-auto mb-2' />
        <p>Loading files...</p>
      </div>
    );
  }

  return (
    <div>
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-4'>
        <Card className='border-2'>
          <CardHeader>
            <CardTitle>ᛋ Project Files</CardTitle>
            <CardDescription>
              Select a file to review. I&apos;ll give you a detailed analysis of
              the code, including security vulnerabilities, code style, and
              performance optimizations.
            </CardDescription>
          </CardHeader>
          <CardContent className='flex-1'>
            <ScrollArea className='h-full'>
              <div>
                {files.map((file) => (
                  <div
                    key={file.url}
                    onClick={() => handleFileClick(file.path)}
                    className={`rounded-lg cursor-pointer transition-colors`}
                  >
                    <div className='flex items-center justify-between p-2'>
                      <span
                        className={cn(
                          'font-mono',
                          file.path === currentFile && 'text-blue-600 font-bold'
                        )}
                      >
                        {file.name}
                      </span>
                      {file.path === currentFile && (
                        <Badge className='bg-purple-600/10 text-blue-600'>
                          Selected
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <FileContent
          selectedFile={currentFile}
          fileContent={fileContent}
          highlightedLines={highlightedLines}
          lineComments={lineComments}
          onLineClick={handleLineClick}
          setReview={setReview}
          showDialog={showDialog}
          selectedLine={selectedLine}
          onCloseDialog={handleCloseDialog}
        />

        <CodeReview review={review} />
      </div>
    </div>
  );
};
