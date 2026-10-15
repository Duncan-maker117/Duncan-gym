#!/usr/bin/env node
// Create a clean publication snapshot from this checkout, without upstream Git
// history or third-party exercise media. The destination must be empty.
import { execFileSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dest = resolve(process.argv[2] || join(root, '.publish', 'Duncan-gym'))
const publicationRoot = resolve(root, '.publish')
if (!dest.startsWith(publicationRoot + sep)) throw new Error('Destination must be inside .publish/')
if (existsSync(dest) && readdirSync(dest).length) throw new Error('Destination is not empty: ' + dest)

const blockedRoots = ['assets/', 'website/', '.gitea/', '.gitlab/', 'helm/', 'kubernetes/', 'contrib/']
const blockedFiles = new Set([
  '.gitlab-ci.yml', 'CLA.md', 'CLAUDE.md', 'CHANGELOG.md', 'CONTRIBUTING.md',
  'ROADMAP.md', 'SECURITY.md', 'renovate.json'
])
const allowedDocs = new Set(['docs/DEPLOYMENT.md', 'docs/PROJECT_HANDOFF.md'])
const allowedGitHub = new Set(['.github/workflows/pages.yml', '.github/ISSUE_TEMPLATE/exercise.yml'])
const include = rel => {
  if (blockedRoots.some(prefix => rel.startsWith(prefix)) || blockedFiles.has(rel)) return false
  if (rel.startsWith('catalogue/media/')) return rel === 'catalogue/media/NOTICE.md'
  if (rel.startsWith('docs/')) return allowedDocs.has(rel)
  if (rel.startsWith('.github/')) return allowedGitHub.has(rel)
  return true
}

const tracked = execFileSync('git', ['ls-files', '-z'], { cwd: root, maxBuffer: 20 * 1024 * 1024 })
  .toString('utf8').split('\0').filter(Boolean)
const added = ['AGENTS.md', 'docs/DEPLOYMENT.md', 'docs/PROJECT_HANDOFF.md', 'frontend/src/lib/brand.js', 'scripts/prepare-publication.mjs']
const files = [...new Set([...tracked, ...added])].filter(include)
mkdirSync(dest, { recursive: true })
let bytes = 0
for (const rel of files) {
  const from = join(root, rel)
  if (!existsSync(from)) throw new Error('Missing source file: ' + rel)
  const to = join(dest, rel)
  mkdirSync(dirname(to), { recursive: true })
  copyFileSync(from, to)
  bytes += statSync(from).size
}
console.log(`Prepared ${files.length} files, ${(bytes / 1024 / 1024).toFixed(1)} MiB in ${dest}`)
