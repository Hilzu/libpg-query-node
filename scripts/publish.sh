#!/usr/bin/env bash

set -euo pipefail

package=$1
version_type=$2

echo "Making a $version_type release for $package"

npm version "$version_type" --workspace "$package"
new_version=$(jq -r .version "packages/$package/package.json")
echo "New version: $new_version"
# npm publish

echo "Committing and pushing changes"
if [[ -n "$CI" ]]; then
  git config user.name github-actions
  git config user.email github-actions@github.com
fi
git add package.json "packages/$package/package.json" package-lock.json
git commit -m "$package: $new_version"
git push
