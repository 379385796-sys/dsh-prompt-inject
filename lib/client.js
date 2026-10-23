/* dsh-prompt-inject — browser half.
 *
 * Bundled in the shell module-table format: window.__ModuleLoader__.load()
 * with a factory receiving the module `require`. The kernel adopts the
 * exported `apply`/`inject` as a Cordis client plugin.
 *
 * Registers a card in the Plugins settings section (`settings.plugins.tab`)
 * that manages templates (add/edit/delete/preview), a global active template,
 * and a per-workspace override per workspace. The card mirrors the harness
 * settings card chrome (collapsible header + body) and follows the UI locale
 * (zh/en).
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
      title: '提示词注入模板',
      description: '维护多套命名提示词模板；全局或某个工作区选择某模板后即生效，无需单独开关。',
      globalLabel: '全局生效模板',
      globalNone: '不注入',
      globalHint: '未在下方覆盖的工作区默认使用此模板。',
      workspaceSection: '按工作区覆盖',
      workspaceInherit: '跟随全局',
      workspaceNone: '不注入',
      workspaceHint: '某工作区选「不注入」则其会话不追加任何模板。',
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
      personaHint: '若当前 Agent 使用 complete persona（完整人格），宿主只保留人格段，本模板不会进入最终系统提示。判断是否生效请看最终组装或请求，而不是这一页；本插件不绕过宿主规则。',
      privacyHint: '模板以明文保存在 Profile 配置里，并随系统提示进入模型请求与会话历史，fork 与备份也可能包含。请勿在此存放凭据。',
    }

    var en = {
      title: 'Prompt Template Injection',
      description: 'Maintain named prompt templates; a template takes effect once the global or a workspace selector picks it — no separate switch.',
      globalLabel: 'Global active template',
      globalNone: 'No injection',
      globalHint: 'Workspaces without an override below use this template.',
      workspaceSection: 'Per-workspace overrides',
      workspaceInherit: 'Inherit global',
      workspaceNone: 'No injection',
      workspaceHint: 'Choosing "No injection" for a workspace leaves its sessions without an injected template.',
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
      personaHint: 'If the active agent uses a complete persona, the host keeps only that persona section and this template never reaches the final system prompt. Judge effectiveness from the assembled prompt or request, not from this page; this plugin does not bypass host rules.',
      privacyHint: 'Templates are stored as plaintext in the Profile config and travel with the system prompt into model requests and session history; forks and backups may also contain them. Do not store credentials here.',
    }

    var fallbackT = function (key) { return zh[key] !== undefined ? zh[key] : key }

    var css = [
      // card chrome — mirrors the harness settings card
      '.pt-card{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);border-radius:12px;list-style:none;transition:border-color .16s,background .16s}',
      '.pt-card:hover{border-color:var(--dsw-alias-label-dimmed)}',
      '.pt-cardOpen{background:var(--dsw-alias-bg-layer-2);border-color:var(--dsw-alias-label-dimmed)}',
      '.pt-header{appearance:none;width:100%;font:inherit;color:inherit;text-align:left;cursor:pointer;background:0 0;border:0;border-radius:12px;align-items:center;gap:12px;padding:14px 16px;display:flex}',
      '.pt-header:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:-2px}',
      '.pt-headText{flex-direction:column;flex:1;gap:4px;min-width:0;display:flex}',
      '.pt-title{color:var(--dsw-alias-label-primary);font-size:15px;font-weight:600;line-height:1.4}',
      '.pt-desc{color:var(--dsw-alias-label-tertiary);font-size:13px;line-height:1.5}',
      '.pt-chevron{color:var(--dsw-alias-label-tertiary);flex:none;transition:transform .16s}',
      '.pt-chevronOpen{transform:rotate(180deg)}',
      '.pt-body{border-top:1px solid var(--dsw-alias-border-l2);margin:0 16px;padding:4px 0 16px;display:flex;flex-direction:column;gap:10px}',
      // inner: fields + inputs
      '.pt-field{flex-direction:column;gap:6px;padding:6px 0;display:flex}',
      '.pt-label{min-width:0;color:var(--dsw-alias-label-primary);flex:1;font-size:13px;font-weight:500;line-height:1.5}',
      '.pt-hint{color:var(--dsw-alias-label-tertiary);margin:0;font-size:12px;line-height:1.5}',
      '.pt-input,.pt-select{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);height:34px;font:inherit;color:var(--dsw-alias-label-primary);border-radius:8px;padding:0 12px;font-size:13px;line-height:1.5;box-sizing:border-box}',
      '.pt-input{width:100%}',
      '.pt-select{max-width:100%;padding-right:28px;cursor:pointer}',
      '.pt-input:focus-visible,.pt-select:focus-visible{border-color:var(--dsw-alias-brand-primary);outline:none}',
      '.pt-input:disabled,.pt-select:disabled{color:var(--dsw-alias-label-tertiary);cursor:default}',
      '.pt-textarea{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);font:inherit;color:var(--dsw-alias-label-primary);border-radius:8px;padding:8px 12px;font-size:13px;line-height:1.5;min-height:120px;resize:vertical;box-sizing:border-box;width:100%;white-space:pre-wrap}',
      '.pt-textarea:focus-visible{border-color:var(--dsw-alias-brand-primary);outline:none}',
      // list + workspace rows
      '.pt-list{display:flex;flex-direction:column;gap:6px}',
      '.pt-item{display:flex;align-items:center;gap:8px;padding:8px 12px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-3)}',
      '.pt-itemName{font-weight:500;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-primary);font-size:13px}',
      '.pt-wsTitle{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-primary);font-size:13px;font-weight:500}',
      '.pt-wsPath{color:var(--dsw-alias-label-tertiary);font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      // preview area
      '.pt-preview{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);border-radius:8px;padding:8px 12px;max-height:220px;overflow:auto}',
      '.pt-previewHead{display:flex;align-items:center;gap:8px;margin-bottom:6px}',
      '.pt-previewTitle{font-weight:600;color:var(--dsw-alias-label-primary);font-size:13px;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.pt-previewBody{white-space:pre-wrap;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:1.5}',
      // buttons
      '.pt-actions{display:flex;justify-content:flex-end;align-items:center;gap:8px}',
      '.pt-actions.left{justify-content:flex-start}',
      '.pt-btn,.pt-btnPrimary{appearance:none;font:inherit;cursor:pointer;border:1px solid #0000;border-radius:8px;padding:5px 14px;font-size:13px;line-height:1.5}',
      '.pt-btn{border-color:var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);background:0 0}',
      '.pt-btn:hover{color:var(--dsw-alias-label-primary)}',
      '.pt-btnPrimary{background:var(--dsw-alias-label-primary);color:var(--dsw-alias-bg-layer-3)}',
      '.pt-btnSm{appearance:none;font:inherit;cursor:pointer;border:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);background:0 0;border-radius:6px;padding:2px 8px;font-size:12px;line-height:1.5;flex:none}',
      '.pt-btnSm:hover{color:var(--dsw-alias-label-primary)}',
      '.pt-btnSm.danger:hover{color:var(--dsw-alias-label-error);border-color:var(--dsw-alias-label-error)}',
      '.pt-btnSm.primary{color:var(--dsw-alias-brand-primary);border-color:var(--dsw-alias-brand-primary)}',
      '.pt-btn:disabled,.pt-btnPrimary:disabled,.pt-btnSm:disabled{opacity:.5;cursor:not-allowed}',
      // misc
      '.pt-error{color:var(--dsw-alias-label-error);margin:0;font-size:12px;line-height:1.5}',
      '.pt-empty{color:var(--dsw-alias-label-tertiary);margin:0;font-size:12px;line-height:1.5;text-align:center;padding:8px 0}',
      '.pt-divider{border-top:1px solid var(--dsw-alias-border-l2);margin:4px 0}',
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
    function normalizePath(path) {
      if (/^[a-z]:[\\/]+$/i.test(path)) return path.slice(0, 2) + '\\'
      return path.replace(/[\\/]+$/, '') || '/'
    }
    function createEditor(controller) {
      return async function (action, body, expectedRevision) {
        var snapshot = controller.getSnapshot()
        if (snapshot.status !== 'ready' || !snapshot.writable || !Number.isInteger(expectedRevision)) throw new Error('Settings unavailable; refresh and retry.')
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
          var key = normalizePath(body.path)
          if (name === INHERIT) delete overrides[key]
          else {
            if (name !== '' && !exists(name)) throw new Error('Unknown template')
            Object.defineProperty(overrides, key, { value: name, enumerable: true, configurable: true, writable: true })
          }
        } else throw new Error('Unknown operation')
        var accepted = await controller.mutate([
          { op: 'set', path: ['templates'], value: templates },
          { op: 'set', path: ['activeTemplate'], value: active },
          { op: 'set', path: ['workspaceOverrides'], value: overrides },
        ], expectedRevision)
        if (!accepted) throw new Error('Save rejected or configuration changed. Refresh, review your draft and retry.')
        return true
      }
    }

    var Chevron = function (open) {
      return h('svg', {
        className: 'pt-chevron' + (open ? ' pt-chevronOpen' : ''),
        viewBox: '0 0 14 14', width: 14, height: 14, fill: 'none',
        stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round',
        'aria-hidden': true,
      }, h('path', { d: 'M3 5l4 4 4-4' }))
    }

    // Shared option list for a selector: [inherit?] none + every template.
    function selectorOptions(t, templates, withInherit) {
      var options = []
      if (withInherit) options.push(h('option', { key: 'inherit', value: INHERIT }, t('workspaceInherit')))
      options.push(h('option', { key: 'none', value: '' }, t('workspaceNone')))
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

    function PromptTemplatesCard(props) {
      var t = (props && typeof props.t === 'function') ? props.t : fallbackT
      var useWorkspaces = props && props.useWorkspaces

      var openState = React.useState(false)
      var open = openState[0]
      var setOpen = openState[1]
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

      var load = function () {
        return props.reload().then(function () {
          setEditing(function (draft) { return draft ? Object.assign({}, draft, { revision: controller.getSnapshot().revision, connectionVersion: props.getConnectionVersion() }) : draft })
          setError('')
        }).catch(function (e) { setError(String(e.message || e)) })
      }
      var run = function (action, body, revision) {
        if (writeLock.current || !ready) return Promise.resolve(false)
        writeLock.current = true
        setBusy(true)
        setError('')
        return editor(action, body, revision === undefined ? snapshot.revision : revision)
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
        form = h('div', null,
          h('div', { className: 'pt-field' },
            h('label', { className: 'pt-label' }, t('nameLabel')),
            h('input', {
              className: 'pt-input',
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
        h('label', { className: 'pt-label' }, t('globalLabel')),
        h('select', {
          className: 'pt-select',
          value: activeName,
          disabled: busy || !ready,
          onChange: function (e) { setGlobalActive(e.target.value) },
        }, selectorOptions(t, templates, false)),
        h('p', { className: 'pt-hint' }, t('globalHint')),
      )

      // per-workspace rows
      var wsRows = workspaces.map(function (ws) {
        var value = workspaceSelectValue(overrides, normalizePath(ws.path))
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
          }, selectorOptions(t, templates, true)),
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

      var body = h('div', { className: 'pt-body' },
        error ? h('p', { className: 'pt-error', role: 'status' }, error) : null,
        !ready ? h('p', { className: 'pt-hint', role: 'status' }, 'Settings: ' + snapshot.status) : null,
        globalSelect,
        workspaceSection,
        h('div', { className: 'pt-divider' }),
        templates.length === 0
          ? h('p', { className: 'pt-empty' }, t('empty'))
          : h('div', { className: 'pt-list' }, rows),
        previewArea,
        form,
        h('div', { className: 'pt-actions left' },
          h('button', { className: 'pt-btn', onClick: startAdd, disabled: busy || !ready }, t('addTemplate')),
          h('button', { className: 'pt-btn', onClick: load, disabled: busy || !ready }, t('refresh')),
        ),
        h('div', { className: 'pt-divider' }),
        h('div', { className: 'pt-field' },
          h('p', { className: 'pt-hint' }, t('effectiveHint')),
          h('p', { className: 'pt-hint' }, t('personaHint')),
          h('p', { className: 'pt-hint' }, t('privacyHint')),
        ),
      )

      return h('li', { className: 'pt-card' + (open ? ' pt-cardOpen' : '') },
        h('button', {
          type: 'button',
          className: 'pt-header',
          'aria-expanded': open,
          onClick: function () { setOpen(!open) },
        },
          h('span', { className: 'pt-headText' },
            h('span', { className: 'pt-title' }, t('title')),
            h('span', { className: 'pt-desc' }, t('description')),
          ),
          Chevron(open),
        ),
        open ? body : null,
      )
    }

    function apply(ctx) {
      ctx.effect(function () { return installPanelStyles() }, 'dsh-prompt-inject: panel styles')
      ctx.effect(function () { return ctx.locale.register(NS, { zh: zh, en: en }) }, 'dsh-prompt-inject: locale')
      var tt = ctx.locale.bind(NS)
      var connectionVersion = 0
      ctx.on('connection/reset', function () { connectionVersion++ })
      var controller = ctx.configForms.get(ENTRY)
      ctx.slots.inject('settings.plugins.tab', function () {
        return ctx.slots.register(
          { name: 'settings.plugins.tab', id: 'prompt-inject', order: 50, locale: NS, label: function () { return tt('title') } },
          function (props) { return h(PromptTemplatesCard, Object.assign({}, props, { controller: controller, getConnectionVersion: function () { return connectionVersion }, reload: function () { return ctx.configForms.describe().load() } })) },
        )
      })
    }

    exports.apply = apply
    exports.inject = ['slots', 'locale', 'configForms']
    exports.createEditor = createEditor
    return module.exports
  },
})



