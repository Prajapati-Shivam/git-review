export async function fetchFolderContents(
  owner: string,
  repo: string,
  path = ''
) {
  const excludedExtensions = ['.svg', '.jpg', '.jpeg', '.png', '.ico', '.webp'];

  try {
    const url = path
      ? `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
      : `https://api.github.com/repos/${owner}/${repo}/contents`;

    const res = await fetch(url, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!res.ok) throw new Error(`GitHub error: ${res.statusText}`);

    const files = await res.json();

    return files.filter((file: any) => {
      if (file.type === 'dir') return true; // Always include folders
      const lowerName = file.name.toLowerCase();
      return !excludedExtensions.some((ext) => lowerName.endsWith(ext));
    });
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function fetchFileContent(
  owner: string,
  repo: string,
  filePath: string
) {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );
    if (!res.ok) throw new Error(`GitHub error: ${res.statusText}`);
    const data = await res.json();
    return Buffer.from(data.content, 'base64').toString('utf-8');
  } catch (err) {
    console.error(err);
    return '';
  }
}
