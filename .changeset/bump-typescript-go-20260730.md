---
"@reintersect/effect-tsgo": patch
---

Bump `typescript-go` to `7.1.0-dev.20260730.1` (`37357ae6`, 26 commits) and stop `textDocument/completion` from panicking on unadvertised trigger characters.

**Upstream bump**

`typescript-go` moves from `8d29e62f` (`7.1.0-dev.20260727.1`) to `37357ae6`, the commit published as `typescript@next` `7.1.0-dev.20260730.1`. All 24 existing patches in `_patches/` re-applied without modification. Notable upstream changes for language-server consumers: a signature-help crash on error-recovered JSX, a formatting crash on template literals in parser-recovered property signatures, two checker stack overflows, watcher performance work, and spelling suggestions restored for unknown `tsconfig` options.

**New patch: `030-ls-completions-trigger-character.patch`**

`isValidTrigger` in `internal/ls/completions.go` panicked on any trigger character outside the completion set it advertises:

```
panic handling request textDocument/completion: Unknown trigger character: >
```

Clients are only supposed to send the characters listed in the server's `completionProvider.triggerCharacters`, but wrapper language servers (the Svelte language server, for one) forward a single union of trigger characters to every downstream request. `textDocument/completion` therefore arrives with `>` (which tsgo advertises for VS auto-insert) and `(` / `,` (which it advertises for signature help), and the panic took down the whole request:

```jsonc
// before
{ "error": { "code": -32603,
             "message": "InternalError: panic handling request textDocument/completion: Unknown trigger character: >" } }
// after
{ "result": null }
```

Unrecognised trigger characters are now treated the way a well-behaved client would be treated if it had never sent them: not a valid completion trigger, so no completions. Behaviour for the advertised characters (`.`, `"`, `'`, `` ` ``, `/`, `@`, `<`, `#`, space, `*`) is unchanged.
