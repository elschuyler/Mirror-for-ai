export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Homepage
    if (path === "/" || path === "") {
      return new Response(`<!DOCTYPE html>
<html>
<head><title>Mirror for AI</title>
<style>
  body { font-family: sans-serif; max-width: 700px; margin: 40px auto; padding: 0 20px; }
  code { background: #f0f0f0; padding: 2px 6px; border-radius: 4px; }
  pre { background: #f0f0f0; padding: 16px; border-radius: 8px; overflow-x: auto; }
</style>
</head>
<body>
<h1>Mirror for AI</h1>
<p>Read-only mirror of GitHub and Codeberg repositories for AI tools.</p>
<h2>How to use</h2>
<h3>List all files in a repo:</h3>
<pre>
/github/owner/repo
/codeberg/owner/repo
</pre>
<h3>Read a specific file:</h3>
<pre>
/github/owner/repo/path/to/file.js
/codeberg/owner/repo/path/to/file.py
</pre>
<h2>Examples</h2>
<ul>
  <li><a href="/github/torvalds/linux">/github/torvalds/linux</a> - list files</li>
  <li><a href="/github/torvalds/linux/README">/github/torvalds/linux/README</a> - read a file</li>
</ul>
</body>
</html>`, {
        headers: { "Content-Type": "text/html" }
      });
    }

    const parts = path.split("/").filter(Boolean);

    if (parts.length < 3) {
      return new Response("Usage: /github/owner/repo or /codeberg/owner/repo", {
        status: 400,
        headers: { "Content-Type": "text/plain" }
      });
    }

    const [platform, owner, repo, ...rest] = parts;

    if (platform !== "github" && platform !== "codeberg") {
      return new Response("Platform must be 'github' or 'codeberg'", {
        status: 400,
        headers: { "Content-Type": "text/plain" }
      });
    }

    const filePath = rest.join("/");

    try {
      if (!filePath) {
        return await listFiles(platform, owner, repo, request);
      } else {
        return await getFile(platform, owner, repo, filePath);
      }
    } catch (e) {
      return new Response(`Error: ${e.message}`, {
        status: 500,
        headers: { "Content-Type": "text/plain" }
      });
    }
  }
};

async function listFiles(platform, owner, repo, request) {
  const headers = { "User-Agent": "mirror-for-ai/1.0" };
  let files = [];

  if (platform === "github") {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`,
      { headers }
    );
    if (!res.ok) throw new Error(`Repo not found or private (status ${res.status})`);
    const data = await res.json();
    files = (data.tree || []).filter(f => f.type === "blob").map(f => f.path);

  } else {
    // Codeberg - get default branch first
    const repoRes = await fetch(
      `https://codeberg.org/api/v1/repos/${owner}/${repo}`,
      { headers }
    );
    if (!repoRes.ok) throw new Error(`Repo not found (status ${repoRes.status})`);
    const repoData = await repoRes.json();
    const branch = repoData.default_branch;

    const branchRes = await fetch(
      `https://codeberg.org/api/v1/repos/${owner}/${repo}/branches/${branch}`,
      { headers }
    );
    if (!branchRes.ok) throw new Error(`Branch not found (status ${branchRes.status})`);
    const branchData = await branchRes.json();
    const sha = branchData.commit.id;

    const treeRes = await fetch(
      `https://codeberg.org/api/v1/repos/${owner}/${repo}/git/trees/${sha}?recursive=true`,
      { headers }
    );
    if (!treeRes.ok) throw new Error(`Could not fetch file tree (status ${treeRes.status})`);
    const treeData = await treeRes.json();
    files = (treeData.tree || []).filter(f => f.type === "blob").map(f => f.path);
  }

  const host = new URL(request.url).host;
  const output = [
    `# ${platform}/${owner}/${repo}`,
    `# ${files.length} files found`,
    `# To read a file: https://${host}/${platform}/${owner}/${repo}/path/to/file`,
    ``,
    ...files
  ].join("\n");

  return new Response(output, {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
}

async function getFile(platform, owner, repo, filePath) {
  const headers = { "User-Agent": "mirror-for-ai/1.0" };

  if (platform === "github") {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
      { headers: { ...headers, "Accept": "application/vnd.github.raw+json" } }
    );
    if (!res.ok) throw new Error(`File not found (status ${res.status})`);
    const content = await res.text();
    return new Response(content, {
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    });

  } else {
    const res = await fetch(
      `https://codeberg.org/api/v1/repos/${owner}/${repo}/raw/${filePath}`,
      { headers }
    );
    if (!res.ok) throw new Error(`File not found (status ${res.status})`);
    const content = await res.text();
    return new Response(content, {
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    });
  }
}
