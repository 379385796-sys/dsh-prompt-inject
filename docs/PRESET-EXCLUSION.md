# Per-Agent template selection — 0.1.4-rc.5

Original Author: H1a3x. Current Maintainer: 379385796-sys. Original MIT license retained.

## Model and precedence

The Profile stores `presetSelectionVersion: 1` and `presetSelections`, a dictionary keyed by stable Preset ID. Each entry has `mode: default | none | template`; template entries also store the existing immutable unique template name as `template`. Missing entries mean default. This is not an adapter back to the old exclusion switch.

An explicit template or none takes precedence. Default inherits the workspace override, then the global default. Missing, empty or ambiguous template references yield empty injection and a visible unresolved state. Deleting a template preserves its preset references so another template is never silently substituted. Complete Persona remains the host-enforced sole final prompt. No host or peer-plugin code is changed.

## Repeatable migration

Version 0/absent plus an enabled legacy switch maps excluded IDs to none. With the switch off, the old list is ignored. Existing new entries take precedence. The same pure migration is used by Host and UI and does not mutate input. The next successful ordinary Settings save commits version and effective map atomically under the existing revision fence. Rejected writes change neither. Version 1 never reapplies the old list. Legacy fields, templates and workspaces are retained; startup performs no background configuration write. Unsupported versions are rejected rather than guessed.

## Roster and interaction

The mode table is the actual setting: each row has Default (resolved template), No injection, and dynamic template-library options. Choices save immediately with explicit saving/saved/error feedback. There is no duplicate exclusion control or result table. Workspace overrides and default diagnostics remain in a disclosure.

The public host roster supplies IDs and names. Shipped names use the host settings.agentPreset locale dictionary and official built-in/name-ownership rule; registered third-party names are not guessed or translated. Only current rows are shown. Discovery never prunes stored mappings. Reopening, reconnect and explicit refresh synchronize rows, with additional refresh on the host preset-settings event. RC5 has no universal notification for every registration mutation, so universal instant push is not claimed.

## Actual validation

- 21 unit/component regression tests: all three modes, workspace/global priority, migration on/off/idempotence, revision/reconnect/draft and concurrent-write guards, dynamic templates and unresolved references, ID retention, registered/localized names and lifecycle changes.
- Actual installed Windows RC5 Host with a synthetic Profile and deterministic offline model adapter captured the actual system messages: default global/workspace, explicit none, explicit template over workspace and disabled workspace, both blank-session switch directions and independent sessions passed.
- The first real UI save atomically migrated legacy exclusions. A stale real Host revision was rejected without losing configuration. Template deletion injected neither the missing template nor any fallback; recreation restored the reference.
- Actual host registration, disposal, re-registration and renamed display metadata preserved ID mappings. Reopening settings after an actual new registration synchronized the list and restored its saved choice. The test bridge exists only in the copied offline test provider and is excluded from the public package.
- Official complete Persona excluded all Prompt Inject text. Cold restart retained migrated maps, legacy fields, templates and workspaces. Actual English names/rows and Chinese 1100/900/640 responsive layouts passed with no page errors or horizontal overflow.

All prompts were synthetic and no external model request was sent. RP IDs in the fixture are not certification of the RP plugin itself. Old accepted request/history/summary content is not retracted. No new RC2/RC3 or other-platform certification. Final native UI was approved by the user; official formal installation and cold-start checks passed. No private model request was sent. Publication is recorded in the Release.

## Final visual polish

Desktop rows measure about 48.2 px before inter-row borders, with a narrower native template select. Its 34 px control height is unchanged. Narrow panels keep the stacked layout. The default option reads “Follow default · template name”; full selected names remain available through the native option list and hover title. No model, migration, selection, or saving logic changed. Chinese/English 1100/900/640 layout and real save/restore checks passed, including long template names; 21 existing tests passed.
