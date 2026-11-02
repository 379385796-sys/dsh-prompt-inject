// The shell loads a single module-table client file, not ESM sibling imports.
// Embed the pure ESM resolver verbatim; check prevents Host/preview rule drift.
import fs from 'node:fs'
const client = new URL('../lib/client.js', import.meta.url)
const source = fs.readFileSync(new URL('../lib/selection.js', import.meta.url), 'utf8').replace(/\r\n/g, '\n')
const block = '    // BEGIN GENERATED SELECTION\n' + source.replace(/^export /gm, '').trimEnd().split('\n').map(line => line ? '    ' + line : '').join('\n') + '\n    // END GENERATED SELECTION'
const raw = fs.readFileSync(client, 'utf8')
const before = raw.replace(/\r\n/g, '\n')
const after = before.replace(/    \/\/ BEGIN GENERATED SELECTION[\s\S]*?    \/\/ END GENERATED SELECTION/, () => block)
if (!before.includes('// BEGIN GENERATED SELECTION')) throw new Error('Missing browser resolver marker')
if (process.argv.includes('--check')) {
  if (before !== after) throw new Error('Browser resolver is stale; run node scripts/sync-client-resolver.mjs')
} else if (before !== after) fs.writeFileSync(client, raw.includes('\r\n') ? after.replace(/\n/g, '\r\n') : after)
