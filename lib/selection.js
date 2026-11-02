// Shared by the Host and the generated browser resolver. No host/browser services.
// Keep drive/UNC/POSIX roots distinct from absent workspace paths.
export function normalizeWorkspacePath(p) {
  if (typeof p !== 'string' || !p) return ''
  if (/^[a-z]:[\\/]+$/i.test(p)) return p.slice(0, 2) + '\\'
  return p.replace(/[\\/]+$/, '') || '/'
}

// Pure, repeatable migration. Only a revision-fenced Settings save persists it.
// New entries take precedence over legacy fields; discovery never prunes keys.
export function effectivePresetSelections(config) {
  var version = config.presetSelectionVersion || 0
  if (version !== 0 && version !== 1) throw new Error('Unsupported preset selection version')
  var entries = Object.entries(config.presetSelections || {})
  if (version === 0 && config.excludeByPreset) {
    var owned = new Set(entries.map(function (entry) { return entry[0] }))
    ;(config.excludedPresetIds || ['roleplay', 'character-forge']).forEach(function (id) {
      if (!owned.has(id)) { entries.push([id, { mode: 'none' }]); owned.add(id) }
    })
  }
  return Object.fromEntries(entries)
}

export function resolveSelection(config, cwd, presetId) {
  var selections = effectivePresetSelections(config)
  var choice = presetId && Object.hasOwn(selections, presetId) ? selections[presetId] : { mode: 'default' }
  if (!choice || !['default', 'none', 'template'].includes(choice.mode)) return { mode: 'template', source: 'preset', selected: '', status: 'invalid', text: '' }
  if (choice.mode === 'none') return { mode: 'none', source: 'preset', selected: '', status: 'disabled', text: '' }
  var key = normalizeWorkspacePath(cwd)
  var overridden = !!key && Object.hasOwn(config.workspaceOverrides, key)
  var selected = choice.mode === 'template' ? choice.template : overridden ? config.workspaceOverrides[key] : config.activeTemplate
  if (choice.mode === 'template' && (typeof selected !== 'string' || !selected)) return { mode: 'template', source: 'preset', selected: '', status: 'invalid', text: '' }
  var mode = overridden ? (selected ? 'template' : 'none') : 'inherit'
  if (choice.mode === 'template') mode = 'template'
  if (!selected) return { mode: mode, selected: '', status: overridden ? 'disabled' : 'none', text: '' }
  var matches = config.templates.filter(function (t) { return t.name === selected })
  if (matches.length !== 1) return { mode: mode, selected: selected, status: matches.length ? 'ambiguous' : 'missing', text: '' }
  return { mode: mode, selected: selected, status: 'resolved', text: matches[0].text }
}
