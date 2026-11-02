## 0.1.4-rc.5 — 2026-11-02

- Current Maintainer: 379385796-sys. Original Author: H1a3x. Original MIT license/copyright retained; maintenance contributions separately attributed.
- Carry forward the accepted Windows RC5 compatibility and 0.1.3-rc.5 settings improvements without reopening host compatibility engineering.
- Add a real per-Preset three-state model: inherit workspace/default, no injection, or explicit template. Current session projection controls request assembly; missing/ambiguous template references fail closed. Complete Persona remains authoritative.
- Safely migrate previous candidate exclusions during the next revision-fenced save, preserving templates, workspaces, legacy fields and unknown-ID mappings.
- Retain localized row-based settings, explicit save feedback, advanced workspace overrides and collapsed diagnostics. Synchronize the live roster on reopening, reconnect, refresh and host preset-settings notifications.
- Final visual polish: compact ~48 px rows, narrower native selects, follow-default labels and full-name hover text; no functional changes.
- Validation: 21 tests; actual RC5 offline request captures, atomic migration/conflicts, registry add/remove/re-registration/renaming, deletion/recreation, preset switching, cold persistence, Chinese/English and responsive layout. Native confirmation and formal installation/publication remain separate gates.

## 0.1.3-rc.5 — 2026-11-01

- Place the preview target label above a full-width selector and its help below. Normalize field, form and section spacing using the existing native settings style.
- Presentation only: preserve template, workspace, injection, preview and ConfigForms behavior; no new dependencies. Retain H1a3x copyright and MIT license.
- Validation: 13 existing tests passed; RC5 Desktop spacing accepted by the user; actual RC5 Web renderer checked at 1360, 900 and 640 pixels without horizontal overflow. No remote publication.

## 0.1.2-rc.5 — 2026-11-01

- Move template management to Settings → System Prompt Injection, directly after Agent presets on Desktop RC5; remove the former nested entry and outer collapse.
- Organize overview, template management, global/workspace scope and expected injection preview. Keep saved configuration separate from verified request evidence.
- Share the pure resolver between Host and generated browser code; preserve all configuration fields, exact workspace matching, deletion safety and user:prompt-inject / order 50. Preserve revision, concurrent-write and reconnect draft guards; reject failed refresh acknowledgements.
- Validation: 13 targeted tests, real RC5 ConfigForms conflict/reconnect/failed-refresh and cold persistence, offline request captures, official Complete Persona behavior, and user-confirmed Desktop navigation/layout/localization/cold persistence. No new dependencies or host/peer plugin changes.
- Retain H1a3x MIT copyright and maintenance attribution. Local candidate only; no remote publication.

## 0.1.1-rc.5 — 2026-10-30

- Add DSH Desktop 0.2.1-rc.5 explicitly to the verified host range; retain previous supported versions.
- Add RC5 to the three actually used host peer ranges. Preserve ConfigForms revision fences, volatile Profile settings, workspace selection, injection order and H1a3x MIT attribution. No functional code changes.
- Validation scope: isolated Windows rc.5 Host and browser, core plugin behavior and three-plugin coexistence; no formal installation or publication in this stage.

## 0.1.1-rc.4 — 2026-10-25

- Extend the explicit host and peer ranges to RC3. Retain ConfigForms revision fences, volatile configuration, template data format, injection order, H1a3x attribution and MIT license.
- Retain prior host declarations and data formats; no new features.
- Real RC3 host and human Desktop acceptance passed; retain RC2 automated regression, with full RC2 Desktop retest NOT TESTED.

# Changelog

## 0.1.1-rc.3.0

- Preserve the existing runtime and package identity.
- Add bilingual publication documentation, original display icons and localized metadata.
- Retain tested Windows / DSH 0.2.1-rc.2 limits; do not claim wider support.
- Local adaptation: volatile Config/ConfigForms transport, revision-safe drafts, client style lifecycle cleanup, and explicit complete-persona/plaintext/history boundaries. Upstream remains credited to H1a3x.

This same-version public package is a publication candidate, separate from earlier personal installation artifacts. It has its own SHA-256.
