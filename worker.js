// Rate limit settings
const RATE_LIMIT_PER_MINUTE = 60;
const RATE_LIMIT_PER_DAY = 1000;

async function checkRateLimit(request) {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const now = new Date();
  const minute = `${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDate()}-${now.getUTCHours()}-${now.getUTCMinutes()}`;
  const day = `${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDate()}`;

  const cache = caches.default;
  const minuteKey = new Request(`https://rate-limit-store/minute/${ip}/${minute}`);
  const dayKey = new Request(`https://rate-limit-store/day/${ip}/${day}`);

  const [minuteRes, dayRes] = await Promise.all([cache.match(minuteKey), cache.match(dayKey)]);
  const minuteCount = minuteRes ? parseInt(await minuteRes.text()) : 0;
  const dayCount = dayRes ? parseInt(await dayRes.text()) : 0;

  if (minuteCount >= RATE_LIMIT_PER_MINUTE) {
    return { limited: true, reason: `Rate limit exceeded: max ${RATE_LIMIT_PER_MINUTE} requests per minute.` };
  }
  if (dayCount >= RATE_LIMIT_PER_DAY) {
    return { limited: true, reason: `Rate limit exceeded: max ${RATE_LIMIT_PER_DAY} requests per day.` };
  }

  // Increment counters
  await Promise.all([
    cache.put(minuteKey, new Response(String(minuteCount + 1), {
      headers: { "Cache-Control": "public, max-age=60" }
    })),
    cache.put(dayKey, new Response(String(dayCount + 1), {
      headers: { "Cache-Control": "public, max-age=86400" }
    }))
  ]);

  return { limited: false };
}

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
  <span>60 req/min · 1000 req/day per user</span>
</footer>
<script>
function getBookmarks() {
  try { return JSON.parse(localStorage.getItem('mirror-bookmarks') || '[]'); } catch { return []; }
}
function saveBookmarks(bm) { localStorage.setItem('mirror-bookmarks', JSON.stringify(bm)); }
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
  .ac-title { font-size: 14px; font-weight: 600; margin-bottom: 4px; color: var(--text); }
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
  if (isSaved()) { bm = bm.filter(b => b.key !== KEY); }
  else { bm.unshift({ key: KEY, platform: PLATFORM, owner: OWNER, repo: REPO, date: new Date().toLocaleDateString() }); }
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

    // MCP (Model Context Protocol) endpoint
    if (path === "/mcp") {
      // Handle CORS preflight
      if (request.method === "OPTIONS") {
        return new Response(null, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
          }
        });
      }

      const host = url.host;

      // GET /mcp — server info
      if (request.method === "GET") {
        return new Response(JSON.stringify({
          name: "mirror-for-ai",
          version: "1.0.0",
          description: "Read-only mirror of public GitHub and Codeberg repositories",
          protocol: "mcp/1.0"
        }, null, 2), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }

      // POST /mcp — handle JSON-RPC tool calls
      if (request.method === "POST") {
        let body;
        try { body = await request.json(); } catch {
          return mcpError(-32700, "Parse error", null);
        }

        const { method, params, id } = body;

        // List available tools
        if (method === "tools/list") {
          return mcpResult({
            tools: [
              {
                name: "list_files",
                description: "List all files in a public GitHub or Codeberg repository",
                inputSchema: {
                  type: "object",
                  properties: {
                    platform: { type: "string", enum: ["github", "codeberg"], description: "The platform hosting the repo" },
                    owner: { type: "string", description: "Repository owner or organization" },
                    repo: { type: "string", description: "Repository name" }
                  },
                  required: ["platform", "owner", "repo"]
                }
              },
              {
                name: "read_file",
                description: "Read the contents of a specific file in a public repository",
                inputSchema: {
                  type: "object",
                  properties: {
                    platform: { type: "string", enum: ["github", "codeberg"] },
                    owner: { type: "string" },
                    repo: { type: "string" },
                    path: { type: "string", description: "Path to the file within the repository" }
                  },
                  required: ["platform", "owner", "repo", "path"]
                }
              },
              {
                name: "get_context",
                description: "Get full context of a repository including file tree and contents of the most important files (README, entry points, config, source files). Use this for deep understanding of a repo without fetching files one by one.",
                inputSchema: {
                  type: "object",
                  properties: {
                    platform: { type: "string", enum: ["github", "codeberg"] },
                    owner: { type: "string" },
                    repo: { type: "string" }
                  },
                  required: ["platform", "owner", "repo"]
                }
              }
            ]
          }, id);
        }

        // Call a tool
        if (method === "tools/call") {
          const { name, arguments: args } = params || {};

          try {
            let text;
            const fakeRequest = new Request(`https://${host}/${args.platform}/${args.owner}/${args.repo}`);

            if (name === "list_files") {
              const res = await listFiles(args.platform, args.owner, args.repo, fakeRequest);
              text = await res.text();
            } else if (name === "get_summary") {
              const res = await getLlmsTxt(args.platform, args.owner, args.repo, fakeRequest);
              text = await res.text();
            } else if (name === "get_context") {
              const res = await getContext(args.platform, args.owner, args.repo, fakeRequest);
              text = await res.text();
            } else if (name === "read_file") {
              const res = await getFile(args.platform, args.owner, args.repo, args.path);
              text = await res.text();
            } else {
              return mcpError(-32601, `Unknown tool: ${name}`, id);
            }

            return mcpResult({
              content: [{ type: "text", text }]
            }, id);

          } catch (e) {
            return mcpResult({
              content: [{ type: "text", text: `Error: ${e.message}` }],
              isError: true
            }, id);
          }
        }

        // Initialize handshake
        if (method === "initialize") {
          return mcpResult({
            protocolVersion: "2024-11-05",
            capabilities: { tools: {} },
            serverInfo: { name: "mirror-for-ai", version: "1.0.0" }
          }, id);
        }

        return mcpError(-32601, "Method not found", id);
      }

      return new Response("Method not allowed", { status: 405 });
    }

    // OpenAI Plugin Manifest
    if (path === "/.well-known/ai-plugin.json") {
      const host = url.host;
      const manifest = {
        schema_version: "v1",
        name_for_human: "Mirror for AI",
        name_for_model: "mirror_for_ai",
        description_for_human: "Read any public GitHub or Codeberg repository. List files, read file contents, and get AI-friendly summaries.",
        description_for_model: "Use this plugin to read public GitHub and Codeberg repositories. You can list all files in a repo, read individual file contents as plain text, and get an AI-friendly llms.txt summary. Always start with the summary to understand the repo structure, then fetch individual files as needed. Supports github and codeberg platforms.",
        auth: { type: "none" },
        api: { type: "openapi", url: `https://${host}/openapi.json` },
        contact_email: "support@example.com",
        legal_info_url: `https://${host}`
      };
      return new Response(JSON.stringify(manifest, null, 2), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // OpenAPI Spec
    if (path === "/openapi.json") {
      const host = url.host;
      const spec = {
        openapi: "3.0.1",
        info: {
          title: "Mirror for AI",
          description: "Read-only mirror of public GitHub and Codeberg repositories for AI tools.",
          version: "1.0.0"
        },
        servers: [{ url: `https://${host}` }],
        paths: {
          "/{platform}/{owner}/{repo}": {
            get: {
              operationId: "listFiles",
              summary: "List all files in a repository",
              description: "Returns a plain text list of all files in the specified public repository.",
              parameters: [
                { name: "platform", in: "path", required: true, schema: { type: "string", enum: ["github", "codeberg"] }, description: "The platform hosting the repository" },
                { name: "owner", in: "path", required: true, schema: { type: "string" }, description: "The repository owner" },
                { name: "repo", in: "path", required: true, schema: { type: "string" }, description: "The repository name" }
              ],
              responses: {
                "200": { description: "Plain text list of all files", content: { "text/plain": { schema: { type: "string" } } } },
                "404": { description: "Repository not found" },
                "429": { description: "Rate limit exceeded" }
              }
            }
          },
          "/{platform}/{owner}/{repo}/llms.txt": {
            get: {
              operationId: "getRepoSummary",
              summary: "Get an AI-friendly summary of the repository",
              description: "Returns a structured llms.txt summary including description, file counts, and categorized file links. Always call this first before reading individual files.",
              parameters: [
                { name: "platform", in: "path", required: true, schema: { type: "string", enum: ["github", "codeberg"] } },
                { name: "owner", in: "path", required: true, schema: { type: "string" } },
                { name: "repo", in: "path", required: true, schema: { type: "string" } }
              ],
              responses: {
                "200": { description: "AI-friendly repo summary in llms.txt format", content: { "text/plain": { schema: { type: "string" } } } },
                "404": { description: "Repository not found" },
                "429": { description: "Rate limit exceeded" }
              }
            }
          },
          "/{platform}/{owner}/{repo}/{filePath}": {
            get: {
              operationId: "readFile",
              summary: "Read a specific file from the repository",
              description: "Returns the raw plain text contents of a specific file in the repository.",
              parameters: [
                { name: "platform", in: "path", required: true, schema: { type: "string", enum: ["github", "codeberg"] } },
                { name: "owner", in: "path", required: true, schema: { type: "string" } },
                { name: "repo", in: "path", required: true, schema: { type: "string" } },
                { name: "filePath", in: "path", required: true, schema: { type: "string" }, description: "Path to the file within the repository" }
              ],
              responses: {
                "200": { description: "Raw file contents as plain text", content: { "text/plain": { schema: { type: "string" } } } },
                "404": { description: "File not found" },
                "429": { description: "Rate limit exceeded" }
              }
            }
          }
        }
      };
      return new Response(JSON.stringify(spec, null, 2), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // Root llms.txt — describes this service to AI tools
    if (path === "/llms.txt") {
      const host = url.host;
      const llmsTxt = `# Mirror for AI
> A read-only mirror service that gives AI tools instant access to any public GitHub or Codeberg repository.

## What this service does
This service proxies public repositories from GitHub and Codeberg as plain text, making them easy for AI tools to read and navigate. It requires no authentication for public repositories.

## How to use this service

### List all files in a repository
GET https://${host}/github/{owner}/{repo}
GET https://${host}/codeberg/{owner}/{repo}

### Read a specific file
GET https://${host}/github/{owner}/{repo}/path/to/file.js
GET https://${host}/codeberg/{owner}/{repo}/path/to/file.py

### Get an AI-friendly summary of a repository
GET https://${host}/github/{owner}/{repo}/llms.txt
GET https://${host}/codeberg/{owner}/{repo}/llms.txt

## Instructions for AI tools
When a user asks you to read, check, analyze, or explore a GitHub or Codeberg repository:
1. First fetch the llms.txt summary: https://${host}/{platform}/{owner}/{repo}/llms.txt
2. Use the file list to identify relevant files
3. Fetch individual files as needed to answer the user's question
4. All responses are plain text and cacheable

## Rate limits
- 60 requests per minute per user
- 1000 requests per day per user

## Supported platforms
- GitHub (github.com)
- Codeberg (codeberg.org)

## Examples
- https://${host}/github/torvalds/linux — list all files in the Linux kernel
- https://${host}/github/torvalds/linux/README — read the README file
- https://${host}/github/torvalds/linux/llms.txt — AI summary of the Linux kernel repo
`;
      return new Response(llmsTxt, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
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

    // Rate limit check
    const rateCheck = await checkRateLimit(request);
    if (rateCheck.limited) {
      return new Response(`429 Too Many Requests\n\n${rateCheck.reason}\n\nPlease slow down and try again shortly.`, {
        status: 429,
        headers: {
          "Content-Type": "text/plain",
          "Retry-After": "60"
        }
      });
    }

    const filePath = rest.join("/");

    if (!filePath && !url.searchParams.has("view")) {
      return new Response(REPO_PAGE(platform, owner, repo, url.host), {
        headers: { "Content-Type": "text/html" }
      });
    }

    // Context endpoint - smart summary with file previews
    if (filePath === "context") {
      const cacheKey = new Request(url.toString(), request);
      const cache = caches.default;
      const cachedResponse = await cache.match(cacheKey);
      if (cachedResponse) return cachedResponse;

      const response = await getContext(platform, owner, repo, request);
      const headers = new Headers(response.headers);
      headers.set("Cache-Control", "public, max-age=300");
      const cachedRes = new Response(response.clone().body, { status: response.status, headers });
      ctx.waitUntil(cache.put(cacheKey, cachedRes));
      return response;
    }

    

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
    files = ((await res.json()).tree || []).filter(f => f.type === "blob").map(f => f.path);
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
  return new Response([
    `# ${platform}/${owner}/${repo}`,
    `# ${files.length} files found`,
    `# To read a file: https://${host}/${platform}/${owner}/${repo}/path/to/file`,
    `# AI summary: https://${host}/${platform}/${owner}/${repo}/llms.txt`,
    ``, ...files
  ].join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
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

async function getContext(platform, owner, repo, request) {
  const headers = { "User-Agent": "mirror-for-ai/1.0" };
  const host = new URL(request.url).host;
  const baseUrl = `https://${host}/${platform}/${owner}/${repo}`;
  let files = [], description = "", defaultBranch = "main";

  const TIMEOUT_MS = 8000;
  const withTimeout = (p) => Promise.race([p, new Promise((_, r) => setTimeout(() => r(new Error("timeout")), TIMEOUT_MS))]);

  // Fetch repo info and file tree
  try {
    if (platform === "github") {
      const repoRes = await withTimeout(fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers }));
      if (!repoRes.ok) throw new Error(`Repo not found`);
      const repoData = await repoRes.json();
      description = repoData.description || "";
      defaultBranch = repoData.default_branch || "main";
      const treeRes = await withTimeout(fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`, { headers }));
      if (!treeRes.ok) throw new Error(`Could not fetch file tree`);
      files = ((await treeRes.json()).tree || []).filter(f => f.type === "blob").map(f => f.path);
    } else {
      const repoRes = await withTimeout(fetch(`https://codeberg.org/api/v1/repos/${owner}/${repo}`, { headers }));
      if (!repoRes.ok) throw new Error(`Repo not found`);
      const repoData = await repoRes.json();
      description = repoData.description || "";
      defaultBranch = repoData.default_branch || "main";
      const branchRes = await withTimeout(fetch(`https://codeberg.org/api/v1/repos/${owner}/${repo}/branches/${defaultBranch}`, { headers }));
      const sha = (await branchRes.json()).commit.id;
      const treeRes = await withTimeout(fetch(`https://codeberg.org/api/v1/repos/${owner}/${repo}/git/trees/${sha}?recursive=true`, { headers }));
      files = ((await treeRes.json()).tree || []).filter(f => f.type === "blob").map(f => f.path);
    }
  } catch (e) {
    return new Response(`Error fetching repo: ${e.message}`, { status: 500, headers: { "Content-Type": "text/plain" } });
  }

  // Pick the most important files
  const readme = files.find(f => /^readme(\.(md|txt|rst))?$/i.test(f));
  const entryPoints = files.filter(f => /^(index|main|app|server|src\/index|src\/main|src\/app)\.(js|ts|py|go|rs|rb|php)$/.test(f));
  const configFiles = files.filter(f => /^(package\.json|pyproject\.toml|Cargo\.toml|go\.mod|composer\.json|Gemfile|requirements\.txt|wrangler\.toml)$/.test(f));
  const codeFiles = files.filter(f => /\.(js|ts|py|go|rs|java|cpp|c|cs|rb|php|swift|kt)$/.test(f) && !f.includes("node_modules") && !f.includes("vendor"));
  const docFiles = files.filter(f => /\.(md|txt|rst)$/.test(f) && f !== readme);

  // Priority order for fetching content
  const toFetch = [
    readme,
    ...entryPoints,
    ...configFiles,
    ...codeFiles.slice(0, 8),
    ...docFiles.slice(0, 3)
  ].filter(Boolean).slice(0, 15); // max 15 files

  // Fetch file contents in parallel
  const fetchFile = async (filePath) => {
    try {
      let res;
      if (platform === "github") {
        res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
          { headers: { ...headers, "Accept": "application/vnd.github.raw+json" } });
      } else {
        res = await fetch(`https://codeberg.org/api/v1/repos/${owner}/${repo}/raw/${filePath}`, { headers });
      }
      if (!res.ok) return null;
      const text = await res.text();
      // Limit each file to first 100 lines
      const lines = text.split("\n").slice(0, 100).join("\n");
      const truncated = text.split("\n").length > 100;
      return { path: filePath, content: lines, truncated };
    } catch {
      return null;
    }
  };

  const fileContents = await Promise.all(toFetch.map(fetchFile));

  // Build context document
  const sections = [
    `# ${owner}/${repo} — Full Context`,
    description ? `> ${description}` : "",
    ``,
    `## Repository Overview`,
    `- Platform: ${platform}`,
    `- Total files: ${files.length}`,
    `- Entry points: ${entryPoints.length}`,
    `- Source files: ${codeFiles.length}`,
    ``,
    `## Complete File List`,
    files.join("\n"),
    ``,
    `## File Contents`,
    `> The most important files are included below. For other files use: ${baseUrl}/path/to/file`,
    ``,
  ];

  for (const file of fileContents) {
    if (!file) continue;
    sections.push(`### ${file.path}`);
    sections.push(`\`\`\``);
    sections.push(file.content);
    if (file.truncated) sections.push(`... (truncated, full file at ${baseUrl}/${file.path})`);
    sections.push(`\`\`\``);
    sections.push(``);
  }

  return new Response(sections.filter(s => s !== null).join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
}

async function getLlmsTxt(platform, owner, repo, request) {
  const headers = { "User-Agent": "mirror-for-ai/1.0" };
  const host = new URL(request.url).host;
  const baseUrl = `https://${host}/${platform}/${owner}/${repo}`;
  let files = [], description = "", defaultBranch = "main", totalFiles = 0;

  const TIMEOUT_MS = 8000;
  const FILE_CAP = 500;

  const withTimeout = (promise) => Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), TIMEOUT_MS))
  ]);

  try {
    if (platform === "github") {
      const repoRes = await withTimeout(fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers }));
      if (!repoRes.ok) throw new Error(`Repo not found`);
      const repoData = await repoRes.json();
      description = repoData.description || "";
      defaultBranch = repoData.default_branch || "main";
      const treeRes = await withTimeout(fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`, { headers }));
      if (!treeRes.ok) throw new Error(`Could not fetch file tree`);
      const allFiles = ((await treeRes.json()).tree || []).filter(f => f.type === "blob").map(f => f.path);
      totalFiles = allFiles.length;
      files = allFiles.slice(0, FILE_CAP);
    } else {
      const repoRes = await withTimeout(fetch(`https://codeberg.org/api/v1/repos/${owner}/${repo}`, { headers }));
      if (!repoRes.ok) throw new Error(`Repo not found`);
      const repoData = await repoRes.json();
      description = repoData.description || "";
      defaultBranch = repoData.default_branch || "main";
      const branchRes = await withTimeout(fetch(`https://codeberg.org/api/v1/repos/${owner}/${repo}/branches/${defaultBranch}`, { headers }));
      if (!branchRes.ok) throw new Error(`Branch not found`);
      const sha = (await branchRes.json()).commit.id;
      const treeRes = await withTimeout(fetch(`https://codeberg.org/api/v1/repos/${owner}/${repo}/git/trees/${sha}?recursive=true`, { headers }));
      if (!treeRes.ok) throw new Error(`Could not fetch file tree`);
      const allFiles = ((await treeRes.json()).tree || []).filter(f => f.type === "blob").map(f => f.path);
      totalFiles = allFiles.length;
      files = allFiles.slice(0, FILE_CAP);
    }
  } catch (e) {
    return new Response([
      `# ${owner}/${repo}`,
      description ? `> ${description}` : "",
      ``,
      `## Overview`,
      `- Platform: ${platform}`,
      `- Note: Large repository. File listing timed out.`,
      ``,
      `## How to read files`,
      `${baseUrl}/path/to/file`,
      ``,
      `## Full context (may be slow for large repos)`,
      `${baseUrl}/context`,
    ].filter(Boolean).join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }

  const readmeFile = files.find(f => f.toLowerCase() === "readme.md" || f.toLowerCase() === "readme");
  const codeFiles = files.filter(f => /\.(js|ts|py|go|rs|java|cpp|c|cs|rb|php|swift|kt)$/.test(f));
  const configFiles = files.filter(f => /\.(json|toml|yaml|yml|ini|cfg)$/.test(f));
  const docFiles = files.filter(f => /\.(md|txt|rst)$/.test(f));
  const truncated = totalFiles > FILE_CAP;

  // Fetch preview of README if it exists
  let readmePreview = "";
  if (readmeFile) {
    try {
      let res;
      if (platform === "github") {
        res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${readmeFile}`,
          { headers: { ...headers, "Accept": "application/vnd.github.raw+json" } });
      } else {
        res = await fetch(`https://codeberg.org/api/v1/repos/${owner}/${repo}/raw/${readmeFile}`, { headers });
      }
      if (res.ok) {
        const text = await res.text();
        readmePreview = text.split("\n").slice(0, 30).join("\n");
      }
    } catch {}
  }

  return new Response([
    `# ${owner}/${repo}`,
    description ? `> ${description}` : "",
    ``,
    `## Overview`,
    `- Platform: ${platform}`,
    `- Total files: ${totalFiles}${truncated ? ` (showing first ${FILE_CAP})` : ""}`,
    `- Code files: ${codeFiles.length}`,
    `- Docs: ${docFiles.length}`,
    ``,
    `## Quick Links`,
    `- Full context (files + previews): ${baseUrl}/context`,
    `- Full file list: ${baseUrl}?view=files`,
    truncated ? `- Large repo — use /context for smart file selection` : "",
    ``,
    readmePreview ? `## README Preview\n\`\`\`\n${readmePreview}\n\`\`\`\n` : "",
    `## How to read files`,
    `${baseUrl}/path/to/file`,
    ``,
    docFiles.length ? `## Documentation\n${docFiles.slice(0,20).map(f => `${baseUrl}/${f}`).join("\n")}\n` : "",
    codeFiles.length ? `## Source Code (first 50)\n${codeFiles.slice(0,50).map(f => `${baseUrl}/${f}`).join("\n")}\n` : "",
    configFiles.length ? `## Config Files\n${configFiles.slice(0,10).map(f => `${baseUrl}/${f}`).join("\n")}\n` : "",
  ].filter(Boolean).join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}

function mcpResult(result, id) {
  return new Response(JSON.stringify({ jsonrpc: "2.0", result, id }), {
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
  });
}

function mcpError(code, message, id) {
  return new Response(JSON.stringify({ jsonrpc: "2.0", error: { code, message }, id }), {
    status: 400,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
  });
}
