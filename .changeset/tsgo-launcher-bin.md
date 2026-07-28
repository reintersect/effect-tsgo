---
"@reintersect/effect-tsgo": patch
---

Add a `tsgo` bin to the main package: a minimal launcher that resolves the
platform package and executes its packaged binary directly (`lib/tsc` by
default, `lib/tsc-next` with `ETSGO_CHANNEL=next`), forwarding arguments,
stdio, and the exit code. A plain devDependency now provides a working
`node_modules/.bin/tsgo` without patching an installed `typescript`.

Platform packages now ship their binaries with the executable bit set, so
the `TypeScriptTeam.native-preview` extension can use
`"typescript.native-preview.tsdk": "./node_modules/@reintersect/effect-tsgo-<platform>-<arch>/lib"`
directly (the extension accepts a directory containing a `tsc` binary and
starts it with `--lsp`). `effect-tsgo patch` remains unchanged as the
fallback flow.
