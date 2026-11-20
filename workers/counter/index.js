// Tiny hit counter for the Toronto Community footer.
// GET /hit increments and returns { views }; GET / returns { views } without incrementing.
export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    };
    const url = new URL(request.url);
    const key = "views";
    try {
      const current = parseInt((await env.TORONTO_VIEWS.get(key)) || "0", 10);
      if (url.pathname === "/hit") {
        const next = current + 1;
        await env.TORONTO_VIEWS.put(key, String(next));
        return new Response(JSON.stringify({ views: next }), { headers: cors });
      }
      return new Response(JSON.stringify({ views: current }), { headers: cors });
    } catch (e) {
      return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: cors });
    }
  },
};
