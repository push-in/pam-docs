#!/bin/sh
set -eu

# Compatibility entrypoint for installation links published before the
# installer moved to immutable GitHub Release assets.
installer_url="https://github.com/push-in/pam/releases/latest/download/install.sh"

if command -v curl >/dev/null 2>&1; then
    exec curl -fsSL "$installer_url" | sh
fi

if command -v wget >/dev/null 2>&1; then
    exec wget -qO- "$installer_url" | sh
fi

echo "PAM installer: curl or wget is required." >&2
exit 1
