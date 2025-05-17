import { useState } from 'react';

export interface GithubFile {
  name: string;
  path: string;
  type: string;
}

interface FileTreeProps {
  files: GithubFile[];
  currentFile: string;
  expandedFolders: Set<string>;
  toggleFolder: (path: string) => void;
  onFileSelect: (filePath: string) => void;
  fetchFolderContents: (path: string) => Promise<GithubFile[]>;
}

export const FileTree: React.FC<FileTreeProps> = ({
  files,
  currentFile,
  expandedFolders,
  toggleFolder,
  onFileSelect,
  fetchFolderContents,
}) => {
  const [folderChildren, setFolderChildren] = useState<
    Record<string, GithubFile[]>
  >({});

  const handleToggle = async (file: GithubFile) => {
    toggleFolder(file.path);
    if (!folderChildren[file.path]) {
      const children = await fetchFolderContents(file.path);
      setFolderChildren((prev) => ({ ...prev, [file.path]: children }));
    }
  };

  return (
    <>
      {files.map((file) => {
        const isExpanded = expandedFolders.has(file.path);
        const isSelected = file.path === currentFile;
        return (
          <div key={file.path} className='ml-2'>
            <div
              onClick={() =>
                file.type === 'dir'
                  ? handleToggle(file)
                  : onFileSelect(file.path)
              }
              className={`cursor-pointer p-1 hover:bg-gray-100 rounded ${
                isSelected ? 'bg-gray-200' : ''
              }`}
            >
              <span className='font-mono overflow-hidden whitespace-nowrap text-ellipsis block max-w-full'>
                {file.type === 'dir' ? (isExpanded ? '📂' : '📁') : '📄'}{' '}
                {file.name}
              </span>
            </div>
            {file.type === 'dir' && isExpanded && folderChildren[file.path] && (
              <FileTree
                files={folderChildren[file.path]}
                currentFile={currentFile}
                expandedFolders={expandedFolders}
                toggleFolder={toggleFolder}
                onFileSelect={onFileSelect}
                fetchFolderContents={fetchFolderContents}
              />
            )}
          </div>
        );
      })}
    </>
  );
};
