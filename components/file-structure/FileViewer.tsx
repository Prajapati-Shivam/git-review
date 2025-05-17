'use client';

import { FileContent } from '@/components/file-content';

interface FileViewerProps {
  selectedFile: string;
  fileContent: string;
  highlightedLines: number[];
  lineComments: Record<number, string>;
  onLineClick: (line: number) => void;
  showDialog: boolean;
  selectedLine: number | null;
  onCloseDialog: () => void;
  setReview: (review: string) => void;
}

export const FileViewer: React.FC<FileViewerProps> = ({
  selectedFile,
  fileContent,
  highlightedLines,
  lineComments,
  onLineClick,
  showDialog,
  selectedLine,
  onCloseDialog,
  setReview,
}) => {
  return (
    <FileContent
      selectedFile={selectedFile}
      fileContent={fileContent}
      highlightedLines={highlightedLines}
      lineComments={lineComments}
      onLineClick={onLineClick}
      showDialog={showDialog}
      selectedLine={selectedLine}
      onCloseDialog={onCloseDialog}
      setReview={setReview}
    />
  );
};
