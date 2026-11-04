// Point the CMS at the GitHub repository that Netlify builds from.
// Usage: node tools/setup-cms.mjs <owner>/<repo> [branch]
import { readFileSync, writeFileSync } from 'node:fs';
const [repo, branch = 'main'] = process.argv.slice(2);
if (!/^[\w.-]+\/[\w.-]+$/.test(repo || '')) { console.error('Usage: node tools/setup-cms.mjs <owner>/<repo> [branch]'); process.exit(1); }
const f = new URL('../public/admin/config.yml', import.meta.url);
const s = readFileSync(f, 'utf8').replace(/^(\s*repo:\s*)\S+/m, `$1${repo}`).replace(/^(\s*branch:\s*)\S+/m, `$1${branch}`);
writeFileSync(f, s);
console.log(`CMS now edits ${repo} (${branch}). Commit and push public/admin/config.yml.`);
