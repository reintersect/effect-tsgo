---
"@reintersect/effect-tsgo": patch
---

Extend the darwin realpath patch's regression suite with a
`TestRealpathSymlinkedPackageDir` test that mirrors pnpm's virtual-store
layout: one package reachable through its canonical store path and through a
workspace `node_modules` symlink, containing both copied (`nlink == 1`,
pnpm `patchedDependencies`) and hardlink-deduplicated files, resolved
concurrently while the kernel name cache is churned. Every spelling must
resolve to one canonical path; a divergence would give the compiler two
module identities for the same file and produce phantom assignability
errors.

No behavioral change: an investigation of nondeterministic TS2345 dual
module identities reproduced them only under a stale
`@typescript/native-preview` 2026-03-12 nightly that was shadowing this
package's `tsgo` bin — the packaged binaries passed the same cold-cache
repro 50+ times consecutively.
