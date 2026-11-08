/* dsh-prompt-inject — browser half.
 *
 * Bundled in the shell module-table format: window.__ModuleLoader__.load()
 * with a factory receiving the module `require`. The kernel adopts the
 * exported `apply`/`inject` as a Cordis client plugin.
 *
 * Maintenance adaptation: a direct settings.section page with template
 * management, scope controls and a configuration-based expected preview.
 * Original author H1a3x; MIT and maintenance provenance retained in the repo.
 */
window.__ModuleLoader__.load({
  id: 'dsh-prompt-inject',
  factory: (require) => {
    var module = { exports: {} }
    var exports = module.exports
    var React = require('react')
    var h = React.createElement

    var NS = 'dsh-prompt-inject'
    var ENTRY = 'prompt-inject'
    var INHERIT = '__inherit__'

    var zh = {
      title: '系统提示词注入',
      description: '管理助手模板，并设置何时注入。',
      overview: '当前配置概览',
      management: '模板管理',
      scope: "默认模板",
      presetSection: "Agent 模式与提示词",
      builtInGroup: '内置预设',
      customGroup: '扩展预设',
      unavailableGroup: '已保存的其他选择',
      previewDetails: '预览与诊断',
      scopeIntro: '工作区设置优先于全局默认。',
      privacyShort: '模板会发送给模型，请勿存放凭据；切换设置不撤回历史或在途请求。',
      presetIntro: '勾选的预设不注入模板，优先于全局和工作区设置。默认关闭。',
      presetExclusion: '按 Agent Preset 自动不注入',
      presetIds: '选择排除的预设',
      savePresetIds: '保存预设选择',
      presetCount: '宿主当前预设数量：',
      presetLoading: '正在读取宿主预设…',
      presetUnavailable: '无法读取宿主预设，请点击刷新重试；已保存的选择不会被清除。',
      presetMissing: '当前不可用，已保留配置',
      presetHint: "指定模板或“不注入”优先于工作区和默认模板。“默认”继承工作区 → 默认模板。无法读取当前模式时，有显式映射则停止组装；无显式映射时保留默认逻辑。",
      globalLabel: "默认模板",
      expected: '预计注入预览',
      previewTarget: '预览对象',
      previewPreset: '预览 Agent Preset',
      previewDefault: '仅预览默认继承链',
      previewPresetUnavailable: '预览预设不可用，请刷新或重新选择。',
      previewOnly: '预览选择只用于本页，不保存配置，也不向模型发送请求。',
      sourceLabel: '命中来源',
      sourcePreset: 'Agent Preset 显式选择',
      sourceWorkspace: '工作区覆盖',
      sourceGlobal: '全局默认',
      globalTarget: '全局默认（不指定工作区）',
      targetHint: '从列表选择工作区；此处不会自动识别当前聊天的工作区。',
      modeLabel: '工作区覆盖模式',
      modeTemplate: '指定模板（替换全局）',
      resolvedLabel: '预计解析结果',
      statusResolved: '已解析（预计）',
      statusNone: '未选择模板',
      statusDisabled: '此工作区不注入',
      statusDisabledPreset: '此 Agent Preset 不注入',
      statusMissing: '模板不存在',
      statusAmbiguous: '模板名称重复，停止注入',
      emptyText: '模板正文为空，不追加文本。',
      unavailableTarget: '预览工作区已不在列表中，请重新选择。',
      unavailable: '配置暂不可用，可刷新重试；编辑草稿会保留。',
      expectedHint: "根据所选工作区与 Agent Preset 预计注入，不代表当前聊天或最终请求；完整 Persona 仍可阻止注入。",
      globalNone: '不注入',
      globalHint: "未指定模板的模式继承默认；工作区可在高级设置中覆盖。",
      workspaceSection: '按工作区覆盖',
      workspaceInherit: '跟随全局',
      workspaceNone: '不注入',
      workspaceHint: '可跟随全局、指定模板或不注入。',
      addTemplate: '添加模板',
      edit: '编辑',
      delete: '删除',
      preview: '预览',
      close: '关闭',
      cancel: '取消',
      save: '保存',
      saving: '保存中…',
      refresh: '刷新',
      nameLabel: '模板名称',
      textLabel: '提示词正文',
      namePlaceholder: '例如：通用助手',
      textPlaceholder: '粘贴要注入系统提示词的文本…',
      empty: '暂无模板，点击下方「添加模板」创建第一套。',
      nameRequired: '名称不能为空',
      noWorkspaces: '暂无工作区',
      effectiveHint: '修改在下一个模型请求组装时生效；已接受的在途请求、既有历史与压缩前缀不会被撤回。',
      personaHint: 'Complete Persona（完整人格）会使宿主仅保留人格段，本模板不进入最终系统提示；本页不验证实际请求，也不绕过宿主规则。',
      privacyHint: '模板以明文保存在 Profile 配置里，并随系统提示进入模型请求与会话历史，fork 与备份也可能包含。请勿在此存放凭据。',
      modeIntro: "每行选择后自动保存。“默认”先使用工作区设置，再使用默认模板。",
      inheritDefault: "跟随默认",
      statusInvalid: "配置无效，停止注入",
      autoSave: "模板分配自动保存；预览选择仅用于本页。",
      saved: "已保存",
      retainedMappings: "暂不可用但已保留的模式配置：",
    }

    var en = {
      title: 'System Prompt Injection',
      description: 'Manage assistant templates and choose when to inject them.',
      overview: 'Current configuration',
      management: 'Templates',
      scope: "Default template",
      presetSection: "Agent modes and prompts",
      builtInGroup: 'Built-in presets',
      customGroup: 'Extension presets',
      unavailableGroup: 'Other saved selections',
      previewDetails: 'Preview and diagnostics',
      scopeIntro: 'Workspace settings override the global default.',
      privacyShort: 'Templates are sent to the model. Do not store credentials; changes do not retract history or in-flight requests.',
      presetIntro: 'Checked presets skip injection before global and workspace settings. Off by default.',
      presetExclusion: 'Skip injection by Agent Preset',
      presetIds: 'Select presets to exclude',
      savePresetIds: 'Save preset selection',
      presetCount: 'Current host presets: ',
      presetLoading: 'Loading host presets…',
      presetUnavailable: 'Host presets unavailable. Refresh to retry; saved selections are retained.',
      presetMissing: 'Unavailable; saved selection retained',
      presetHint: "An explicit template or No injection overrides workspace/default selection. Default inherits workspace → default template. If current identity is unavailable and overrides exist, assembly stops; all-default configurations retain prior behavior.",
      globalLabel: "Default template",
      expected: 'Expected injection preview',
      previewTarget: 'Preview target',
      previewPreset: 'Preview Agent Preset',
      previewDefault: 'Preview inherited defaults only',
      previewPresetUnavailable: 'The preview preset is unavailable. Refresh or select another target.',
      previewOnly: 'Preview choices are local to this page. They do not save configuration or send model requests.',
      sourceLabel: 'Selection source',
      sourcePreset: 'Explicit Agent Preset choice',
      sourceWorkspace: 'Workspace override',
      sourceGlobal: 'Global default',
      globalTarget: 'Global default (no workspace)',
      targetHint: 'Select a workspace from the list; this page does not detect the current chat workspace.',
      modeLabel: 'Workspace override mode',
      modeTemplate: 'Specific template (replaces global)',
      resolvedLabel: 'Expected selection',
      statusResolved: 'Resolved (expected)',
      statusNone: 'No template selected',
      statusDisabled: 'Injection disabled for this workspace',
      statusDisabledPreset: 'Injection disabled by this Agent Preset',
      statusMissing: 'Template not found',
      statusAmbiguous: 'Duplicate template name; injection stopped',
      emptyText: 'The template text is empty; no text is appended.',
      unavailableTarget: 'The preview workspace is no longer listed. Select another target.',
      unavailable: 'Settings unavailable. Refresh to retry; your draft is retained.',
      expectedHint: "Expected injection for the selected workspace and Agent Preset, not the current chat or final request. Complete Persona may still suppress it.",
      globalNone: 'No injection',
      globalHint: "Unassigned modes inherit this default; advanced workspace settings may override it.",
      workspaceSection: 'Per-workspace overrides',
      workspaceInherit: 'Inherit global',
      workspaceNone: 'No injection',
      workspaceHint: 'Inherit the global choice, use a template, or skip injection.',
      addTemplate: 'Add template',
      edit: 'Edit',
      delete: 'Delete',
      preview: 'Preview',
      close: 'Close',
      cancel: 'Cancel',
      save: 'Save',
      saving: 'Saving…',
      refresh: 'Refresh',
      nameLabel: 'Template name',
      textLabel: 'Prompt text',
      namePlaceholder: 'e.g. General assistant',
      textPlaceholder: 'Paste the text to inject…',
      empty: 'No templates yet. Click "Add template" below.',
      nameRequired: 'Name cannot be empty',
      noWorkspaces: 'No workspaces',
      effectiveHint: 'Changes apply when the next model request is assembled. Already-accepted requests, existing history and compaction prefixes are not retracted.',
      personaHint: 'With Complete Persona, the host keeps only the persona section and excludes this template. This page does not verify requests or bypass host rules.',
      privacyHint: 'Templates are stored as plaintext in the Profile config and travel with the system prompt into model requests and session history; forks and backups may also contain them. Do not store credentials here.',
      modeIntro: "Each selection saves automatically. Default inherits workspace settings, then the default template.",
      inheritDefault: "Follow default",
      statusInvalid: "Invalid configuration; no injection",
      autoSave: "Template assignments save automatically; preview choices stay on this page.",
      saved: "Saved",
      retainedMappings: "Unavailable modes with retained settings: ",
    }

    var builtInNameKeys = { standard: 'presetStandardName', ptc: 'presetPtcName', minimal: 'presetMinimalName', cordis: 'presetCordisName' }
    function presetDisplay(row, presetT) {
      var builtIn = row.name === undefined && Object.hasOwn(builtInNameKeys, row.id)
      var name = row.name || row.id
      if (builtIn && presetT) {
        var translated = presetT(builtInNameKeys[row.id])
        if (translated && translated !== builtInNameKeys[row.id]) name = translated
      }
      return { name: name, builtIn: builtIn }
    }

    var fallbackT = function (key) { return zh[key] !== undefined ? zh[key] : key }

    var css = [
      // Keep the existing controls and native design tokens, without card chrome.
      '.pt-page{width:100%;max-width:760px;box-sizing:border-box;color:var(--dsw-alias-label-primary);display:flex;flex-direction:column;gap:12px;min-width:0}',
      '.pt-title{margin:0;font-size:18px;font-weight:600;line-height:1.4}',
      '.pt-section{display:flex;flex-direction:column;gap:12px;min-width:0;margin-top:4px;padding-top:16px;border-top:1px solid var(--dsw-alias-border-l2)}',
      '.pt-sectionTitle{margin:0;font-size:15px;font-weight:600}',
      '.pt-desc{color:var(--dsw-alias-label-tertiary);font-size:13px;line-height:1.5}',
      '.pt-sectionIntro{margin:0;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:1.5}',
      '.pt-page{container-type:inline-size}',
      '.pt-modeTable{display:flex;flex-direction:column;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;overflow:hidden}',
      '.pt-modeRow{display:grid;grid-template-columns:minmax(0,1fr) minmax(170px,42%);align-items:center;gap:12px;padding:6px 12px}',
      '.pt-modeRow+.pt-modeRow{border-top:1px solid var(--dsw-alias-border-l2)}',
      '.pt-modeChoice{display:flex;flex-direction:column;gap:4px;min-width:0}',
      '.pt-modeChoice>.pt-select{width:100%}',
      '.pt-modeWarning{color:var(--dsw-alias-state-error-primary);font-size:12px}',
      '@container (max-width:420px){.pt-modeRow{grid-template-columns:minmax(0,1fr);gap:8px}}',
      '.pt-presetGroup{border:0;padding:0;margin:0;min-width:0;display:flex;flex-direction:column;gap:8px}',
      '.pt-presetGroup>legend{padding:0;margin-bottom:8px;font-size:12px;font-weight:500;color:var(--dsw-alias-label-secondary)}',
      '.pt-presetGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}',
      '.pt-presetCard{display:flex;align-items:center;gap:10px;padding:10px 12px;min-width:0;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;cursor:pointer;background:var(--dsw-alias-bg-layer-3)}',
      '.pt-presetCard:has(input:checked){border-color:var(--dsw-alias-brand-primary)}',
      '.pt-presetCard:has(input:focus-visible){outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}',
      '.pt-presetCard input,.pt-toggle input{accent-color:var(--dsw-alias-brand-primary);flex:none;margin:0}',
      '.pt-presetCopy{display:flex;flex-direction:column;gap:2px;min-width:0}',
      '.pt-presetName{font-size:13px;font-weight:500;line-height:1.45;overflow-wrap:anywhere}',
      '.pt-presetId{font-size:11px;line-height:1.4;color:var(--dsw-alias-label-tertiary);overflow-wrap:anywhere}',
      '.pt-toggle{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:500;line-height:1.5}',
      '.pt-details{border-top:1px solid var(--dsw-alias-border-l2);margin-top:4px;padding-top:16px}',
      '.pt-details>summary{cursor:pointer;color:var(--dsw-alias-label-secondary);font-size:13px;font-weight:500}',
      '.pt-detailsBody{display:flex;flex-direction:column;gap:12px;margin-top:12px;min-width:0}',
      '@container (max-width:420px){.pt-presetGrid{grid-template-columns:minmax(0,1fr)}}',
      // inner: fields + inputs
      '.pt-field{flex-direction:column;gap:6px;display:flex}',
      '.pt-form{display:flex;flex-direction:column;gap:12px}',
      '.pt-label{margin:0;min-width:0;color:var(--dsw-alias-label-primary);flex:1;font-size:13px;font-weight:500;line-height:1.5}',
      '.pt-targetField{display:flex;flex-direction:column;gap:6px;flex:none;margin-top:6px}',
      '.pt-targetField>.pt-select{width:100%}',
      '.pt-hint{color:var(--dsw-alias-label-tertiary);margin:0;font-size:12px;line-height:1.5}',
      '.pt-input,.pt-select{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);height:34px;font:inherit;color:var(--dsw-alias-label-primary);border-radius:8px;padding:0 12px;font-size:13px;line-height:1.5;box-sizing:border-box}',
      '.pt-input{width:100%}',
      '.pt-select{min-width:0;max-width:100%;padding-right:28px;cursor:pointer}',
      '.pt-input:focus-visible,.pt-select:focus-visible{border-color:var(--dsw-alias-brand-primary);outline:none}',
      '.pt-input:disabled,.pt-select:disabled{color:var(--dsw-alias-label-tertiary);cursor:default}',
      '.pt-textarea{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);font:inherit;color:var(--dsw-alias-label-primary);border-radius:8px;padding:8px 12px;font-size:13px;line-height:1.5;min-height:120px;resize:vertical;box-sizing:border-box;width:100%;white-space:pre-wrap}',
      '.pt-textarea:focus-visible{border-color:var(--dsw-alias-brand-primary);outline:none}',
      // list + workspace rows
      '.pt-list{display:flex;flex-direction:column;gap:6px}',
      '.pt-item{display:flex;align-items:center;flex-wrap:wrap;gap:8px;padding:8px 12px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-3)}',
      '.pt-itemName{font-weight:500;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-primary);font-size:13px}',
      '.pt-wsTitle{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-primary);font-size:13px;font-weight:500}',
      '.pt-wsPath{color:var(--dsw-alias-label-tertiary);font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      // preview area
      '.pt-preview{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);border-radius:8px;padding:8px 12px;max-height:220px;overflow:auto}',
      '.pt-previewHead{display:flex;align-items:center;gap:8px;margin-bottom:6px}',
      '.pt-previewTitle{font-weight:600;color:var(--dsw-alias-label-primary);font-size:13px;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.pt-previewBody{white-space:pre-wrap;overflow-wrap:anywhere;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:1.5}',
      // buttons
      '.pt-actions{display:flex;justify-content:flex-end;align-items:center;gap:8px}',
      '.pt-actions.left{justify-content:flex-start}',
      '.pt-btn,.pt-btnPrimary{appearance:none;font:inherit;cursor:pointer;border:1px solid #0000;border-radius:8px;padding:5px 14px;font-size:13px;line-height:1.5}',
      '.pt-btn{border-color:var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);background:0 0}',
      '.pt-btn:hover{color:var(--dsw-alias-label-primary)}',
      '.pt-btnPrimary{background:var(--dsw-alias-label-primary);color:var(--dsw-alias-bg-layer-3)}',
      '.pt-btnSm{appearance:none;font:inherit;cursor:pointer;border:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);background:0 0;border-radius:6px;padding:2px 8px;font-size:12px;line-height:1.5;flex:none}',
      '.pt-btnSm:hover{color:var(--dsw-alias-label-primary)}',
      '.pt-btnSm.danger:hover{color:var(--dsw-alias-state-error-primary);border-color:var(--dsw-alias-state-error-primary)}',
      '.pt-btnSm.primary{color:var(--dsw-alias-brand-primary);border-color:var(--dsw-alias-brand-primary)}',
      '.pt-btn:disabled,.pt-btnPrimary:disabled,.pt-btnSm:disabled{opacity:.5;cursor:not-allowed}',
      // misc
      '.pt-error{color:var(--dsw-alias-state-error-primary);margin:0;font-size:12px;line-height:1.5}',
      '.pt-empty{color:var(--dsw-alias-label-tertiary);margin:0;font-size:12px;line-height:1.5;text-align:center;padding:8px 0}',
      '.pt-divider{border-top:1px solid var(--dsw-alias-border-l2);margin:4px 0}',
      '.pt-page button,.pt-page input,.pt-page select,.pt-page textarea{transition:background-color 120ms ease,border-color 120ms ease,color 120ms ease,box-shadow 120ms ease}',
      '.pt-page :is(input,select,textarea,button,summary):focus-visible{outline:2px solid var(--dsw-focus-ring-color,var(--dsw-alias-brand-primary));outline-offset:3px}',
      '.pt-page button:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}',
      '.pt-page button:active:not(:disabled){background:var(--dsw-alias-interactive-bg-active)}',
      '.pt-page .pt-btnPrimary{background:var(--dsw-alias-button-primary-fill,var(--dsw-alias-label-primary));color:var(--dsw-alias-label-primary-foreground,var(--dsw-alias-bg-layer-3))}',
      '.pt-page .pt-btnPrimary:hover:not(:disabled){background:var(--dsw-alias-button-primary-hover,var(--dsw-alias-label-primary))}',
      '.pt-modeRow:focus-within{background:var(--dsw-alias-interactive-bg-hover)}',
      '.pt-modeTable[aria-busy=true]{opacity:.75}',
      '.pt-saveStatus{min-height:22px;margin:0;font-size:12px;line-height:1.6;color:var(--dsw-alias-label-tertiary)}',
      '.pt-saveStatus.is-saved{color:var(--dsw-alias-state-success-primary,var(--dsw-alias-label-secondary))}',
      '.pt-previewSource{font-size:12px;line-height:1.6;color:var(--dsw-alias-label-secondary);overflow-wrap:anywhere}',
      '.pt-preview,.pt-form{animation:pt-feedback-in 160ms ease-out}',
      '@keyframes pt-feedback-in{from{opacity:0}to{opacity:1}}',
      '@media(prefers-reduced-motion:reduce){.pt-page button,.pt-page input,.pt-page select,.pt-page textarea,.pt-preview,.pt-form{animation:none;transition:none}}',
    ].join('\n')

    // INJ-05: the stylesheet is installed from apply() under the plugin's own
    // lifecycle effect, never from module evaluation, so unloading removes
    // exactly what this instance added. The mount count lives on the node, so a
    // hot reload that mounts the next instance before disposing the previous
    // one keeps a single node and never drops the styles of a live panel.
    var CSS_TAG_ID = 'dsh-prompt-inject/panel.css'

    function installPanelStyles() {
      if (typeof document === 'undefined' || typeof document.head === 'undefined') return function () {}
      var node = document.querySelector('style[data-plugin-css=' + JSON.stringify(CSS_TAG_ID) + ']')
      if (node === null) {
        node = document.createElement('style')
        node.dataset.pluginCss = CSS_TAG_ID
        node.textContent = css
        document.head.appendChild(node)
      }
      node.dataset.ptMounts = String((parseInt(node.dataset.ptMounts, 10) || 0) + 1)
      return function () {
        var remaining = (parseInt(node.dataset.ptMounts, 10) || 0) - 1
        if (remaining > 0) { node.dataset.ptMounts = String(remaining); return }
        if (node.parentNode) node.parentNode.removeChild(node)
      }
    }

    // The editor always fences writes with the revision of its source snapshot.
    // Conflicts refresh the official mirror and leave the user's draft open.
    // BEGIN GENERATED SELECTION
    // Shared by the Host and the generated browser resolver. No host/browser services.
    // Keep drive/UNC/POSIX roots distinct from absent workspace paths.
    function normalizeWorkspacePath(p) {
      if (typeof p !== 'string' || !p) return ''
      if (/^[a-z]:[\\/]+$/i.test(p)) return p.slice(0, 2) + '\\'
      return p.replace(/[\\/]+$/, '') || '/'
    }

    // Pure, repeatable migration. Only a revision-fenced Settings save persists it.
    // New entries take precedence over legacy fields; discovery never prunes keys.
    function effectivePresetSelections(config) {
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

    function resolveSelection(config, cwd, presetId) {
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
    // END GENERATED SELECTION
    function createEditor(controller) {
      return async function (action, body, expectedRevision) {
        var snapshot = controller.getSnapshot()
        if (snapshot.status !== 'ready' || !snapshot.writable || !Number.isInteger(expectedRevision)) throw new Error('Settings unavailable; refresh and retry.')
        var migration = effectivePresetSelections(snapshot.value)
        var migrationOps = snapshot.value.presetSelectionVersion === 1 ? [] : [
          { op: 'set', path: ['presetSelections'], value: migration },
          { op: 'set', path: ['presetSelectionVersion'], value: 1 },
        ]
        if (action === 'preset') {
          if (typeof body.id !== 'string' || !body.id || !['default', 'none', 'template'].includes(body.mode)) throw new Error('Invalid preset selection')
          if (body.mode === 'template' && snapshot.value.templates.filter(function (t) { return t.name === body.template }).length !== 1) throw new Error('Template is missing or ambiguous')
          var choice = body.mode === 'template' ? { mode: 'template', template: body.template } : { mode: body.mode }
          Object.defineProperty(migration, body.id, { value: choice, enumerable: true, configurable: true, writable: true })
          var accepted = await controller.mutate([
            { op: 'set', path: ['presetSelections'], value: migration },
            { op: 'set', path: ['presetSelectionVersion'], value: 1 },
          ], expectedRevision)
          if (!accepted) throw new Error('Save rejected or configuration changed. Refresh, review your draft and retry.')
          return true
        }
        var cfg = snapshot.value
        var templates = cfg.templates.slice()
        var overrides = Object.assign({}, cfg.workspaceOverrides)
        var active = cfg.activeTemplate
        var name = body.name
        var exists = function (n) { return templates.some(function (t) { return t.name === n }) }
        if (action === 'add' || action === 'edit') {
          name = typeof name === 'string' ? name.trim() : ''
          if (!name || name === INHERIT) throw new Error('Invalid or reserved template name')
          if (typeof body.text !== 'string') throw new Error('Prompt text must be a string')
          if (action === 'add') {
            if (exists(name)) throw new Error('Duplicate template name')
            templates.push({ name: name, text: body.text })
          } else {
            if (!exists(name)) throw new Error('Template no longer exists')
            templates = templates.map(function (t) { return t.name === name ? { name: name, text: body.text } : t })
          }
        } else if (action === 'delete') {
          templates = templates.filter(function (t) { return t.name !== name })
          if (active === name) active = ''
          // A deleted explicit selection becomes disabled, avoiding accidental global injection.
          Object.keys(overrides).forEach(function (k) { if (overrides[k] === name) overrides[k] = '' })
        } else if (action === 'active') {
          if (name !== '' && !exists(name)) throw new Error('Unknown template')
          active = name
        } else if (action === 'workspace') {
          if (!body.path) throw new Error('Workspace path required')
          var key = normalizeWorkspacePath(body.path)
          if (name === INHERIT) delete overrides[key]
          else {
            if (name !== '' && !exists(name)) throw new Error('Unknown template')
            Object.defineProperty(overrides, key, { value: name, enumerable: true, configurable: true, writable: true })
          }
        } else throw new Error('Unknown operation')
        var accepted = await controller.mutate(migrationOps.concat([
          { op: 'set', path: ['templates'], value: templates },
          { op: 'set', path: ['activeTemplate'], value: active },
          { op: 'set', path: ['workspaceOverrides'], value: overrides },
        ]), expectedRevision)
        if (!accepted) throw new Error('Save rejected or configuration changed. Refresh, review your draft and retry.')
        return true
      }
    }

    // Shared option list for a selector: [inherit?] none + every template.
    function selectorOptions(t, templates, withInherit, selected) {
      var options = []
      if (withInherit) options.push(h('option', { key: 'inherit', value: INHERIT }, t('workspaceInherit')))
      options.push(h('option', { key: 'none', value: '' }, t('workspaceNone')))
      if (selected && selected !== INHERIT && !templates.some(function (tmpl) { return tmpl.name === selected })) {
        options.push(h('option', { key: 'missing', value: selected, disabled: true }, selected + ' · ' + t('statusMissing')))
      }
      for (var i = 0; i < templates.length; i++) {
        options.push(h('option', { key: templates[i].name, value: templates[i].name }, templates[i].name))
      }
      return options
    }

    function workspaceSelectValue(overrides, path) {
      if (overrides && Object.prototype.hasOwnProperty.call(overrides, path)) {
        return overrides[path] // '' = none, name = template
      }
      return INHERIT
    }

    function PromptTemplatesPage(props) {
      var t = (props && typeof props.t === 'function') ? props.t : fallbackT
      var useWorkspaces = props && props.useWorkspaces

      var controller = props.controller
      var snapshot = React.useSyncExternalStore(
        React.useCallback(function (listener) { return controller.subscribe(listener) }, [controller]),
        React.useCallback(function () { return controller.getSnapshot() }, [controller]),
      )
      var data = snapshot.status === 'ready' ? snapshot.value : null
      var ready = !!data && snapshot.writable
      var writeLock = React.useRef(false)
      var editor = React.useMemo(function () { return createEditor(controller) }, [controller])
      var errorState = React.useState('')
      var error = errorState[0]
      var setError = errorState[1]
      var editingState = React.useState(null)
      var editing = editingState[0]
      var setEditing = editingState[1]
      var busyState = React.useState(false)
      var busy = busyState[0]
      var setBusy = busyState[1]
      var previewState = React.useState(null)
      var previewName = previewState[0]
      var setPreviewName = previewState[1]
      var rosterState = React.useState({ status: 'loading', rows: [] })
      var roster = rosterState[0]
      var setRoster = rosterState[1]
      var rosterRequest = React.useRef(0)
      var reloadPresets = React.useCallback(async function () {
        var request = ++rosterRequest.current
        var connection = props.getConnectionVersion()
        setRoster(function (previous) { return { status: 'loading', rows: previous.rows } })
        try {
          var rows = await props.loadPresets()
          if (request === rosterRequest.current && connection === props.getConnectionVersion()) setRoster({ status: 'ready', rows: rows })
        } catch (_) {
          if (request === rosterRequest.current && connection === props.getConnectionVersion()) setRoster(function (previous) { return { status: 'error', rows: previous.rows } })
        }
      }, [props.loadPresets, props.getConnectionVersion])
      React.useEffect(function () {
        reloadPresets()
        return function () { rosterRequest.current++ }
      }, [reloadPresets, props.getConnectionVersion()])
      React.useEffect(function () { return props.subscribePresets ? props.subscribePresets(reloadPresets) : undefined }, [props.subscribePresets, reloadPresets])
      var targetState = React.useState('')
      var targetId = targetState[0]
      var setTargetId = targetState[1]
      var previewPresetState = React.useState('')
      var previewPresetId = previewPresetState[0]
      var setPreviewPresetId = previewPresetState[1]

      var load = function () {
        var connectionAtLoad = props.getConnectionVersion()
        reloadPresets()
        return props.reload().then(function () {
          if (connectionAtLoad !== props.getConnectionVersion()) throw new Error(t('unavailable'))
          var refreshed = controller.getSnapshot()
          if (refreshed.status !== 'ready' || !refreshed.writable) throw new Error(t('unavailable'))
          setEditing(function (draft) { return draft ? Object.assign({}, draft, { revision: refreshed.revision, connectionVersion: props.getConnectionVersion() }) : draft })
          setError('')
        }).catch(function (e) { setError(String(e.message || e)) })
      }
      var savedState = React.useState(false)
      var saved = savedState[0]
      var setSaved = savedState[1]
      var run = function (action, body, revision) {
        if (writeLock.current || !ready) return Promise.resolve(false)
        writeLock.current = true
        setBusy(true)
        setSaved(false)
        setError('')
        return editor(action, body, revision === undefined ? snapshot.revision : revision)
          .then(function (ok) { if (ok) setSaved(true); return ok })
          .catch(function (e) { setError(String(e.message || e)); return false })
          .finally(function () { writeLock.current = false; setBusy(false) })
      }
      var startAdd = function () { setEditing({ name: '', text: '', isNew: true, revision: snapshot.revision, connectionVersion: props.getConnectionVersion() }) }
      var startEdit = function (tmpl) { setEditing({ name: tmpl.name, text: tmpl.text, isNew: false, revision: snapshot.revision, connectionVersion: props.getConnectionVersion() }) }
      var cancelEdit = function () { setEditing(null) }
      var saveDraft = function () {
        if (!editing) return
        if (editing.connectionVersion !== props.getConnectionVersion()) { setError('Host reconnected. Refresh and review the draft before saving.'); return }
        var name = (editing.name || '').trim()
        if (!name) { setError(t('nameRequired')); return }
        return run(editing.isNew ? 'add' : 'edit', { name: name, text: editing.text }, editing.revision)
          .then(function (ok) { if (ok) setEditing(null) })
      }
      var removeTemplate = function (name) {
        return run('delete', { name: name }).then(function (ok) { if (ok && previewName === name) setPreviewName(null) })
      }
      var setGlobalActive = function (name) { return run('active', { name: name }) }
      var setWorkspaceOverride = function (path, value) { return run('workspace', { path: path, name: value }) }

      var templates = (data && data.templates) || []
      var activeName = data ? data.activeTemplate : ''
      var overrides = (data && data.workspaceOverrides) || {}
      var workspaces = useWorkspaces ? useWorkspaces(function (s) { return (s && s.items) || [] }) : []
      var target = workspaces.find(function (ws) { return ws.workspaceId === targetId })
      var targetValid = targetId === '' || !!target
      var presetTargetValid = previewPresetId === '' || (roster.status === 'ready' && roster.rows.some(function (row) { return row.id === previewPresetId }))
      var inheritedResult = data && targetValid ? resolveSelection(data, target ? target.path : '') : null
      var expected = data && targetValid && presetTargetValid ? resolveSelection(data, target ? target.path : '', previewPresetId || undefined) : null
      var globalResult = data ? resolveSelection(data, '') : null
      var selections = data ? effectivePresetSelections(data) : {}
      var previewChoice = previewPresetId && Object.hasOwn(selections, previewPresetId) ? selections[previewPresetId] : { mode: 'default' }
      var previewSource = previewPresetId && (!previewChoice || previewChoice.mode !== 'default') ? 'sourcePreset' : target && Object.hasOwn(overrides, normalizeWorkspacePath(target.path)) ? 'sourceWorkspace' : 'sourceGlobal'
      var statusText = function (result) {
        return t({ resolved: 'statusResolved', none: 'statusNone', disabled: result.source === 'preset' ? 'statusDisabledPreset' : 'statusDisabled', missing: 'statusMissing', ambiguous: 'statusAmbiguous', invalid: 'statusInvalid' }[result.status])
      }
      var resultText = function (result) {
        return (result.selected ? result.selected + ' · ' : '') + statusText(result)
      }
      var modeText = inheritedResult ? t({ inherit: 'workspaceInherit', none: 'workspaceNone', template: 'modeTemplate' }[inheritedResult.mode]) : ''

      // template rows (preview / edit / delete)
      var rows = templates.map(function (tmpl) {
        var isPreviewing = tmpl.name === previewName
        return h('div', { key: tmpl.name, className: 'pt-item' },
          h('span', { className: 'pt-itemName' }, tmpl.name),
          h('button', { className: 'pt-btnSm' + (isPreviewing ? ' primary' : ''), disabled: busy || !ready, onClick: function () { setPreviewName(isPreviewing ? null : tmpl.name) } }, t('preview')),
          h('button', { className: 'pt-btnSm', disabled: busy || !ready, onClick: function () { startEdit(tmpl) } }, t('edit')),
          h('button', { className: 'pt-btnSm danger', disabled: busy || !ready, onClick: function () { removeTemplate(tmpl.name) } }, t('delete')),
        )
      })

      var form = null
      if (editing) {
        form = h('div', { className: 'pt-form' },
          h('div', { className: 'pt-field' },
            h('label', { className: 'pt-label' }, t('nameLabel')),
            h('input', {
              className: 'pt-input',
              'aria-label': t('nameLabel'),
              value: editing.name,
              disabled: !editing.isNew || busy || !ready,
              placeholder: t('namePlaceholder'),
              onChange: function (e) { setEditing({ name: e.target.value, text: editing.text, isNew: editing.isNew, revision: editing.revision, connectionVersion: editing.connectionVersion }) },
            }),
          ),
          h('div', { className: 'pt-field' },
            h('label', { className: 'pt-label' }, t('textLabel')),
            h('textarea', {
              className: 'pt-textarea',
              'aria-label': t('textLabel'),
              value: editing.text,
              disabled: busy || !ready,
              placeholder: t('textPlaceholder'),
              onChange: function (e) { setEditing({ name: editing.name, text: e.target.value, isNew: editing.isNew, revision: editing.revision, connectionVersion: editing.connectionVersion }) },
            }),
          ),
          h('div', { className: 'pt-actions' },
            h('button', { className: 'pt-btn', onClick: cancelEdit, disabled: busy || !ready }, t('cancel')),
            h('button', { className: 'pt-btnPrimary', onClick: saveDraft, disabled: busy || !ready }, busy ? t('saving') : t('save')),
          ),
        )
      }

      // global selector
      var globalSelect = h('div', { className: 'pt-field' },
        h('select', {
          className: 'pt-select',
          value: activeName,
          disabled: busy || !ready,
          onChange: function (e) { setGlobalActive(e.target.value) },
          'aria-label': t('globalLabel'),
        }, selectorOptions(t, templates, false, activeName)),
        h('p', { className: 'pt-hint' }, t('globalHint')),
      )

      var inheritedLabel = t('inheritDefault') + ' · ' + (!targetValid ? t('unavailableTarget') : inheritedResult && inheritedResult.selected ? inheritedResult.selected + (inheritedResult.status === 'resolved' ? '' : ' · ' + statusText(inheritedResult)) : t('globalNone'))
      var presetSection = h(React.Fragment, null,
        h('p', { className: 'pt-sectionIntro' }, t('modeIntro')),
        h('p', { className: 'pt-hint', role: 'status' }, roster.status === 'ready' ? t('presetCount') + roster.rows.length : t(roster.status === 'loading' ? 'presetLoading' : 'presetUnavailable')),
        h('div', { className: 'pt-modeTable', 'aria-busy': roster.status === 'loading' }, roster.rows.map(function (row) {
          var copy = presetDisplay(row, props.presetT)
          var choice = Object.hasOwn(selections, row.id) ? selections[row.id] : { mode: 'default' }
          var valid = choice && ['default', 'none', 'template'].includes(choice.mode)
          var value = !valid ? 'invalid' : choice.mode === 'template' ? 'template:' + (choice.template || '') : choice.mode
          var resolved = data ? resolveSelection(data, target ? target.path : '', row.id) : null
          var unresolved = resolved && ['missing', 'ambiguous', 'invalid'].includes(resolved.status)
          var options = [h('option', { key: 'default', value: 'default' }, inheritedLabel), h('option', { key: 'none', value: 'none' }, t('globalNone'))]
          if (unresolved && value !== 'default') options.push(h('option', { key: 'unresolved', value: value, disabled: true }, (choice.template || '') + ' · ' + statusText(resolved)))
          templates.forEach(function (tmpl) { if (!(unresolved && value === 'template:' + tmpl.name)) options.push(h('option', { key: 'template:'+tmpl.name, value: 'template:'+tmpl.name }, tmpl.name)) })
          return h('div', { key: row.id, className: 'pt-modeRow', 'data-preset-id': row.id },
            h('div', { className: 'pt-presetCopy' }, h('span', { className: 'pt-presetName', title: copy.name }, copy.name), h('span', { className: 'pt-presetId' }, row.id)),
            h('div', { className: 'pt-modeChoice' },
              h('select', { className: 'pt-select', value: value, disabled: busy || !ready || roster.status !== 'ready', 'aria-label': copy.name + ' · ' + row.id, title: value === 'default' ? inheritedLabel : value === 'none' ? t('globalNone') : choice.template || t('statusInvalid'),
                onChange: function (e) {
                  var value = e.target.value
                  return run('preset', { id: row.id, mode: value.startsWith('template:') ? 'template' : value, template: value.startsWith('template:') ? value.slice(9) : undefined })
                } }, options),
              unresolved ? h('span', { className: 'pt-modeWarning' }, statusText(resolved)) : null))
        })))

      // per-workspace rows
      var wsRows = workspaces.map(function (ws) {
        var value = workspaceSelectValue(overrides, normalizeWorkspacePath(ws.path))
        return h('div', { key: ws.workspaceId, className: 'pt-item' },
          h('div', { className: 'pt-wsTitle' },
            h('div', null, ws.title || ws.path),
            h('div', { className: 'pt-wsPath' }, ws.path),
          ),
          h('select', {
            className: 'pt-select',
            value: value,
            disabled: busy || !ready,
            onChange: function (e) { setWorkspaceOverride(ws.path, e.target.value) },
            'aria-label': t('workspaceSection') + ': ' + (ws.title || ws.path),
          }, selectorOptions(t, templates, true, value)),
        )
      })

      var workspaceSection = h('div', { className: 'pt-field' },
        h('label', { className: 'pt-label' }, t('workspaceSection')),
        workspaces.length === 0
          ? h('p', { className: 'pt-empty' }, t('noWorkspaces'))
          : h('div', { className: 'pt-list' }, wsRows),
        h('p', { className: 'pt-hint' }, t('workspaceHint')),
      )

      // per-template preview area (toggled by the row's 预览 button)
      var previewArea = null
      if (previewName) {
        var previewTemplate = null
        for (var i = 0; i < templates.length; i++) {
          if (templates[i].name === previewName) { previewTemplate = templates[i]; break }
        }
        if (previewTemplate) {
          previewArea = h('div', { className: 'pt-preview' },
            h('div', { className: 'pt-previewHead' },
              h('span', { className: 'pt-previewTitle' }, previewTemplate.name),
              h('button', { className: 'pt-btnSm', onClick: function () { setPreviewName(null) } }, t('close')),
            ),
            h('div', { className: 'pt-previewBody' }, previewTemplate.text),
          )
        }
      }

      var section = function (key, children) {
        return h('section', { className: 'pt-section', 'aria-label': t(key) },
          h('h3', { className: 'pt-sectionTitle' }, t(key)), children)
      }
      return h('section', { className: 'pt-page' },
        h('h2', { className: 'pt-title' }, t('title')),
        h('p', { className: 'pt-hint' }, t('description')),
        error ? h('p', { className: 'pt-error', role: 'status' }, error) : null,
        !data ? h('p', { className: 'pt-hint', role: 'status' }, t('unavailable')) : null,
        h('p', { className: 'pt-saveStatus' + (saved ? ' is-saved' : ''), role: 'status', 'aria-live': 'polite' }, busy ? t('saving') : saved ? t('saved') : t('autoSave')),
        h('div', { className: 'pt-actions left' },
          h('button', { className: 'pt-btn', onClick: load, disabled: busy }, t('refresh')),
        ),
        section('management', h(React.Fragment, null,
          templates.length === 0
            ? h('p', { className: 'pt-empty' }, t('empty'))
            : h('div', { className: 'pt-list' }, rows),
          previewArea,
          form,
          h('div', { className: 'pt-actions left' },
            h('button', { className: 'pt-btn', onClick: startAdd, disabled: busy || !ready }, t('addTemplate')),
          ),
        )),
        section('scope', globalSelect),
        section('presetSection', presetSection),
        h('details', { className: 'pt-details' },
          h('summary', null, t('previewDetails')),
          h('div', { className: 'pt-detailsBody' },
          workspaceSection,
          h('p', { className: 'pt-hint' }, t('retainedMappings') + Object.keys(selections).filter(function (id) { return !roster.rows.some(function (row) { return row.id === id }) }).length),
          h('div', { className: 'pt-field' }, h('div', { className: 'pt-field' },
          h('p', { className: 'pt-hint' }, t('globalLabel') + ': ' + (globalResult ? resultText(globalResult) : t('unavailable'))),
          h('label', { className: 'pt-label pt-targetField' }, t('previewTarget'),
            h('select', {
              className: 'pt-select', value: targetId,
              onChange: function (e) { setTargetId(e.target.value) },
            },
              h('option', { value: '' }, t('globalTarget')),
              !targetValid ? h('option', { value: targetId, disabled: true }, t('unavailableTarget')) : null,
              workspaces.map(function (ws) { return h('option', { key: ws.workspaceId, value: ws.workspaceId }, (ws.title || ws.path) + (ws.title ? ' · ' + ws.path : '')) }),
            ),
          ),
          h('p', { className: 'pt-hint' }, t('targetHint')),
          h('label', { className: 'pt-label pt-targetField' }, t('previewPreset'),
            h('select', { className: 'pt-select', value: previewPresetId, 'aria-label': t('previewPreset'), disabled: roster.status !== 'ready', onChange: function (e) { setPreviewPresetId(e.target.value) } },
              h('option', { value: '' }, t('previewDefault')),
              previewPresetId && !roster.rows.some(function (row) { return row.id === previewPresetId }) ? h('option', { value: previewPresetId, disabled: true }, previewPresetId + ' · ' + t('presetMissing')) : null,
              roster.rows.map(function (row) { return h('option', { key: row.id, value: row.id }, presetDisplay(row, props.presetT).name + ' · ' + row.id) }))),
          h('p', { className: 'pt-hint' }, t('previewOnly')),
          target ? h('p', { className: 'pt-hint' }, t('modeLabel') + ': ' + modeText) : null,
        )),

          h('div', { className: 'pt-field' },
          h('p', { className: 'pt-label' }, !targetValid ? t('unavailableTarget') : target ? (target.title ? target.title + ' · ' : '') + target.path : t('globalTarget')),
          h('p', { className: 'pt-hint' }, t('expectedHint')),
          h('p', { className: 'pt-label', role: 'status' }, t('resolvedLabel') + ': ' + (expected ? resultText(expected) : t(!targetValid ? 'unavailableTarget' : !presetTargetValid ? 'previewPresetUnavailable' : 'unavailable'))),
          expected ? h('p', { className: 'pt-previewSource' }, t('sourceLabel') + ': ' + t(previewSource)) : null,
          expected && expected.status === 'resolved'
            ? h('div', { className: 'pt-preview' }, h('div', { className: 'pt-previewBody' }, expected.text || t('emptyText')))
            : null,
          h('p', { className: 'pt-hint' }, t('effectiveHint')),
          h('p', { className: 'pt-hint' }, t('personaHint')),
          h('p', { className: 'pt-hint' }, t('presetHint')),
          h('p', { className: 'pt-hint' }, t('privacyHint')),
        ))),
        h('div', { className: 'pt-field' },
          h('p', { className: 'pt-hint' }, t('privacyShort')),
        ),
      )
    }

    function apply(ctx) {
      ctx.effect(function () { return installPanelStyles() }, 'dsh-prompt-inject: panel styles')
      ctx.effect(function () { return ctx.locale.register(NS, { zh: zh, en: en }) }, 'dsh-prompt-inject: locale')
      var tt = ctx.locale.bind(NS)
      var presetT = ctx.locale.bind('settings.agentPreset')
      var connectionVersion = 0
      ctx.on('connection/reset', function () { connectionVersion++ })
      var controller = ctx.configForms.get(ENTRY)
      var subscribePresets = function (refresh) {
        return typeof ctx.remote.$on === 'function' ? ctx.remote.$on('settings/document-updated', function (ns) { if (ns === 'agent-preset-registry') refresh() }) : function () {}
      }
      var getConnectionVersion = function () { return connectionVersion }
      var loadPresets = async function () {
        var remote = ctx.remote
        if (!remote || !remote.agentPresets || typeof remote.agentPresets.list !== 'function') throw new Error('Preset roster unavailable')
        var result = await remote.agentPresets.list()
        if (!result.ok || !Array.isArray(result.value.presets)) throw new Error('Preset roster unavailable')
        return result.value.presets.filter(function (row) { return row && typeof row.id === 'string' && row.id })
      }
      ctx.slots.inject('settings.section', function () {
        return ctx.slots.register(
          { name: 'settings.section', id: 'prompt-inject', order: 21, locale: NS, label: function () { return tt('title') } },
          function (props) {
            return h(PromptTemplatesPage, Object.assign({}, props, {
              controller: controller,
              loadPresets: loadPresets,
              presetT: presetT,
              getConnectionVersion: getConnectionVersion,
              subscribePresets: subscribePresets,
              reload: async function () {
                var mirror = ctx.configForms.describe()
                await mirror.load()
                var state = mirror.getSnapshot()
                // RC5's mirror resolves load() even on a failed read, retaining
                // its old view. Do not acknowledge that as a refreshed draft.
                if (state.status !== 'ready' || state.error) throw new Error(tt('unavailable'))
              },
            }))
          },
        )
      })
    }

    exports.apply = apply
    exports.inject = ['slots', 'locale', 'configForms', 'remote', 'remote.agentPresets']
    exports.createEditor = createEditor
    exports.resolveSelection = resolveSelection
    return module.exports
  },
})



