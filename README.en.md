# DSH Prompt Inject

[简体中文](README.md) · [Download v0.1.1-rc.5 (prerelease)](https://github.com/379385796-sys/dsh-prompt-inject/releases/tag/v0.1.1-rc.5) · [Compatibility](docs/COMPATIBILITY.md)

Manage named System Prompt templates. Select one globally or per workspace to append it when the next model request is assembled.

A maintained adaptation of [H1a3x/dsh-prompt-inject](https://github.com/H1a3x/dsh-prompt-inject), retaining the original copyright and MIT license. **This is not an official upstream release.** See [upstream and changes](docs/UPSTREAM.md).

## Template selection

- Add, edit, delete, and preview named templates.
- Select a global template or No injection. Creating a template does not select it automatically.
- Let each workspace inherit the global choice, disable injection, or select its own template.
- Save through native host configuration forms. Conflicts retain your draft so you can refresh, review, and retry.

| Global choice | Workspace choice | Result |
| --- | --- | --- |
| General assistant | Inherit global | General assistant |
| General assistant | No injection | No appended template |
| General assistant | Code review | Code review |
| No injection | Inherit global | No appended template |

These names illustrate selection rules; they are not built-in templates. A host **complete persona** can exclude the plugin's section. Injection is not guaranteed for every Agent preset.

## Installation

Current package: **0.1.1-rc.5**, marked as a GitHub prerelease. Requires Node **24+** and declares DSH `0.2.0-rc.2 || 0.2.1-rc.2 || 0.2.1-rc.3 || 0.2.1-rc.5`. Windows Desktop RC5 is the current target. The legacy `0.2.0-rc.2` declaration is retained, not newly certified. Other platforms are untested.

1. Download `dsh-prompt-inject-0.1.1-rc.5.tgz` and its `.sha256` from [v0.1.1-rc.5](https://github.com/379385796-sys/dsh-prompt-inject/releases/tag/v0.1.1-rc.5).
2. Compare the checksum using `Get-FileHash -Algorithm SHA256 -LiteralPath '<absolute-tgz-path>'`.
3. Install the local tgz through DSH's plugin manager or a configured CLI:

   ```text
   dsh plugin --profile <profile> add <absolute-tgz-path>
   ```

4. Restart and verify package `dsh-prompt-inject`, configuration entry ID `prompt-inject`, and version `0.1.1-rc.5`.

Template management requires host settings, systemPrompt, client configuration forms, Cordis, Schemastery, and React interfaces. Exact peer ranges are in [package.json](package.json). The other three DSH plugins are not required. Do not edit host dependencies to bypass compatibility checks.

## First use

1. Open **Settings → Plugins → Prompt Template Injection** and expand the card.
2. Add a unique name and prompt text, then save. For example, name it “Concise answers” with text “Start with the conclusion, then give the necessary supporting details.”
3. Select it under Global active template. Set per-workspace exceptions as needed.
4. Send the next model request. Check the final assembled prompt or request to confirm injection; panel preview alone does not prove it.

Templates are plaintext in the Profile configuration and enter model requests and session history; forks and backups may include them. Do not store credentials. Switching templates does not retract accepted requests, existing history, or compaction prefixes.

## FAQ

**I saved a template but it is not applied.** Check the global selection and workspace override, including No injection. Saving affects the next assembly only. A complete persona can exclude this section under host rules.

**Why do similar workspace paths have different overrides?** Matching removes trailing separators while preserving root semantics, but does not unify case or internal slash styles. Use the paths displayed in the panel. This is not access control.

**What happens when I delete a selected template?** Its global selection is cleared and explicit workspace selections become No injection; they do not unexpectedly inherit the global template.

**How do I resolve a save conflict?** Keep the draft, refresh configuration, review the latest state, and save again rather than repeatedly overwriting from a stale page.

**How do I uninstall?** Preserve any templates you need, then use the manager or `dsh plugin --profile <profile> remove dsh-prompt-inject`. Uninstalling does not retract transmitted content or guarantee removal of retained configuration or history.

## Development and interface

The repository ships `lib/` JavaScript directly; build performs syntax checks without UI compilation. Configure temporary directories and tool caches, then run:

```text
npm run check
```

This checks syntax and existing synthetic regressions without accessing your personal Profile. See [historical host validation](docs/COMPATIBILITY.md) and [changelog](CHANGELOG.md).

This existing manager card comes from an isolated RC2 host and identifies the installation:

![English plugin manager card](assets/manager-en.png)

Suggested addition: a template-management screenshot using example text, with private prompts and workspace paths excluded.

See [MIT license](LICENSE), [third-party notices](THIRD_PARTY_NOTICES.md), and [upstream record](docs/UPSTREAM.md).
