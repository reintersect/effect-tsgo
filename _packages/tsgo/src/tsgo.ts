import * as childProcess from "node:child_process"
import * as fs from "node:fs"
import * as nodeModule from "node:module"
import * as path from "node:path"

/**
 * Minimal launcher for the packaged Effect TypeScript-Go binary.
 *
 * Resolves the platform package next to this package, picks the packaged
 * binary for the requested channel (`lib/tsc` built from `generated/latest`
 * by default, `lib/tsc-next` built from `main` when `ETSGO_CHANNEL=next`),
 * and executes it with the forwarded arguments. This gives every consumer a
 * real `node_modules/.bin/tsgo` from a plain devDependency without patching
 * an installed `typescript` package. `effect-tsgo patch` remains available
 * for flows that need the patched `typescript` install itself.
 */

type Channel = "tsc" | "tsc-next"

const fail = (message: string): never => {
  console.error(message)
  return process.exit(1)
}

const resolveChannel = (env: NodeJS.ProcessEnv): Channel => env["ETSGO_CHANNEL"] === "next" ? "tsc-next" : "tsc"

const resolvePackageJsonPath = (packageName: string): string => {
  const selfRequire = nodeModule.createRequire(import.meta.url)
  try {
    return selfRequire.resolve(packageName + "/package.json")
  } catch {
    return fail(
      `Unable to resolve ${packageName}. ` +
        "Either your platform is unsupported, or the platform package is not installed."
    )
  }
}

const resolveBinaryPath = (channel: Channel): string => {
  const packageName = "@reintersect/effect-tsgo-" + process.platform + "-" + process.arch
  const packageJsonPath = resolvePackageJsonPath(packageName)
  const exeName = channel + (process.platform === "win32" ? ".exe" : "")
  const exePath = path.join(path.dirname(packageJsonPath), "lib", exeName)
  if (!fs.existsSync(exePath)) {
    return fail(`Native TypeScript binary not found at ${exePath}. Try reinstalling ${packageName}.`)
  }
  return exePath
}

const ensureExecutable = (exePath: string): void => {
  if (process.platform === "win32") {
    return
  }
  try {
    fs.accessSync(exePath, fs.constants.X_OK)
  } catch {
    try {
      fs.chmodSync(exePath, 0o755)
    } catch {
      fail(`Unable to mark ${exePath} as executable.`)
    }
  }
}

const exePath = resolveBinaryPath(resolveChannel(process.env))
ensureExecutable(exePath)

const result = childProcess.spawnSync(exePath, process.argv.slice(2), { stdio: "inherit" })
if (result.error !== undefined) {
  fail(result.error.message)
}
if (result.signal !== null) {
  process.kill(process.pid, result.signal)
} else {
  process.exit(result.status ?? 1)
}
