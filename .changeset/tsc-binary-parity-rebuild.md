---
"@reintersect/effect-tsgo": patch
---

Rebuild the packaged `tsc` binary from the refreshed `generated/latest`
branch. The `tsc` binary in 0.27.0 was built from a snapshot that predated
the upstream sync, so it carried the darwin realpath patch but not the new
`abortControllerInEffect` diagnostic that 0.27.0's changelog advertises
(`tsc-next` had both). Both packaged binaries now include the full
diagnostic set and the realpath fix.
