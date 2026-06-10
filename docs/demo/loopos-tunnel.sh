#!/usr/bin/env bash
# LoopOS — quick cloudflared tunnel for ChatGPT Connector (Beat 5).
#
# Run this AFTER `uv run rbt dev run` is up on the Mini.
# Prints a https://*.trycloudflare.com URL — append /mcp and paste it into
# ChatGPT → Settings → Connectors → Add. Same Reboot backend as Tailscale
# path, so durable state is shared.
#
# Tunnel stays up until you Ctrl+C. URL changes per session (free quick tunnel).
# For a stable URL, set up a named tunnel (cloudflared tunnel create loopos).

set -euo pipefail

REBOOT_PORT="${REBOOT_PORT:-9991}"
REBOOT_URL="http://localhost:${REBOOT_PORT}"

# Sanity: is Reboot running?
if ! curl -s -o /dev/null -w "%{http_code}" --max-time 2 "${REBOOT_URL}/mcp" \
  | grep -qE "^(200|401|404|405|301|302)$"; then
  echo "[loopos-tunnel] WARN: ${REBOOT_URL}/mcp not responding."
  echo "[loopos-tunnel] Start the backend first: cd ~/code/loopos && uv run rbt dev run"
  echo "[loopos-tunnel] Continuing anyway — tunnel will retry once backend is up."
fi

echo "[loopos-tunnel] Starting quick tunnel to ${REBOOT_URL}..."
echo "[loopos-tunnel] Look for the https://*.trycloudflare.com URL below — append /mcp."
echo "[loopos-tunnel] Ctrl+C to stop."
echo

exec cloudflared tunnel --url "${REBOOT_URL}" --no-autoupdate
