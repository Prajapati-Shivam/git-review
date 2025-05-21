'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useState } from 'react';
import { CodeReview } from './code-review';
import {
  fetchFileContent,
  fetchFolderContents,
} from '@/hooks/useGithubFileSystem';
import { FileViewer } from './file-structure/FileViewer';
import { useFileReview } from '@/hooks/useFileReview';
import { FileTree } from './file-structure/FileTree';

interface GithubFile {
  name: string;
  path: string;
  type: string;
  url: string;
  html_url: string;
  git_url: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  path: initialPath,
}) => {
  const [review, setReview] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [currentFile, setCurrentFile] = useState(initialPath || '');
  const [rootFiles, setRootFiles] = useState<GithubFile[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );
  const { highlightedLines, lineComments } = useFileReview(fileContent);

  useEffect(() => {
    fetchFolderContents(owner, repo).then(setRootFiles);
  }, [owner, repo]);

  useEffect(() => {
    if (currentFile) {
      fetchFileContent(owner, repo, currentFile).then(setFileContent);
    }
  }, [currentFile, owner, repo]);

  const toggleFolder = async (path: string) => {
    const newSet = new Set(expandedFolders);
    if (expandedFolders.has(path)) {
      newSet.delete(path);
    } else {
      newSet.add(path);
    }
    setExpandedFolders(newSet);
  };

  const handleLineClick = (line: number) => {
    setSelectedLine(line);
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setSelectedLine(null);
  };

  return (
    <div className='h-[650px]'>
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 pb-8'>
        <Card className='border-2 hover:border-neutral-400 h-max'>
          <CardHeader>
            <CardTitle className='text-xl'>🗃️ Project Files</CardTitle>
            <CardDescription>
              Click a file to review or expand folders.
            </CardDescription>
          </CardHeader>
          <CardContent className='flex-1'>
            <ScrollArea className='h-[500px]'>
              <FileTree
                files={rootFiles}
                currentFile={currentFile}
                expandedFolders={expandedFolders}
                toggleFolder={toggleFolder}
                onFileSelect={setCurrentFile}
                fetchFolderContents={(path) =>
                  fetchFolderContents(owner, repo, path)
                }
              />
            </ScrollArea>
          </CardContent>
        </Card>

        <FileViewer
          fileContent={fileContent}
          selectedLine={selectedLine}
          highlightedLines={highlightedLines}
          lineComments={lineComments}
          onLineClick={handleLineClick}
          onCloseDialog={handleCloseDialog}
          showDialog={showDialog}
          selectedFile={currentFile}
          setReview={setReview}
        />

        <CodeReview review={review} />
      </div>
    </div>
  );
};
