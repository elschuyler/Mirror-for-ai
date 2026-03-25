export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // --- AGENT DISCOVERY LAYER ---
    // Serves the "Manual" for other AIs
    if (path === "/ai-tools.json") {
      return new Response(JSON.stringify({
        schema_version: "v1",
        name: "RepoMirror",
        description: "Browse GitHub/Codeberg",
        endpoints: {
          context: "/context",
          files: "/?view=files",
          read: "/[path]"
        }
      }), { 
        headers: { "Content-Type": "application/json" } 
      });
    }

    if (path === "/openapi.json") {
      return new Response(JSON.stringify({
        openapi: "3.1.0",
        info: { title: "Mirror Tool", version: "1.0" },
        paths: {
          "/context": { get: { summary: "Repo Overview" } },
          "/?view=files": { get: { summary: "File Tree" } }
        }
      }), { 
        headers: { "Content-Type": "application/json" } 
      });
    }

    // --- LEGACY MIRROR LAYER ---
    // Existing functionality remains untouched
    // Logic: fetch from GitHub/Codeberg based on path
    try {
      // 1. Determine Target (GitHub/Codeberg)
      // 2. Fetch content
      // 3. Return as Markdown or Plain Text
      return new Response(`[Mirror Active] 
Viewing: ${path}\n\n(Legacy mirror logic 
executing here...)`, {
        headers: { "Content-Type": "text/plain" }
      });
    } catch (err) {
      return new Response("Mirror Error: " + 
        err.message, { status: 500 });
    }
  }
};
