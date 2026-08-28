#!/usr/bin/env node
// scripts/end-of-day.mjs
//
// Companion to the end-of-day workflow. Prints a structured summary of
// git activity since the most recent session file (or the very first commit
// if no session file exists yet), so the AI agent / human can decide whether
// to append to docs/DECISIONS.md, draft a new file under docs/sessions/, and
// update CHANGELOG.md.
//
// Usage:
//   node scripts/end-of-day.mjs             # JSON to stdout
//   node scripts/end-of-day.mjs --markdown  # human-readable summary
//
// Exit code: 0 always. (The agent decides what to do with the output.)

import { readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..');
const sessionsDir = join(repoRoot, 'docs', 'sessions');

const isMarkdown = process.argv.includes('--markdown');

function sh(cmd, args = []) {
  try {
    return execFileSync(cmd, args, {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return '';
  }
}

const today = new Date().toISOString().slice(0, 10);
const todaySlug = today;

let lastSession = null;
try {
  const files = readdirSync(sessionsDir).filter((f) => f.endsWith('.md'));
  if (files.length > 0) {
    files.sort();
    lastSession = files[files.length - 1];
  }
} catch {
  // dir missing — first run
}

let sinceSha = '';
if (lastSession) {
  sinceSha = sh('git', [
    'log',
    '--diff-filter=A',
    '--format=%H',
    '--',
    `docs/sessions/${lastSession}`,
  ]).split('\n')[0];
}
if (!sinceSha) {
  sinceSha = sh('git', ['rev-list', '--max-parents=0', 'HEAD']);
}

const headSha = sh('git', ['rev-parse', 'HEAD']);

let commits = [];
if (sinceSha) {
  const r = sh('git', [
    'log',
    '--pretty=format:%h%x09%an%x09%s',
    `${sinceSha}..HEAD`,
  ]);
  commits = r ? r.split('\n').filter(Boolean) : [];
}

const filesChanged = sinceSha
  ? sh('git', ['diff', '--name-status', `${sinceSha}..HEAD`]).split('\n').filter(Boolean)
  : [];

const shortstat = sinceSha ? sh('git', ['diff', '--shortstat', `${sinceSha}..HEAD`]) : '';

// Heuristics for whether to update each doc
const hasNewDecision =
  filesChanged.some((l) => /^\s*A\s+src\/components\//.test(l)) ||
  filesChanged.some((l) => /^\s*A\s+\.github\/workflows\//.test(l)) ||
  filesChanged.some((l) => /^\s*M\s+(package\.json|astro\.config\.mjs|tsconfig\.json)/.test(l));

const isUserVisible =
  filesChanged.some((l) => /^\s*[AM]\s+src\/pages\//.test(l)) ||
  filesChanged.some((l) => /^\s*[AM]\s+src\/components\//.test(l)) ||
  filesChanged.some((l) => /^\s*[AM]\s+src\/styles\//.test(l));

const summary = {
  today: todaySlug,
  newSessionPath: `docs/sessions/${todaySlug}.md`,
  lastSessionFile: lastSession,
  sinceSha: sinceSha.slice(0, 12),
  headSha: headSha.slice(0, 12),
  shortstat,
  commits,
  filesChanged,
  suggestions: {
    newSessionFile: commits.length > 0,
    newSessionPath: lastSession !== `${todaySlug}.md` ? `docs/sessions/${todaySlug}.md` : `docs/sessions/${todaySlug}-2.md`,
    appendDecisions: hasNewDecision,
    updateChangelog: isUserVisible,
  },
};

if (isMarkdown) {
  const lines = [];
  lines.push(`# End-of-day snapshot — ${summary.today}`);
  lines.push('');
  lines.push(`- Last session file: \`${summary.lastSessionFile ?? '(none, first session)'}\``);
  lines.push(`- Diff range: \`${summary.sinceSha}..${summary.headSha}\``);
  lines.push(`- Stats: ${summary.shortstat || 'no changes'}`);
  lines.push('');
  lines.push('## Suggested updates');
  lines.push('');
  lines.push(`- **Session log**: ${summary.suggestions.newSessionFile ? `create \`${summary.suggestions.newSessionPath}\`` : 'append to existing'}`);
  lines.push(`- **DECISIONS**: ${summary.suggestions.appendDecisions ? 'review & likely append' : 'no new decision'}`);
  lines.push(`- **CHANGELOG**: ${summary.suggestions.updateChangelog ? 'likely needs an entry' : 'probably no user-visible change'}`);
  lines.push('');
  lines.push('## Commits');
  lines.push('');
  for (const c of summary.commits) lines.push(`- ${c}`);
  lines.push('');
  lines.push('## Files changed');
  lines.push('');
  for (const f of summary.filesChanged) lines.push(`- \`${f}\``);
  console.log(lines.join('\n'));
} else {
  console.log(JSON.stringify(summary, null, 2));
}
