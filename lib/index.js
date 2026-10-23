/** Host half for Harness 0.2.0-rc.2. Values live in the owning Profile config. */
import z from '@deepseek-ai/schemastery'

export const Config = z.object({
  templates: z.array(z.object({ name: z.string().pattern(/^(?!__inherit__$)\S(?:[\s\S]*\S)?$/).required(), text: z.string().required() })).volatile().default([]),
  activeTemplate: z.string().volatile().default(''),
  workspaceOverrides: z.dict(z.string()).volatile().default({}),
})
export const name = 'prompt-inject'
export const inject = ['systemPrompt', 'settings']

// Keep drive/UNC/POSIX roots distinct from absent workspace paths.
export function normalizeWorkspacePath(p) {
  if (typeof p !== 'string' || !p) return ''
  if (/^[a-z]:[\\/]+$/i.test(p)) return p.slice(0, 2) + '\\'
  return p.replace(/[\\/]+$/, '') || '/'
}

export function apply(ctx, config) {
  ctx.effect(() => ctx.settings.configure({ auto: false }, ctx.fiber))
  // Volatile fields are live references, not plain arrays/strings/objects.
  // Loader commits them atomically before Settings' write promise settles.
  ctx.systemPrompt.variable('dsh_prompt_inject_text', (context) => {
    const templates = config.templates.get()
    const active = config.activeTemplate.get()
    const overrides = config.workspaceOverrides.get()
    const key = normalizeWorkspacePath(context?.agent?.session?.header?.cwd)
    const selected = key && Object.hasOwn(overrides, key) ? overrides[key] : active
    if (!selected) return ''
    const matches = templates.filter(t => t.name === selected)
    return matches.length === 1 ? matches[0].text : ''
  })
  ctx.systemPrompt.section({ name: 'user:prompt-inject', order: 50, text: '{{dsh_prompt_inject_text}}' })
}

