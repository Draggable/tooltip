#!/bin/bash
# Rebuild vendor/npm-11.21.1-undici-6.29.1.tgz
#
# @semantic-release/npm depends on npm ^11.6.2. The latest npm 11 release
# (11.21.1) bundles undici 6.29.0 for node-gyp. That version is inside
# GHSA-xjj6-f33q-929c (>= 6.23.0, < 6.29.1). npm 12.2.1, the latest
# published CLI, vendors the same undici 6.29.0. npm overrides do not
# replace dependencies bundled inside a dependency tarball, so this
# repacks official npm@11.21.1 with official undici@6.29.1 in its place.
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
workdir="$(mktemp -d)"
trap 'rm -rf "$workdir"' EXIT

cd "$workdir"
npm pack npm@11.21.1 --silent
npm pack undici@6.29.1 --silent
mkdir npm undici
tar -xzf npm-11.21.1.tgz -C npm
tar -xzf undici-6.29.1.tgz -C undici
rm -rf npm/package/node_modules/undici
mkdir -p npm/package/node_modules/undici
cp -a undici/package/. npm/package/node_modules/undici/
tar -czf "$root/vendor/npm-11.21.1-undici-6.29.1.tgz" -C npm package

version="$(tar -xOzf "$root/vendor/npm-11.21.1-undici-6.29.1.tgz" package/node_modules/undici/package.json | python3 -c 'import json,sys; print(json.load(sys.stdin)["version"])')"
if [[ "$version" != "6.29.1" ]]; then
  echo "expected undici 6.29.1, found $version" >&2
  exit 1
fi
echo "wrote $root/vendor/npm-11.21.1-undici-6.29.1.tgz (bundled undici $version)"
