// PostToolUse(Edit|Write): formaterar filen som just ändrades med Prettier och
// kör sedan ESLint med samma config som CI (närmaste eslint.config.mjs – appen
// eller paketet). Lintfel skickas tillbaka till agenten (exit 2 + stderr)
// medan ändringen fortfarande är färsk.
//
// Prettier körs först så att ESLint ser den slutliga koden. Bara lintfel
// rapporteras, inte varningar – CI stoppar också bara på fel.
// Fail-open: allt vi inte kan hantera säkert släpps igenom med exit 0.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const repo = process.env.CLAUDE_PROJECT_DIR;
if (!repo) process.exit(0);

let fil = "";
try {
  const input = JSON.parse(readFileSync(0, "utf8"));
  fil = String(input?.tool_input?.file_path ?? "");
} catch {
  process.exit(0);
}
if (!fil || !existsSync(fil)) process.exit(0);

const abs = path.resolve(fil);
const rel = path.relative(repo, abs);
if (rel.startsWith("..") || path.isAbsolute(rel)) process.exit(0);
if (/(^|[\\/])(node_modules|generated|\.next)[\\/]/.test(rel)) process.exit(0);

/** Sökväg till ett pakets CLI, löst från en viss mapps package.json. */
function bin(fran, paket, ...delar) {
  try {
    const req = createRequire(path.join(fran, "package.json"));
    return path.join(
      path.dirname(req.resolve(`${paket}/package.json`)),
      ...delar,
    );
  } catch {
    return null;
  }
}

// 1. Prettier – .prettierrc.json och .prettierignore i roten gäller.
//    --ignore-unknown: filtyper Prettier inte kan (t.ex. .sql) hoppas över.
const prettier = bin(repo, "prettier", "bin", "prettier.cjs");
if (prettier) {
  try {
    execFileSync(
      process.execPath,
      [prettier, "--write", "--ignore-unknown", "--log-level", "warn", rel],
      { cwd: repo, stdio: "ignore" },
    );
  } catch {
    // Syntaxfel o.d. – ESLint nedan (eller typkontrollen) säger mer.
  }
}

// 2. ESLint – bara för kod.
if (!/\.(ts|tsx|mts|mjs)$/.test(abs)) process.exit(0);

let dir = path.dirname(abs);
while (!existsSync(path.join(dir, "eslint.config.mjs"))) {
  const upp = path.dirname(dir);
  if (upp === dir || path.relative(repo, upp).startsWith("..")) process.exit(0);
  dir = upp;
}

const eslint = bin(dir, "eslint", "bin", "eslint.js");
if (!eslint) process.exit(0);

try {
  execFileSync(
    process.execPath,
    [eslint, path.relative(dir, abs), "--quiet", "--no-warn-ignored"],
    { cwd: dir, stdio: ["ignore", "pipe", "pipe"], encoding: "utf8" },
  );
  process.exit(0);
} catch (err) {
  // Exit 1 = lintfel. Annat (krasch, saknad config) släpps igenom.
  if (err?.status !== 1) process.exit(0);
  const ut = `${err.stdout ?? ""}${err.stderr ?? ""}`.trim();
  if (!ut) process.exit(0);
  console.error(`ESLint hittade fel i ${rel}:\n\n${ut}`);
  process.exit(2);
}
