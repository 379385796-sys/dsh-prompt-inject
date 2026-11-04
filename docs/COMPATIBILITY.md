# Compatibility / 兼容与验证

## 当前范围 / Current scope

- Package **0.1.5** declares DSH `0.2.0-rc.2 || 0.2.1-rc.2 || 0.2.1-rc.3 || 0.2.1-rc.5 || 0.2.2-rc.1`; Node **24+**.
- Current published target: Windows x64 DSH Desktop **0.2.2-rc.1**. See [v0.1.5 Release](https://github.com/379385796-sys/dsh-prompt-inject/releases/tag/v0.1.5).
- 声明接受范围不等于每个版本、平台及第三方组合都完成同等验收。下面的 RC2/RC3/RC5 测试数量与安装状态是对应日期的历史记录。
- Declared ranges are not equal validation of every build/platform/combination. Historical RC2/RC3/RC5 records below retain their dates and scope.
- Linux/macOS and arbitrary host builds remain untested.

## 0.1.5 — 0.2.2-rc.1 compatibility (2026-11-05)

Target: DSH Desktop 0.2.2-rc.1, Windows x64, Electron 44 / Node 24.21.0. Exact host range: `0.2.0-rc.2 || 0.2.1-rc.2 || 0.2.1-rc.3 || 0.2.1-rc.5 || 0.2.2-rc.1`.

0.2.2-rc.1 evaluates `engines.dsh` before importing plugin code and skips a bundle whose range does not satisfy the running host, so 0.1.4-rc.5 could not load at all on that host.

### Reviewed surfaces

| Surface | 0.2.1-rc.5 | 0.2.2-rc.1 | Effect |
| --- | --- | --- | --- |
| `systemPrompt.variable()` / `.section()` | unchanged | unchanged | injection contract intact |
| `system-prompt/assemble` payload | `PromptAssembly` (with `tools`) | `PromptPresentation` (tools provider-owned) | not used by this plugin |
| `sessionProjections.stateOf(session, key)` | public | **deprecated**, still returns the value | prefer the owning service |
| `agentPresets.presetForSession(session)` | present | present | preferred lookup |
| `settings.configure({auto}, fiber)` | `owner` used directly | reads `owner.ctx.fiber` | unchanged for `ctx.fiber` callers |
| cordis | 4.0.5 | 4.1.0 | volatile config, `effect`, `inject` unchanged |

### Behaviour

The preset lookup now tries `agentPresets.presetForSession(session)` first and falls back to the deprecated projection read. Both return the same preset id; the "current Agent Preset unavailable" error still throws rather than injecting the wrong template. Section name, order 50, the single `{{dsh_prompt_inject_text}}` variable and the Complete Persona precedence are unchanged.

### Evidence

- Real 0.2.2-rc.1 host: template text appears exactly once in the assembled system prompt (5738 → 5813 characters).
- Preset `standard` set to `none`: marker count 0, prompt back to 5738 characters.
- Configuration survived a host restart and still injected once.
- No deprecation warning in the host log; no plugin load warnings.
- 22 automated tests pass.

## 历史验证记录 / Historical validation records


- Windows + DSH Desktop 0.2.1-rc.2: previously isolated and formally installed for exporter, comfort, and prompt-inject; bilingual metadata reader and Chinese light/dark GUI verified. Public packaging is verified separately in the private release report.
- Linux/macOS/other DSH builds: NOT TESTED.
- 模板以明文保存，并会传给模型；已接受请求、历史与摘要不会因切换模板撤回。工作区匹配保留路径大小写和分隔符差异，不是权限隔离。complete persona 会按宿主规则排除本插件的段。不能保证任意 Agent 预设均会注入。
- Templates are stored in plaintext and transmitted to the model. Switching templates does not retract accepted requests, history, or summaries. Workspace keys preserve case and separators and are not an access-control boundary. A complete persona can exclude the injected section under host rules.

No live credentials, real conversations, Profile snapshots, recovery backups, or test logs belong in this repository. Functional test counts are reported as historical evidence when not rerun; a successful build is not GUI acceptance.

## Public candidate checks, 2026-10-24

Clean official tgz install and cold Web host startup PASS. Actual English and Chinese plugin cards and loaded icons PASS. No duplicate client stylesheet and no browser page errors. Syntax checks and 3 portable synthetic behavior tests PASS; the earlier 34 host tests remain historical evidence. No real model requests were sent.

## 0.1.1-rc.4 — 2026-10-25

Installed target verified from immutable app.asar metadata: DSH and Shell 0.2.1-rc.3; Shell commit be72761ee1a6736ebcdf4f3739363b083ae53c98; Electron 44.7.0, Node 24.21.0, ABI 149.

Extend the explicit host and peer ranges to RC3. Retain ConfigForms revision fences, volatile configuration, template data format, injection order, H1a3x attribution and MIT license.

Three behavior tests and real ConfigForms saving, workspace overrides, draft refresh, cold restart and exactly-once main-request injection passed. All three maintained plugins coexist with Packer 0.4.2 in an isolated RC3 Profile; the final headless Web-host pass has no page, console or HTTP errors. The human user completed actual Desktop GUI checks. Headless and Desktop results are recorded separately. No compatibility exemption was used. Prior RC2 support remains; full RC2 Desktop retesting this maintenance is NOT TESTED. The legacy 0.2.0-rc.2 declaration is retained, not newly certified.

## 0.1.1-rc.5 — rc.5 maintenance (2026-10-30)

Target: DSH Desktop 0.2.1-rc.5, Windows x64, Electron 44.7.0 / Node 24.21.0 / ABI 149. Exact host range: `0.2.0-rc.2 || 0.2.1-rc.2 || 0.2.1-rc.3 || 0.2.1-rc.5`. Add RC5 to the three actually used host peer ranges. Preserve ConfigForms revision fences, volatile Profile settings, workspace selection, injection order and H1a3x MIT attribution. No functional code changes.

Core behavior is checked on an isolated rc.5 Host/browser with synthetic sessions and deterministic offline model output, followed by three-plugin coexistence and the unchanged Packer 0.4.3 candidate dependency precheck. Earlier RC2/RC3 evidence remains; those full Desktop GUI checks are not repeated here. No formal Profile or DSH core modification.


## 0.1.2-rc.5 — 2026-11-01

Target: Windows x64 / DSH Desktop 0.2.1-rc.5, Electron 44.7.0 / Node 24.21.0. Existing engine and peer ranges are unchanged; earlier hosts/platforms are not newly certified by these UI changes.

The user confirmed real isolated Desktop navigation after Agent presets, absence of the old entry, direct layout, Chinese/English switching and a saved synthetic template after cold restart. Automated native Desktop control was blocked by tool policy; this human acceptance is recorded separately from Headless Edge over the real RC5 Host.

Real ConfigForms CRUD, global/workspace selection, expected preview, revision conflict, failed refresh and actual WebSocket reconnect retained drafts. The real Host cold restart preserved configuration. Actual offline LLM adapter captures verified global injection exactly once, replacement by workspace selection, no injection, live edits in the same session, and exclusion by the official dsh-persona component with complete=true. These are request-boundary observations, not UI preview assertions. Public 13-test regression and resolver repeatability checks remain separate evidence.

Comfort 1.0.3, AI Exporter 0.1.3 and Packer 0.4.3 were loaded together for targeted coexistence only. Broad Packer backup/restore and cross-plugin regression remain deferred to the joint regression. No formal installation is implied by this acceptance record.

## 0.1.3-rc.5 — spacing maintenance (2026-11-01)

Windows x64 / DSH Desktop 0.2.1-rc.5. CSS and two presentational class changes only; functional code byte-identical to 0.1.2-rc.5 after removing those changes. Existing 13 tests passed once, native Desktop accepted by the user, actual RC5 Web renderer passed at 1360/900/640 pixels. Host ranges, dependencies, configuration and injection semantics are unchanged.

## 0.1.4-rc.5 — Per-Agent template selection

Target remains Windows x64 / DSH Desktop 0.2.1-rc.5. This is a local configuration/selection/UI change, not a new host compatibility project. Current identity uses `sessionProjections.stateOf(session, "agentPreset")`. All-default settings preserve workspace/global behavior; explicit mappings need a reliable current ID. No new certification of RC2/RC3 or other platforms. Actual test scope and migration are recorded in [PRESET-EXCLUSION](PRESET-EXCLUSION.md), whose existing filename is retained. Final native UI was accepted by the user. Official CLI upgrade from 0.1.3-rc.5 and formal cold-start verification passed, preserving templates, workspace settings and unrelated plugins. Formal private prompts were checked read-only/in memory; actual request captures used the isolated offline adapter.
