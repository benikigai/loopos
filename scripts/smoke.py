import httpx, json, urllib.parse as up
BASE = "http://localhost:9991"
CALLBACK = "http://127.0.0.1:9991/oauth/test-callback"
with httpx.Client(follow_redirects=False) as c:
    cid = c.post(f"{BASE}/__/oauth/register", json={"redirect_uris": [CALLBACK]}).json()["client_id"]
    cv = "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk"; cc = "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM"
    r = c.get(f"{BASE}/__/oauth/authorize", params={"response_type": "code", "client_id": cid,
        "redirect_uri": CALLBACK, "code_challenge": cc, "code_challenge_method": "S256", "state": "s"})
    r = c.get(r.headers["location"])
    code = up.parse_qs(up.urlparse(r.headers["location"]).query)["code"][0]
    token = c.post(f"{BASE}/__/oauth/token", data={"grant_type": "authorization_code",
        "code": code, "redirect_uri": CALLBACK, "client_id": cid, "code_verifier": cv}).json()["access_token"]
    H = {"Authorization": f"Bearer {token}", "Content-Type": "application/json",
         "Accept": "application/json, text/event-stream", "MCP-Protocol-Version": "2025-06-18"}
    r = c.post(f"{BASE}/mcp/", headers=H, json={"jsonrpc": "2.0", "id": 1, "method": "initialize",
        "params": {"protocolVersion": "2025-06-18", "capabilities": {},
        "clientInfo": {"name": "smoke", "version": "0.1"}}})
    H["mcp-session-id"] = r.headers["mcp-session-id"]
    c.post(f"{BASE}/mcp/", headers=H, json={"jsonrpc": "2.0", "method": "notifications/initialized"})
    def call(name, args):
        r = c.post(f"{BASE}/mcp/", headers=H, json={"jsonrpc": "2.0", "id": 99,
            "method": "tools/call", "params": {"name": name, "arguments": args}})
        for line in r.text.split("\n"):
            if line.startswith("data: "):
                d = json.loads(line[6:])
                if "error" in d: return f"ERROR: {d['error']}"
                content = d.get("result", {}).get("content", [])
                if content: return content[0].get("text", "")
                return f"RESULT: {json.dumps(d.get('result'))[:200]}"
        return f"NO_DATA: {r.text[:300]}"

    # Step 1: ingest
    out = call("ingest_text_message", {"request": {
        "property_id": "warm_taipei_2br",
        "text": "Ben，Warm Taipei 主臥冷氣在漏水，水滴到插座旁邊，客人在生氣，要找誰？",
        "sender_user_id": "shirley"}})
    tid = json.loads(out)["ticket_id"]
    print(f"INGEST → ticket {tid}\n")

    # Step 2: inspect ops_ticket schema
    r = c.post(f"{BASE}/mcp/", headers=H, json={"jsonrpc": "2.0", "id": 100, "method": "tools/list"})
    for line in r.text.split("\n"):
        if line.startswith("data: "):
            d = json.loads(line[6:])
            for t in d["result"]["tools"]:
                if t["name"] == "ops_ticket_show_brain_sources":
                    print("=== show_brain_sources schema ===")
                    print(json.dumps(t.get("inputSchema", {}), indent=2)[:600])
            break

    # Step 3: try various arg shapes
    print(f"\n=== TRY: state_id ===")
    print(call("ops_ticket_show_brain_sources", {"state_id": tid})[:500])
    print(f"\n=== TRY: ops_ticket_id ===")
    print(call("ops_ticket_show_brain_sources", {"ops_ticket_id": tid})[:500])
