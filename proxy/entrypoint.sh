#!/bin/sh
TARGET=${TARGET_IP:-127.0.0.1}

echo "Proxy starting — forwarding to $TARGET"
echo "  :3000 → $TARGET:3000 (CCTV)"
echo "  :3001 → $TARGET:3001 (FRP)"
echo "  :8080 → $TARGET:8080 (API)"

socat TCP-LISTEN:3000,fork,reuseaddr TCP:${TARGET}:3000 &
socat TCP-LISTEN:3001,fork,reuseaddr TCP:${TARGET}:3001 &
socat TCP-LISTEN:8080,fork,reuseaddr TCP:${TARGET}:8080 &

wait
