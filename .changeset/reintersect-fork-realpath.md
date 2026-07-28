---
"@reintersect/effect-tsgo": patch
---

Fork of `@effect/tsgo` published as `@reintersect/effect-tsgo`, carrying
[microsoft/typescript-go#4578](https://github.com/microsoft/typescript-go/pull/4578)
as `_patches/028-nativepath-realpath-darwin.patch`. The upstream `F_GETPATH`
fast path in `internal/nativepath/realpath_darwin.go` can return any hardlink
sibling's name for files with `nlink > 1` (nondeterministically under
concurrency), which breaks module resolution in pnpm and Nix stores on macOS
(microsoft/typescript-go#4262). The patch resolves the parent directory instead
for hardlinked regular files and re-attaches the final component.

All packages are renamed from `@effect/tsgo*` to `@reintersect/effect-tsgo*`;
the CLI bin name stays `effect-tsgo`. This fork retires as soon as upstream
merges the fix.
