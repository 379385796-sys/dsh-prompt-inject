# dsh-prompt-inject 0.1.5

DSH Desktop **0.2.2-rc.1** compatibility release. 0.2.2-rc.1 refuses to load a plugin whose `engines.dsh` does not name the running host, so 0.1.4-rc.5 was skipped at boot on that host. Injection behaviour, the three-state per-Preset model, settings UI and stored configuration are unchanged.

DSH Desktop **0.2.2-rc.1** 兼容性发布。该宿主会跳过 `engines.dsh` 未声明当前版本的插件，0.1.4-rc.5 因此无法加载。注入行为、每个 Agent Preset 的三态选择、设置界面与已保存配置均未改动。

Original Author: H1a3x. Current Maintainer: 379385796-sys. Original MIT license/copyright retained; maintenance contributions separately attributed.

## What changed

- `engines.dsh` and the `@deepseek-ai/dsh-*` peer ranges now include `0.2.2-rc.1`.
- The preset lookup prefers the owning service `agentPresets.presetForSession(session)` when the host exposes it, and falls back to `sessionProjections.stateOf(session, 'agentPreset')` on older hosts. 0.2.2 deprecates the generic projection read; both paths return the same value, and the "current Agent Preset unavailable" failure still throws instead of injecting the wrong template.
- No change to templates, workspace overrides, migration, ordering (section order 50) or the single `{{dsh_prompt_inject_text}}` section contract.

## Verification on 0.2.2-rc.1

- Template text appears **exactly once** in the assembled system prompt of a real session (system prompt 5738 → 5813 characters).
- With the `standard` preset set to `none`, the marker disappears and the prompt returns to 5738 characters — the preset-exclusion path that exercises the new lookup.
- Configuration persisted across a host restart and still injected once.
- No `sessionProjections.stateOf ... is deprecated` warning in the host log.
- 22 tests pass (1 new for the preferred service path, 1 adjusted to keep the legacy fallback covered).

## Install

Download `dsh-prompt-inject-0.1.5.tgz`, verify it against `dsh-prompt-inject-0.1.5.tgz.sha256`, then install through the official plugin interface. Node 24+.

Template changes do not retract history, summaries or accepted requests. Complete Persona remains authoritative. Missing explicit references fail closed.

## Historical 0.1.4-rc.5 notes

Direct per-Agent template assignment with dynamic host preset discovery, localized built-in names, revision-checked saves, safe migration from earlier candidate exclusions and compact native-select settings. Validated on Windows x64 / DSH Desktop 0.2.1-rc.5 with 21 tests; official upgrade preserved templates, workspaces and unrelated plugins.
