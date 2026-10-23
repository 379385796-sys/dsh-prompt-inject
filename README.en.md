# System Prompt Injection (dsh-prompt-inject)

[简体中文](README.md)

Manage named System Prompt templates with a global default and workspace overrides.

A locally maintained adaptation of [H1a3x/dsh-prompt-inject](https://github.com/H1a3x/dsh-prompt-inject), retaining H1a3x’s copyright and MIT license. This is not an official upstream release. See [provenance](docs/UPSTREAM.md).

## Compatibility and status

Version **0.1.1-rc.3.0**. Tested on Windows with DSH Desktop **0.2.1-rc.2**. Other platforms are untested. 

Templates are stored in plaintext and transmitted to the model. Switching templates does not retract accepted requests, history, or summaries. Workspace keys preserve case and separators and are not an access-control boundary. A complete persona can exclude the injected section under host rules.

## Install, use, and uninstall

Download the prebuilt tgz from Releases, verify its SHA-256, and select it in the official plugin manager, or use `dsh plugin --profile <profile> add <absolute-tgz-path>`. Restart DSH and verify the plugin ID and version. Back up your configuration before updating. To uninstall, use the official manager or `dsh plugin --profile <profile> remove dsh-prompt-inject`. Do not edit node_modules or app.asar. Removing the plugin does not erase existing exports, history, or retained preferences.

Create named templates in the plugin settings panel, select a global default, and choose inherit, disable, or a named override per workspace. Changes apply on the next system prompt assembly.

## Development and troubleshooting

JavaScript is shipped directly. `npm run check` checks syntax and runs the available tests. Tests use synthetic data, not your live Profile. Prebuilt runtime files are included; installation requires no build-time script. Verify host version, Profile selection, checksums, and import errors before troubleshooting. Do not disable safety checks or overwrite host files. See [validation scope](docs/COMPATIBILITY.md).

## License

See LICENSE and the retained third-party notices.

## Plugin manager / 插件管理器

Actual isolated DSH 0.2.1-rc.2 interface, with no personal account, Profile path, or conversation content in the captured cards.

![中文](assets/manager-zh.png)

![English](assets/manager-en.png)
