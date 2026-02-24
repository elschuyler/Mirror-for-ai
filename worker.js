const HOMEPAGE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Mirror for AI</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Fira+Code:wght@300;400&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #06060e; --card: rgba(255,255,255,0.04); --border: rgba(255,255,255,0.08);
    --text: #e8e8f0; --muted: rgba(255,255,255,0.35); --a: #a78bfa; --b: #38bdf8; --c: #34d399;
  }
  body { background: var(--bg); color: var(--text); font-family: 'Space Grotesk', sans-serif; min-height: 100vh; }
  body::before {
    content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background:
      radial-gradient(ellipse 60% 40% at 0% 0%, rgba(167,139,250,0.12) 0%, transparent 70%),
      radial-gradient(ellipse 50% 40% at 100% 60%, rgba(56,189,248,0.10) 0%, transparent 70%),
      radial-gradient(ellipse 40% 30% at 40% 100%, rgba(52,211,153,0.08) 0%, transparent 70%);
  }
  nav { position: relative; z-index: 10; padding: 20px 40px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border); }
  .logo { font-size: 18px; font-weight: 700; background: linear-gradient(90deg, var(--a), var(--b)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .badge { font-size: 11px; font-weight: 500; color: var(--c); border: 1px solid rgba(52,211,153,0.3); background: rgba(52,211,153,0.08); padding: 4px 12px; border-radius: 100px; letter-spacing: 0.06em; }
  main { position: relative; z-index: 10; max-width: 920px; margin: 0 auto; padding: 80px 40px; }
  .hero { text-align: center; margin-bottom: 72px; }
  .pill { display: inline-flex; align-items: center; gap: 8px; font-family: 'Fira Code', monospace; font-size: 11px; color: var(--muted); border: 1px solid var(--border); background: var(--card); padding: 5px 14px; border-radius: 100px; margin-bottom: 28px; }
  .pill-dot { width: 6px; height: 6px; background: var(--c); border-radius: 50%; }
  h1 { font-size: clamp(38px, 6vw, 72px); font-weight: 700; line-height: 1.0; letter-spacing: -0.03em; margin-bottom: 20px; }
  .grad-text { background: linear-gradient(135deg, var(--a) 0%, var(--b) 50%, var(--c) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .hero-sub { font-size: 16px; font-weight: 300; color: var(--muted); max-width: 480px; margin: 0 auto 40px; line-height: 1.7; }
  .search-wrap { max-width: 540px; margin: 0 auto; display: flex; background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 6px; }
  .search-wrap input { flex: 1; background: transparent; border: none; padding: 11px 14px; font-family: 'Fira Code', monospace; font-size: 13px; color: var(--text); outline: none; min-width: 0; }
  .search-wrap input::placeholder { color: var(--muted); }
  .search-wrap button { background: linear-gradient(135deg, var(--a), var(--b)); border: none; border-radius: 8px; padding: 11px 20px; font-family: 'Space Grotesk', sans-serif; font-size: 13px; font-weight: 600; color: #000; cursor: pointer; white-space: nowrap; transition: opacity 0.15s; }
  .search-wrap button:hover { opacity: 0.85; }
  .section-label { font-family: 'Fira Code', monospace; font-size: 11px; color: var(--muted); letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 16px; }
  .endpoints { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 56px; }
  .ep { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 22px; transition: border-color 0.2s, transform 0.2s; }
  .ep:hover { border-color: rgba(255,255,255,0.18); transform: translateY(-2px); }
  .ep-num { font-family: 'Fira Code', monospace; font-size: 10px; color: var(--muted); margin-bottom: 12px; }
  .ep-title { font-size: 15px; font-weight: 600; margin-bottom: 8px; }
  .ep-path { font-family: 'Fira Code', monospace; font-size: 11px; color: var(--muted); margin-bottom: 10px; line-height: 1.5; word-break: break-all; }
  .ep-path em { font-style: normal; color: var(--b); }
  .ep-desc { font-size: 12px; font-weight: 300; color: var(--muted); line-height: 1.6; }
  .how-to { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 40px; margin-bottom: 48px; }
  .how-to h2 { font-size: 22px; font-weight: 700; margin-bottom: 32px; background: linear-gradient(90deg, var(--a), var(--b)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px; }
  .step { display: flex; flex-direction: column; gap: 10px; }
  .step-num { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--a), var(--b)); color: #000; font-size: 13px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
  .step-title { font-size: 14px; font-weight: 600; }
  .step-desc { font-size: 12px; color: var(--muted); line-height: 1.6; font-weight: 300; }
  .code-block { background: rgba(0,0,0,0.4); border: 1px solid var(--border); border-radius: 8px; padding: 16px; margin-top: 28px; }
  .code-block-title { font-family: 'Fira Code', monospace; font-size: 10px; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 12px; }
  .code-line { font-family: 'Fira Code', monospace; font-size: 12px; line-height: 2; color: var(--muted); }
  .code-line .hl { color: var(--b); } .code-line .hl2 { color: var(--c); } .code-line .comment { color: rgba(255,255,255,0.2); }
  .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
  .stat { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 20px; text-align: center; }
  .stat-val { font-size: 26px; font-weight: 700; background: linear-gradient(135deg, var(--a), var(--b)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 4px; }
  .stat-label { font-size: 11px; color: var(--muted); }
  footer { position: relative; z-index: 10; border-top: 1px solid var(--border); padding: 20px 40px; display: flex; justify-content: space-between; font-size: 11px; color: var(--muted); font-family: 'Fira Code', monospace; }
  @media (max-width: 700px) {
    main { padding: 48px 20px; } nav, footer { padding: 16px 20px; }
    .endpoints { grid-template-columns: 1fr; } .stats { grid-template-columns: repeat(2, 1fr); }
    .how-to { padding: 24px; } footer { flex-direction: column; gap: 8px; }
  }
</style>
</head>
<body>
<nav>
  <div class="logo">mirror.ai</div>
  <div class="badge">● LIVE</div>
</nav>
<main>
  <div class="hero">
    <div class="pill"><span class="pill-dot"></span>read-only · github · codeberg</div>
    <h1><span class="grad-text">Repos made<br>readable.</span></h1>
    <p class="hero-sub">A lightweight mirror that gives AI tools instant read access to any public GitHub or Codeberg repository.</p>
    <div class="search-wrap">
      <input type="text" placeholder="github/owner/repo" id="repoInput">
      <button onclick="goToRepo()">Explore →</button>
    </div>
  </div>
  <div class="section-label" style="margin-bottom:16px;">// endpoints</div>
  <div class="endpoints">
    <div class="ep">
      <div class="ep-num">01 / FILE TREE</div>
      <div class="ep-title">List Files</div>
      <div class="ep-path">/<em>{platform}</em>/<em>{owner}</em>/<em>{repo}</em></div>
      <div class="ep-desc">Complete flat list of every file in the repository</div>
    </div>
    <div class="ep">
      <div class="ep-num">02 / RAW ACCESS</div>
      <div class="ep-title">Read File</div>
      <div class="ep-path">/<em>{platform}</em>/<em>{owner}</em>/<em>{repo}</em>/<em>{path}</em></div>
      <div class="ep-desc">Fetch any file as plain text, instantly readable</div>
    </div>
    <div class="ep">
      <div class="ep-num">03 / AI SUMMARY</div>
      <div class="ep-title">llms.txt</div>
      <div class="ep-path">/<em>{platform}</em>/<em>{owner}</em>/<em>{repo}</em>/llms.txt</div>
      <div class="ep-desc">AI-friendly overview with categorized file links</div>
    </div>
  </div>
  <div class="how-to">
    <h2>How to use</h2>
    <div class="steps">
      <div class="step">
        <div class="step-num">1</div>
        <div class="step-title">Find a repo</div>
        <div class="step-desc">Pick any public repository on GitHub or Codeberg that you want an AI tool to read.</div>
      </div>
      <div class="step">
        <div class="step-num">2</div>
        <div class="step-title">Build the URL</div>
        <div class="step-desc">Replace the domain with this mirror. Use <em style="color:var(--b);font-style:normal">github</em> or <em style="color:var(--b);font-style:normal">codeberg</em> as the platform.</div>
      </div>
      <div class="step">
        <div class="step-num">3</div>
        <div class="step-title">Browse files</div>
        <div class="step-desc">Visit the repo URL to get a full file list, then append any file path to read it.</div>
      </div>
      <div class="step">
        <div class="step-num">4</div>
        <div class="step-title">Give to AI</div>
        <div class="step-desc">Paste the URL into any AI tool. Start with <em style="color:var(--c);font-style:normal">/llms.txt</em> for a smart summary.</div>
      </div>
    </div>
    <div class="code-block">
      <div class="code-block-title">// example — reading the linux kernel repo</div>
      <div class="code-line"><span class="comment"># Step 1: List all files</span></div>
      <div class="code-line"><span class="hl">mirror-for-ai.vialewis31.workers.dev</span>/github/torvalds/linux</div>
      <br>
      <div class="code-line"><span class="comment"># Step 2: Read a specific file</span></div>
      <div class="code-line"><span class="hl">mirror-for-ai.vialewis31.workers.dev</span>/github/torvalds/linux<span class="hl2">/README</span></div>
      <br>
      <div class="code-line"><span class="comment"># Step 3: Get AI summary</span></div>
      <div class="code-line"><span class="hl">mirror-for-ai.vialewis31.workers.dev</span>/github/torvalds/linux<span class="hl2">/llms.txt</span></div>
    </div>
  </div>
  <div class="section-label" style="margin-bottom:16px;">// stats</div>
  <div class="stats">
    <div class="stat"><div class="stat-val">2</div><div class="stat-label">Platforms</div></div>
    <div class="stat"><div class="stat-val">∞</div><div class="stat-label">Public Repos</div></div>
    <div class="stat"><div class="stat-val">5m</div><div class="stat-label">Cache TTL</div></div>
    <div class="stat"><div class="stat-val">0</div><div class="stat-label">Auth Required</div></div>
  </div>
</main>
<footer>
  <span>mirror-for-ai — cloudflare workers</span>
  <span>read only · always free</span>
</footer>
<script>
function goToRepo() {
  const val = document.getElementById('repoInput').value.trim();
  if (val) window.location.href = '/' + val;
}
document.getElementById('repoInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') goToRepo();
});
</script>
</body>
</html>`;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === "/" || path === "") {
      return new Response(HOMEPAGE, { headers: { "Content-Type": "text/html" } });
    }

    const parts = path.split("/").filter(Boolean);
    if (parts.length < 3) {
      return new Response("Usage: /github/owner/repo or /codeberg/owner/repo", {
        status: 400, headers: { "Content-Type": "text/plain" }
      });
    }

    const [platform, owner, repo, ...rest] = parts;
    if (platform !== "github" && platform !== "codeberg") {
      return new Response("Platform must be 'github' or 'codeberg'", {
        status: 400, headers: { "Content-Type": "text/plain" }
      });
    }

    const filePath = rest.join("/");

    const cacheKey = new Request(url.toString(), request);
    const cache = caches.default;
    const cachedResponse = await cache.match(cacheKey);
    if (cachedResponse) return cachedResponse;

    try {
      let response;
      if (!filePath) {
        response = await listFiles(platform, owner, repo, request);
      } else if (filePath === "llms.txt") {
        response = await getLlmsTxt(platform, owner, repo, request);
      } else {
        response = await getFile(platform, owner, repo, filePath);
      }

      const headers = new Headers(response.headers);
      headers.set("Cache-Control", "public, max-age=300");
      const cachedRes = new Response(response.clone().body, { status: response.status, headers });
      ctx.waitUntil(cache.put(cacheKey, cachedRes));
      return response;

    } catch (e) {
      return new Response(`Error: ${e.message}`, { status: 500, headers: { "Content-Type": "text/plain" } });
    }
  }
};

async function listFiles(platform, owner, repo, request) {
  const headers = { "User-Agent": "mirror-for-ai/1.0" };
  let files = [];

  if (platform === "github") {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`, { headers });
    if (!res.ok) throw new Error(`Repo not found or private (status ${res.status})`);
    const data = await res.json();
    files = (data.tree || []).filter(f => f.type === "blob").map(f => f.path);
  } else {
    const repoRes = await fetch(`https://codeberg.org/api/v1/repos/${owner}/${repo}`, { headers });
    if (!repoRes.ok) throw new Error(`Repo not found (status ${repoRes.status})`);
    const repoData = await repoRes.json();
    const branchRes = await fetch(`https://codeberg.org/api/v1/repos/${owner}/${repo}/branches/${repoData.default_branch}`, { headers });
    if (!branchRes.ok) throw new Error(`Branch not found`);
    const sha = (await branchRes.json()).commit.id;
    const treeRes = await fetch(`https://codeberg.org/api/v1/repos/${owner}/${repo}/git/trees/${sha}?recursive=true`, { headers });
    if (!treeRes.ok) throw new Error(`Could not fetch file tree`);
    files = ((await treeRes.json()).tree || []).filter(f => f.type === "blob").map(f => f.path);
  }

  const host = new URL(request.url).host;
  const output = [
    `# ${platform}/${owner}/${repo}`,
    `# ${files.length} files found`,
    `# To read a file: https://${host}/${platform}/${owner}/${repo}/path/to/file`,
    `# AI summary: https://${host}/${platform}/${owner}/${repo}/llms.txt`,
    ``, ...files
  ].join("\n");

  return new Response(output, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}

async function getFile(platform, owner, repo, filePath) {
  const headers = { "User-Agent": "mirror-for-ai/1.0" };
  if (platform === "github") {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
      { headers: { ...headers, "Accept": "application/vnd.github.raw+json" } });
    if (!res.ok) throw new Error(`File not found (status ${res.status})`);
    return new Response(await res.text(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  } else {
    const res = await fetch(`https://codeberg.org/api/v1/repos/${owner}/${repo}/raw/${filePath}`, { headers });
    if (!res.ok) throw new Error(`File not found (status ${res.status})`);
    return new Response(await res.text(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }
}

async function getLlmsTxt(platform, owner, repo, request) {
  const headers = { "User-Agent": "mirror-for-ai/1.0" };
  const host = new URL(request.url).host;
  let files = [], description = "", defaultBranch = "main";

  if (platform === "github") {
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
    if (!repoRes.ok) throw new Error(`Repo not found`);
    const repoData = await repoRes.json();
    description = repoData.description || "";
    defaultBranch = repoData.default_branch || "main";
    const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`, { headers });
    if (!treeRes.ok) throw new Error(`Could not fetch file tree`);
    files = ((await treeRes.json()).tree || []).filter(f => f.type === "blob").map(f => f.path);
  } else {
    const repoRes = await fetch(`https://codeberg.org/api/v1/repos/${owner}/${repo}`, { headers });
    if (!repoRes.ok) throw new Error(`Repo not found`);
    const repoData = await repoRes.json();
    description = repoData.description || "";
    defaultBranch = repoData.default_branch || "main";
    const branchRes = await fetch(`https://codeberg.org/api/v1/repos/${owner}/${repo}/branches/${defaultBranch}`, { headers });
    if (!branchRes.ok) throw new Error(`Branch not found`);
    const sha = (await branchRes.json()).commit.id;
    const treeRes = await fetch(`https://codeberg.org/api/v1/repos/${owner}/${repo}/git/trees/${sha}?recursive=true`, { headers });
    if (!treeRes.ok) throw new Error(`Could not fetch file tree`);
    files = ((await treeRes.json()).tree || []).filter(f => f.type === "blob").map(f => f.path);
  }

  const baseUrl = `https://${host}/${platform}/${owner}/${repo}`;
  const readmeFile = files.find(f => f.toLowerCase() === "readme.md" || f.toLowerCase() === "readme");
  const codeFiles = files.filter(f => /\.(js|ts|py|go|rs|java|cpp|c|cs|rb|php|swift|kt)$/.test(f));
  const configFiles = files.filter(f => /\.(json|toml|yaml|yml|ini|cfg)$/.test(f));
  const docFiles = files.filter(f => /\.(md|txt|rst)$/.test(f));

  const output = [
    `# ${owner}/${repo}`,
    description ? `> ${description}` : "",
    ``,
    `## Overview`,
    `- Platform: ${platform}`,
    `- Total files: ${files.length}`,
    `- Code files: ${codeFiles.length}`,
    `- Docs: ${docFiles.length}`,
    ``,
    `## How to read files`,
    `${baseUrl}/path/to/file`,
    ``,
    readmeFile ? `## README\n${baseUrl}/${readmeFile}\n` : "",
    docFiles.length ? `## Documentation\n${docFiles.slice(0,20).map(f => `${baseUrl}/${f}`).join("\n")}\n` : "",
    codeFiles.length ? `## Source Code\n${codeFiles.slice(0,50).map(f => `${baseUrl}/${f}`).join("\n")}\n` : "",
    configFiles.length ? `## Config Files\n${configFiles.slice(0,10).map(f => `${baseUrl}/${f}`).join("\n")}\n` : "",
  ].filter(Boolean).join("\n");

  return new Response(output, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
