#!/bin/sh

set -e

echo "Starting dashboard application..."

replace_placeholder() {
  local placeholder=$1
  local env_var=$2
  if [ -n "$env_var" ]; then
    echo "Replacing $placeholder with: $env_var"
    find /usr/share/caddy/html -type f -name "*.js" -exec sed -i "s|$placeholder|$env_var|g" {} +
  else
    echo "WARNING: $placeholder not set - placeholder will remain"
  fi
}

replace_placeholder "VITE_PUBLIC_API_URL_PLACEHOLDER" "$VITE_PUBLIC_API_URL"
replace_placeholder "VITE_PUBLIC_POSTHOG_KEY_PLACEHOLDER" "$VITE_PUBLIC_POSTHOG_KEY"
replace_placeholder "VITE_PUBLIC_POSTHOG_HOST_PLACEHOLDER" "$VITE_PUBLIC_POSTHOG_HOST"

echo "Configuration complete."

exec "$@"
