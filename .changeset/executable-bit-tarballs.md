---
"@reintersect/effect-tsgo": patch
---

Ship the packaged platform binaries with the executable bit set. `changeset
publish` packs through `pnpm publish`, which only marks `bin` entries
executable, so 0.27.1's `lib/tsc` and `lib/tsc-next` landed as 0644 despite
the workflow chmod; the unix platform packages now declare
`publishConfig.executableFiles`. This makes the
`typescript.native-preview.tsdk` directory setting work without any prior
chmod (the `tsgo` launcher and `effect-tsgo` CLI already chmod on first
run).
