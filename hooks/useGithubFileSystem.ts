export async function fetchFolderContents(
  owner: string,
  repo: string,
  path = ''
) {
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

    return await res.json();
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
