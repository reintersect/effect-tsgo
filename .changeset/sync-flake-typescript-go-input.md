---
"@reintersect/effect-tsgo": patch
---

Sync the `typescript-go-src` flake input with the `typescript-go` submodule commit (`37357ae6`). The upstream bump in #4 was merged before the Refresh Flake Hash workflow pushed its sync commit, leaving the flake building against an older typescript-go source that lacks symbols referenced by the regenerated shims.
