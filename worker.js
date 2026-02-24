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
  .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 56px; }
  .stat { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 20px; text-align: center; }
  .stat-val { font-size: 26px; font-weight: 700; background: linear-gradient(135deg, var(--a), var(--b)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 4px; }
  .stat-label { font-size: 11px; color: var(--muted); }

  /* BOOKMARKS */
  .bookmarks-section { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 32px; margin-bottom: 48px; }
  .bookmarks-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
  .bookmarks-header h2 { font-size: 18px; font-weight: 700; background: linear-gradient(90deg, var(--a), var(--b)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .bookmarks-empty { font-family: 'Fira Code', monospace; font-size: 12px; color: var(--muted); text-align: center; padding: 24px 0; }
  .bookmark-list { display: flex; flex-direction: column; gap: 10px; }
  .bookmark-item { display: flex; align-items: center; gap: 12px; background: rgba(0,0,0,0.2); border: 1px solid var(--border); border-radius: 10px; padding: 14px 16px; transition: border-color 0.2s; }
  .bookmark-item:hover { border-color: rgba(255,255,255,0.15); }
  .bookmark-platform { font-family: 'Fira Code', monospace; font-size: 10px; padding: 3px 8px; border-radius: 4px; font-weight: 400; flex-shrink: 0; }
  .platform-github { background: rgba(167,139,250,0.15); color: var(--a); border: 1px solid rgba(167,139,250,0.3); }
  .platform-codeberg { background: rgba(56,189,248,0.15); color: var(--b); border: 1px solid rgba(56,189,248,0.3); }
  .bookmark-name { font-size: 13px; font-weight: 500; flex: 1; cursor: pointer; }
  .bookmark-name:hover { color: var(--b); }
  .bookmark-date { font-family: 'Fira Code', monospace; font-size: 10px; color: var(--muted); flex-shrink: 0; }
  .bookmark-actions { display: flex; gap: 8px; flex-shrink: 0; }
  .btn-sm { border: none; border-radius: 6px; padding: 6px 12px; font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 600; cursor: pointer; transition: opacity 0.15s; }
  .btn-visit { background: linear-gradient(135deg, var(--a), var(--b)); color: #000; }
  .btn-remove { background: rgba(255,255,255,0.06); color: var(--muted); border: 1px solid var(--border); }
  .btn-remove:hover { color: #ff6b6b; border-color: rgba(255,107,107,0.4); }
  .btn-sm:hover { opacity: 0.85; }

  footer { position: relative; z-index: 10; border-top: 1px solid var(--border); padding: 20px 40px; display: flex; justify-content: space-between; font-size: 11px; color: var(--muted); font-family: 'Fira Code', monospace; }
  @media (max-width: 700px) {
    main { padding: 48px 20px; } nav, footer { padding: 16px 20px; }
    .endpoints { grid-template-columns: 1fr; } .stats { grid-template-columns: repeat(2, 1fr); }
    .how-to, .bookmarks-section { padding: 24px; } footer { flex-direction: column; gap: 8px; }
    .bookmark-date { display: none; }
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

  <!-- BOOKMARKS -->
  <div class="section-label" style="margin-bottom:16px;">// saved repos</div>
  <div class="bookmarks-section">
    <div class="bookmarks-header">
      <h2>🔖 Saved Repos</h2>
    </div>
    <div id="bookmarkList"><div class="bookmarks-empty">No saved repos yet. Visit a repo and click Save to bookmark it.</div></div>
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
function getBookmarks() {
  try { return JSON.parse(localStorage.getItem('mirror-bookmarks') || '[]'); } catch { return []; }
}
function saveBookmarks(bm) {
  localStorage.setItem('mirror-bookmarks', JSON.stringify(bm));
}
function addBookmark(platform, owner, repo) {
  const bm = getBookmarks();
  const key = platform + '/' + owner + '/' + repo;
  if (bm.find(b => b.key === key)) return;
  bm.unshift({ key, platform, owner, repo, date: new Date().toLocaleDateString() });
  saveBookmarks(bm);
  renderBookmarks();
}
function removeBookmark(key) {
  saveBookmarks(getBookmarks().filter(b => b.key !== key));
  renderBookmarks();
}
function renderBookmarks() {
  const bm = getBookmarks();
  const el = document.getElementById('bookmarkList');
  if (!bm.length) {
    el.innerHTML = '<div class="bookmarks-empty">No saved repos yet. Visit a repo and click Save to bookmark it.</div>';
    return;
  }
  el.innerHTML = '<div class="bookmark-list">' + bm.map(b => \`
    <div class="bookmark-item">
      <span class="bookmark-platform platform-\${b.platform}">\${b.platform}</span>
      <span class="bookmark-name" onclick="window.location.href='/\${b.key}'">\${b.owner}/\${b.repo}</span>
      <span class="bookmark-date">\${b.date}</span>
      <div class="bookmark-actions">
        <button class="btn-sm btn-visit" onclick="window.location.href='/\${b.key}'">Visit</button>
        <button class="btn-sm btn-remove" onclick="removeBookmark('\${b.key}')">Remove</button>
      </div>
    </div>
  \`).join('') + '</div>';
}
function goToRepo() {
  const val = document.getElementById('repoInput').value.trim();
  if (val) window.location.href = '/' + val;
}
document.getElementById('repoInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') goToRepo();
});
renderBookmarks();
</script>
</body>
</html>`;

const REPO_PAGE = (platform, owner, repo, host) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${owner}/${repo} — Mirror for AI</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Fira+Code:wght@300;400&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root { --bg: #06060e; --card: rgba(255,255,255,0.04); --border: rgba(255,255,255,0.08); --text: #e8e8f0; --muted: rgba(255,255,255,0.35); --a: #a78bfa; --b: #38bdf8; --c: #34d399; }
  body { background: var(--bg); color: var(--text); font-family: 'Space Grotesk', sans-serif; min-height: 100vh; }
  body::before { content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 0; background: radial-gradient(ellipse 60% 40% at 0% 0%, rgba(167,139,250,0.10) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 100% 60%, rgba(56,189,248,0.08) 0%, transparent 70%); }
  nav { position: relative; z-index: 10; padding: 20px 40px; display: flex; align-items: center; gap: 16px; border-bottom: 1px solid var(--border); }
  .logo { font-size: 16px; font-weight: 700; background: linear-gradient(90deg, var(--a), var(--b)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; text-decoration: none; }
  .sep { color: var(--border); font-size: 18px; }
  .repo-title { font-size: 14px; font-weight: 500; color: var(--muted); }
  .nav-actions { margin-left: auto; display: flex; gap: 10px; align-items: center; }
  .btn { border: none; border-radius: 8px; padding: 8px 16px; font-family: 'Space Grotesk', sans-serif; font-size: 12px; font-weight: 600; cursor: pointer; transition: opacity 0.15s; }
  .btn-save { background: linear-gradient(135deg, var(--a), var(--b)); color: #000; }
  .btn-saved { background: rgba(52,211,153,0.15); color: var(--c); border: 1px solid rgba(52,211,153,0.3); }
  .btn-home { background: var(--card); color: var(--muted); border: 1px solid var(--border); }
  .btn:hover { opacity: 0.85; }
  main { position: relative; z-index: 10; max-width: 920px; margin: 0 auto; padding: 48px 40px; }
  .repo-header { margin-bottom: 40px; }
  .platform-badge { display: inline-block; font-family: 'Fira Code', monospace; font-size: 10px; padding: 3px 10px; border-radius: 4px; margin-bottom: 16px; }
  .platform-github { background: rgba(167,139,250,0.15); color: var(--a); border: 1px solid rgba(167,139,250,0.3); }
  .platform-codeberg { background: rgba(56,189,248,0.15); color: var(--b); border: 1px solid rgba(56,189,248,0.3); }
  h1 { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
  .repo-desc { font-size: 14px; color: var(--muted); font-weight: 300; }
  .action-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 40px; }
  .ac { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 20px; cursor: pointer; transition: border-color 0.2s, transform 0.15s; text-decoration: none; display: block; }
  .ac:hover { border-color: rgba(255,255,255,0.2); transform: translateY(-2px); }
  .ac-icon { font-size: 22px; margin-bottom: 10px; }
  .ac-title { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
  .ac-desc { font-size: 11px; color: var(--muted); font-weight: 300; }
  footer { position: relative; z-index: 10; border-top: 1px solid var(--border); padding: 20px 40px; font-size: 11px; color: var(--muted); font-family: 'Fira Code', monospace; }
  @media (max-width: 700px) { main { padding: 32px 20px; } nav, footer { padding: 16px 20px; } .action-cards { grid-template-columns: 1fr; } .repo-title { display: none; } }
</style>
</head>
<body>
<nav>
  <a href="/" class="logo">mirror.ai</a>
  <span class="sep">/</span>
  <span class="repo-title">${owner}/${repo}</span>
  <div class="nav-actions">
    <button class="btn btn-home" onclick="window.location.href='/'">← Home</button>
    <button class="btn btn-save" id="saveBtn" onclick="toggleSave()">🔖 Save</button>
  </div>
</nav>
<main>
  <div class="repo-header">
    <div class="platform-badge platform-${platform}">${platform}</div>
    <h1>${owner}/${repo}</h1>
    <p class="repo-desc">Public repository mirror — read only</p>
  </div>
  <div class="action-cards">
    <a class="ac" href="/${platform}/${owner}/${repo}?view=files">
      <div class="ac-icon">📂</div>
      <div class="ac-title">Browse Files</div>
      <div class="ac-desc">View the complete file tree of this repository</div>
    </a>
    <a class="ac" href="/${platform}/${owner}/${repo}/llms.txt">
      <div class="ac-icon">🤖</div>
      <div class="ac-title">llms.txt</div>
      <div class="ac-desc">AI-friendly summary with categorized file links</div>
    </a>
    <a class="ac" href="https://${platform === 'github' ? 'github.com' : 'codeberg.org'}/${owner}/${repo}" target="_blank">
      <div class="ac-icon">↗</div>
      <div class="ac-title">Original Repo</div>
      <div class="ac-desc">Open the original repository on ${platform}</div>
    </a>
  </div>
</main>
<footer>mirror-for-ai — ${platform}/${owner}/${repo}</footer>
<script>
const PLATFORM = '${platform}', OWNER = '${owner}', REPO = '${repo}';
const KEY = PLATFORM + '/' + OWNER + '/' + REPO;
function getBookmarks() { try { return JSON.parse(localStorage.getItem('mirror-bookmarks') || '[]'); } catch { return []; } }
function isSaved() { return getBookmarks().some(b => b.key === KEY); }
function updateBtn() {
  const btn = document.getElementById('saveBtn');
  if (isSaved()) { btn.textContent = '✓ Saved'; btn.className = 'btn btn-saved'; }
  else { btn.textContent = '🔖 Save'; btn.className = 'btn btn-save'; }
}
function toggleSave() {
  let bm = getBookmarks();
  if (isSaved()) {
    bm = bm.filter(b => b.key !== KEY);
  } else {
    bm.unshift({ key: KEY, platform: PLATFORM, owner: OWNER, repo: REPO, date: new Date().toLocaleDateString() });
  }
  localStorage.setItem('mirror-bookmarks', JSON.stringify(bm));
  updateBtn();
}
updateBtn();
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

    // Show repo landing page when no file path and no ?view=files
    if (!filePath && !url.searchParams.has("view")) {
      const host = url.host;
      return new Response(REPO_PAGE(platform, owner, repo, host), {
        headers: { "Content-Type": "text/html" }
      });
    }

    const cacheKey = new Request(url.toString(), request);
    const cache = caches.default;
    const cachedResponse = await cache.match(cacheKey);
    if (cachedResponse) return cachedResponse;

    try {
      let response;
      if (!filePath || url.searchParams.get("view") === "files") {
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
