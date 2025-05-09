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

async function getSelectedFile(owner: string, repo: string, path: string) {
  try {
    if (!path) {
      return { error: 'File path is required' };
    }

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

    // GitHub API returns base64 encoded content
    const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
    return { content };
  } catch (error) {
    console.error('Error fetching file content:', error);
    return { error: 'Failed to fetch file content' };
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams: { owner?: string; repo?: string; path?: string };
}) {
  const owner = searchParams.owner || 'vercel';
  const repo = searchParams.repo || 'next.js';
  const path = searchParams.path;

  const data = await getAllFilesFromGitHub(owner, repo);
  const selectedFile = path ? await getSelectedFile(owner, repo, path) : null;

  if (data.error) {
    return <div>Error loading repository files.</div>;
  }

  return (
    <div className='hero-container border'>
      <div className='flex flex-col gap-4 p-4 sm:p-8'>
        <header>
          <h2 className='text-3xl font-bold'>Github Review</h2>
        </header>
        <div>
          <h3 className='text-2xl font-semibold mb-2'>
            Code Review for {owner}/{repo}
          </h3>
          <p className='text-gray-700'>
            Hey! Your helper for examining code in GitHub repositories is me,
            Code Review AI. I can explain the code to you, make suggestions for
            enhancements, and optimize performance.
          </p>
        </div>
      </div>

      {/* <div className='mt-4'>

          {data.files && (
            <div className='mt-2'>
              <h3 className='font-semibold'>Files:</h3>
              <ul className='list-disc pl-5'>
                {data.files.map((file) => (
                  <li key={file.path}>{file.path}</li>
                ))}
              </ul>
            </div>
          )}

          {selectedFile?.content && (
            <div className='mt-4'>
              <h3 className='font-semibold'>Selected File Content:</h3>
              <pre className='bg-gray-100 p-4 rounded mt-2 overflow-auto'>
                {selectedFile.content}
              </pre>
            </div>
          )}
        </div> */}
    </div>
  );
}
