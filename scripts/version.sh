#!/usr/bin/env bash

set -euo pipefail

package=$1
version_type=$2

echo "Making a $version_type release for $package"

npm version "$version_type" --workspace "$package"
new_version=v$(jq -r .version "packages/$package/package.json")
echo "New version: $new_version"

echo "Committing and pushing changes"
if [[ -n "$CI" ]]; then
  git config user.name "${GITHUB_ACTOR}"
  git config user.email "${GITHUB_ACTOR_ID}+${GITHUB_ACTOR}@users.noreply.github.com"
fi
git add package.json "packages/$package/package.json" package-lock.json
git commit -m "$package: $new_version"
git push
