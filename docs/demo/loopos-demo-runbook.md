# LoopOS demo runbook — Mini (host) + MBP (stage)

Mini = `eliass-mac-mini.tail365038.ts.net` (Tailscale MagicDNS) = Reboot backend host.
MBP = stage / Claude Desktop. Reaches Mini's localhost services via **SSH port forwarding**.
ChatGPT = uses cloudflared tunnel from Mini.

## Why SSH port forward (not bare Tailscale IP)

`rbt dev run` binds to `127.0.0.1:9991`, not `0.0.0.0`. Hitting `http://100.85.105.99:9991`
from the MBP fails — Tailscale routes the packet, but the loopback-only listener
rejects non-loopback traffic. SSH port forward terminates on the Mini, so the
listener sees a real localhost client.

## Pre-demo checklist (T-30 min)

### On the **Mini**

```bash
# 1. Make sure Docker engine is up (OrbStack must have its first-run dialogs accepted).
docker info | head -3   # must print "Server Version: ..."

# 2. Keep Mini awake.
caffeinate -dimsu &
echo $! > /tmp/loopos-caffeinate.pid

# 3. Start Reboot backend (Terminal 1).
cd ~/code/loopos
uv run rbt dev run
# Wait for "ready" log line; serves at http://localhost:9991/mcp

# 4. Start Vite HMR (Terminal 2).
cd ~/code/loopos/web
npm run dev
# Serves at http://localhost:4444 — Reboot proxies /__/web/** to it for the React UI.

# 5. (Optional) Start ChatGPT tunnel for Beat 5 (Terminal 3).
~/loopos-tunnel.sh
# Copy the https://*.trycloudflare.com URL it prints. Append /mcp.

# 6. Sanity smoke from the Mini itself before MBP touches anything.
mcpjam server probe --url http://localhost:9991/mcp
mcpjam tools list --url http://localhost:9991/mcp
```

### On the **MBP**

```bash
# 1. Open SSH port forwards for Reboot + Vite (Terminal 1, leave running).
ssh -L 9991:localhost:9991 -L 4444:localhost:4444 -N \
  elias@eliass-mac-mini.tail365038.ts.net
# -N = no shell, just tunnel. Add -f to background it after auth.

# 2. Drop the loopos MCP server into Claude Desktop config (one-time).
# If file doesn't exist:
cp ~/loopos-mbp-claude-config.json \
   "$HOME/Library/Application Support/Claude/claude_desktop_config.json"
#
# If it already exists with other servers, MERGE the "loopos" entry —
# don't replace the whole file.

# 3. Quit and reopen Claude Desktop fully.
osascript -e 'tell application "Claude" to quit' 2>/dev/null || true
sleep 1
open -a "Claude"

# 4. First connect pops an OAuth window pointing at http://localhost:9991/...
#    (which the SSH tunnel routes to the Mini). Approve it. Tools surface
#    in the integrations panel.
```

### In **ChatGPT** (browser, optional, for Beat 5)

ChatGPT can't see localhost or Tailscale, so it uses the **cloudflared tunnel** instead.
- Settings → Connectors → Add
- Paste the cloudflared URL from Mini step 5 + `/mcp`
- Approve OAuth
- New chat: ask "list loopos tickets" — should see same tickets as Claude Desktop

## On stage — sanity prompt

In Claude Desktop:

> Use loopos: ingest a voice note for property `warm_taipei_2br` with audio `demo://shirley_ac_zh.m4a`. Then triage that ticket and show me live state.

Expected: ticket created → triaged → category=hvac_leak, severity=4, status flips dispatched → awaiting_human, skill_artifact populated with Mr. Wang HVAC.

## Failure modes

| Symptom | Fix |
|---|---|
| MBP Claude Desktop says "loopos failed to connect" | SSH tunnel dropped — restart `ssh -L …`. Or Reboot not running on Mini — check `lsof -nP -iTCP:9991 -sTCP:LISTEN` |
| OAuth callback fails on MBP | Tunnel must forward all needed ports (HMR `:4444` plus `:9991`). Add more `-L` flags as needed |
| Bare Tailscale IP in config | Reboot binds 127.0.0.1, not 0.0.0.0 — must use SSH forward (see top section) |
| ChatGPT Connector won't add | Tunnel URL didn't include `/mcp`; or tunnel URL changed since last session — re-run `~/loopos-tunnel.sh`, update connector |
| `docker` hangs | OrbStack engine not initialized — open OrbStack from dock, accept first-run dialogs, wait for menu-bar icon to settle |
| Mini falls asleep mid-demo | `caffeinate` not running; restart it |

## Teardown

```bash
# On Mini:
kill $(cat /tmp/loopos-caffeinate.pid)
# Ctrl+C the rbt dev run, npm run dev, and cloudflared terminals.

# On MBP:
# Ctrl+C the ssh -L tunnel terminal.
```
