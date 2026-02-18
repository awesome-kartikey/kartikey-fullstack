# Release Management

We use **Tags** to mark specific points in history as important versions (e.g., v1.0.0).

## Creating a Tag
1. Finish all work and push to main.
2. Create the tag locally:
   `git tag -a v0.1.0 -m "release: initial version of git course"`

## Publishing the Release
Tags are not pushed automatically. I must push them explicitly:
1. Command: `git push origin v0.1.0`
2. Go to GitHub -> "Releases" -> "Draft a new release".
3. Select the tag `v0.1.0`.
4. Write release notes describing what changed.