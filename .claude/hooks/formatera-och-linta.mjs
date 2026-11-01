// PostToolUse(Edit|Write): kör ESLint på filen som just ändrades, med samma
// config som CI (närmaste eslint.config.mjs – appen eller paketet). Fel skickas
// tillbaka till agenten (exit 2 + stderr) medan ändringen fortfarande är färsk.
//
// Bara fel rapporteras, inte varningar – CI stoppar också bara på fel.
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

if (!/\.(ts|tsx|mts|mjs)$/.test(fil) || !existsSync(fil)) process.exit(0);

const abs = path.resolve(fil);
const rel = path.relative(repo, abs);
if (rel.startsWith("..") || path.isAbsolute(rel)) process.exit(0);
if (/(^|[\\/])(node_modules|generated|\.next)[\\/]/.test(rel)) process.exit(0);

// Närmaste mapp med eslint.config.mjs, men aldrig utanför repot.
let dir = path.dirname(abs);
while (!existsSync(path.join(dir, "eslint.config.mjs"))) {
  const upp = path.dirname(dir);
  if (upp === dir || path.relative(repo, upp).startsWith("..")) process.exit(0);
  dir = upp;
}

let eslint;
try {
  const req = createRequire(path.join(dir, "package.json"));
  eslint = path.join(
    path.dirname(req.resolve("eslint/package.json")),
    "bin",
    "eslint.js",
  );
} catch {
  process.exit(0);
}

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
