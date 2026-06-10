#!/usr/bin/env bash
# Shortcut wrapper for the locally-cloned MCPJam CLI.
# Build with: cd ~/code/references/mcpjam-inspector && npm run build:packages
exec node /Users/elias/code/references/mcpjam-inspector/cli/dist/index.js "$@"
