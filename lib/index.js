/** Host half for Harness 0.2.0-rc.2. Values live in the owning Profile config. */
import z from '@deepseek-ai/schemastery'
import { resolveSelection, effectivePresetSelections } from './selection.js'
export { normalizeWorkspacePath } from './selection.js'

export const Config = z.object({
  templates: z.array(z.object({ name: z.string().pattern(/^(?!__inherit__$)\S(?:[\s\S]*\S)?$/).required(), text: z.string().required() })).volatile().default([]),
  activeTemplate: z.string().volatile().default(''),
  workspaceOverrides: z.dict(z.string()).volatile().default({}),
  excludeByPreset: z.boolean().volatile().default(false),
  excludedPresetIds: z.array(z.string().pattern(/^\S+$/)).volatile().default(['roleplay', 'character-forge']),
  presetSelectionVersion: z.number().volatile().default(0),
  presetSelections: z.dict(z.object({
    mode: z.string().pattern(/^(default|none|template)$/).required(),
    template: z.string(),
  })).volatile().default({}),
})
export const name = 'prompt-inject'
export const inject = ['systemPrompt', 'settings']

export function apply(ctx, config) {
  ctx.effect(() => ctx.settings.configure({ auto: false }, ctx.fiber))
  // Volatile fields are live references, not plain arrays/strings/objects.
  // Loader commits them atomically before Settings' write promise settles.
  ctx.systemPrompt.variable('dsh_prompt_inject_text', (context) => {
    const values = {
      templates: config.templates.get(),
      activeTemplate: config.activeTemplate.get(),
      workspaceOverrides: config.workspaceOverrides.get(),
      excludeByPreset: config.excludeByPreset?.get() ?? false,
      excludedPresetIds: config.excludedPresetIds?.get(),
      presetSelectionVersion: config.presetSelectionVersion?.get() ?? 0,
      presetSelections: config.presetSelections?.get() ?? {},
    }
    const selections = effectivePresetSelections(values)
    let preset
    if (Object.values(selections).some(choice => !choice || choice.mode !== 'default')) {
      // The public projection follows selection events, unlike the frozen header.
      const session = context?.agent?.session
      const projections = ctx.get('sessionProjections')
      preset = session && projections?.stateOf(session, 'agentPreset')
      if (typeof preset !== 'string' || !preset) {
        throw new Error('Prompt Inject: current Agent Preset unavailable; cannot safely resolve preset template selections.')
      }
    }
    return resolveSelection(values, context?.agent?.session?.header?.cwd, preset).text
  })
  ctx.systemPrompt.section({ name: 'user:prompt-inject', order: 50, text: '{{dsh_prompt_inject_text}}' })
}

